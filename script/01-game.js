"use strict";

class Game {
	static #instance = null;
	#subscriptions = {};
	#ancestorBrain = null;
	#evoCounter = 0;
	#currentEvo = null;
	#evoData = [];

	#button = new MultiFuncButton(document.getElementById('button'),
		{
			[ButtonKey.Start]: () => this.#start(),
			[ButtonKey.Pause]: () => {
				this.#button.bind(ButtonKey.Resume);
				The.eventBus.notify(EventKey.pause);
			},
			[ButtonKey.Resume]: () => {
				this.#button.bind(ButtonKey.Pause);
				The.eventBus.notify(EventKey.resume);
			},
			[ButtonKey.End]: () => null,
		});

	constructor() {
		if (Game.#instance)
			throw new Error("Do not instantiate a singleton class twice");
		this.#validateConfig();
		this.#bindEvents();
		this.#subscribeEvents();
		//Only to instantiate the singleton classes
		let dummyObj = The.grid;
		dummyObj = The.eventBus;
		dummyObj = The.feeder;
		dummyObj = The.gameBoard;
		dummyObj = The.genBoard;
		dummyObj = The.evoBoard;
		dummyObj = The.wormBoard;
		dummyObj = The.target;
		Evolution.ancestor = null;
		Game.#instance = this;
	}

	static get instance() { return Game.#instance ? Game.#instance : new Game(); }
	get currentEvo() { return this.#currentEvo }

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
				The.eventBus.notify(EventKey.slowDown);
			}
			else {
				The.eventBus.notify(EventKey.speedUp);
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

	#subscribeEvents() {
		const me = this;
		this.#subscriptions[EventKey.evolutionEnd] = The.eventBus.subscribe(EventKey.evolutionEnd, (...args) => this.#onEvolutionEnd(...args));
		this.#subscriptions[EventKey.targetReached] = The.eventBus.subscribe(EventKey.targetReached, (...args) => this.#onTargetReached(...args));
	}

	#unsubscribeEvents() {
		const me = this;
		for (let key in this.#subscriptions) {
			const ref = this.#subscriptions[key];
			The.eventBus.unsubscribe(key, ref);
		}
	}

	#start() {
		this.#button.bind(ButtonKey.Pause);
		this.#run();
	}

	#run() {
		this.#evoCounter++;
		The.evoBoard.set({ [EvoBoard.key.evolutionNo]: this.#evoCounter + " /" + Config.evolution.rounds });
		this.#currentEvo = new Evolution(this.#ancestorBrain);
		this.#currentEvo.run();
	}

	#onTargetReached() {
		this.#unsubscribeEvents();
	}

	#onEvolutionEnd() {
		if (this.#evoCounter < Config.evolution.rounds) {
			this.#run();
		} else { //Todo: Add stat collection over evolutions and download as csv
			this.#unsubscribeEvents();
			this.#end();
			return;
		}
	}

	#end() {
		alert(`Ran ${this.#evoCounter} rounds of evolution\nreaching no target`);
		this.#button.bind(ButtonKey.End);
	}
}

class GameBoard {
	static #instance = null;
	static key = Object.freeze({
		useAncestor: "Use Ancestor",
		age: "Age",
		length: "Length",
		averageLen: "Average Len",
	});
	#board = new Infoboard(
		document.getElementById("game-board"),
		{
			[GameBoard.key.useAncestor]: "No",
			[GameBoard.key.age]: Config.target.age,
			[GameBoard.key.length]: Config.target.length,
			[GameBoard.key.averageLen]: Config.target.averageLen,
		},
		"Game Targets",
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
