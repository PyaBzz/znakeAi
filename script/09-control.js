class Control {
	constructor(game) {
		this.game = game;
		this.funcs = [];
		this.bind();
	}

	setForRunning() {
		let me = this;
		this.funcs[this.game.config.keys.pause.charCodeAt(0)] = () => me.game.togglePause();
	}

	disable() {
		for (let key in this.funcs)
			this.funcs[key] = function () { };
	}

	bind() {
		let me = this;
		document.onkeydown = function (keyDownEvent) {
			ifFunctionRun(me.funcs[keyDownEvent.keyCode]);
		}
	}
}
