"use strict";

class Generation {
    static infoKey = Object.freeze({ wormNo: "Worm No" });
    #wormCounter = 0;
    #maxLen = 0;
    #minLen = Number.MAX_VALUE;
    #maxAge = 0
    #minAge = Number.MAX_VALUE;
    #totalLen = 0;
    #totalAge = 0

    constructor() {
    }

    run() {
        this.#wormCounter++;
        return new Promise((resHandler, rejHandler) => {
            if (this.#wormCounter <= Config.generation.population) {
                GenInfoboard.instance.set({ [Generation.infoKey.wormNo]: this.#wormCounter + " /" + Config.generation.population });
                const worm = new Worm();
                const wormResPromise = worm.live();
                return wormResPromise.then(wormRes => {
                    log(`worm ${this.#wormCounter} >> ${wormRes.len}, ${wormRes.age}`);
                    this.#maxLen = Math.max(this.#maxLen, wormRes.len);
                    this.#minLen = Math.min(this.#minLen, wormRes.len);
                    this.#maxAge = Math.max(this.#maxAge, wormRes.age);
                    this.#minAge = Math.min(this.#minAge, wormRes.age);
                    this.#totalLen += wormRes.len;
                    this.#totalAge += wormRes.age;
                    return resHandler(this.run());
                });
            } else {
                resHandler(new GenerationResult(this.#maxLen, this.#minLen, this.#maxAge, this.#minAge, this.#totalLen, this.#totalAge));
            }
        });
    }

    #reproduce() {
        //Todo: Implement
    }

    #naturalSelect() {
        //Todo: Implement
    }
}

class GenerationResult {
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

class GenInfoboard {
    static #instance = null;
    #board = new Infoboard(
        document.getElementById("generation-info"),
        {
            [Generation.infoKey.wormNo]: 0,
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
