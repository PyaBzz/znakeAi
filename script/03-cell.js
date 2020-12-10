class Cell {
    constructor(grid, rowNumber, colNumber) {
        this.grid = grid;
        this.element = document.createElement('td');
        this.element.className = 'cell';
        this.element.cell = this;
        this.row = rowNumber;
        this.col = colNumber;
        this.type = CellType.blank;
    }

    get isWorm() { return this.type === CellType.worm }
    get isHead() { return this.type === CellType.head }
    get isFood() { return this.type === CellType.food }
    get isBlank() { return this.type === CellType.blank }
    get isWall() { return this.type === CellType.wall }
    get isDeadly() { return this.isWall || this.isWorm }

    beWorm() {
        this.type = CellType.worm;
        this.element.className = 'worm';
    }

    beHead() {
        this.type = CellType.head;
        // this.grid.head = this;
        this.element.className = 'worm';
    }

    beFood() {
        this.type = CellType.food;
        this.element.className = 'food';
    }

    beBlank() {
        this.type = CellType.blank;
        this.element.className = 'cell';
    }

    beWall() {
        this.type = CellType.wall;
        this.element.className = 'wall';
    }

    getDistance2Death(direc) {
        let cellCount = 1;
        let runner = this[direc];
        while (runner.isDeadly === false) {
            cellCount++;
            runner = runner[direc];
        }
        return cellCount; //No diagonal yet
    }
}