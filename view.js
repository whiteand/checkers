// view.js
let VIEW_SETTINGS = {
	WHITE_CELLS_COLOR: "#EFEDD1",
	BLACK_CELLS_COLOR: "#789656",
	BOARD_BORDER_COLOR: "#333",
	BOARD_BORDER_LINE_WIDTH: 5,
	BOARD_BACK_COLOR: undefined,
	VIEW_BORDER_COLOR: "#F00",
	VIEW_BORDER_LINE_WIDTH: 0,
	VIEW_BACK_COLOR: undefined,
};
class Point {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
	toString() {
		return `(${this.x}, ${this.y})`;
	}
	times(k) {      return new Point(this.x*k,        this.y*k);}
	plus(another) { return new Point(this.x+another.x,this.y+another.y);}
	minus(another) {return new Point(this.x-another.x,this.y-another.y);}
	multiply(another) { return this.x*another.x + this.y * another.y; }
	resize(another) {
		return new Point(this.x * another.y, this.y * another.y);
	}
	length() {
		if (typeof this.length == 'undefined')
			this.length = Math.sqrt(this.x*this.x + this.y*this.y);
		return this.length;
	}
}
class PositionableObject {
	constructor(width, height, x, y) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
	}
	set position(p) {
		this.x = p.x;
		this.y = p.y;
	}
	get position() {
		return new Point(this.x, this.y);
	}
	set size(p){
		this.width=  p.x;
		this.height = p.y;
	}
	get size() {
		return new Point(this.width, this.height);
	}
}
class ColoredPositionableObject extends PositionableObject{
	constructor(color,width, height=width, dx=0, dy=0) {
		super(width,height,dx,dy);
		this.color = color;
	}
}


class Cell extends ColoredPositionableObject {
	constructor(color, width, height, row, column, dx=0, dy=0) {
		super(color,width, height, dx,dy);
		this.row = row;
		this.column = column
	}
	draw(ctx) {
		let {x,y} = new Point(this.row, this.column)
						.resize(this.size)
						.plus(this.position);
        const oldFillStyle = ctx.fillStyle;
		ctx.fillStyle = this.color;
		ctx.fillRect(x,y,this.width,this.height);
		ctx.fillStyle = oldFillStyle;
	}
	toString() {
		return `Cell: pos=(r${this.row}, c${this.column}) color=${this.color}`;
	}
}


class BoardView extends PositionableObject{
	constructor(view,width, height=width, dx = 0, dy = 0)
	{
		super(width-VIEW_SETTINGS.BOARD_BORDER_LINE_WIDTH*2 ,height-VIEW_SETTINGS.BOARD_BORDER_LINE_WIDTH*2, VIEW_SETTINGS.BOARD_BORDER_LINE_WIDTH,VIEW_SETTINGS.BOARD_BORDER_LINE_WIDTH);

		this.cells = [];
		this.view = view;
		//this.x += (this.view.width - this.width) >> 1;
		const cellWidth = ((this.width-this.getBorderWidth()) / 8);
		const cellHeight = ((this.height-this.getBorderWidth()) / 8); 
		let color;
		for (let i = 0; i < 8; ++i) {
			this.cells[i] = [];
			for (let j = 0; j < 8; ++j) {
				color = ((i+j) % 2 == 1)
					? VIEW_SETTINGS.WHITE_CELLS_COLOR 
					: VIEW_SETTINGS.BLACK_CELLS_COLOR;
				const DX = this.getBorderWidth()/2 + this.view.getBorderWidth()/2;
				const DY = this.getBorderWidth()/2 + this.view.getBorderWidth()/2;
				this.cells[i][j] = 
					new Cell(color,cellWidth, cellHeight,i,j,this.x+DX, this.y + DY);
			}
		}
	}
	getBorderWidth() {
		return Math.max(VIEW_SETTINGS.BOARD_BORDER_LINE_WIDTH,0)
	}
	isBorder() {
		if (!VIEW_SETTINGS.BOARD_BORDER_COLOR)
			return false;
		if (VIEW_SETTINGS.BOARD_BORDER_LINE_WIDTH <= 0)
			return false;
		return true;
	}
	isBack() {
		return VIEW_SETTINGS.BOARD_BACK_COLOR != undefined;
	}
	drawBack(ctx) {
		if (!this.isBack()) return;
		const oldStyle = ctx.fillStyle;
		ctx.fillStyle = VIEW_SETTINGS.BOARD_BACK_COLOR;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = oldStyle;
	}
	drawBorder(ctx) {
		if (!this.isBorder()) return;
		const {strokeStyle: oldStyle, lineWidth: lineWidth} = ctx;
		ctx.strokeStyle = VIEW_SETTINGS.BOARD_BORDER_COLOR;
		ctx.lineWidth = VIEW_SETTINGS.BOARD_BORDER_LINE_WIDTH;
		ctx.strokeRect(this.x, this.y, this.width, this.height);
		ctx.strokeStyle = oldStyle;
		ctx.lineWidth = lineWidth;
	}
	drawCells(ctx) {
		for (let i = 0; i < 8; ++i) {
			for (let j = 0; j < 8; ++j) {
				this.cells[i][j].draw(ctx);
			}
		}
	}
	draw(ctx) {
		console.log('board, draw');
		this.drawBack(ctx);
		this.drawCells(ctx);
		this.drawBorder(ctx);
	}
	toString() {
		return `Board: size=${this.size}, position=${this.position}`;
	}
}

class View extends PositionableObject{
	constructor(canvas, width=canvas.width, height=canvas.height, dx = 0, dy = 0)
	{
		super(width, height, dx,dy);
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		let borderWidth = this.getBorderWidth();
		console.log(borderWidth);
		let boardWidth = Math.min(width-borderWidth, height-borderWidth);
		let boardLeft = ((width - boardWidth) >> 1) + (width - boardWidth) % 2;
		let boardTop = 0;//((height - boardWidth) >> 1) + (1+width - boardWidth) % 2;

		this.board = new BoardView(this, boardWidth, boardWidth, boardLeft,boardTop);
	}
	getBorderWidth() {
		return Math.max(VIEW_SETTINGS.VIEW_BORDER_LINE_WIDTH,0);
	}
	isBorder() {
		if (!VIEW_SETTINGS.VIEW_BORDER_COLOR)
			return false;
		if (VIEW_SETTINGS.VIEW_BORDER_LINE_WIDTH <= 0)
			return false;
		return true;
	}
	isBack() {
		return VIEW_SETTINGS.VIEW_BACK_COLOR != undefined;
	}
	drawBorder(ctx) {
		if (!this.isBorder()) return;
		const {strokeStyle: oldStyle, lineWidth: lineWidth} = ctx;
		ctx.strokeStyle = VIEW_SETTINGS.VIEW_BORDER_COLOR;
		ctx.lineWidth = VIEW_SETTINGS.VIEW_BORDER_LINE_WIDTH;
		ctx.strokeRect(this.x, this.y, this.width, this.height);
		ctx.strokeStyle = oldStyle;
		ctx.lineWidth = lineWidth;

	}
	drawBack(ctx) {
		if (!this.isBack()) return;
		const oldStyle = ctx.fillStyle;
		ctx.fillStyle = VIEW_SETTINGS.VIEW_BACK_COLOR;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = oldStyle;

	}
	draw() {
		const ctx = this.ctx;
		this.drawBack(ctx);
		this.drawBorder(ctx);
		this.board.draw(ctx);
		
	}
	toString() {
		return `View: size=${this.size}, position=${this.position}`;
	}
}