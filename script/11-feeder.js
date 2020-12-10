class Feeder {
	constructor(game) {
		this.game = game;
	}

	dropFood() {
		let blankCells = this.game.grid.getBlankCells();
		let nextFoodCell = blankCells.pickRandom();
		nextFoodCell.beFood();
		this.game.grid.food = nextFoodCell;
	}
}
