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

    constructor(number, previous) {
        GenInfoboard.instance.set({ [GenInfoboard.key.generationNo]: number + " /" + Config.target.generations });
        if (previous)
            this.#worms = previous.#evolve();
        else
            for (let i = 0; i < Config.generation.population; i++)
                this.#worms.push(new Worm());
        this.#subscribeEvents();
    }

    #subscribeEvents() { //Todo: Add all game flow like this
        const me = this;
        this.#subscriptionRefs[EventBus.key.wormDied] = EventBus.instance.subscribe(EventBus.key.wormDied, (...args) => this.#onWormDied(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptionRefs) {
            const ref = this.#subscriptionRefs[key];
            EventBus.instance.unsubscribe(key, ref);
        }
    }

    live() {
        this.#wormCounter++;
        if (this.#wormCounter <= Config.generation.population) {
            const worm = this.#worms[this.#wormCounter - 1];
            worm.live();
        } else {
            this.#unsubscribeEvents();
            EventBus.instance.notify(EventBus.key.generationEnd, this)
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
        GenInfoboard.instance.set({
            [GenInfoboard.key.wormNo]: this.#wormCounter + " /" + Config.generation.population,
            [GenInfoboard.key.maxLen]: this.#maxLen,
            [GenInfoboard.key.minLen]: this.#minLen,
            [GenInfoboard.key.maxAge]: this.#maxAge,
            [GenInfoboard.key.minAge]: this.#minAge,
        });
    }
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
