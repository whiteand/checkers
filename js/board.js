function assume(assertion, msg = "assertion error") {
	if (!assertion) {
		throw new Error(msg);
	}
	return true;
}
function interval(a,b) {
	return [...Array(b-a).keys()].map(e=>e+a);
}
class Board extends Array {
	constructor(isEmpty = false) {
		super();
		if (!isEmpty) {
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
		} else {
			for (let i = 0; i < 8; i++) {
				this[i] = [0,0,0,0,0,0,0,0];
			}
		}
	}
	
	makeMove(move) {
		if (!move || move.next.length == 0) {
			return;
		}
		let currentValue = this[move.i0][move.j0];
		let currentPos = move.startPosition;
		for (let k = 0; k < move.next.length; k++) {
			let next = move.next[k];
			let isWhite = COLOR.isWhite(currentValue);
			// Change to queen if step to last line
			if (!COLOR.isQueen(currentValue) && (next.i == (isWhite ? 0 : 7))) {
				currentValue = currentValue << 1;
			}
			// remove all bitten draughts
			let distance = Math.abs(next.i-currentPos.i);
			let di = Math.sign(next.i-currentPos.i);
			let dj = Math.sign(next.j-currentPos.j);
			if (distance >= 2) {
				for (let d = 1; d < distance; d++) {
					let i = currentPos.i+d*di;
					let j = currentPos.j+d*dj;
					if (!Board.isRightIndexes(i,j)) {
						console.log(`WRONG`);
						
					}
					this[i][j] = 0;					
				}
			}
			

			// make move
			[this[currentPos.i][currentPos.j], this[next.i][next.j]] = [0, currentValue];
			currentPos = next;
		}
	}
	isEmpty(i,j) {
		return this[i][j] == 0;
	}
	isFreeToPut(i,j) {
		return Board.isRightIndexes(i,j) && this.isEmpty(i,j);
	}
	getDraughts(predicate) {
		let res = []
		let value;
		let isPred = true;
		if (typeof predicate != "function") {
			isPred = false;
		}
		let blackPos = Board.getAllBlackCells();
		let blackSize = blackPos.length;
		for (let k = 0; k < blackSize; k++) {
			let {i,j} = blackPos[k];
			let value = this[i][j];
			if (this[i][j] != 0 &&(!isPred || predicate(value,i,j))) {
				res.push(new Draught(value, i, j));
			}
		}
		return res;
	}
	getSimpleMoves(moveColor) {
		let draughts = this.getDraughts((value) => value * moveColor > 0);
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
	getSimpleAttackMoves(moveColor, draughts = this.getDraughts(value=>value * moveColor > 0)) {
		let res = [];
		
		for (let k = 0; k < draughts.length; k++) {
			let draught = draughts[k];
			
			let [maxRange,maxAfterRange] = draught.isQueen() ? [7,7] : [1,1];
			let directions = [{i:1,j:1}, 
							  {i:1,j:-1},
							  {i:-1,j:1},
							  {i:-1,j:-1}];
			directions.forEach(({i:di, j:dj})=>{
				let currentDistance = 1;
				let currentI = draught.i + di;
				let currentJ = draught.j + dj;
				while (currentDistance <= maxRange && this.isFreeToPut(currentI, currentJ)) {
					currentI += di;
					currentJ += dj;
					currentDistance++;
				}			
				
				if (currentDistance > maxRange || !Board.isRightIndexes(currentI, currentJ) || this[currentI][currentJ]*draught.value > 0)
					return;

				let enemyI = currentI;
				let enemyJ = currentJ;
				currentI += di;
				currentJ += dj;
				let currentAfterDistance = 1;
				while (this.isFreeToPut(currentI, currentJ) && currentAfterDistance <= maxAfterRange) {
					res.push(new Move(draught.i, draught.j,currentI, currentJ));
					currentI += di;
					currentJ += dj;
					currentAfterDistance++;
				}
			});
		}
			
		return res;
	}
	getAttackMoves(moveColor) {
		return Board.appendMoves(this.clone(), this.getSimpleAttackMoves(moveColor));
	}

	getPossibleMoves(moveColor) {
		let attackMoves = this.getAttackMoves(moveColor);
		if (attackMoves.length > 0) {
			return attackMoves;
		}
		let simpleMoves = this.getSimpleMoves(moveColor);
		return simpleMoves;
	}
	getWinner(moveColor) {
		let possibleMoves = this.getPossibleMoves(moveColor);
		if (possibleMoves.length === 0) {
			return {hasWinner: true, winnerColor: -moveColor};
		}
		// TODO: write this
		return Board.HAS_NO_WINNER;
	}
	clone() {
		let res = new Board(true);
		this.getDraughts().forEach(({value,i,j})=>{
			res[i][j] = value;
		});
		return res;
	}
}
Board.HAS_NO_WINNER = {hasWinner: false};
Board.isCellBlack = function(i,j, isReversed = true) {
	return (i + j) % 2 == isReversed ? 0 : 1;
}
Board.isRightIndexes = function(i,j) {
	return (i < 8) &&(i >= 0) && (j < 8) && (j >= 0);
}
Board.getMoveDirection = function(value) {
	return (value > 0) ? -1 : 1;
}
Board.findPathesStartsWith = function(board, move) {
	let tempBoard = board.clone();
	let res = [];
	// Make move
	tempBoard.makeMove(move);
	let lastPosIndex = move.next.length-1;
	let curI = move.next[lastPosIndex].i;
	let curJ = move.next[lastPosIndex].j;
	let currentDraught = new Draught(tempBoard[curI][curJ], curI, curJ);
	// Find if there is some continuation
	let moves = tempBoard.getSimpleAttackMoves(currentDraught.getColor(),[currentDraught]);
	if (moves.length == 0) {
		tempBoard[curI][curJ] = 0;
		tempBoard[move.i0][move.j0] = currentDraught.value;
		return [move];
	}
	res = moves.map(nextMove => {

		let tails = Board.findPathesStartsWith(tempBoard, nextMove);
		tails.forEach(tail=>{
			let firstPos = {i: tail.i0, j: tail.j0};
			tail.i0 = move.i0;
			tail.j0 = move.j0;
			tail.next.unshift(firstPos);
		});
		return tails;
	});
	return res.reduce((arr, elem) => arr.concat(elem), []);
}
Board.appendMoves = function(board, moves) {
	let res = [];
	for (let i = 0; i < moves.length; i++) {
		let paths = Board.findPathesStartsWith(board, moves[i]);
		res = res.concat(paths);
	}
	return res;
}


Board.getAllBlackCells = function() {
	if (Board._allBlackCells) {
		return Board._allBlackCells;
	}
	let res = [];
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if (Board.isCellBlack(i,j)) {
				res.push(new Position(i,j));
			}
		}
	}
	return Board._allBlackCells = res;
}