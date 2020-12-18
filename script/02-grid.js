"use strict";

class Grid {
    #cells = [];
    #maxRowIndex = Config.grid.height - 1;
    #maxColIndex = Config.grid.width - 1;
    // #maxDistance = bazMath.amplitude([this.#maxColIndex, this.#maxRowIndex]);
    // #playableCellCount = (Config.grid.height - 2) * (Config.grid.width - 2);
    // #food = null;

    constructor(parent) {
        const table = document.createElement('table');
        for (let col = 0; col <= this.#maxColIndex; col++) {
            this.#cells.push([]);
            for (let row = 0; row <= this.#maxRowIndex; row++) {
                const newCell = new Cell(this, row, col); //Todo: Review cell implementation
                if (col == 0 || col == this.#maxColIndex || row == 0 || row == this.#maxRowIndex) newCell.beWall();
                this.#cells[col].push(newCell);

                if (row != 0) { // Link up-neighbour
                    newCell[Direction.up] = this.#cells[col][row - 1];
                    newCell[Direction.up][Direction.down] = newCell;
                }
                if (col != 0 && row != 0) { // Link up-left-neighbour
                    newCell.upLeft = this.#cells[col - 1][row - 1];
                    newCell.upLeft.downRight = newCell;
                }
                if (col != 0) { // Link left-neighbour
                    newCell[Direction.left] = this.#cells[col - 1][row];
                    newCell[Direction.left][Direction.right] = newCell;
                }
                if (col != 0 && row != this.#maxRowIndex) { // Link down-left-neighbour
                    newCell.downLeft = this.#cells[col - 1][row + 1];
                    newCell.downLeft.upRight = newCell;
                }
            }
        }
        for (let row = 0; row <= this.#maxRowIndex; row++) {
            const newRow = document.createElement('tr');
            for (let col = 0; col <= this.#maxColIndex; col++) {
                const cell = this.#cells[col][row];
                newRow.appendChild(cell.element);
            }
            table.appendChild(newRow);
        }
        parent.appendChild(table);
    }

    get #allBlankCells() {
        const flatArrayOfCells = this.#cells.flat();
        return flatArrayOfCells.filter((cell, ind) => cell.isBlank);
    }

    getBlankCellsAround(root, diff) {
        const result = [];
        if (root.isBlank)
            result.push(root);
        const rootCol = root.col;
        const rootRow = root.row;
        const minCol = Math.max(rootCol - diff, 0);
        const maxCol = Math.min(rootCol + diff, this.#maxColIndex);
        const minRow = Math.max(rootRow - diff, 0);
        const maxRow = Math.min(rootRow + diff, this.#maxRowIndex);
        for (let col = minCol; col <= maxCol; col++) {
            for (let row = minRow; row <= maxRow; row++) {
                const neighbour = this.#cells[col][row];
                if (neighbour.isBlank)
                    result.push(neighbour);
            }
        }
        return result;
    }

    getStartCell(atCentre = false) {
        return atCentre ? this.centreCell : this.#allBlankCells[0];
    }

    get centreCell() {
        const row = Math.floor(this.#maxRowIndex / 2);
        const col = Math.floor(this.#maxColIndex / 2);
        return this.#cells[col][row];
    }
}
