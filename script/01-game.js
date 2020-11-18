Game = function (znakeConf) {
	this.importConfig(znakeConf);
	this.initialise();
	this.loopId = 0;
}

Game.prototype.importConfig = function (znakeConf) {
	this.config = {}
	for (let key in znakeConf)
		this.config[key] = znakeConf[key];
	if (this.config["gridHeight"] < 4)
		throw "Grid height must be at least 4"
	if (this.config["gridWidth"] < 4)
		throw "Grid width must be at least 4"
}

Game.prototype.initialise = function () {
	this.wormStepTime = this.config.wormStepTime;
	this.mouse = new Mouse(this);
	this.grid = new Grid(this, document.getElementById('grid-container'));
	this.infoboard = new InfoBoard(this);
	this.control = new Control(this);
	this.overlay = new Overlay(this);
	this.feeder = new Feeder(this);
	this.button = new Button(this, document.getElementById('button'));
	this.ai = new Ai(this);
}

Game.prototype.splashClicked = function () {
	this.initialiseSound();
	let me = this;
	this.worm = new Worm(this);
}

Game.prototype.initialiseSound = function () {
	if (isUndefined(this.sound) || isUndefined(this.sound.audioCtx)) {
		this.sound = new znakeSound(this.config.soundVolume);
	}
}

Game.prototype.start = function () {
	this.button.beRestartButton();
	this.control.setForRunning()
	this.feeder.dropFood();
	this.run();
}

Game.prototype.restart = function () {
	if (this.isPaused) {
		this.overlay.popDown();
		this.isPaused = false;
	} else {
		this.stopRunning();
	}
	this.wormStepTime = this.config.wormStepTime;
	this.worm.disappear();
	this.worm = new Worm(this);
	this.control.setForRunning();
	this.feeder.dropFood();
	this.run();
}

Game.prototype.run = function () {
	this.runLoopId++;
	let me = this;
	this.runLoopHandle = setInterval(function () {
		me.worm.step();
	}, me.wormStepTime);
}

Game.prototype.stopRunning = function () {
	clearInterval(this.runLoopHandle);
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
	this.sound.foodBeep();
	this.infoboard.updateScore(this.worm.length);
	this.feeder.dropFood();
}

Object.defineProperties(Game.prototype, {
	loopHandle: {
		get: function () { return this['runningLoop' + this.loopId]; },
		set: function (val) { this['runningLoop' + this.loopId] = val; }
	},
});
