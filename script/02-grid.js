Grid = function (game, container) {
    this.game = game;
    this.container = container;
    this.height = this.game.config.grid.height;
    this.width = this.game.config.grid.width;
    this.element = document.createElement('table');
    this.element.id = 'grid';
    this.cells = [];
    for (let col = 0; col < this.width; col++) {
        this.cells.push([]);
        for (let row = 0; row < this.height; row++) {
            let newCell = new Cell(this, row, col);
            if (col == 0 || col == this.lastColIndex || row == 0 || row == this.lastRowIndex) newCell.beWall();
            this.cells[col].push(newCell);

            if (row != 0) { // Link up-neighbour
                newCell.neighbours.up = this.cells[col][row - 1];
                newCell.neighbours.up.neighbours.down = newCell;
            }
            if (col != 0 && row != 0) { // Link up-left-neighbour
                newCell.neighbours.upLeft = this.cells[col - 1][row - 1];
                newCell.neighbours.upLeft.neighbours.downRight = newCell;
            }
            if (col != 0) { // Link left-neighbour
                newCell.neighbours.left = this.cells[col - 1][row];
                newCell.neighbours.left.neighbours.right = newCell;
            }
            if (col != 0 && row != this.lastRowIndex) { // Link down-left-neighbour
                newCell.neighbours.downLeft = this.cells[col - 1][row + 1];
                newCell.neighbours.downLeft.neighbours.upRight = newCell;
            }
        }
    }
    for (let row = 0; row < this.height; row++) {
        let newRow = document.createElement('tr');
        for (let col = 0; col < this.width; col++) {
            let cell = this.cells[col][row];
            newRow.appendChild(cell.element);
        }
        this.element.appendChild(newRow);
    }
    this.container.appendChild(this.element);

    this.bindHandlers();
    this.maxDistance = Math.sqrt(Math.pow(this.height, 2) + Math.pow(this.width, 2));
    this.food = null;
}

Grid.prototype.getStartCell = function () {
    return this.game.config.startAtCentre ? this.getCentreCell() : this.getBlankCells()[0];
}

Grid.prototype.getCentreCell = function () {
    let row = Math.floor(this.lastRowIndex / 2);
    let col = Math.floor(this.lastColIndex / 2);
    return this.cells[col][row];
}

Grid.prototype.getBlankCells = function () {
    let flatArrayOfCells = this.cells.flat();
    return flatArrayOfCells.filter((cell, index) => cell.isBlank);
}

Grid.prototype.bindHandlers = function () {
    if (this.game.config.devMode !== true)
        return;
    let me = this;
    this.game.mouse.bindByTag('TD', (clickEvent) => {
        switch (clickEvent.which) {
            case 1: clickEvent.target.cell.beFood(); break;  // left click
            case 2: clickEvent.target.cell.beBlank(); break;  // middle click
            case 3: clickEvent.target.cell.beWall(); break;  // right click
            default: break;
        }
    });
}

Object.defineProperties(Grid.prototype, {
    lastRowIndex: { get: function () { return this.height - 1 } },
    lastColIndex: { get: function () { return this.width - 1 } },
});
