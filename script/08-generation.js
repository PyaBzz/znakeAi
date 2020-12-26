"use strict";

class Generation {
    #reproducingPopulation = Config.worm.population / 2;
    #subscriptions = {};
    #worms = [];
    #wormIndex = 0;
    #currentWorm = null;
    #maxLen = 0;
    #maxAge = 0;
    #totalLen = 0;
    #totalAge = 0;

    constructor(ancestorBrain, lastGen) {
        if (ancestorBrain)
            for (let i = 0; i < Config.worm.population; i++)
                this.#worms.push(new Worm(ancestorBrain));
        else if (lastGen)
            this.#worms = lastGen.#evolve();
        else
            for (let i = 0; i < Config.worm.population; i++)
                this.#worms.push(new Worm());
        this.#subscribeEvents();
    }

    get currentWorm() { return this.#currentWorm }

    #subscribeEvents() {
        const me = this;
        this.#subscriptions[EventKey.wormDied] = The.eventBus.subscribe(EventKey.wormDied, (...args) => this.#onWormDied(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptions) {
            const ref = this.#subscriptions[key];
            The.eventBus.unsubscribe(key, ref);
        }
    }

    run() {
        The.wormBoard.set({ [WormBoard.key.wormNo]: (this.#wormIndex + 1) + " /" + Config.worm.population });
        this.#currentWorm = this.#worms[this.#wormIndex];
        this.#currentWorm.run();
    }

    #onWormDied(wormTargetMet, worm) {
        this.#maxAge = Math.max(this.#maxAge, worm.age);
        this.#maxLen = Math.max(this.#maxLen, worm.length);
        this.#totalLen += worm.length;
        this.#totalAge += worm.age;
        this.#updateBoard();
        const targetMet = wormTargetMet || this.#isTargetMet();
        this.#wormIndex++;
        if (targetMet || this.#wormIndex >= Config.worm.population) {
            this.#unsubscribeEvents();
            The.eventBus.notify(EventKey.generationEnd, targetMet, this);
        } else {
            this.run();
        }
    }

    #isTargetMet() {
        return false;
    }

    #evolve() {
        const fittest = this.#naturalSelect();
        const replicas = fittest.map(w => w.replicate());
        const mutants = fittest.map(w => w.mutate());
        return [...replicas, ...mutants];
    }

    #naturalSelect() {
        return this.#worms.getTop(w => w.fitness, this.#reproducingPopulation).items;
    }

    #updateBoard() {
        The.genBoard.set({
            [GenBoard.key.maxLen]: this.#maxLen,
            [GenBoard.key.maxAge]: this.#maxAge,
        });
    }
}

class GenBoard {
    static #instance = null;
    static key = Object.freeze({
        generationNo: "Generation No",
        maxAge: "Max Age",
        maxLen: "Max Length",
    });
    #board = new Infoboard(
        document.getElementById("generation-board"),
        {
            [GenBoard.key.generationNo]: 0,
            [GenBoard.key.maxAge]: 0,
            [GenBoard.key.maxLen]: 0,
        },
        "Generation",
    );

    constructor() {
        GenBoard.#instance = this;
    }

    static get instance() {
        return GenBoard.#instance ? GenBoard.#instance : new GenBoard();
    }

    get(key) { return this.#board.get(key) }
    set(...args) { this.#board.set(...args) }
}
