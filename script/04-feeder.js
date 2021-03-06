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
		let additiveSpread = 0;
		let blankCells = [];
		while (BazArray.hasNone(blankCells)) {
			const effectiveSpread = this.#spread + additiveSpread;
			const spreadSurface = Math.pow((2 * effectiveSpread + 1), 2);
			blankCells = The.grid.getBlankCellsAround(centre, effectiveSpread);
			if (spreadSurface >= The.grid.playableCellCount && BazArray.hasNone(blankCells))
				alert("There's no blank cell to drop food!") //Todo: The ultimate goal, isn't it?
			additiveSpread++;
		}
		const nextFoodCell = BazArray.pickRandom(blankCells).items[0];
		if (!nextFoodCell)
			debugger;
		nextFoodCell.beFood();
		this.#lastFood = nextFoodCell;
		The.grid.food = nextFoodCell;
	}
}
