"use strict";

// class Keyboard {
// 	#pauseFunc;
// 	#mapping;

// 	constructor(gamePauseFunc) {
// 		this.#pauseFunc = gamePauseFunc;
// 		this.bind();
// 		this.#mapping = {
// 			[Config.keyboard.pause.charCodeAt(0)]: 0,
// 		};
// 	}

// 	bind() {
// 		let me = this;
// 		document.onkeydown = function (keyDownEvent) {
// 			const action = me.#mapping[keyDownEvent.keyCode];
// 			if (action === 0)
// 				me.#pauseFunc();
// 		}
// 	}
// }
