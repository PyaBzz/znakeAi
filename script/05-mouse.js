"use strict";

// class Mouse {
// 	constructor() {
// 		document.oncontextmenu = (clickEvent) => clickEvent.preventDefault();
// 		this.attach();
// 		this.tagHandlers = {};
// 		this.idHandlers = {};
// 	}

// 	attach() {
// 		const me = this;

// 		document.onmousedown = function (clickEvent) {
// 			let target = clickEvent.target;
// 			ifFunctionRun(me.tagHandlers[target.tagName], clickEvent);
// 			ifFunctionRun(me.idHandlers[target.id], clickEvent);
// 		}
// 	}

// 	bindByTag(tag, handler) {
// 		this.tagHandlers[tag] = handler;
// 	}

// 	bindById(elementId, handler) {
// 		this.idHandlers[elementId] = handler;
// 	}

// 	unbindAll() {
// 		this.idHandlers = {};
// 	}
// } 
