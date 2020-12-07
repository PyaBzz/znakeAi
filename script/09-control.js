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
