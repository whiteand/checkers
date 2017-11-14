// main.js
const canvas = document.querySelector('#canvas');


const createGameButton = document.querySelector("#createGameButton");
const vsAIButton = document.querySelector("#vsAIButton");
const PvPButton = document.querySelector("#PvPButton");

vsAIButton.addEventListener("click",onVSAIButton);
PvPButton.addEventListener("click",onPvPButton);

let view = new View(canvas);
let ai = new AI();
let board;
const DELAY = 0;
function waitFor(ms, value) {
	return new Promise((res) => {
		setTimeout(res, 10);
	})
}
async function startGame(whitePlayer, blackPlayer) {
	let currentPlayer = COLOR.WHITE;
	let isPlaying = true;
	let winner = null;
	//let board = makeStartBoard();
	board = new Board();
	while (true) {

		let whiteMove = await whitePlayer.getMove(board, COLOR.WHITE);
		
		board.makeMove(whiteMove);
		await view.showBoard(board);
		winner = board.getWinner(COLOR.BLACK);
		if (winner != null) {
			break;
		}
		await waitFor(DELAY);
		let blackMove = await blackPlayer.getMove(board, COLOR.BLACK);
		
		
		board.makeMove(blackMove);
		await view.showBoard(board);
		winner = board.getWinner(COLOR.WHITE);
		if (winner != null) {
			break;
		}
		await waitFor(DELAY);
	}
	alert(winner);
}


//startGame(view, view);
startGame(ai, ai);

function onVSAIButton(e) {
	alert("VS AI BUTTON PRESSED");
}
function onPvPButton(e) {
	alert("PvP Button pressed");
}


//})();