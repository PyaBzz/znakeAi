Feeder = function (game) {
	this.game = game;
	this.feedingTimeStep = game.config.feedingTimeStep;
	this.loopId = 0;
	this.foodCells = [];
}

Feeder.prototype.dropFood = function () {
	this.foodCells.forEach(function (cell) {
		if (cell.isFood)
			cell.beBlank();
	})

	let blankCells = this.game.grid.getBlankCells();
	if (this.game.config.numberOfFoodCellsAtOnce === 1) {
		this.foodCells = [];
		this.foodCells.push(blankCells.pickRandom());
	} else {
		this.foodCells = blankCells.pickRandom(this.game.config.numberOfFoodCellsAtOnce);
	}
	this.foodCells.forEach((cell) => cell.beFood());
}
