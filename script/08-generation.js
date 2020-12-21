"use strict";

class Generation {
    #reproducingPopulation = Config.generation.population / 2;
    #subscriptions = {};
    #worms = [];
    #wormCounter = 0;
    #currentWorm = null;
    #maxLen = 0;
    #minLen = Number.MAX_VALUE;
    #maxAge = 0;
    #minAge = Number.MAX_VALUE;
    #totalLen = 0;
    #totalAge = 0;

    constructor(ancestorBrain, lastGen) {
        if (ancestorBrain)
            for (let i = 0; i < Config.generation.population; i++)
                this.#worms.push(new Worm(ancestorBrain));
        else if (lastGen)
            this.#worms = lastGen.#evolve();
        else
            for (let i = 0; i < Config.generation.population; i++)
                this.#worms.push(new Worm());
        this.#subscribeEvents();
    }

    get currentWorm() { return this.#currentWorm }

    #subscribeEvents() {
        const me = this;
        this.#subscriptions[EventKey.wormDied] = The.eventBus.subscribe(EventKey.wormDied, (...args) => this.#onWormDied(...args));
        this.#subscriptions[EventKey.targetReached] = The.eventBus.subscribe(EventKey.targetReached, (...args) => this.#onTargetReached(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptions) {
            const ref = this.#subscriptions[key];
            The.eventBus.unsubscribe(key, ref);
        }
    }

    run() {
        if (The.target.reached)
            return;
        this.#wormCounter++;
        this.#currentWorm = this.#worms[this.#wormCounter - 1];
        The.wormBoard.set({ [WormBoard.key.wormNo]: this.#wormCounter + " /" + Config.generation.population });
        this.#currentWorm.run();
    }

    #onWormDied(age, len) {
        this.#maxAge = Math.max(this.#maxAge, age);
        this.#minAge = Math.min(this.#minAge, age);
        this.#maxLen = Math.max(this.#maxLen, len);
        this.#minLen = Math.min(this.#minLen, len);
        this.#totalLen += len;
        this.#totalAge += age;
        this.#updateBoard();
        if (this.#wormCounter < Config.generation.population) {
            this.run();
        } else {
            this.#unsubscribeEvents();
            The.eventBus.notify(EventKey.generationEnd, this);
            return;
        }
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

    #onTargetReached() {
        this.#unsubscribeEvents();
        // The.eventBus.notify(EventKey.generationEnd, this);
    }

    #updateBoard() {
        The.genBoard.set({
            [GenBoard.key.maxLen]: this.#maxLen,
            [GenBoard.key.minLen]: this.#minLen,
            [GenBoard.key.maxAge]: this.#maxAge,
            [GenBoard.key.minAge]: this.#minAge,
        });
    }
}

class GenBoard {
    static #instance = null;
    static key = Object.freeze({
        generationNo: "Generation No",
        maxLen: "Max Length",
        minLen: "Min Length",
        maxAge: "Max Age",
        minAge: "Min Age",
    });
    #board = new Infoboard(
        document.getElementById("generation-board"),
        {
            [GenBoard.key.generationNo]: 0,
            [GenBoard.key.maxLen]: 0,
            [GenBoard.key.minLen]: 0,
            [GenBoard.key.maxAge]: 0,
            [GenBoard.key.minAge]: 0,
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
