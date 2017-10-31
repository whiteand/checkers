// main.js
const canvas = document.querySelector('#canvas');


const createGameButton = document.querySelector("#createGameButton");
const vsAIButton = document.querySelector("#vsAIButton");
const PvPButton = document.querySelector("#PvPButton");

vsAIButton.addEventListener("click",onVSAIButton);
PvPButton.addEventListener("click",onPvPButton);

let view = new View(canvas);
let board;
async function startGame(whitePlayer, blackPlayer) {
	let currentPlayer = COLOR.WHITE;
	let isPlaying = true;

	//let board = makeStartBoard();
	board = new Board();
	while (isPlaying) {
		let whiteMove = await whitePlayer.getMove(board, COLOR.WHITE);
		console.log(`WhiteMove: `, whiteMove);
		board.makeMove(whiteMove);
		let blackMove = await blackPlayer.getMove(board, COLOR.BLACK);
		board.makeMove(blackMove);
	}
}


startGame(view, view);

function onVSAIButton(e) {
	alert("VS AI BUTTON PRESSED");
}
function onPvPButton(e) {
	alert("PvP Button pressed");
}


//})();