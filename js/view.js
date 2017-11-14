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
		this.draughts = [];
		this.changeHandler = ()=>{
			this.draw();
			if (typeof onchange === 'function')
			onchange();
		};
		this.dragAndDrop = new DragAndDrop(canvas);
		this.dragAndDrop.start();
		this.isWhiteMove = true;
		this.availableMoves = [];
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
		return new Promise((res,rej)=>{
			setTimeout(()=> {
				this.drawBoard();
				this.drawDraughts();
				res();
			},0);	
		})
	}
	showBoard() {
		let tempView = new View(canvas);
		tempView.setPosition(board);
		return tempView.draw();
	}
	// cells = [{i,j,c}, {i,j}, ...]
	setPosition(board) {
		this.draughts = board.getDraughts().map(({i,j,value}, id)=>{
			let [newI, newJ] = this.rotate(i,j)
			return new DraughtView(this, newI,newJ,value, id);
		});
	}
	_update(board, currentPlayerColor, callback) {
		this.isWhiteMove = currentPlayerColor > 0;
		this.setPosition(board);
		this.dragAndDrop.clear();
		this.dragAndDrop.add(...this.draughts.filter(e=>e.color * currentPlayerColor > 0));
		this.changeHandler();
		this.board = board;
		this.returnMove = callback;
		this.availableMoves = board.getPossibleMoves(currentPlayerColor);
		this.resetCurrentAvailable();
	}
	resetCurrentAvailable() {
		this.currentAvailable = [].concat(this.availableMoves);
		this.currentPath = [];
	}
	clearCurrentMoves() {
		setPosition(this.board);
		this.resetCurrentAvailable();	
	}
	getMove(board, currentPlayerColor) {
		return new Promise((res,rej)=>{
			this._update(board, currentPlayerColor, function(move){
				res(move);
			});
		});
	}

	drawDraughts() {
		let draughts = this.draughts;
		let ctx = this.ctx;
		for (let i = 0; i < draughts.length; i++) {
			draughts[i].draw(ctx);
		}
	}


	drawBoard() {
		this.ctx.pushFillStroke();
		this.ctx.fillStyle = View.WHITE_CELL_COLOR;
		this.ctx.fillRect(0,0,this.width, this.height);
		let size = this.cellSize;
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (Board.isCellBlack(i,j)) {
					this.ctx.fillStyle = View.BLACK_CELL_COLOR;		
					let top = i*size;
					let left = j*size;
					this.ctx.fillRect(top, left, size, size);
				}
			}
		}
		this.ctx.popFillStroke();
	}
	block() {
		this.dragAndDrop.clear();
	}
	rotate(i,j) {
		if (this.isWhiteMove) {
			return [i,j];
		}
		return [7-i, 7-j];
	}
	endMove() {
		this.returnMove(Move.concat(...this.currentPath));
		this.block();
	}
	tryMove(startI, startJ, endI, endJ) {
		if (!Board.isRightIndexes(endI, endJ))
			return false;
		if (!Board.isCellBlack(endI, endJ))
			return false;
		if (startI == endI && startJ == endJ) 
			return false;

		let [i0, j0] = this.rotate(startI, startJ);
		let [i1, j1] = this.rotate(endI, endJ);
		let move = new Move(i0, j0, i1, j1);
		let nextMoves = this.currentAvailable.filter(m => m.head().equals(move));
		if (nextMoves.length == 0)
			return false;
		this.currentPath.push(move);
		if (nextMoves.length == 1 && nextMoves[0].next.length == 1) {
			this.endMove();
			return true;
		}
		this.currentAvailable = nextMoves.map(e=>e.tail());

		
		return true;
	}
}

View.WHITE_CELL_COLOR = "#EEEED2";
View.BLACK_CELL_COLOR = "#769656";
