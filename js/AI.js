class AI {
	constructor() {
		this.board = null;
	}
	getMove(board, currentPlayerColor) {
		this.board = board;
		this.availableMoves = board.getPossibleMoves(currentPlayerColor);
		let rand = (Math.random() * this.availableMoves.length) | 0;
		return Promise.resolve(this.availableMoves[rand]);
	}
}