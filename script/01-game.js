"use strict";

class Game {
	#ancestor = null;
	#evoCounter = 0;

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
		const grid = Grid.instance; //Only to instantiate the singleton
		const gameInfoboard = GameInfoboard.instance; //Only to instantiate the singleton
		const genInfoboard = GenInfoboard.instance; //Only to instantiate the singleton
		const evoInfoboard = EvoInfoboard.instance; //Only to instantiate the singleton
		Evolution.ancestor = null; //Todo: Add file loading code to Game
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
		this.#run();
	}

	#run() {
		this.#evoCounter++;
		if (this.#evoCounter <= Config.evolution.rounds) {
			const evo = new Evolution(this.#evoCounter, this.#ancestor);
			const evoResPromise = evo.run();
			return evoResPromise.then(evoRes => {
				log(`evolution ${this.#evoCounter} >> ${evoRes.maxLen}, ${evoRes.minLen}, ${evoRes.maxAge}, ${evoRes.minAge}, ${evoRes.totalLen}, ${evoRes.totalAge}`);
				return this.#run();
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

class GameInfoboard {
	static #instance = null;
	static key = Object.freeze({ useAncestor: "Use Ancestor" });
	#board = new Infoboard(
		document.getElementById("game-info"),
		{
			[GameInfoboard.key.useAncestor]: "No",
		},
		"Game info",
	);

	constructor() {
		GameInfoboard.#instance = this;
	}

	static get instance() {
		return GameInfoboard.#instance ? GameInfoboard.#instance : new GameInfoboard();
	}

	get(key) { return this.#board.get(key) }
	set(...args) { this.#board.set(...args) }
}
