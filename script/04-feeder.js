"use strict";

class Feeder {
	static #instance = null;

	constructor() {
		if (Feeder.#instance)
			throw new Error("Do not instantiate a singleton class twice");

		Feeder.#instance = this;
	}

	static get instance() {
		return Feeder.#instance ? Feeder.#instance : new Feeder();
	}

	dropFood(spread = 1) {
		spread = Math.max(spread, 1);
		const centre = Grid.instance.centreCell;
		const blankCells = Grid.instance.getBlankCellsAround(centre, spread);
		const nextFoodCell = blankCells.pickRandom();
		if (!nextFoodCell)
			debugger;
		nextFoodCell.beFood();
		Grid.instance.food = nextFoodCell;
	}
}
