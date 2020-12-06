Game = function (znakeConf) {
	this.importConfig(znakeConf);
	this.initialise();
}

Game.prototype.importConfig = function (znakeConf) {
	this.config = {}
	for (let key in znakeConf)
		this.config[key] = znakeConf[key];
	if (this.config.grid.height < 4)
		throw "Grid height must be at least 4"
	if (this.config.grid.width < 4)
		throw "Grid width must be at least 4"
}

Game.prototype.initialise = function () {
	this.mouse = new Mouse(this);
	this.grid = new Grid(this, document.getElementById('grid-container'));
	this.generationInfoboard = new Infoboard(
		"generation-stats",
		[infoboardKeysEnum.Score, 0],
		[infoboardKeysEnum.Age, 0],
		[infoboardKeysEnum.WormNo, "1 /" + this.config.ai.population],
		[infoboardKeysEnum.Generation, 1],
	);
	this.evolutionInfoboard = new Infoboard(
		"evolution-stats",
		[infoboardKeysEnum.genMinAge, 0],
		[infoboardKeysEnum.genMaxAge, 0],
		[infoboardKeysEnum.genMinLen, 0],
		[infoboardKeysEnum.genMaxLen, 0],
		[infoboardKeysEnum.TotalWorms, 1],
		[infoboardKeysEnum.AverageAge, 0],
		[infoboardKeysEnum.AverageLen, 0],
	);
	this.control = new Control(this);
	this.overlay = new Overlay(this);
	this.feeder = new Feeder(this);
	this.button = new Button(this, document.getElementById('button'));
	this.ai = new Ai(this);
}

Game.prototype.onSplashClicked = function () {
}

Game.prototype.start = function () {
	let brain = this.ai.getNextModel();
	this.worm = new Worm(this, brain);
	this.generationInfoboard.set(infoboardKeysEnum.Score, this.worm.length);
	this.button.beRestartButton();
	this.control.setForRunning()
	// this.feeder.dropFoodInitial();
	this.feeder.dropFood();
	// this.visualiser = new Visualiser(this);
	// this.visualiser.visualiseGrid();
	this.worm.run();
}

Game.prototype.restart = function () {
	if (this.isPaused) {
		this.overlay.popDown();
		this.isPaused = false;
	} else {
		this.worm.stopRunning();
	}
	this.stepTime = this.config.stepTime;
	this.worm.disappear();
	let brain = this.ai.getNextModel();
	this.worm = new Worm(this, brain);
	this.generationInfoboard.set(infoboardKeysEnum.Score, this.worm.length);
	this.control.setForRunning();
	this.worm.run();
}

Game.prototype.togglePause = function () {
	if (this.isPaused) {
		this.worm.run();
		this.isPaused = false;
		this.control.setForRunning();
		this.overlay.popDown();
	}
	else {
		this.worm.stopRunning();
		this.isPaused = true;
		this.overlay.popUp();
	}
}

Game.prototype.onNewModel = function () {
	this.generationInfoboard.set(infoboardKeysEnum.WormNo, this.ai.nextModelIndex + " /" + this.config.ai.population);
}

Game.prototype.onGenerationDone = function (genMinAge, genMaxAge, genMinLen, genMaxLen) {
	this.evolutionInfoboard.set(infoboardKeysEnum.genMinAge, genMinAge);
	this.evolutionInfoboard.set(infoboardKeysEnum.genMaxAge, genMaxAge);
	this.evolutionInfoboard.set(infoboardKeysEnum.genMinLen, genMinLen);
	this.evolutionInfoboard.set(infoboardKeysEnum.genMaxLen, genMaxLen);
}

Game.prototype.onNewGeneration = function () {
	this.generationInfoboard.set(infoboardKeysEnum.Generation, this.ai.generationNumber);
}

Game.prototype.onStepTaken = function () {
	this.generationInfoboard.set(infoboardKeysEnum.Age, this.worm.age);
}

Game.prototype.onFoodEaten = function () {
	this.generationInfoboard.set(infoboardKeysEnum.Score, this.worm.length);
	this.feeder.dropFood();
}

Game.prototype.onWormDied = function () {
	this.control.disable();
	this.worm.stopRunning();
	this.ai.onWormDied(this.worm);
	this.evolutionInfoboard.set(infoboardKeysEnum.TotalWorms, this.ai.totalModels);
	this.evolutionInfoboard.set(infoboardKeysEnum.AverageLen, this.ai.AverageLen.toFixed(3));
	this.evolutionInfoboard.set(infoboardKeysEnum.AverageAge, this.ai.averageAge.toFixed(3));
	if (this.worm.length >= this.config.worm.targetLength) {
		alert("Target reached!");
		game.ai.currentModel.save('downloads://znakeAi-model');
	} else
		this.restart();
}
