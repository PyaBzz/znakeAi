Cell = function (grid, rowNumber, colNumber) {
    this.grid = grid;
    this.element = document.createElement('td');
    this.element.className = 'cell';
    this.element.cell = this;
    this.row = rowNumber;
    this.col = colNumber;
    this.type = CellType.blank;
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

Cell.prototype.getDistance2Death = function (direc) {
    let cellCount = 1;
    let runner = this[direc];
    while (runner.isDeadly === false) {
        cellCount++;
        runner = runner[direc];
    }
    return cellCount / this.grid.maxDistance; //Normalise distance, no diagonal yet
}

Object.defineProperties(Cell.prototype, {
    isWorm: { get: function () { return this.type === CellType.worm } },
    isHead: { get: function () { return this.type === CellType.head } },
    isFood: { get: function () { return this.type === CellType.food } },
    isBlank: { get: function () { return this.type === CellType.blank } },
    isWall: { get: function () { return this.type === CellType.wall } },
    isDeadly: { get: function () { return this.isWall || this.isWorm } },
});
