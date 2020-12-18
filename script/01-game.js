"use strict";

class Game {
	#evoCounter = Config.evolution.rounds;
	#grid = new Grid(document.getElementById('grid-container'));
	// #mouse = new Mouse(this);
	// #keyboard = new Keyboard(() => this.#togglePause());

	#button = new MultiFuncButton(document.getElementById('button'),
		{
			[ButtonKey.Start]: () => this.#start(),
			[ButtonKey.Pause]: () => this.#pause(),
			[ButtonKey.Resume]: () => this.#resume(),
		});


	constructor() {
		this.#validateConfig();



		// while (this.#evoCounter) {
		// 	this.#evoCounter--;
		// }
	}

	#validateConfig() {
		if (Config.grid.height < 4)
			throw "Grid height must be at least 4"
		if (Config.grid.width < 4)
			throw "Grid width must be at least 4"
	}

	#start() {
		log("start");
		this.#button.bind(ButtonKey.Pause);
	}

	#pause() {
		this.#button.bind(ButtonKey.Resume);
		log("pause");
	}

	#resume() {
		this.#button.bind(ButtonKey.Pause);
		log("resume");
	}
}
