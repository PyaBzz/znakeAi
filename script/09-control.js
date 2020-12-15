class Control {
	#pauseFunc;
	#mapping;

	constructor(gamePauseFunc, config) {
		this.#pauseFunc = gamePauseFunc;
		this.bind();
		this.#mapping = {
			[config.pause.charCodeAt(0)]: 0,
		};
	}

	bind() {
		let me = this;
		document.onkeydown = function (keyDownEvent) {
			const action = me.#mapping[keyDownEvent.keyCode];
			if (action === 0)
				me.#pauseFunc();
		}
	}
}
