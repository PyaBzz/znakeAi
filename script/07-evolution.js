"use strict";

class Evolution {
    #subscriptionRefs = {};
    #lastGen = null;
    #genCounter = 0;
    #maxLen = 0;
    #minLen = Number.MAX_VALUE;
    #maxAge = 0;
    #minAge = Number.MAX_VALUE;
    #totalLen = 0;
    #totalAge = 0;

    constructor(number, ancestorBrain) {
        EvoInfoboard.instance.set({ [EvoInfoboard.key.evolutionNo]: number + " /" + Config.evolution.rounds });
        Feeder.instance.resetSpread();
    }

    get #averageLen() { return this.totalLen / (Config.generation.population * this.#genCounter) }
    get #averageAge() { return this.totalAge / (Config.generation.population * this.#genCounter) }

    #subscribeEvents() {
        const me = this;
        this.#subscriptionRefs[EventBus.key.wormDied] = EventBus.instance.subscribe(EventBus.key.wormDied, (...args) => this.#onWormDied(...args));
        this.#subscriptionRefs[EventBus.key.generationEnd] = EventBus.instance.subscribe(EventBus.key.generationEnd, (...args) => this.#onGenerationEnd(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptionRefs) {
            const ref = this.#subscriptionRefs[key];
            EventBus.instance.unsubscribe(key, ref);
        }
    }

    run() {
        if (this.#reachedTarget()) {
            EventBus.instance.notify(EventBus.key.targetReached);
        } else {
            this.#genCounter++;
            const gen = new Generation(this.#genCounter, this.#lastGen);
            gen.live();
        }
    }

    #reachedTarget() { //Todo: Implement other criteria to determine if target is reached
        return this.#genCounter >= Config.target.generations
            || this.#averageLen >= Config.target.averageLen;
    }

    #onWormDied(age, len) {
        this.#maxAge = Math.max(this.#maxAge, age);
        this.#minAge = Math.min(this.#minAge, age);
        this.#maxLen = Math.max(this.#maxLen, len);
        this.#minLen = Math.min(this.#minLen, len);
        this.#totalLen += len;
        this.#totalAge += age;
        this.#updateBoard();
    }

    #onGenerationEnd(lastGen) {
        this.#lastGen = lastGen;
        this.run();
    }

    #updateBoard() {
        EvoInfoboard.instance.set({
            [EvoInfoboard.key.maxLen]: this.#maxLen,
            [EvoInfoboard.key.minLen]: this.#minLen,
            [EvoInfoboard.key.maxAge]: this.#maxAge,
            [EvoInfoboard.key.minAge]: this.#minAge,
            [EvoInfoboard.key.averageLen]: this.#averageLen.toFixed(3),
            [EvoInfoboard.key.averageAge]: this.#averageAge.toFixed(3),
            [EvoInfoboard.key.foodSpread]: Feeder.instance.spread,
        });
    }
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
        foodSpread: "Food Spread",
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
            [EvoInfoboard.key.foodSpread]: 1,

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
