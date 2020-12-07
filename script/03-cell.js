Cell = function (grid, rowNumber, colNumber) {
    this.grid = grid;
    this.element = document.createElement('td');
    this.element.className = 'cell';
    this.element.cell = this;
    this.row = rowNumber;
    this.col = colNumber;
    this.type = CellType.blank;

    this.upNeighbour = null;
    this.upRightNeighbour = null;
    this.rightNeighbour = null;
    this.downRightNeighbour = null;
    this.downNeighbour = null;
    this.downLeftNeighbour = null;
    this.leftNeighbour = null;
    this.upLeftNeighbour = null;
}

Cell.prototype.beWorm = function () {
    this.type = CellType.worm;
    this.element.className = 'worm';
}

Cell.prototype.beHead = function () {
    this.type = CellType.head;
    // this.grid.head = this;
    this.element.className = 'worm';
}

Cell.prototype.beFood = function () {
    this.type = CellType.food;
    this.element.className = 'food';
}

Cell.prototype.beBlank = function () {
    this.type = CellType.blank;
    this.element.className = 'cell';
}

Cell.prototype.beWall = function () {
    this.type = CellType.wall;
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
    isWorm: { get: function () { return this.type === CellType.worm } },
    isHead: { get: function () { return this.type === CellType.head } },
    isFood: { get: function () { return this.type === CellType.food } },
    isBlank: { get: function () { return this.type === CellType.blank } },
    isWall: { get: function () { return this.type === CellType.wall } },
    isDeadly: { get: function () { return this.isWall || this.isWorm } },
    neighbours: {
        get: function () {
            let allNeighbours = [this.upNeighbour, this.upRightNeighbour, this.rightNeighbour, this.downRightNeighbour, this.downNeighbour, this.downLeftNeighbour, this.leftNeighbour, this.upLeftNeighbour];
            return allNeighbours.filter(function (n) { return n !== null });
        }
    },
});
