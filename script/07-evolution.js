"use strict";

class Evolution {
    static infoKey = Object.freeze({ evolutionNo: "Evolution No" });
    static ancestor = null;
    #genCounter = 0;
    #maxLen = 0;
    #minLen = Number.MAX_VALUE;
    #maxAge = 0
    #minAge = Number.MAX_VALUE;
    #totalLen = 0;
    #totalAge = 0

    constructor(number) {
        EvoInfoboard.instance.set({ [Evolution.infoKey.evolutionNo]: number + " /" + Config.evolution.rounds });
    }

    run() {
        this.#genCounter++;
        return new Promise((resHandler, rejHandler) => {
            if (this.#genCounter <= Config.evolution.target.generationCount) { //Todo: Implement other criteria to determine if target is reached
                const gen = new Generation(this.#genCounter);
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
                resHandler(new EvolutionResult(this, this.#maxLen, this.#minLen, this.#maxAge, this.#minAge, this.#totalLen, this.#totalAge));
            }
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
            [Evolution.infoKey.evolutionNo]: 0,
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
