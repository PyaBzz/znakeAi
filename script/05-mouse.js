"use strict";

class Mouse {
	constructor(game) {
		document.oncontextmenu = (clickEvent) => clickEvent.preventDefault();
		this.game = game;
		this.attach();
		this.tagHandlers = {};
		this.idHandlers = {};
	}

	attach() {
		let me = this;

		document.onmousedown = function (clickEvent) {
			let target = clickEvent.target;
			ifFunctionRun(me.tagHandlers[target.tagName], clickEvent);
			ifFunctionRun(me.idHandlers[target.id], clickEvent);
		}
	}

	bindByTag(tag, handler) {
		this.tagHandlers[tag] = handler;
	}

	bindById(elementId, handler) {
		this.idHandlers[elementId] = handler;
	}

	unbindAll() {
		this.idHandlers = {};
	}
} 
