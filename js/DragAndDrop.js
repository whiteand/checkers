// drag(mouseX, mouseY) // : void
// dragStart(mouseX, mouseY)// : void
// drop(mouseX, mouseY) //:void
// isDrag(mouseX, mouseY) //:bool
// getDistance(mouseX, mouseY) //:number
function checkInterface(interface, obj) {
    return Object.keys(interface).every(key => typeof obj[key] !== "undefined");
}
class DragAndDrop
{
    constructor(canvas)
    {
    	this.canvas = canvas;
    	this.context = canvas.getContext('2d');
    	this.enable = false;
    	this.objects = [];
    	this.dragedObject = null;
    	this.mouseDownHandler = this._mouseDownHandler();
    	this.mouseUpHandler = this._mouseUpHandler();
    	this.mouseMoveHandler = this._mouseMoveHandler();
        this.mouseLeave = this._mouseLeave();
    }
    add(...objs) {
        objs.forEach(obj=>{
            if (this.objects.indexOf(obj) >= 0)
                return;
            if (!checkInterface(DragAndDrop.INTERFACE, obj)) {
                alert("THIS IS NOT A DRAG AND DROP INTERFACE!");
            }
            this.objects.push(obj);
        });
    }
    getMousePosition(e) {
        let {left, top} = $(this.canvas).offset();
        let mouseX = e.pageX - left;
        let mouseY = e.pageY - top;
        return [mouseX, mouseY];
    }
    toCanvasScale(x,y) {

        let dx = this.canvas.width / $(this.canvas).width();
        let dy = this.canvas.height / $(this.canvas).height();
        return [x*dx,y*dy];
    }
    remove(...objs) {
        objs.forEach(obj=>{
            const index = this.objects.indexOf(obj);
            if (index < 0)
                return;
            this.objects.splice(index, 1);    
        });
    }
    clear() {
        this.objects = [];
    }

    _mouseMoveHandler()
    {
    	return (event)=>{
    		if (this.dragedObject == null)
    			return;
            let [mouseX, mouseY] = this.getMousePosition(event);
            [mouseX, mouseY] = this.toCanvasScale(mouseX, mouseY);
            this.dragedObject.drag(mouseX, mouseY);
    	};
    }
    _mouseDownHandler() {
    	return (event)=>{
            let [mouseX, mouseY] = this.getMousePosition(event);
            [mouseX, mouseY] = this.toCanvasScale(mouseX, mouseY);
            let minIndex = -1;
            let minDist = 1e+8;

            for (let i = this.objects.length-1; i >= 0; --i)
            {
                if (!this.objects[i].isDrag(mouseX, mouseY))
                    continue;

                let dist = this.objects[i].getDistance(mouseX, mouseY)

                if (minIndex == -1){
                    minIndex = i;
                    minDist = dist;
                    continue;
                }
                if (dist < minDist) {
                    minIndex = i;
                    minDist = dist;
                }
            }
            if (minIndex < 0)
                return;
            this.dragedObject = this.objects[minIndex];
            this.dragedObject.dragStart(mouseX, mouseY);
    	};
    }
    _mouseUpHandler()
    {
    	return (event)=>{
            if (this.dragedObject == null)
                return;

            let [mouseX, mouseY] = this.getMousePosition(event);
            [mouseX, mouseY] = this.toCanvasScale(mouseX, mouseY);
            let draged = this.dragedObject;
            draged.drop(mouseX, mouseY);
            this.dragedObject = null;
    	}
    }
    _mouseLeave()
    {
        return (event)=>{
            if (this.dragedObject == null)
                return;
            let [mouseX, mouseY] = this.getMousePosition(event);
            [mouseX, mouseY] = this.toCanvasScale(mouseX, mouseY);
            let endX = Math.max(Math.min(mouseX, this.canvas.width), 1);
            let endY = Math.max(Math.min(mouseY, this.canvas.height), 1);
            this.dragedObject.drop(endX, endY);
            this.dragedObject = null;

        }
    }

    start()
    {
    	if (this.enable)
    		return;

    	this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    	this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    	this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("mouseleave", this.mouseLeave);
		this.enable = true;
    }

    stop()
    {
    	if (!this.enable)
    		return;
    	this.enable = false;
        this.canvas.removeEventListener("mouseleave", this.mouseLeave);
    	this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    	this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    	this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    	
    }
}
DragAndDrop.INTERFACE = {
    "drag":"drag(mouseX, mouseY):void",
    "dragStart":"dragStart(mouseX, mouseY):void",
    "drop":"drop(mouseX, mouseY):void",
    "isDrag":"isDrag(mouseX, mouseY):bool",
    "getDistance":"getDistance(mouseX, mouseY):number"
}
