class Game {
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

	constructor() {
		let me = this;
		if (Config.grid.height < 4)
			throw "Grid height must be at least 4"
		if (Config.grid.width < 4)
			throw "Grid width must be at least 4"
		this.#mouse = new Mouse(this);

		this.#grid = new Grid(
			document.getElementById('grid-container'),
			Config.grid,
			(...args) => this.#mouse.bindByTag(...args),
			Config.devMode);

		this.#generationInfoboard = new Infoboard(
			document.getElementById("generation-stats"),
			{
				[InfoKey.age]: 0,
				[InfoKey.length]: 1,
				[InfoKey.wormNo]: `1 / ${Config.ai.population}`,
				[InfoKey.genNumber]: 1,
				[InfoKey.genMaxAge]: 0,
				[InfoKey.genMinAge]: 0,
				[InfoKey.genMaxLen]: 0,
				[InfoKey.genMinLen]: 0,
			});

		this.#evolutionInfoboard = new Infoboard(
			document.getElementById("evolution-stats"),
			{
				[InfoKey.ancestor]: "No",
				[InfoKey.targetLength]: Config.worm.targetLength,
				[InfoKey.maxStepsToFood]: this.#grid.playableCellCount,
				[InfoKey.totalWorms]: 1,
				[InfoKey.averageAge]: 0,
				[InfoKey.averageLen]: 0,
				[InfoKey.foodSpread]: 1,
			});

		this.#control = new Control(() => this.#togglePause(), Config.keys);

		this.#overlay = new Overlay(document.getElementById('body'),
			() => {
				me.#overlay.popDown();
				me.#overlay.unbindHandler();
				me.#overlay.beTranslucent();
				me.#overlay.line1 = "PAUSE";
				me.#overlay.line2 = "press SPACE";
				me.#overlay.line3 = "to resume";
				me.#onSplashClicked();
			},
			{
				line1: "Znake",
				line2: Config.devMode ? "Developer mode" : "",
				line3: "Click me!",
			});

		this.#feeder = new Feeder(this.#grid);

		this.#button = new MultiFuncButton(document.getElementById('button'),
			{
				Start: () => me.#init(),
				Pause: () => me.#togglePause(), //Todo: What should this button do?
			});

		this.#ai = new Ai(
			Config.ai,
			this.#grid.playableCellCount,
			{
				onAncestorLoad: (...args) => this.#onAncestorLoad(...args),
				onGenerationDone: (...args) => this.#onGenerationDone(...args),
				onNewModel: (...args) => this.#onNewModel(...args),
				onNewGeneration: (...args) => this.#onNewGeneration(...args),
			});

		this.#stat = new Stat();

		//Todo: Put ancestor handling here
	}

	#onSplashClicked() {
	}

	#onAncestorLoad(success) {
		if (success)
			this.#evolutionInfoboard.set({ [InfoKey.ancestor]: "Yes" });
		else
			this.#evolutionInfoboard.set({ [InfoKey.ancestor]: "Failed!" });
	}

	#init() {
		this.#worm = this.#buildWorm();
		this.#button.bind("Pause");
		this.#feeder.dropFood();
		// this.visualiser = new Visualiser(this);
		// this.visualiser.visualiseGrid();
		this.#worm.run();
		this.bindEvents();
	}

	#doNewEvolution() {
		//Todo: Implement
	}

	#evolutionDone() {
		//
	}

	#doNewGeneration() {
		//Todo: Implement
	}

	#onNewGeneration() {//Todo: Flow should be initiated by the game rather than ai
		this.#stat.onNewGeneration();
		this.#generationInfoboard.set({
			[InfoKey.genNumber]: this.#stat.get(Stat.key.generationNo),
		});
	}

	#onGenerationDone() {
		this.#generationInfoboard.set({
			[InfoKey.genMinAge]: this.#stat.get(Stat.key.genMinAge),
			[InfoKey.genMaxAge]: this.#stat.get(Stat.key.genMaxAge),
			[InfoKey.genMinLen]: this.#stat.get(Stat.key.genMinLen),
			[InfoKey.genMaxLen]: this.#stat.get(Stat.key.genMaxLen),
		});
	}

	#doNewWorm() {
		if (this.isPaused) {
			this.#overlay.popDown();
			this.isPaused = false;
		} else {
			this.#worm.stop();
		}
		this.#worm.disappear();
		this.#worm = this.#buildWorm();
		this.#generationInfoboard.set({ [InfoKey.length]: 1 });
		this.#worm.run();
	}

	#buildWorm() {
		const brain = this.#ai.getNextModel();
		return new Worm(
			brain,
			Config.ai.inputVectorSize,
			this.#grid,
			Config.startAtCentre,
			Config.stepTime,
			{
				onWormBorn: (...args) => this.#onWormBorn(...args),
				onStepTaken: (...args) => this.#onStepTaken(...args),
				onFoodEaten: (...args) => this.#onFoodEaten(...args),
				onWormDied: (...args) => this.#onWormDied(...args),
			});
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
		this.#generationInfoboard.set({ [InfoKey.wormNo]: `${nextIndex} / ${Config.ai.population}` });
	}

	#onWormBorn(replacedFoodCell = false) {
		if (replacedFoodCell)
			this.#feeder.dropFood();
		this.#stat.onNewWorm();
	}

	#onStepTaken(age) {
		this.#generationInfoboard.set({ [InfoKey.age]: age });
	}

	#onFoodEaten(len) {
		this.#generationInfoboard.set({ [InfoKey.length]: len });
		if (len >= Config.worm.targetLength) {
			const shouldDownload = confirm(`Target length of ${Config.worm.targetLength} reached!\nWould you like to download the current AI model`);
			if (shouldDownload)
				this.#ai.saveModel();
		}
		const foodSpread = Math.floor(this.#stat.get(Stat.key.averageLen)) || 1;
		this.#evolutionInfoboard.set({ [InfoKey.foodSpread]: foodSpread });
		this.#feeder.dropFood(foodSpread);
	}

	#onWormDied(age, len) {
		this.#ai.onWormDied(age, len);
		this.#stat.set({
			[Stat.key.wormAge]: age,
			[Stat.key.wormLen]: len,
		});
		this.#evolutionInfoboard.set({
			[InfoKey.totalWorms]: this.#stat.get(Stat.key.totalWorms),
			[InfoKey.averageLen]: this.#stat.get(Stat.key.averageLen).toFixed(3),
			[InfoKey.averageAge]: this.#stat.get(Stat.key.averageAge).toFixed(3),
		});
		this.#doNewWorm();
	}
}
