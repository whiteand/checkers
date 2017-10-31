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
function wait(ms, value) {
	return new Promise((res) => {
		setTimeout(()=>{
			res(value);
		}, ms);
	})
}
async function startGame(whitePlayer, blackPlayer) {
	let currentPlayer = COLOR.WHITE;
	let isPlaying = true;

	//let board = makeStartBoard();
	board = new Board();
	while (isPlaying) {
		let whiteMove = await whitePlayer.getMove(board, COLOR.WHITE);
		
		

		console.log(`WhiteMove: `, whiteMove);
		board.makeMove(whiteMove);
		view.showBoard(board);
		await wait(500);
		let blackMove = await blackPlayer.getMove(board, COLOR.BLACK);
		
		await wait(500);
		board.makeMove(blackMove);
		view.showBoard(board);
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