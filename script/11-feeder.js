class Feeder {
	#grid;

	constructor(grid) {
		this.#grid = grid;
	}

	dropFood(diffFromCentre = 1) {
		let centre = this.#grid.getCentreCell();
		// let diff = Math.floor(this.game.ai.AverageLen) || 1; //Todo: Transfer this from game
		let blankCells = this.#grid.getBlankCellsAround(centre, diffFromCentre);
		let nextFoodCell = blankCells.pickRandom();
		nextFoodCell.beFood();
		this.#grid.food = nextFoodCell;
	}
}
