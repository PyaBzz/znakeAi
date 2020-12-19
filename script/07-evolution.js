"use strict";

class Evolution {
    static infoKey = Object.freeze({ generationNo: "Generation No" });
    static ancestor = null;
    #genCounter = 0;
    #maxLen = 0;
    #minLen = Number.MAX_VALUE;
    #maxAge = 0
    #minAge = Number.MAX_VALUE;
    #totalLen = 0;
    #totalAge = 0

    constructor() {
    }

    run() {
        this.#genCounter++;
        return new Promise((resHandler, rejHandler) => {
            if (this.#genCounter <= Config.evolution.target.generationCount) { //Todo: Implement other criteria to determine if target is reached
                EvoInfoboard.instance.set({ [Evolution.infoKey.generationNo]: this.#genCounter + " /" + Config.evolution.target.generationCount });
                const gen = new Generation();
                const genResPromise = gen.run();
                return genResPromise.then(genRes => {
                    log(`generation ${this.#genCounter} >> ${genRes.maxLen}, ${genRes.minLen}, ${genRes.maxAge}, ${genRes.minAge}, ${genRes.totalLen}, ${genRes.totalAge}`);
                    this.#maxLen = Math.max(this.#maxLen, genRes.maxLen);
                    this.#minLen = Math.min(this.#minLen, genRes.minLen);
                    this.#maxAge = Math.max(this.#maxAge, genRes.maxAge);
                    this.#minAge = Math.min(this.#minAge, genRes.minAge);
                    this.#totalLen += genRes.totalLen;
                    this.#totalAge += genRes.totalAge;
                    return resHandler(this.run());
                });
            } else {
                resHandler(new EvolutionResult(this.#maxLen, this.#minLen, this.#maxAge, this.#minAge, this.#totalLen, this.#totalAge));
            }
        });
    }
}

class EvolutionResult {
    #maxLen;
    #minLen;
    #maxAge;
    #minAge;
    #totalLen;
    #totalAge;

    constructor(maxLen, minLen, maxAge, minAge, totalLen, totalAge,) {
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

class EvoInfoboard {
    static #instance = null;
    #board = new Infoboard(
        document.getElementById("evolution-info"),
        {
            [Evolution.infoKey.generationNo]: 0,
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
