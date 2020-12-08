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
		[InfoboardKey.Age, 0],
		[InfoboardKey.Length, 0],
		[InfoboardKey.WormNo, "1 /" + this.config.ai.population],
		[InfoboardKey.Generation, 1],
		[InfoboardKey.genMaxAge, 0],
		[InfoboardKey.genMinAge, 0],
		[InfoboardKey.genMaxLen, 0],
		[InfoboardKey.genMinLen, 0],
	);
	this.evolutionInfoboard = new Infoboard(
		"evolution-stats",
		[InfoboardKey.AverageAge, 0],
		[InfoboardKey.AverageLen, 0],
		[InfoboardKey.TotalWorms, 1],
		[InfoboardKey.ancestor, "No"],
	);
	this.control = new Control(this);
	this.overlay = new Overlay(this);
	this.feeder = new Feeder(this);
	this.button = new Button(this, document.getElementById('button'));
	this.ai = new Ai(this);
}

Game.prototype.onSplashClicked = function () {
}

Game.prototype.onAncestorLoad = function (success) {
	if (success)
		this.evolutionInfoboard.set(InfoboardKey.ancestor, "Yes")
	else
		this.evolutionInfoboard.set(InfoboardKey.ancestor, "Failed!")
}

Game.prototype.start = function () {
	let brain = this.ai.getNextModel();
	this.worm = new Worm(this, brain);
	this.generationInfoboard.set(InfoboardKey.Length, this.worm.length);
	this.button.beRestartButton();
	this.control.setForRunning()
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
	this.generationInfoboard.set(InfoboardKey.Length, this.worm.length);
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
	this.generationInfoboard.set(InfoboardKey.WormNo, this.ai.nextModelIndex + " /" + this.config.ai.population);
}

Game.prototype.onGenerationDone = function (genMinAge, genMaxAge, genMinLen, genMaxLen) {
	this.generationInfoboard.set(InfoboardKey.genMinAge, genMinAge);
	this.generationInfoboard.set(InfoboardKey.genMaxAge, genMaxAge);
	this.generationInfoboard.set(InfoboardKey.genMinLen, genMinLen);
	this.generationInfoboard.set(InfoboardKey.genMaxLen, genMaxLen);
}

Game.prototype.onNewGeneration = function () {
	this.generationInfoboard.set(InfoboardKey.Generation, this.ai.generationNumber);
}

Game.prototype.onStepTaken = function () {
	this.generationInfoboard.set(InfoboardKey.Age, this.worm.age);
}

Game.prototype.onFoodEaten = function () {
	this.generationInfoboard.set(InfoboardKey.Length, this.worm.length);
	if (this.worm.length >= this.config.worm.targetLength) {
		const shouldDownload = confirm("Target reached!\r\nWould you like to download the current AI model?");
		if (shouldDownload)
			game.ai.currentModel.save('downloads://znakeAi-model');
	}
	this.feeder.dropFood();
}

Game.prototype.onWormDied = function () {
	this.control.disable();
	this.worm.stopRunning();
	this.ai.onWormDied(this.worm);
	this.evolutionInfoboard.set(InfoboardKey.TotalWorms, this.ai.totalModels);
	this.evolutionInfoboard.set(InfoboardKey.AverageLen, this.ai.AverageLen.toFixed(3));
	this.evolutionInfoboard.set(InfoboardKey.AverageAge, this.ai.averageAge.toFixed(3));
	this.restart();
}
