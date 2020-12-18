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
			[ButtonKey.End]: () => null,
		});


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
		log("start");
		this.#button.bind(ButtonKey.Pause);
		this.#doNextEvolution();
	}

	#doNextEvolution() {
		if (this.#evoCounter) {
			this.#evoCounter--;
			const evo = new Evolution();
			const resPromise = evo.start();
			resPromise.then(res => {
				log(res);
				this.#doNextEvolution();
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
