cellTypeEnum = Object.freeze({ head: "head", worm: "worm", wall: "wall", blank: "blank", food: "food" });
cellValueEnum = Object.freeze({ head: -2, worm: -1, wall: -1, blank: 0, food: 2 });

Cell = function (grid, rowNumber, colNumber) {
    this.grid = grid;
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
    this.grid.head = this;
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

Cell.prototype.getDistanceTo = function (otherCell) {
    const horDiff = otherCell.col - this.col;
    const verDiff = otherCell.row - this.row;
    return Math.sqrt(Math.pow(horDiff, 2) + Math.pow(verDiff, 2)) / this.grid.maxDistance; //Normalised distance
}

Cell.prototype.getValue = function () {
    if (this.isHead)
        return 0;
    else if (this.isFood)
        return 0;
    else if (this.isDeadly)
        return 2.4;
    else
        return this.getDistanceTo(this.grid.head) + this.getDistanceTo(this.grid.food);
}

Object.defineProperties(Cell.prototype, {
    isWorm: { get: function () { return this.type === cellTypeEnum.worm } },
    isHead: { get: function () { return this.type === cellTypeEnum.head } },
    isFood: { get: function () { return this.type === cellTypeEnum.food } },
    isBlank: { get: function () { return this.type === cellTypeEnum.blank } },
    isWall: { get: function () { return this.type === cellTypeEnum.wall } },
    isDeadly: { get: function () { return this.isWall || this.isWorm } },
});
