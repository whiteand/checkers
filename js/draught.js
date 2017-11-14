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
		alert("ERROR");
	}
	toString() {
		return `(${this.i}, ${this.j}, ${this.getStringValue()})`;
	}
}