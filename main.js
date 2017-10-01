// main.js

//(()=>{



const canvas = document.querySelector('#canvas');
const container = document.querySelector('.canvas-container');
console.log(container);


canvas.width = container.clientWidth || 400
canvas.height = container.clientHeight||300
let view = new View(canvas)
view.draw();


window.addEventListener("resize",()=>{
	canvas.width = container.clientWidth || 400
	canvas.height = container.clientHeight||300
	view = new View(canvas);
	view.draw();
});

// 
const createGameButton = document.querySelector("#createGameButton");
const vsAIButton = document.querySelector("#vsAIButton");
const PvPButton = document.querySelector("#PvPButton");

createGameButton.addEventListener("click",onCreateGameButton);
vsAIButton.addEventListener("click",onVSAIButton);
PvPButton.addEventListener("click",onPvPButton);

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