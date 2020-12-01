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
	let me = this;
	this.intervaller = new Intervaller(() => me.worm.step(), me.config.stepTime);
}

Game.prototype.splashClicked = function () {
	this.worm = new Worm(this);
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
	this.worm = new Worm(this);
	this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
	this.control.setForRunning();
	this.run();
}

Game.prototype.run = function () {
	this.intervaller.run();
}

Game.prototype.stopRunning = function () {
	this.intervaller.stop();
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

Game.prototype.wormDied = function () {
	this.stopRunning();
	this.control.disable();
	this.restart();
}

Game.prototype.foodEaten = function () {
	this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
	this.feeder.dropFood();
}
