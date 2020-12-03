cellTypeEnum = Object.freeze({ head: "head", worm: "worm", wall: "wall", blank: "blank", food: "food" });
cellValueEnum = Object.freeze({ head: -2, worm: -1, wall: -1, blank: 0, food: 2 });

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

Cell.prototype.beWall = function () {
    this.type = cellTypeEnum.wall;
    this.element.className = 'wall';
}

Object.defineProperties(Cell.prototype, {
    isWorm: { get: function () { return this.type === cellTypeEnum.worm } },
    isFood: { get: function () { return this.type === cellTypeEnum.food } },
    isBlank: { get: function () { return this.type === cellTypeEnum.blank } },
    isWall: { get: function () { return this.type === cellTypeEnum.wall } },
    isDeadly: { get: function () { return this.isWall || this.isWorm } },
    value: { get: function () { return cellValueEnum[this.type] } },
});
