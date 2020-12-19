"use strict";

class Evolution {
    static ancestor = null;
    #previousGen = null;
    #genCounter = 0;
    #maxLen = 0;
    #minLen = Number.MAX_VALUE;
    #maxAge = 0
    #minAge = Number.MAX_VALUE;
    #totalLen = 0;
    #totalAge = 0

    constructor(number, ancestorBrain) {
        EvoInfoboard.instance.set({ [EvoInfoboard.key.evolutionNo]: number + " /" + Config.evolution.rounds });
    }

    get #averageLen() { return this.#totalLen / (Config.generation.population * this.#genCounter) }
    get #averageAge() { return this.#totalAge / (Config.generation.population * this.#genCounter) }

    run() {
        this.#genCounter++;
        return new Promise((resHandler, rejHandler) => {
            if (this.#genCounter <= Config.evolution.target.generationCount) { //Todo: Implement other criteria to determine if target is reached
                const gen = new Generation(this.#genCounter, this.#previousGen);
                const genResPromise = gen.live();
                return genResPromise.then(genRes => {
                    this.#previousGen = genRes.gen;
                    this.#maxLen = Math.max(this.#maxLen, genRes.maxLen);
                    this.#minLen = Math.min(this.#minLen, genRes.minLen);
                    this.#maxAge = Math.max(this.#maxAge, genRes.maxAge);
                    this.#minAge = Math.min(this.#minAge, genRes.minAge);
                    this.#totalLen += genRes.totalLen;
                    this.#totalAge += genRes.totalAge;
                    this.#updateBoard();
                    return resHandler(this.run());
                });
            } else {
                resHandler(new EvolutionResult(this, this.#maxLen, this.#minLen, this.#maxAge, this.#minAge, this.#totalLen, this.#totalAge));
            }
        });
    }

    #updateBoard() {
        EvoInfoboard.instance.set({
            [EvoInfoboard.key.maxLen]: this.#maxLen,
            [EvoInfoboard.key.minLen]: this.#minLen,
            [EvoInfoboard.key.maxAge]: this.#maxAge,
            [EvoInfoboard.key.minAge]: this.#minAge,
            [EvoInfoboard.key.averageLen]: this.#averageLen.toFixed(3),
            [EvoInfoboard.key.averageAge]: this.#averageAge.toFixed(3),
        });
    }
}

class EvolutionResult {
    #evo;
    #maxLen;
    #minLen;
    #maxAge;
    #minAge;
    #totalLen;
    #totalAge;

    constructor(evo, maxLen, minLen, maxAge, minAge, totalLen, totalAge,) {
        this.#evo = evo;
        this.#maxLen = maxLen;
        this.#minLen = minLen;
        this.#maxAge = maxAge;
        this.#minAge = minAge;
        this.#totalLen = totalLen;
        this.#totalAge = totalAge;
    }

    get maxLen() { return this.#maxLen }
    get minLen() { return this.#minLen }

    get maxAge() { return this.#maxAge }
    get minAge() { return this.#minAge }

    get totalLen() { return this.#totalLen }
    get totalAge() { return this.#totalAge }
}

class EvoInfoboard {
    static #instance = null;
    static key = Object.freeze({
        evolutionNo: "Evolution No",
        maxLen: "Max Length",
        minLen: "Min Length",
        maxAge: "Max Age",
        minAge: "Min Age",
        averageLen: "Average Length",
        averageAge: "Average Age",
    });
    #board = new Infoboard(
        document.getElementById("evolution-info"),
        {
            [EvoInfoboard.key.evolutionNo]: 0,
            [EvoInfoboard.key.maxLen]: 0,
            [EvoInfoboard.key.minLen]: 0,
            [EvoInfoboard.key.maxAge]: 0,
            [EvoInfoboard.key.minAge]: 0,
            [EvoInfoboard.key.averageLen]: 0,
            [EvoInfoboard.key.averageAge]: 0,

        },
        "Evolution info",
    );

    constructor() {
        EvoInfoboard.#instance = this;
    }

    static get instance() {
        return EvoInfoboard.#instance ? EvoInfoboard.#instance : new EvoInfoboard();
    }

    get(key) { return this.#board.get(key) }
    set(...args) { this.#board.set(...args) }
}
