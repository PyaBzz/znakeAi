"use strict";

class EvoLog {
    static #instance = null;
    #board;

    constructor() {
        if (EvoLog.#instance)
            throw new Error("Do not instantiate a singleton class twice");

        const parent = document.getElementById('evolog');

        this.#board = new Logboard(
            parent,
            ["Evo", "TargetMet", "Generations", "TotalWorms", "AverageLen", "MaxLen"],
            "Evolution Log"
        );

        EvoLog.#instance = this;
    }

    static get instance() {
        return EvoLog.#instance ? EvoLog.#instance : new EvoLog();
    }

    log(...args) { this.#board.log(...args) };
}
