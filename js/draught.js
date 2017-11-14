class Draught {
	constructor(value, i, j) {
		this.i = i;
		this.j = j;
		this.value = value;
	}
	getStringValue() {
		switch (this.value) {
			case COLOR.WHITE:
				return "White";
			case COLOR.BLACK:
				return "Black"
			case COLOR.WHITE_QUEEN:
				return "White queen";
			case COLOR.BLACK_QUEEN:
				return "Black queen";
		}
		alert(`DRAUGHT WRONG VALUE: ${this.value}`);
	}
	getColor() {
		return COLOR.isWhite(this.value) ? COLOR.WHITE : COLOR.BLACK;
	}
	isQueen() {
		return Math.abs(this.value) > 1;
	}
	toString() {
		return `(${this.i}, ${this.j}, ${this.getStringValue()})`;
	}
}