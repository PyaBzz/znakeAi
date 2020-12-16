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
	#worm;
	#feeder;
	#ai;
	#stat;

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
				[InfoKey.Length]: 1,
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

		this.#feeder = new Feeder(this.#grid);

		this.#button = new MultiFuncButton(document.getElementById('button'),
			{
				Start: () => me.#start(),
				Restart: () => me.#restart()
			});

		this.#ai = new Ai(
			this.#config.ai,
			this.#grid.playableCellCount,
			{
				onAncestorLoad: (...args) => this.#onAncestorLoad(...args),
				onGenerationDone: (...args) => this.#onGenerationDone(...args),
				onNewModel: (...args) => this.#onNewModel(...args),
				onNewGeneration: (...args) => this.#onNewGeneration(...args),
			});

		this.#stat = new Stat();
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
		let brain = this.#ai.getNextModel();
		this.#worm = new Worm(
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

		this.#button.bind("Restart");
		this.#feeder.dropFood(1);
		// this.visualiser = new Visualiser(this);
		// this.visualiser.visualiseGrid();
		this.#worm.run();
		this.bindEvents();
	}

	#restart() {
		if (this.isPaused) {
			this.#overlay.popDown();
			this.isPaused = false;
		} else {
			this.#worm.stop();
		}
		this.#worm.disappear();
		let brain = this.#ai.getNextModel();
		this.#worm = new Worm(
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
		this.#generationInfoboard.set({ [InfoKey.Length]: 1 });
		this.#worm.run();
	}

	#togglePause() {
		if (this.isPaused) {
			this.#worm.run();
			this.isPaused = false;
			this.#overlay.popDown();
		}
		else {
			this.#worm.stop();
			this.isPaused = true;
			this.#overlay.popUp();
		}
	}

	bindEvents() {
		this.speedTickbox = document.getElementById('speed-tickbox');
		let me = this;
		this.speedTickbox.onchange = function () {
			if (me.speedTickbox.checked) {
				me.#worm.slowDown();
			}
			else {
				me.#worm.speedUp();
			}
		};
	}

	#onNewModel(nextIndex) { //Todo: Can we combine newModel and newWorm callbacks?
		this.#generationInfoboard.set({ [InfoKey.WormNo]: `${nextIndex} / ${this.#config.ai.population}` });
	}

	#onWormBorn(replacedFoodCell = false) {
		if (replacedFoodCell)
			this.#feeder.dropFood();
		this.#stat.resetWorm();
	}

	#onStepTaken(age) {
		this.#generationInfoboard.set({ [InfoKey.Age]: age });
	}

	#onFoodEaten(len) {
		this.#generationInfoboard.set({ [InfoKey.Length]: len });
		if (len >= this.#config.worm.targetLength) {
			const shouldDownload = confirm(`Target length of ${this.#config.worm.targetLength} reached!\nWould you like to download the current AI model`);
			if (shouldDownload)
				this.#ai.saveModel();
		}
		const foodSpread = Math.floor(this.#stat.get(Stat.key.averageLen));
		this.#feeder.dropFood(foodSpread);
	}

	#onWormDied(age, len) {
		this.#worm.stop(); //Todo: Move to worm
		this.#ai.onWormDied(age, len);
		this.#stat.set({
			[Stat.key.wormAge]: age,
			[Stat.key.wormLen]: len,
		});
		this.#evolutionInfoboard.set({
			[InfoKey.TotalWorms]: this.#stat.get(Stat.key.totalWorms),
			[InfoKey.AverageLen]: this.#stat.get(Stat.key.averageLen).toFixed(3),
			[InfoKey.AverageAge]: this.#stat.get(Stat.key.averageAge).toFixed(3),
		});
		this.#restart();
	}

	#onNewGeneration() {
		this.#generationInfoboard.set({ [InfoKey.Generation]: this.#ai.generationNumber });//Todo: Move to stat
		this.#stat.resetGeneration();
	}

	#onGenerationDone() {
		this.#generationInfoboard.set({
			[InfoKey.genMinAge]: this.#stat.get(Stat.key.genMinAge),
			[InfoKey.genMaxAge]: this.#stat.get(Stat.key.genMaxAge),
			[InfoKey.genMinLen]: this.#stat.get(Stat.key.genMinLen),
			[InfoKey.genMaxLen]: this.#stat.get(Stat.key.genMaxLen),
		});
	}
}
