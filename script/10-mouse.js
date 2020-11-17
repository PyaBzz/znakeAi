Mouse = function (game) {
	document.oncontextmenu = (clickEvent) => clickEvent.preventDefault();
	this.game = game;
	this.attach();
	this.tagHandlers = {};
	this.idHandlers = {};
}

Mouse.prototype.attach = function () {
	let me = this;

	document.onmousedown = function (clickEvent) {
		let target = clickEvent.target;
		ifFunctionRun(me.tagHandlers[target.tagName], clickEvent);
		ifFunctionRun(me.idHandlers[target.id], clickEvent);
	}
}

Mouse.prototype.bindByTag = function (tag, handler) {
	this.tagHandlers[tag] = handler;
}

Mouse.prototype.bindById = function (elementId, handler) {
	this.idHandlers[elementId] = handler;
}

Mouse.prototype.unbindAll = function () {
	this.idHandlers = {};
}
