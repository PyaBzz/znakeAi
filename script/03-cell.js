cellTypeEnum = Object.freeze({ "head": "head", "worm": "worm", "obstacle": "obstacle", "blank": "blank", "food": "food" });
cellValueEnum = Object.freeze({ "head": -2, "worm": -1, "obstacle": -1, "blank": 0, "food": 2 });

Cell = function (rowNumber, colNumber) {
    this.element = document.createElement('td');
    this.element.className = 'cell';
    this.element.cell = this;
    this.row = rowNumber;
    this.col = colNumber;
    this.type = cellTypeEnum.blank;
}

Cell.prototype.beWorm = function () {
    this.type = cellTypeEnum.worm;
    this.element.className = 'worm';
}

Cell.prototype.beHead = function () {
    this.type = cellTypeEnum.head;
    this.element.className = 'worm';
}

Cell.prototype.beFood = function () {
    this.type = cellTypeEnum.food;
    this.element.className = 'food';
}

Cell.prototype.beBlank = function () {
    this.type = cellTypeEnum.blank;
    this.element.className = 'cell';
}

Cell.prototype.beObstacle = function () {
    this.type = cellTypeEnum.obstacle;
    this.element.className = 'obstacle';
}

Object.defineProperties(Cell.prototype, {
    isWorm: { get: function () { return this.type === cellTypeEnum.worm } },
    isFood: { get: function () { return this.type === cellTypeEnum.food } },
    isBlank: { get: function () { return this.type === cellTypeEnum.blank } },
    isObstacle: { get: function () { return this.type === cellTypeEnum.obstacle } },
    isDeadly: { get: function () { return this.isObstacle || this.isWorm } },
    value: { get: function () { return cellValueEnum[this.type] } },
});
