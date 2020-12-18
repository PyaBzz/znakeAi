"use strict";

class Game {
	#evoCounter = Config.evolution.rounds;
	#grid = new Grid(document.getElementById('grid-container'));

	constructor() {
		this.#validateConfig();
		// this.#mouse = new Mouse(this);

		// while (this.#evoCounter) {
		// 	check();
		// 	this.#evoCounter--;
		// }
	}

	#validateConfig() {
		if (Config.grid.height < 4)
			throw "Grid height must be at least 4"
		if (Config.grid.width < 4)
			throw "Grid width must be at least 4"
	}
}
