class Board extends Array {
	constructor() {
		super();
		for (let i = 0; i < 8; i++) {
			this[i] = [0,0,0,0,0,0,0,0];
			let color = (i < 4) ? COLOR.BLACK : COLOR.WHITE;
			for (let j = 0; j < 8; j++) {
				if (!Board.isCellBlack(i,j))
					continue;
				if (i < 3 || i > 4)
					this[i][j] = color;
			}
		}
	}
	makeMove(move) {
		if (!move || move.next.length == 0) {
			return;
		}
		let currentValue = this[move.i0][move.j0];
		let currentPos = move.startPosition;
		for (let i = 0; i < move.next.length; i++) {
			let next = move.next[i];
			let isWhite = COLOR.isWhite(currentValue);
			if (!COLOR.isQueen(currentValue) && (next.i == (isWhite ? 0 : 7))) {
				currentValue = currentValue << 1;
			}		
			[this[currentPos.i][currentPos.j], this[next.i][next.j]] = [0, currentValue];
			currentPos = next;
		}
	}
	isEmpty(i,j) {
		return this[i][j] == 0;
	}
	isFreeToPut(i,j) {
		return (i >= 0) && (i < 8) && (j >= 0) && (j < 8) && this.isEmpty(i,j);
	}
	getDraughts() {
		let res = []
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (this[i][j] != 0) {
					res.push({i:i,j:j,value:this[i][j]});
				}
			}
		}
		return res;
	}
	getSimpleMoves(moveColor) {
		let draughts = this.getDraughts().filter(d => d.value * moveColor > 0);
		let res = [];
		let direction = moveColor == COLOR.WHITE ? -1 : 1;
		draughts.filter(draught => draught.value * moveColor == 2)
			.forEach(d => {
				Direction.ALL.forEach(({di,dj})=>{
					for (let i = d.i+di, j = d.j+dj; i < 8 && i >= 0 && j >= 0 && j < 8; i+=di, j+=dj) {
						if (this.isEmpty(i,j)) {
							res.push(new Move(d.i, d.j, i,j));
						} else {
							break;
						}
					}	
				})
		});
		draughts.filter(draught => draught.value * moveColor == 1)
			.forEach(d=>{
				if (this.isFreeToPut(d.i+direction, d.j-1)) {
					res.push(new Move(d.i, d.j, d.i+direction, d.j-1));
				}
				if (this.isFreeToPut(d.i+direction, d.j+1)) {
					res.push(new Move(d.i, d.j, d.i+direction, d.j+1));
				}
		});
		return res;
	}
	getAttackMoves(moveColor) {
		let draughts = this.getDraughts().filter(draught => draught.value * moveColor > 0);
		// TODO: write this
		return [];
	}
	getPossibleMoves(moveColor) {
		let attackMoves = this.getAttackMoves(moveColor);
		if (attackMoves.length > 0) {
			return attackMoves;
		}
		let simpleMoves = this.getSimpleMoves(moveColor);
		return simpleMoves;
	}
}
Board.isCellBlack = function(i,j, isReversed = true) {
	return (i + j) % 2 == isReversed ? 0 : 1;
}
Board.isRightIndexes = function(i,j) {
	return (i < 8) &&(i >= 0) && (j < 8) && (j >= 0);
}

