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
		console.log(`MOVE: ${move}`);
		[this[move.i0][move.j0], this[move.next[0].i][move.next[0].j]] = [0, this[move.i0][move.j0]];
	}
	isEmpty(i,j) {
		return this[i][j] == 0;
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
		draughts = this.getDraughts().filter(draught => draught.value * moveColor > 0);
		res = [];
		direction = moveColor == COLOR.WHITE ? -1 : 1;
		draughts.filter(draught => draught.value)
		// TODO: WRITE THIS
	}
	getAttackMoves(moveColor) {
		draughts = this.getDraughts().filter(draught => draught.value * moveColor > 0);
		// TODO: write this
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