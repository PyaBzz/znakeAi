"use strict";

class Cell {
    static #types = Object.freeze({ head: "head", worm: "worm", wall: "wall", blank: "blank", food: "food" });
    // static #value = Object.freeze({ head: -2, worm: -1, wall: -1, blank: 0, food: 2 });
    #element = document.createElement('td');
    #row;
    #col;
    #type;

    constructor(rowNumber, colNumber) {
        this.#element.className = 'cell';
        this.#element.cell = this;
        this.#row = rowNumber;
        this.#col = colNumber;
        this.#type = Cell.#types.blank;
    }

    get row() { return this.#row }
    get col() { return this.#col }
    get isWorm() { return this.#type === Cell.#types.worm }
    get isHead() { return this.#type === Cell.#types.head }
    get isFood() { return this.#type === Cell.#types.food }
    get isBlank() { return this.#type === Cell.#types.blank }
    get isWall() { return this.#type === Cell.#types.wall }
    get isDeadly() { return this.isWall || this.isWorm }

    sitIn(row) {
        row.appendChild(this.#element);
    }

    beWorm() {
        this.#type = Cell.#types.worm;
        this.#element.className = 'worm';
    }

    beHead() {
        this.#type = Cell.#types.head;
        this.#element.className = 'worm';
    }

    beFood() {
        this.#type = Cell.#types.food;
        this.#element.className = 'food';
    }

    beBlank() {
        this.#type = Cell.#types.blank;
        this.#element.className = 'cell';
    }

    beWall() {
        this.#type = Cell.#types.wall;
        this.#element.className = 'wall';
    }

    getDiff2Death(direc1, direc2) {
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
