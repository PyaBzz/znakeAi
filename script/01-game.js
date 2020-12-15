class Game {
	#config = {};
	#mouse;
	#grid;
	#button;
	#generationInfoboard;
	#evolutionInfoboard;
	#control;
	#overlay;
	#isPaused = false;

	constructor(znakeConf) {
		let me = this;
		this.#importConfig(znakeConf);
		this.#mouse = new Mouse(this);

		this.#grid = new Grid(
			document.getElementById('grid-container'),
			this.#config.grid,
			(...args) => this.#mouse.bindByTag(...args),
			this.#config.devMode);

		this.#generationInfoboard = new Infoboard(
			document.getElementById("generation-stats"),
			{
				[InfoKey.Age]: 0,
				[InfoKey.Length]: 0,
				[InfoKey.WormNo]: `1 / ${this.#config.ai.population}`,
				[InfoKey.Generation]: 1,
				[InfoKey.genMaxAge]: 0,
				[InfoKey.genMinAge]: 0,
				[InfoKey.genMaxLen]: 0,
				[InfoKey.genMinLen]: 0,
			}
		);
		this.#evolutionInfoboard = new Infoboard(
			document.getElementById("evolution-stats"),
			{
				[InfoKey.ancestor]: "No",
				[InfoKey.targetLength]: this.#config.worm.targetLength,
				[InfoKey.maxStepsToFood]: this.#grid.playableCellCount,
				[InfoKey.TotalWorms]: 1,
				[InfoKey.AverageAge]: 0,
				[InfoKey.AverageLen]: 0,
			}
		);

		this.#control = new Control(() => this.#togglePause(), this.#config.keys);

		this.#overlay = new Overlay(document.getElementById('body'),
			() => {
				me.#overlay.popDown();
				me.#overlay.unbindHandler();
				me.#overlay.beTranslucent();
				me.#overlay.line1 = "PAUSE";
				me.#overlay.line2 = "";
				me.#overlay.line3 = "";
				me.#onSplashClicked();
			},
			{
				line1: "Znake",
				line2: this.#config.devMode ? "Developer mode" : "",
				line3: "Click me!",
			});

		this.feeder = new Feeder(this.#grid);

		this.#button = new MultiFuncButton(document.getElementById('button'),
			{
				Start: () => me.#start(),
				Restart: () => me.#restart()
			});

		this.ai = new Ai(
			this.#config.ai,
			this.#grid.playableCellCount,
			{
				onAncestorLoad: (...args) => this.#onAncestorLoad(...args),
				onGenerationDone: (...args) => this.#onGenerationDone(...args),
				onNewModel: (...args) => this.#onNewModel(...args),
				onNewGeneration: (...args) => this.#onNewGeneration(...args),
			});
	}

	#importConfig(znakeConf) {
		for (let key in znakeConf)
			this.#config[key] = znakeConf[key];
		if (this.#config.grid.height < 4)
			throw "Grid height must be at least 4"
		if (this.#config.grid.width < 4)
			throw "Grid width must be at least 4"
	}

	#onSplashClicked() {
	}

	#onAncestorLoad(success) {
		if (success)
			this.#evolutionInfoboard.set({ [InfoKey.ancestor]: "Yes" });
		else
			this.#evolutionInfoboard.set({ [InfoKey.ancestor]: "Failed!" });
	}

	#start() {
		let brain = this.ai.getNextModel();
		this.worm = new Worm(
			brain,
			this.#config.ai.inputVectorSize,
			this.#grid,
			this.#config.startAtCentre,
			this.#config.stepTime,
			{
				onWormBorn: (...args) => this.#onWormBorn(...args),
				onStepTaken: (...args) => this.#onStepTaken(...args),
				onFoodEaten: (...args) => this.#onFoodEaten(...args),
				onWormDied: (...args) => this.#onWormDied(...args),
			});

		this.#generationInfoboard.set({ [InfoKey.Length]: this.worm.length });
		this.#button.bind("Restart");
		this.feeder.dropFood();
		// this.visualiser = new Visualiser(this);
		// this.visualiser.visualiseGrid();
		this.worm.run();
		this.bindEvents();
	}

	#restart() {
		if (this.isPaused) {
			this.#overlay.popDown();
			this.isPaused = false;
		} else {
			this.worm.stop();
		}
		this.worm.disappear();
		let brain = this.ai.getNextModel();
		this.worm = new Worm(
			brain,
			this.#config.ai.inputVectorSize,
			this.#grid,
			this.#config.startAtCentre,
			this.#config.stepTime,
			{
				onWormBorn: (...args) => this.#onWormBorn(...args),
				onStepTaken: (...args) => this.#onStepTaken(...args),
				onFoodEaten: (...args) => this.#onFoodEaten(...args),
				onWormDied: (...args) => this.#onWormDied(...args),
			});
		this.#generationInfoboard.set({ [InfoKey.Length]: this.worm.length });
		this.worm.run();
	}

	#togglePause() {
		if (this.isPaused) {
			this.worm.run();
			this.isPaused = false;
			this.#overlay.popDown();
		}
		else {
			this.worm.stop();
			this.isPaused = true;
			this.#overlay.popUp();
		}
	}

	bindEvents() {
		this.speedTickbox = document.getElementById('speed-tickbox');
		let me = this;
		this.speedTickbox.onchange = function () {
			if (me.speedTickbox.checked) {
				me.worm.slowDown();
			}
			else {
				me.worm.speedUp();
			}
		};
	}

	#onNewModel() {
		this.#generationInfoboard.set({ [InfoKey.WormNo]: `${this.ai.nextModelIndex} / ${this.#config.ai.population}` });
	}

	#onWormBorn(replacedFoodCell = false) {
		if (replacedFoodCell)
			this.feeder.dropFood();
	}

	#onGenerationDone(genMinAge, genMaxAge, genMinLen, genMaxLen) {
		this.#generationInfoboard.set({
			[InfoKey.genMinAge]: genMinAge,
			[InfoKey.genMaxAge]: genMaxAge,
			[InfoKey.genMinLen]: genMinLen,
			[InfoKey.genMaxLen]: genMaxLen,
		});
	}

	#onNewGeneration() {
		this.#generationInfoboard.set({ [InfoKey.Generation]: this.ai.generationNumber });
	}

	#onStepTaken() {
		this.#generationInfoboard.set({ [InfoKey.Age]: this.worm.age });
	}

	#onFoodEaten(age) {
		this.#generationInfoboard.set({ [InfoKey.Length]: age });
		if (this.worm.length >= this.#config.worm.targetLength) {
			const shouldDownload = confirm(`Target length of ${this.#config.worm.targetLength} reached!\nWould you like to download the current AI model`);
			if (shouldDownload)
				game.ai.currentModel.save('downloads://znakeAi-model');
		}
		this.feeder.dropFood();
	}

	#onWormDied() {
		this.worm.stop();
		this.ai.onWormDied(this.worm);
		this.#evolutionInfoboard.set({
			[InfoKey.TotalWorms]: this.ai.totalModels,
			[InfoKey.AverageLen]: this.ai.AverageLen.toFixed(3),
			[InfoKey.AverageAge]: this.ai.averageAge.toFixed(3),
		});
		this.#restart();
	}
}