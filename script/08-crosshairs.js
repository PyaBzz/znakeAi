Crosshairs = function (elementsClass, mouseInAction, mouseOutAction) {
	this.targets = document.getElementsByClassName(elementsClass);

	Array.prototype.forEach.call(targets, function (item) {
		let cornerTopLeft = document.createElement('div');
		cornerTopLeft.classList.add('corners', 'corner-top-left');
		item.appendChild(cornerTopLeft);
		let cornerTopRight = document.createElement('div');
		cornerTopRight.classList.add('corners', 'corner-top-right');
		item.appendChild(cornerTopRight);
		let cornerBottomLeft = document.createElement('div');
		cornerBottomLeft.classList.add('corners', 'corner-bottom-left');
		item.appendChild(cornerBottomLeft);
		let cornerBottomRight = document.createElement('div');
		cornerBottomRight.classList.add('corners', 'corner-bottom-right');
		item.appendChild(cornerBottomRight);
		if (isFunction(mouseInAction))
			item.onmouseenter = () => mouseInAction();
		if (isFunction(mouseOutAction))
			item.onmouseleave = () => mouseOutAction();
	});
}
