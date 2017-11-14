class Move {
	constructor(startI, startJ, ...nextPositions) {
		if (nextPositions.length % 2 == 1) {
			alert("NEXT POSITIONS HAVE NOT EVEN AMOUNT OF POSITION");
		}

		this.i0 = startI;
		this.j0 = startJ;
		this.next = [];
		for (let i = 0; i < nextPositions.length >> 1; i++) {
			this.next.push(new Position(nextPositions[i<<1],nextPositions[(i<<1)+1]));
		}
	}
	get startPosition() {
		return new Position(this.i0, this.j0);
	}
	toString() {
		let startPos = `${this.i0},${this.j0}`;
		let lastPositions = this.next.map(e=>`${e.i},${e.j}`)
		  							 .join(' -> ');
		return `${startPos} -> ${lastPositions}`;
	}
	equals(another) {
		if (another == null || typeof another == "undefined")
			return false;

		if (another == this)
			return true;

		if (another.i0 != this.i0 || another.j0 != this.j0)
			return false;

		if (another.next.length != this.next.length)
			return false;

		for (let i = 0; i < this.next.length; i++) {
			if (!this.next[i].equals(another.next[i])) {
				return false;
			}
		}
		return true;
	}
	tail(skip = 1) {
		let newMove = new Move(this.next[skip-1].i, this.next[skip-1].j);
		newMove.next = this.next.slice(skip);
		return newMove;
	}
	head() {
		return new Move(this.i0, this.j0, this.next[0].i, this.next[0].j);
	}
	clone() {
		let newMove = new Move(this.i0, this.j0);
		newMove.next = [].concat(this.next);
		return newMove;
	}
}

Move.concat = function(...moves) {
	if (moves.length <= 0)
		throw new Error("THERE IS NO CONCATENATION OF NOTHING")
	console.log("CONCAT",moves);
	let res = moves[0].clone();
	for (let i = 1; i < moves.length; i++) {
		res.next = res.next.concat(moves[i].next);
	}
	console.log(res);
	return res;
}


class Position {
	constructor(i, j) {
		this.i = i;
		this.j = j;
	}
	add(d) {
		res = new Position(i + d.di, j + d.dj);
		if (!res.isValid())
			return null;
		return res;
	}
	isValid() {
		return this.i >= 0 && this.j >= 0 && this.i < 8 && this.j < 8;
	}
	equals(another) {
		if (another == null || typeof another == "undefined")
			return false;
		if (another == this) {
			return true;
		}
		if (another.i != this.i || another.j != this.j) {
			return false;
		}
		return true;
	}

}
class Direction {
	constructor(di, dj){
		this.di = di;
		this.dj = dj;
	}
	equals(another) {
		if (another == null || typeof another == "undefined")
			return false;
		if (another == this) {
			return true;
		}
		if (another.di != this.di || another.dj != this.dj) {
			return false;
		}
		return true;
	}
}

Direction.ALL = [
	new Direction(1,1),
	new Direction(1,-1),
	new Direction(-1,1),
	new Direction(-1,-1),
];