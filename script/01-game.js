"use strict";

class Game {
	#ancestorBrain = null;
	#evoCounter = 0;
	#slowDownFunc;
	#speedUpFunc;

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
		this.#bindEvents();
		//Only to instantiate the singleton classes
		let dummyObj = Grid.instance;
		dummyObj = GameInfoboard.instance;
		dummyObj = GenInfoboard.instance;
		dummyObj = EvoInfoboard.instance;
		dummyObj = EventBus.instance;
		Evolution.ancestor = null; //Todo: Add file loading code to Game
	}

	#validateConfig() {
		if (Config.grid.height < 4)
			throw "Grid height must be at least 4"
		if (Config.grid.width < 4)
			throw "Grid width must be at least 4"
	}

	#bindEvents() {
		this.speedTickbox = document.getElementById('speed-tickbox');
		const me = this;
		this.speedTickbox.onchange = function () {
			if (me.speedTickbox.checked) {
				EventBus.instance.notify(EventBus.key.slowDown);
			}
			else {
				EventBus.instance.notify(EventBus.key.speedUp);
			}
		};
		const jsonUpload = document.getElementById('json-upload');
		const binUpload = document.getElementById('bin-upload');
		jsonUpload.onchange = function () { };
		binUpload.onchange = function () { };
		const loadButton = document.getElementById('load-button');
		loadButton.onclick = function () {
			if (jsonUpload.files.length === 0) {
				alert("Please select a JSON file to describe the model");
				return;
			}
			if (binUpload.files.length === 0) {
				alert("Please select a binary file for model weights");
				return;
			}
			tf.loadLayersModel(
				tf.io.browserFiles([
					jsonUpload.files[0],
					binUpload.files[0]
				])
			).then(result => {
				me.#ancestorBrain = result;
				GameInfoboard.instance.set({ [GameInfoboard.key.useAncestor]: "Yes", })
			}).catch(err => {
				GameInfoboard.instance.set({ [GameInfoboard.key.useAncestor]: "Failed", })
			});
		};
	}

	#start() {
		this.#button.bind(ButtonKey.Pause);
		this.#run();
	}

	#run() {
		this.#evoCounter++;
		if (this.#evoCounter <= Config.evolution.rounds) {
			const evo = new Evolution(this.#evoCounter, this.#ancestorBrain);
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
		EventBus.instance.notify(EventBus.key.pause);
	}

	#resume() {
		this.#button.bind(ButtonKey.Pause);
		EventBus.instance.notify(EventBus.key.resume);
	}

	#end() {
		this.#button.bind(ButtonKey.End);
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
