const COLOR = {
	WHITE: 1,
	WHITE_QUEEN: 2,
	BLACK: -1,
	BLACK_QUEEN: -2
}
COLOR.isQueen = function(val) {
	return val == COLOR.WHITE_QUEEN  || val == COLOR.BLACK_QUEEN;
}
COLOR.isWhite = function(val) { return val > 0; }
COLOR.isBlack = function(val) { return val < 0; }