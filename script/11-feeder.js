Feeder = function (game) {
	this.game = game;
}

Feeder.prototype.dropFood = function () {
	let blankCells = this.game.grid.getBlankCells();
	let nextFoodCell = blankCells.pickRandom();
	nextFoodCell.beFood();
	this.game.grid.food = nextFoodCell;
}
