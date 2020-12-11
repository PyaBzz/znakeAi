class Feeder {
	constructor(game) {
		this.game = game;
	}

	dropFood() {
		let centre = this.game.grid.getCentreCell();
		let diff = Math.floor(this.game.ai.AverageLen) || 1;
		let blankCells = this.game.grid.getBlankCellsAround(centre, diff);
		let nextFoodCell = blankCells.pickRandom();
		nextFoodCell.beFood();
		this.game.grid.food = nextFoodCell;
	}
}
