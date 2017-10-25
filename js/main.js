// main.js
const canvas = document.querySelector('#canvas');


const createGameButton = document.querySelector("#createGameButton");
const vsAIButton = document.querySelector("#vsAIButton");
const PvPButton = document.querySelector("#PvPButton");

createGameButton.addEventListener("click",onCreateGameButton);
vsAIButton.addEventListener("click",onVSAIButton);
PvPButton.addEventListener("click",onPvPButton);


var view = new View(canvas, updateDraw);
view.update(startPosition(COLOR.WHITE))
function startPosition(playerColor) {
	let res = []
	for (let i = 0; i < 8; i++) {
		if (i == 3 || i == 4) 
			continue;
		for (let j = 0; j < 8; j++) {
			if ((i+j)%2 ==0) {
				res.push({
					"i":i,
					"j":j,
					"c":(i < 4) ? (-playerColor) : playerColor
				});
			}
		}
	}
	console.log(res);
	return res;
}
function updateDraw() {
	view.draw();
}

function onCreateGameButton(e) {
	alert("GAME CREATED");
}
function onVSAIButton(e) {
	alert("VS AI BUTTON PRESSED");
}
function onPvPButton(e) {
	alert("PvP Button pressed");
}


//})();