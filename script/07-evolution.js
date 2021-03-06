"use strict";

class Evolution {
    #subscriptions = {};
    #ancestorBrain = null;
    #lastGen = null;
    #genIndex = 0;
    #currentGen = null;
    #maxLen = 0;
    #maxAge = 0;
    #totalLen = 0;
    #totalAge = 0;
    #totalWorms = 0;

    constructor(ancestorBrain) {
        this.#ancestorBrain = ancestorBrain;
        The.feeder.resetSpread();
        this.#subscribeEvents();
    }

    get genCount() { return this.#genIndex + 1 }
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
        The.genBoard.set({ [GenBoard.key.generationNo]: (this.#genIndex + 1) + " /" + Config.generation.rounds });
        this.#currentGen = new Generation(this.#ancestorBrain, this.#lastGen);
        this.#currentGen.run();
    }

    #onWormDied(wormTargetMet, worm) {
        this.#totalWorms++;
        this.#maxAge = Math.max(this.#maxAge, worm.age);
        this.#maxLen = Math.max(this.#maxLen, worm.length);
        this.#totalLen += worm.length;
        this.#totalAge += worm.age;
        The.eventBus.notify(EventKey.averageLenChanged, this.averageLen)
        this.#updateBoard();
    }

    #onGenerationEnd(genTargetMet, lastGen) {
        this.#lastGen = lastGen;
        const targetMet = genTargetMet || this.#isTargetMet();
        this.#genIndex++;
        if (targetMet || this.#genIndex >= Config.generation.rounds) {
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
            [EvoBoard.key.maxAge]: this.#maxAge,
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
        maxAge: "Max Age",
        maxLen: "Max Length",
        averageAge: "Average Age",
        averageLen: "Average Length",
        foodSpread: "Food Spread",
    });
    #board = new Infoboard(
        document.getElementById("evolution-board"),
        {
            [EvoBoard.key.evolutionNo]: 0,
            [EvoBoard.key.maxAge]: 0,
            [EvoBoard.key.maxLen]: 0,
            [EvoBoard.key.averageAge]: 0,
            [EvoBoard.key.averageLen]: 0,
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
