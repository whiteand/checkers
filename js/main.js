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
const DELAY = 500;
function waitFor(ms, value) {
	return new Promise((res) => {
		setTimeout(res, ms);
	})
}
async function startGame(whitePlayer, blackPlayer, playerColor) {
	let currentPlayer = COLOR.WHITE;
	let isPlaying = true;
	let winner = null;
	//let board = makeStartBoard();
	board = new Board();
	while (true) {
		console.time("whiteMove");
		let whiteMove = await whitePlayer.getMove(board, COLOR.WHITE);
		console.log("Make move: ", whiteMove.toString());
		board.makeMove(whiteMove);
		await view.showBoard(board);
		winner = board.getWinner(COLOR.BLACK);
		if (winner.hasWinner) {
			break;
		}
		console.timeEnd("whiteMove");
		await waitFor(DELAY);
		let blackMove = await blackPlayer.getMove(board, COLOR.BLACK);
		console.time("blackMove");
		console.log("Make move: ", blackMove.toString());
		board.makeMove(blackMove);
		await view.showBoard(board);
		winner = board.getWinner(COLOR.WHITE);
		if (winner.hasWinner) {
			break;
		}
		console.timeEnd("blackMove");
		await waitFor(DELAY);
	}
	await waitFor(2000);
	window.location.reload();
}


//startGame(view, view);
let view2 = new View(canvas);
startGame(view, ai, "BLACK");

function onVSAIButton(e) {
	alert("VS AI BUTTON PRESSED");
}
function onPvPButton(e) {
	alert("PvP Button pressed");
}


//})();