"use strict";

class Feeder {
    #subscriptionRefs = {}; //Todo: listen to foodEaten and react
	static #instance = null;
	#spread = 1;

	constructor() {
		if (Feeder.#instance)
			throw new Error("Do not instantiate a singleton class twice");

		Feeder.#instance = this;
	}

	static get instance() { return Feeder.#instance ? Feeder.#instance : new Feeder() }
	get spread() { return this.#spread };

	resetSpread() {
		this.#spread = 1;
	}

	setSpread(val) {
		val = Math.floor(val);
		if (val > this.#spread)
			this.#spread = val;
	}

	dropFood() {
		const centre = Grid.instance.centreCell;
		const blankCells = Grid.instance.getBlankCellsAround(centre, this.#spread);
		const nextFoodCell = blankCells.pickRandom();
		if (!nextFoodCell)
			debugger;
		nextFoodCell.beFood();
		Grid.instance.food = nextFoodCell;
	}
}
