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

    getDiff2Death(direc1, direc2) {//Todo: Move to grid
        direc2 = direc2 || null;
        let diffDir1 = 1;
        let diffDir2 = 0;
        let runner = this[direc1];
        if (direc2 !== null) {
            diffDir2 = 1;
            runner = runner[direc2];
        }
        while (runner.isDeadly === false) {
            diffDir1++;
            runner = runner[direc1];
            if (direc2 !== null) {
                runner = runner[direc2];
                diffDir2++;
            }
        }
        return [diffDir1, diffDir2];
    }
}