"use strict";

class Evolution {
    #subscriptions = {};
    #ancestorBrain = null;
    #lastGen = null;
    #genCounter = 0;
    #currentGen = null;
    #maxLen = 0;
    #minLen = Number.MAX_VALUE;
    #maxAge = 0;
    #minAge = Number.MAX_VALUE;
    #totalLen = 0;
    #totalAge = 0;
    #totalWorms = 0;

    constructor(ancestorBrain) {
        this.#ancestorBrain = ancestorBrain;
        The.feeder.resetSpread();
        this.#subscribeEvents();
    }

    get genCount() { return this.#genCounter }
    get currentGen() { return this.#currentGen }
    get maxLen() { return this.#maxLen }
    get totalWorms() { return this.#totalWorms }
    get averageLen() { return this.#totalLen / this.#totalWorms }
    get averageAge() { return this.#totalAge / this.#totalWorms }

    #subscribeEvents() {
        const me = this;
        this.#subscriptions[EventKey.wormDied] = The.eventBus.subscribe(EventKey.wormDied, (...args) => this.#onWormDied(...args));
        this.#subscriptions[EventKey.generationEnd] = The.eventBus.subscribe(EventKey.generationEnd, (...args) => this.#onGenerationEnd(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptions) {
            const ref = this.#subscriptions[key];
            The.eventBus.unsubscribe(key, ref);
        }
    }

    run() {
        this.#genCounter++;
        The.genBoard.set({ [GenBoard.key.generationNo]: this.#genCounter + " /" + Config.generation.rounds });
        this.#currentGen = new Generation(this.#ancestorBrain, this.#lastGen);
        this.#currentGen.run();
    }

    #onWormDied(wormTargetMet, worm) {
        this.#totalWorms++;
        this.#maxAge = Math.max(this.#maxAge, worm.age);
        this.#minAge = Math.min(this.#minAge, worm.age);
        this.#maxLen = Math.max(this.#maxLen, worm.length);
        this.#minLen = Math.min(this.#minLen, worm.length);
        this.#totalLen += worm.length;
        this.#totalAge += worm.age;
        The.eventBus.notify(EventKey.averageLenChanged, this.averageLen)
        this.#updateBoard();
    }

    #onGenerationEnd(genTargetMet, lastGen) {
        this.#lastGen = lastGen;
        const targetMet = genTargetMet || this.#isTargetMet();
        if (targetMet || this.#genCounter >= Config.generation.rounds) {
            this.#unsubscribeEvents();
            The.eventBus.notify(EventKey.evolutionEnd, targetMet, this);
        } else {
            this.run();
        }
    }

    #isTargetMet() {
        if (Config.evolution.target.averageLen && this.averageLen >= Config.evolution.target.averageLen) {
            // alert(`Average length of ${Config.evolution.target.averageLen} reached`);
            return true;
        }
        return false;
    }

    #updateBoard() {
        The.evoBoard.set({
            [EvoBoard.key.maxLen]: this.#maxLen,
            [EvoBoard.key.minLen]: this.#minLen,
            [EvoBoard.key.maxAge]: this.#maxAge,
            [EvoBoard.key.minAge]: this.#minAge,
            [EvoBoard.key.averageLen]: this.averageLen.toFixed(3),
            [EvoBoard.key.averageAge]: this.averageAge.toFixed(3),
            [EvoBoard.key.foodSpread]: The.feeder.spread,
        });
    }
}

class EvoBoard {
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
        document.getElementById("evolution-board"),
        {
            [EvoBoard.key.evolutionNo]: 0,
            [EvoBoard.key.maxLen]: 0,
            [EvoBoard.key.minLen]: 0,
            [EvoBoard.key.maxAge]: 0,
            [EvoBoard.key.minAge]: 0,
            [EvoBoard.key.averageLen]: 0,
            [EvoBoard.key.averageAge]: 0,
            [EvoBoard.key.foodSpread]: 1,

        },
        "Evolution",
    );

    constructor() {
        EvoBoard.#instance = this;
    }

    static get instance() {
        return EvoBoard.#instance ? EvoBoard.#instance : new EvoBoard();
    }

    get(key) { return this.#board.get(key) }
    set(...args) { this.#board.set(...args) }
}
