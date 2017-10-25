
class Cell {
	constructor(view,i,j, color) {
		this.view = view;
		this.color = color;
		this.setCell(i,j);
	}
	draw(ctx) {
		ctx.pushFillStroke();
		
		ctx.beginPath();

		ctx.arc(this.x, this.y, this.view.cellSize * Cell.RADIUS, 0, Math.PI * 2);
		ctx.fillStyle = (this.color == COLOR.WHITE) ? Cell.WHITE_CELL_COLOR : Cell.BLACK_CELL_COLOR;
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.view.cellSize * Cell.SMALL_RADIUS, 0, Math.PI * 2);
		ctx.strokeStyle = Cell.LINE_COLOR;
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.view.cellSize * Cell.SMALLEST_RADIUS, 0, Math.PI * 2);
		ctx.strokeStyle = Cell.LINE_COLOR;
		ctx.lineWidth = 3;
		ctx.fillStyle = Cell.LINE_COLOR;
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
		console.log(this.i, this.j,"->", newI, newJ);
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
Cell.WHITE_CELL_COLOR = "#fff";
Cell.BLACK_CELL_COLOR = "#000";
Cell.LINE_COLOR = "#666";
Cell.RADIUS = 0.4;
Cell.SMALL_RADIUS = Cell.RADIUS * 0.75;
Cell.SMALLEST_RADIUS = Cell.SMALL_RADIUS * 0.8;
class CtxState {
	constructor(fill, stroke, lineWidth) {
		this.fillStyle = fill;
		this.strokeStyle = stroke;
		this.lineWidth = lineWidth;
	}
}
class View {
	constructor(canvas, onchange) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		let ctxStates = [];
		this.ctx.pushFillStroke =function() {
			ctxStates.push(new CtxState(
				this.fillStyle, 
				this.strokeStyle,
				this.lineWidth
			))
		}
		this.ctx.popFillStroke = function() {
			let state = ctxStates.pop();

			this.fillStyle = state.fillStyle;
			this.strokeStyle = state.strokeStyle;
			this.lineWidth = state.lineWidth;
		}
		this.cells = [];
		this.changeHandler = onchange;
		this.dragAndDrop = new DragAndDrop(canvas);
		this.dragAndDrop.start();
	}
	get width() {
		return this.canvas.width;
	}
	get height() {
		return this.canvas.height;
	}
	get cellSize() {
		return Math.min(this.width, this.height) / 8;
	}
	draw() {
		this.drawBoard();
		this.drawCells();
	}

	// cells = [{i,j,c}, {i,j}, ...]
	update(cells) {
		const size = this.cellSize;
		this.cells = cells.map(({i,j,c})=>{
			return new Cell(this, i,j,c);
		});
		this.dragAndDrop.clear();
		this.dragAndDrop.add(...this.cells);
		this.changeHandler();
	}

	drawCells() {
		this.cells.forEach(cell=>{
			cell.draw(this.ctx);
		})
	}


	drawBoard() {
		this.ctx.pushFillStroke();
		this.ctx.fillStyle = View.WHITE_CELL_COLOR;
		this.ctx.fillRect(0,0,this.width, this.height);
		let size = this.cellSize;
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if ((i + j) % 2 == 0) {
					this.ctx.fillStyle = View.BLACK_CELL_COLOR;		
					let top = i*size;
					let left = j*size;
					this.ctx.fillRect(top, left, size, size);
				}
			}
		}
		this.ctx.popFillStroke();
	}
	tryMove(startI, startJ, endI, endJ) {
		return (endI + endJ) % 2 == 0;
	}
}

View.WHITE_CELL_COLOR = "#EEEED2";
View.BLACK_CELL_COLOR = "#769656";