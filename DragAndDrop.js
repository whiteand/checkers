// drag(mouseX, mouseY) // : void
// dragStart(mouseX, mouseY)// : void
// drop(mouseX, mouseY) //:void
// isDrag(mouseX, mouseY) //:void
// getDistance(mouseX, mouseY) //:number

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
            this.objects.push(obj);
        });
    }

    remove(...objs) {
        objs.forEach(obj=>{
            const index = this.objects.indexOf(obj);
            if (index < 0)
                return;
            this.objects.splice(index, 1);    
        });
    }
    _mouseMoveHandler()
    {
    	return (event)=>{
    		if (this.dragedObject == null)
    			return;
            let mouseX = event.clientX - this.canvas.offsetLeft;
            let mouseY = event.clientY - this.canvas.offsetTop;
            this.dragedObject.drag(mouseX, mouseY);
    	};
    }
    _mouseDownHandler()
    {
    	return (event)=>{
            let mouseX = event.clientX - this.canvas.offsetLeft;
            let mouseY = event.clientY - this.canvas.offsetTop;
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
            let mouseX = event.clientX - this.canvas.offsetLeft;
            let mouseY = event.clientY - this.canvas.offsetTop;
            this.dragedObject.drop(mouseX, mouseY);
            this.dragedObject = null;
    	}
    }
    _mouseLeave()
    {
        return (event)=>{
            if (this.dragedObject == null)
                return;
            let mouseX = event.clientX - this.canvas.offsetLeft;
            let mouseY = event.clientY - this.canvas.offsetTop;
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

