Grid = function (game, container) {
    this.game = game;
    this.container = container;
    this.height = this.game.config.grid.height;
    this.width = this.game.config.grid.width;
    this.element = document.createElement('table');
    this.element.id = 'grid';
    this.cells = [];
    for (let row = 0; row < this.height; row++) {
        let newRow = document.createElement('tr');
        this.cells.push([]);
        for (let col = 0; col < this.width; col++) {
            let newCell = new Cell(row, col);
            if (col == 0 || col == this.lastColIndex || row == 0 || row == this.lastRowIndex) newCell.beWall();
            newRow.appendChild(newCell.element);
            this.cells[row].push(newCell);
        }
        this.element.appendChild(newRow);
    }
    this.container.appendChild(this.element);

    this.nextCellGettingFunctions = {};
    this.nextCellGettingFunctions[directionEnum.up] = (me, wormHead) => me.cells[wormHead.row - 1][wormHead.col];
    this.nextCellGettingFunctions[directionEnum.right] = (me, wormHead) => me.cells[wormHead.row][wormHead.col + 1];
    this.nextCellGettingFunctions[directionEnum.down] = (me, wormHead) => me.cells[wormHead.row + 1][wormHead.col];
    this.nextCellGettingFunctions[directionEnum.left] = (me, wormHead) => me.cells[wormHead.row][wormHead.col - 1];

    this.bindHandlers();
}

Grid.prototype.getStartCell = function () {
    if (this.game.config.startAtCentre)
        return this.getCentreCell();
    else
        return this.getBlankCells()[0];
}

Grid.prototype.getCentreCell = function () {
    let row = Math.floor(this.lastRowIndex / 2);
    let col = Math.floor(this.lastColIndex / 2);
    return this.cells[row][col];
}

Grid.prototype.getNextCell = function (wormHead, direction) {
    return this.nextCellGettingFunctions[direction](this, wormHead);
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
