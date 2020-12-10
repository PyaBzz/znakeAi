class Grid {
    constructor(game, container) {
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
                    newCell[Direction.up] = this.cells[col][row - 1];
                    newCell[Direction.up][Direction.down] = newCell;
                }
                if (col != 0 && row != 0) { // Link up-left-neighbour
                    newCell.upLeft = this.cells[col - 1][row - 1];
                    newCell.upLeft.downRight = newCell;
                }
                if (col != 0) { // Link left-neighbour
                    newCell[Direction.left] = this.cells[col - 1][row];
                    newCell[Direction.left][Direction.right] = newCell;
                }
                if (col != 0 && row != this.lastRowIndex) { // Link down-left-neighbour
                    newCell.downLeft = this.cells[col - 1][row + 1];
                    newCell.downLeft.upRight = newCell;
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
        this.maxDistance = Math.sqrt(Math.pow(this.maxDistanceHor, 2) + Math.pow(this.maxDistanceVer, 2));
        this.food = null;
    }

    get lastRowIndex() { return this.height - 1 }
    get lastColIndex() { return this.width - 1 }
    get maxDistanceVer() { return this.height - 1 }
    get maxDistanceHor() { return this.width - 1 }
    get playableCellCount() { return (this.width - 2) * (this.height - 2) }

    getStartCell() {
        return this.game.config.startAtCentre ? this.getCentreCell() : this.getBlankCells()[0];
    }

    getCentreCell() {
        let row = Math.floor(this.lastRowIndex / 2);
        let col = Math.floor(this.lastColIndex / 2);
        return this.cells[col][row];
    }

    getBlankCells() {
        let flatArrayOfCells = this.cells.flat();
        return flatArrayOfCells.filter((cell, index) => cell.isBlank);
    }

    bindHandlers() {
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
}
