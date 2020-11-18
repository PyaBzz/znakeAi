directionEnum = Object.freeze({ "up": 1, "right": 2, "down": 3, "left": 4 });
oppositeDirectionEnum = Object.freeze({ 1: 3, 2: 4, 3: 1, 4: 2 });

Control = function (game) {
	this.game = game;
	this.mapping = {};
	this.funcs = [];
	this.mapKeys();
	this.bind();
}

Control.prototype.mapKeys = function () {
	for (let directionName in directionEnum)
		this.mapping[this.game.config.keys[directionName].charCodeAt(0)] = directionEnum[directionName];
	this.mapping[this.game.config.keys.pause.charCodeAt(0)] = 0;
}

Control.prototype.setForRunning = function () {
	let me = this;
	for (let directionName in directionEnum) {
		let directionCode = directionEnum[directionName];
		this.funcs[directionCode] = function () { me.game.worm.directionFuncs[directionCode]() };
	}

	this.funcs[0] = function () { me.game.togglePause() };
}

Control.prototype.setForPause = function () {
	for (let directionName in directionEnum) {
		let directionCode = directionEnum[directionName];
		this.funcs[directionCode] = function () { };
	}
}

Control.prototype.disable = function () {
	for (let key in this.funcs)
		this.funcs[key] = function () { };
}

Control.prototype.bind = function () {
	let me = this;
	document.onkeydown = function (keyDownEvent) {
		let directionCode = me.mapping[keyDownEvent.keyCode];
		ifFunctionRun(me.funcs[directionCode]);
	}
}
