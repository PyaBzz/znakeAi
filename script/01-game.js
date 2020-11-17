ManualGame = function (znakeConf) {
	Game.call(this, znakeConf);
}

ManualGame.prototype.constructor = Game;

ManualGame.prototype.importConfig = function (znakeConf) {
	Game.prototype.importConfig.call(this, znakeConf);
}

ManualGame.prototype.initialise = function () {
	Game.prototype.initialise.call(this);
}

ManualGame.prototype.splashClicked = function () {
	Game.prototype.splashClicked.call(this);
}

ManualGame.prototype.initialiseSound = function () {
	Game.prototype.initialiseSound.call(this);
}

ManualGame.prototype.start = function () {
	Game.prototype.start.call(this);
	this.feeder.feed();
}

ManualGame.prototype.restart = function () {
	Game.prototype.restart.call(this);
}

ManualGame.prototype.run = function () {
	Game.prototype.run.call(this);
}

ManualGame.prototype.stopRunning = function () {
	Game.prototype.stopRunning.call(this);
}

ManualGame.prototype.togglePause = function () {
	Game.prototype.togglePause.call(this);
}

ManualGame.prototype.gameOver = function () {
	Game.prototype.gameOver.call(this);
}

ManualGame.prototype.speedUp = function () {
	Game.prototype.speedUp.call(this);
}

Object.defineProperties(ManualGame.prototype, {
	loopHandle: {
		get: function () { return this['runningLoop' + this.loopId]; },
		set: function (val) { this['runningLoop' + this.loopId] = val; }
	},
});
