AiGame = function (znakeConf) {
	Game.call(this, znakeConf);
}

AiGame.prototype.constructor = Game;

AiGame.prototype.importConfig = function (znakeConf) {
	Game.prototype.importConfig.call(this, znakeConf);
}

AiGame.prototype.initialise = function () {
	Game.prototype.initialise.call(this);
	this.ai = new Ai(this);
}

AiGame.prototype.splashClicked = function () {
	Game.prototype.splashClicked.call(this);
}

AiGame.prototype.initialiseSound = function () {
	Game.prototype.initialiseSound.call(this);
}

AiGame.prototype.start = function () {
	Game.prototype.start.call(this);
	this.feeder.dropFood();
}

AiGame.prototype.restart = function () {
	Game.prototype.restart.call(this);
}

AiGame.prototype.run = function () {
	this.runLoopId++;
	let me = this;
	this.runLoopHandle = setInterval(function () {
		let direction = me.ai.getNextDirection();
		me.control.funcs[direction]();
		me.worm.update();
	}, me.movingTimeStep);
}

AiGame.prototype.stopRunning = function () {
	clearInterval(this.runLoopHandle);
}

AiGame.prototype.togglePause = function () {
	Game.prototype.togglePause.call(this);
}

AiGame.prototype.gameOver = function () {
	Game.prototype.gameOver.call(this);
	if (this.lifeCount < this.config.ai.lifeCount)
		this.restart();
	else {
		if (this.ai.pickNextModel(this.worm.length)) {
			this.lifeCount = 0;
			this.restart();
		} else {
			this.ai.generationFinished();
		}
	}
}

AiGame.prototype.speedUp = function () {
	this.feeder.dropFood();
}
