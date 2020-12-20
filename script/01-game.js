"use strict";

class Game { //Todo: Make singleton
	#subscriptionRefs = {};
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
		let dummyObj = The.grid;
		dummyObj = The.eventBus;
		dummyObj = The.feeder;
		dummyObj = The.gameBoard;
		dummyObj = The.genBoard;
		dummyObj = The.evoBoard;
		dummyObj = The.wormBoard;
		dummyObj = The.target;
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
				The.eventBus.notify(EventBus.key.slowDown);
			}
			else {
				The.eventBus.notify(EventBus.key.speedUp);
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
				The.gameBoard.set({ [GameBoard.key.useAncestor]: "Yes", })
			}).catch(err => {
				The.gameBoard.set({ [GameBoard.key.useAncestor]: "Failed", })
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
			evo.run();
		} else {
			this.#end();
		}
	}

	#pause() {
		this.#button.bind(ButtonKey.Resume);//Todo: Could go to a button object as subscription
		The.eventBus.notify(EventBus.key.pause);
	}

	#resume() {
		this.#button.bind(ButtonKey.Pause);//Todo: Could go to a button object as subscription
		The.eventBus.notify(EventBus.key.resume);
	}

	#end() {
		this.#button.bind(ButtonKey.End);
	}
}

class GameBoard {
	static #instance = null;
	static key = Object.freeze({ useAncestor: "Use Ancestor" });
	#board = new Infoboard(
		document.getElementById("game-board"),
		{
			[GameBoard.key.useAncestor]: "No",
		},
		"Game info",
	);

	constructor() {
		GameBoard.#instance = this;
	}

	static get instance() {
		return GameBoard.#instance ? GameBoard.#instance : new GameBoard();
	}

	get(key) { return this.#board.get(key) }
	set(...args) { this.#board.set(...args) }
}
