class Grid {
    constructor(parent, config, mouseBindFunc, devMode) {
        this.container = parent;
        this.height = config.height;
        this.width = config.width;
        this.element = document.createElement('table');
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

        if (devMode) {
            mouseBindFunc('TD', (clickEvent) => {
                switch (clickEvent.which) {
                    case 1: clickEvent.target.cell.beFood(); break;  // left click
                    case 2: clickEvent.target.cell.beBlank(); break;  // middle click
                    case 3: clickEvent.target.cell.beWall(); break;  // right click
                    default: break;
                }
            });
        }
        this.maxDistance = Math.sqrt(Math.pow(this.maxDistanceHor, 2) + Math.pow(this.maxDistanceVer, 2));
        this.food = null;
    }

    get lastRowIndex() { return this.height - 1 }
    get lastColIndex() { return this.width - 1 }
    get maxDistanceVer() { return this.height - 1 }
    get maxDistanceHor() { return this.width - 1 }
    get playableCellCount() { return (this.width - 2) * (this.height - 2) }

    getStartCell(atCentre = false) {
        return atCentre ? this.getCentreCell() : this.getBlankCells()[0];
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

    getBlankCellsAround(root, diff) {
        let result = [];
        if (root.isBlank)
            result.push(root);
        const rootCol = root.col;
        const rootRow = root.row;
        const minCol = Math.max(rootCol - diff, 0);
        const maxCol = Math.min(rootCol + diff, this.lastColIndex);
        const minRow = Math.max(rootRow - diff, 0);
        const maxRow = Math.min(rootRow + diff, this.lastRowIndex);
        for (let col = minCol; col <= maxCol; col++) {
            for (let row = minRow; row <= maxRow; row++) {
                const neighbour = this.cells[col][row];
                if (neighbour.isBlank)
                    result.push(neighbour);
            }
        }
        return result;
    }
}
