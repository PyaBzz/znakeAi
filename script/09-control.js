directionEnum = Object.freeze({ "up": 1, "right": 2, "down": 3, "left": 4 });
oppositeDirectionEnum = Object.freeze({ 1: 3, 2: 4, 3: 1, 4: 2 });

Control = function (game) {
	this.game = game;
	this.funcs = [];
	this.bind();
}

Control.prototype.setForRunning = function () {
	let me = this;
	this.funcs[this.game.config.keys.pause.charCodeAt(0)] = () => me.game.togglePause();
}

Control.prototype.disable = function () {
	for (let key in this.funcs)
		this.funcs[key] = function () { };
}

Control.prototype.bind = function () {
	let me = this;
	document.onkeydown = function (keyDownEvent) {
		ifFunctionRun(me.funcs[keyDownEvent.keyCode]);
	}
}
