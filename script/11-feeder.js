Feeder = function (game) {
	this.game = game;
	this.numberOfFoodCellsAtOnce = this.game.config.numberOfFoodCellsAtOnce;
}

Feeder.prototype.dropFood = function () {
	let blankCells = this.game.grid.getBlankCells();
	let nextFoodCell = blankCells.pickRandom();
	nextFoodCell.beFood();
}

Feeder.prototype.dropFoodInitial = function () {
	let blankCells = this.game.grid.getBlankCells();
	let newFoods;
	if (this.numberOfFoodCellsAtOnce === 1) {
		newFoods = [blankCells.pickRandom()];
	} else {
		newFoods = blankCells.pickRandom(this.numberOfFoodCellsAtOnce);
	}
	newFoods.forEach((cell) => cell.beFood());
}
