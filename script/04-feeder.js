"use strict";

class Feeder {
	#grid;

	constructor(grid) {
		this.#grid = grid;
	}

	dropFood(spread = 1) {
		spread = Math.max(spread, 1);
		const centre = this.#grid.centreCell();
		const blankCells = this.#grid.getBlankCellsAround(centre, spread);
		const nextFoodCell = blankCells.pickRandom();
		if (!nextFoodCell)
			debugger;
		nextFoodCell.beFood();
		this.#grid.food = nextFoodCell;
	}
}
