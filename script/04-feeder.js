"use strict";

class Feeder {
	#subscriptions = {};
	static #instance = null;
	#lastFood = null;
	#spread = 1;

	constructor() {
		if (Feeder.#instance)
			throw new Error("Do not instantiate a singleton class twice");

		Feeder.#instance = this;
		this.#subscribeEvents();
		this.#dropFood();
	}

	static get instance() { return Feeder.#instance ? Feeder.#instance : new Feeder() }
	get spread() { return this.#spread };

	#subscribeEvents() {
		const me = this;
		this.#subscriptions[EventKey.foodEaten] = The.eventBus.subscribe(EventKey.foodEaten, (...args) => me.#dropFood(...args));
		this.#subscriptions[EventKey.averageLenChanged] = The.eventBus.subscribe(EventKey.averageLenChanged, (...args) => me.#setSpread(...args));
	}

	#unsubscribeEvents() {
		const me = this;
		for (let key in this.#subscriptions) {
			const ref = this.#subscriptions[key];
			The.eventBus.unsubscribe(key, ref);
		}
	}

	resetSpread() {
		this.#spread = 1;
	}

	#setSpread(val) {
		val = Math.floor(val);
		if (val >= this.#spread)
			this.#spread = val;
		else {
			this.#spread = Math.min(1, val);
			this.#lastFood.beBlank();
			this.#dropFood();
		}
	}

	#dropFood() {
		const centre = The.grid.centreCell;
		let blankCells = The.grid.getBlankCellsAround(centre, this.#spread);
		if (blankCells.hasNone)
			blankCells = The.grid.getBlankCellsAround(centre, this.#spread + 1);
		const nextFoodCell = blankCells.pickRandom();
		if (!nextFoodCell)
			debugger;
		nextFoodCell.beFood();
		this.#lastFood = nextFoodCell;
		The.grid.food = nextFoodCell;
	}
}
