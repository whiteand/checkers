class Draught {
	constructor(view,i,j, color, id) {
		this.view = view;
		this.color = color;
		this.id = id;
		this.setCell(i,j);
	}
	draw(ctx) {
		ctx.pushFillStroke();
		
		ctx.beginPath();

		ctx.arc(this.x, this.y, this.view.cellSize *Draught.RADIUS, 0, Math.PI * 2);
		ctx.fillStyle = (this.color > 0) ?Draught.WHITE_CELL_COLOR :Draught.BLACK_CELL_COLOR;
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.view.cellSize *Draught.SMALL_RADIUS, 0, Math.PI * 2);
		ctx.strokeStyle =Draught.LINE_COLOR;
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.view.cellSize *Draught.SMALLEST_RADIUS, 0, Math.PI * 2);
		ctx.strokeStyle =Draught.LINE_COLOR;
		ctx.lineWidth = 3;
		ctx.fillStyle = Math.abs(this.color) > 1 
			?Draught.QUEEN_COLOR 
			:Draught.LINE_COLOR;
		ctx.closePath();
		ctx.fill();
		ctx.popFillStroke();
	}
	// drag(mouseX, mouseY) // : void
	drag(mouseX, mouseY) {
		this.setCoord(mouseX, mouseY);
	}
	// dragStart(mouseX, mouseY)// : void
	dragStart(mouseX, mouseY) {
		this.setCoord(mouseX,mouseY);
	}
	setCoord(x,y) {
		this.x = x;
		this.y = y;
		this.view.changeHandler();
	}
	// drop(mouseX, mouseY) //:void
	drop(mouseX, mouseY) {
		const size = this.view.cellSize;
		let newI = Math.floor(mouseY / size);
		let newJ = Math.floor(mouseX / size);
		let ok = this.view.tryMove(this.i, this.j, newI, newJ);
		if (ok) {
			this.setCell(newI,newJ);
		} else {
			this.setCell(this.i, this.j);
		}
	}

	setCell(i,j) {
		this.i = i;
		this.j = j;
		const size = this.view.cellSize;
		this.setCoord(size * j + (size >> 1),size * i + (size >> 1));

	}
	// isDrag(mouseX, mouseY) //:void
	isDrag(x, y) {
		const size= this.view.cellSize;
		return this.getDistance(x,y) < size*2;
	}
	// getDistance(mouseX, mouseY) //:number
	getDistance(X, Y) {
		return Math.sqrt(Math.pow(X-this.x,2) + Math.pow(Y - this.y,2));
	}
}
Draught.WHITE_CELL_COLOR = "#fff";
Draught.BLACK_CELL_COLOR = "#000";
Draught.QUEEN_COLOR = "#ff4c65";
Draught.LINE_COLOR = "#666";
Draught.RADIUS = 0.4;
Draught.SMALL_RADIUS =Draught.RADIUS * 0.75;
Draught.SMALLEST_RADIUS =Draught.SMALL_RADIUS * 0.8;