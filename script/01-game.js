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
	this.infoboard = new Infoboard(
		"stats",
		[infoboardKeysEnum.Score, 0],
		[infoboardKeysEnum.Age, 0],
		[infoboardKeysEnum.Generation, 0]
	);
	this.control = new Control(this);
	this.overlay = new Overlay(this);
	this.feeder = new Feeder(this);
	this.button = new Button(this, document.getElementById('button'));
	this.ai = new Ai(this);
}

Game.prototype.onSplashClicked = function () {
	let brain = this.ai.getNextModel();
	this.worm = new Worm(this, brain);
	this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
}

Game.prototype.start = function () {
	this.button.beRestartButton();
	this.control.setForRunning()
	this.feeder.dropFoodInitial();
	this.run();
}

Game.prototype.restart = function () {
	if (this.isPaused) {
		this.overlay.popDown();
		this.isPaused = false;
	} else {
		this.stopRunning();
	}
	this.stepTime = this.config.stepTime;
	this.worm.disappear();
	let brain = this.ai.getNextModel();
	this.worm = new Worm(this, brain);
	this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
	this.control.setForRunning();
	this.run();
}

Game.prototype.run = function () {
	this.worm.run();
}

Game.prototype.stopRunning = function () {
	this.worm.stopRunning();
}

Game.prototype.togglePause = function () {
	if (this.isPaused) {
		this.run();
		this.isPaused = false;
		this.control.setForRunning();
		this.overlay.popDown();
	}
	else {
		this.stopRunning();
		this.isPaused = true;
		this.overlay.popUp();
	}
}

Game.prototype.onStepTaken = function () {
	this.infoboard.set(infoboardKeysEnum.Age, this.worm.age);
}

Game.prototype.onWormDied = function () {
	this.control.disable();
	this.stopRunning();
	this.ai.currentModelDied(this.worm);
	if (this.worm.length >= this.config.worm.targetLength) {
		alert("Target reached!");
	} else
		this.restart();
}

Game.prototype.onFoodEaten = function () {
	this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
	this.feeder.dropFood();
}
