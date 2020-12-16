class Cell {
    static #type = Object.freeze({ head: "head", worm: "worm", wall: "wall", blank: "blank", food: "food" });
    // static #value = Object.freeze({ head: -2, worm: -1, wall: -1, blank: 0, food: 2 });

    constructor(grid, rowNumber, colNumber) {
        this.grid = grid;
        this.element = document.createElement('td');
        this.element.className = 'cell';
        this.element.cell = this;
        this.row = rowNumber;
        this.col = colNumber;
        this.type = Cell.#type.blank;
    }

    get isWorm() { return this.type === Cell.#type.worm }
    get isHead() { return this.type === Cell.#type.head }
    get isFood() { return this.type === Cell.#type.food }
    get isBlank() { return this.type === Cell.#type.blank }
    get isWall() { return this.type === Cell.#type.wall }
    get isDeadly() { return this.isWall || this.isWorm }

    beWorm() {
        this.type = Cell.#type.worm;
        this.element.className = 'worm';
    }

    beHead() {
        this.type = Cell.#type.head;
        // this.grid.head = this;
        this.element.className = 'worm';
    }

    beFood() {
        this.type = Cell.#type.food;
        this.element.className = 'food';
    }

    beBlank() {
        this.type = Cell.#type.blank;
        this.element.className = 'cell';
    }

    beWall() {
        this.type = Cell.#type.wall;
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