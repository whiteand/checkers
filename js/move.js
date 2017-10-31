class Move {
	constructor(startI, startJ, ...nextPositions) {
		if (nextPositions.length % 2 == 1) {
			alert("NEXT POSITIONS HAVE NOT EVEN AMOUNT OF POSITION");
		}

		this.i0 = startI;
		this.j0 = startJ;
		this.next = [];
		for (let i = 0; i < nextPositions.length >> 1; i++) {
			this.next.push({i: nextPositions[i*2], j: nextPositions[i*2+1]});
		}
	}

	toString() {
		let startPos = `${this.i0},${this.j0}`;
		let lastPositions = this.next.map(e=>`${e.i},${e.j}`)
		  							 .join(' -> ');
		return `${startPos} -> ${lastPositions}`;
	}
}