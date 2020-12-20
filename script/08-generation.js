"use strict";

class Generation {
    #reproducingPopulation = Config.generation.population / 2;
    #subscriptionRefs = {};
    #worms = [];
    #wormCounter = 0; //Todo: Change to wormIndex
    #maxLen = 0;
    #minLen = Number.MAX_VALUE;
    #maxAge = 0;
    #minAge = Number.MAX_VALUE;
    #totalLen = 0;
    #totalAge = 0;

    constructor(genNumber, previous) {
        The.genBoard.set({ [GenBoard.key.generationNo]: genNumber + " /" + Config.target.generations });
        if (previous)
            this.#worms = previous.#evolve();
        else
            for (let i = 0; i < Config.generation.population; i++)
                this.#worms.push(new Worm());
        this.#subscribeEvents();
    }

    #subscribeEvents() { //Todo: Add all game flow like this
        const me = this;
        this.#subscriptionRefs[EventBus.key.wormDied] = The.eventBus.subscribe(EventBus.key.wormDied, (...args) => this.#onWormDied(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptionRefs) {
            const ref = this.#subscriptionRefs[key];
            The.eventBus.unsubscribe(key, ref);
        }
    }

    live() {
        this.#wormCounter++;
        if (this.#wormCounter <= Config.generation.population) {
            const worm = this.#worms[this.#wormCounter - 1];
            worm.live(this.#wormCounter);
        } else {
            this.#unsubscribeEvents();
            The.eventBus.notify(EventBus.key.generationEnd, this)
        }
    }

    #onWormDied(age, len) {
        this.#maxAge = Math.max(this.#maxAge, age);
        this.#minAge = Math.min(this.#minAge, age);
        this.#maxLen = Math.max(this.#maxLen, len);
        this.#minLen = Math.min(this.#minLen, len);
        this.#totalLen += len;
        this.#totalAge += age;
        this.#updateBoard();
        this.live();
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
