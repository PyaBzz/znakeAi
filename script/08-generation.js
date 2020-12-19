"use strict";

class Generation {
    #reproducingPopulation = Config.generation.population / 2;
    #worms = [];
    #wormCounter = 0;
    #maxLen = 0;
    #minLen = Number.MAX_VALUE;
    #maxAge = 0
    #minAge = Number.MAX_VALUE;
    #totalLen = 0;
    #totalAge = 0

    constructor(number) {
        GenInfoboard.instance.set({ [GenInfoboard.key.generationNo]: number + " /" + Config.evolution.target.generationCount });
    }

    run() {
        this.#wormCounter++;
        return new Promise((resHandler, rejHandler) => {
            if (this.#wormCounter <= Config.generation.population) {
                GenInfoboard.instance.set({ [GenInfoboard.key.wormNo]: this.#wormCounter + " /" + Config.generation.population });
                const worm = new Worm();
                this.#worms.push(worm);
                const wormResPromise = worm.live();
                return wormResPromise.then(wormRes => {
                    log(`worm ${this.#wormCounter} >> ${wormRes.len}, ${wormRes.age}`);
                    this.#maxLen = Math.max(this.#maxLen, wormRes.len);
                    this.#minLen = Math.min(this.#minLen, wormRes.len);
                    this.#maxAge = Math.max(this.#maxAge, wormRes.age);
                    this.#minAge = Math.min(this.#minAge, wormRes.age);
                    this.#totalLen += wormRes.len;
                    this.#totalAge += wormRes.age;
                    this.#updateBoard();
                    return resHandler(this.run());
                });
            } else {
                resHandler(new GenerationResult(this, this.#maxLen, this.#minLen, this.#maxAge, this.#minAge, this.#totalLen, this.#totalAge));
            }
        });
    }

    #reproduce() {
        //Todo: Implement
    }

    #naturalSelect() {
        return this.#worms.getTop(w => w.fitness, this.#reproducingPopulation).items;
    }

    #updateBoard() {
        GenInfoboard.instance.set({
            [GenInfoboard.key.maxLen]: this.#maxLen,
            [GenInfoboard.key.minLen]: this.#minLen,
            [GenInfoboard.key.maxAge]: this.#maxAge,
            [GenInfoboard.key.minAge]: this.#minAge,
        });
    }
}

class GenerationResult {
    #gen;
    #maxLen;
    #minLen;
    #maxAge;
    #minAge;
    #totalLen;
    #totalAge;

    constructor(gen, maxLen, minLen, maxAge, minAge, totalLen, totalAge,) {
        this.#gen = gen;
        this.#maxLen = maxLen;
        this.#minLen = minLen;
        this.#maxAge = maxAge;
        this.#minAge = minAge;
        this.#totalLen = totalLen;
        this.#totalAge = totalAge;
    }

    get maxLen() { return this.#maxLen }
    get averageLen() { return this.#totalLen / Config.generation.population }
    get minLen() { return this.#minLen }

    get maxAge() { return this.#maxAge }
    get averageAge() { return this.#totalAge / Config.generation.population }
    get minAge() { return this.#minAge }

    get totalLen() { return this.#totalLen }
    get totalAge() { return this.#totalAge }
}

class GenInfoboard {
    static #instance = null;
    static key = Object.freeze({
        generationNo: "Generation No",
        wormNo: "Worm No",
        maxLen: "Max Length",
        minLen: "Min Length",
        maxAge: "Max Age",
        minAge: "Min Age",
    });
    #board = new Infoboard(
        document.getElementById("generation-info"),
        {
            [GenInfoboard.key.generationNo]: 0,
            [GenInfoboard.key.wormNo]: 0,
            [GenInfoboard.key.maxLen]: 0,
            [GenInfoboard.key.minLen]: 0,
            [GenInfoboard.key.maxAge]: 0,
            [GenInfoboard.key.minAge]: 0,
        },
        "Generation info",
    );

    constructor() {
        GenInfoboard.#instance = this;
    }

    static get instance() {
        return GenInfoboard.#instance ? GenInfoboard.#instance : new GenInfoboard();
    }

    get(key) { return this.#board.get(key) }
    set(...args) { this.#board.set(...args) }
}
