cellTypeEnum = Object.freeze({ "blank": "blank", "obstacle": "obstacle", "worm": "worm", "food": "food" });

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

Cell.prototype.getValue = function () {
    if (this.isFood)
        return 10;
    if (this.isBlank)
        return 0;
    if (this.isDeadly)
        return -10;
}

Object.defineProperties(Cell.prototype, {
    isWorm: { get: function () { return this.type === cellTypeEnum.worm } },
    isFood: { get: function () { return this.type === cellTypeEnum.food } },
    isBlank: { get: function () { return this.type === cellTypeEnum.blank } },
    isObstacle: { get: function () { return this.type === cellTypeEnum.obstacle } },
    isDeadly: { get: function () { return this.isObstacle || this.isWorm } },
});
