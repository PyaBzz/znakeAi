class Feeder {
	#grid;

	constructor(grid) {
		this.#grid = grid;
	}

	dropFood(spread = 1) {
		spread = Math.max(spread, 1);
		let centre = this.#grid.getCentreCell();
		let blankCells = this.#grid.getBlankCellsAround(centre, spread);
		let nextFoodCell = blankCells.pickRandom();
		nextFoodCell.beFood();
		this.#grid.food = nextFoodCell;
	}
}
