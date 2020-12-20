"use strict";

class Feeder {
	#subscriptionRefs = {};
	static #instance = null;
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
		this.#subscriptionRefs[EventKey.foodEaten] = The.eventBus.subscribe(EventKey.foodEaten, (...args) => me.#dropFood(...args));
		this.#subscriptionRefs[EventKey.averageLenChanged] = The.eventBus.subscribe(EventKey.averageLenChanged, (...args) => me.#setSpread(...args));
	}

	#unsubscribeEvents() {
		const me = this;
		for (let key in this.#subscriptionRefs) {
			const ref = this.#subscriptionRefs[key];
			The.eventBus.unsubscribe(key, ref);
		}
	}

	resetSpread() {
		this.#spread = 1;
	}

	#setSpread(val) {
		val = Math.floor(val);
		if (val > this.#spread)
			this.#spread = val;
	}

	#dropFood() {
		const centre = The.grid.centreCell;
		const blankCells = The.grid.getBlankCellsAround(centre, this.#spread);
		const nextFoodCell = blankCells.pickRandom();
		if (!nextFoodCell)
			debugger;
		nextFoodCell.beFood();
		The.grid.food = nextFoodCell;
	}
}
