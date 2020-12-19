"use strict";

class Game {
	static #infoKey = Object.freeze({ useAncestor: "Use Ancestor", evolutionNo: "Evolution No", });

	#evoCounter = 0;
	#grid = new Grid(document.getElementById('grid-container'));

	// #mouse = new Mouse(this);
	// #keyboard = new Keyboard(() => this.#togglePause());

	#button = new MultiFuncButton(document.getElementById('button'),
		{
			[ButtonKey.Start]: () => this.#start(),
			[ButtonKey.Pause]: () => this.#pause(),
			[ButtonKey.Resume]: () => this.#resume(),
			[ButtonKey.End]: () => null,
		});

	#infoboard = new Infoboard(
		document.getElementById("game-info"),
		{
			[Game.#infoKey.useAncestor]: "No",
			[Game.#infoKey.evolutionNo]: 0,
		},
		"Game info",
	);

	#evoInfoboard = new Infoboard(
		document.getElementById("evolution-info"),
		{
			[Evolution.infoKey.generationNo]: 0,
		},
		"Evolution info",
	);

	constructor() {
		this.#validateConfig();
	}

	#validateConfig() {
		if (Config.grid.height < 4)
			throw "Grid height must be at least 4"
		if (Config.grid.width < 4)
			throw "Grid width must be at least 4"
	}

	#start() {
		log("game start");
		this.#button.bind(ButtonKey.Pause);
		this.#doNextEvolution();
	}

	#doNextEvolution() {
		this.#evoCounter++;
		if (this.#evoCounter <= Config.evolution.rounds) {
			const evo = new Evolution();
			const evoResPromise = evo.run();
			return evoResPromise.then(evoRes => {
				log(evoRes.stat + this.#evoCounter);
				return this.#doNextEvolution();
			});
		} else {
			this.#end();
		}
	}

	#pause() {
		this.#button.bind(ButtonKey.Resume);
		log("pause");
	}

	#resume() {
		this.#button.bind(ButtonKey.Pause);
		log("resume");
	}

	#end() {
		this.#button.bind(ButtonKey.End);
		log("fin");
	}
}
