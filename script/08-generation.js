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
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptions) {
            const ref = this.#subscriptions[key];
            The.eventBus.unsubscribe(key, ref);
        }
    }

    run() {
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
        const targetMet = this.#isTargetMet(age, len);
        if (!targetMet && this.#wormCounter < Config.generation.population) {
            this.run();
        } else {
            this.#unsubscribeEvents();
            The.eventBus.notify(EventKey.generationEnd, this, targetMet);
        }
    }

    #isTargetMet(age, len) {
        if (Config.worm.target.length && len >= Config.worm.target.length) {
            if (Config.worm.target.offerBrainDownload) {
                const shouldDownload = confirm(`Target length of ${Config.worm.target.length} reached!\nWould you like to download this TensorFlow neural net?`);
                if (shouldDownload)
                    The.worm.downloadBrain();
            }
            return true;
        } else if (Config.worm.target.age && age >= Config.worm.target.age) {
            if (Config.worm.target.offerBrainDownload) {
                const shouldDownload = confirm(`Target age of ${Config.worm.target.length} reached!\nWould you like to download this TensorFlow neural net?`);
                if (shouldDownload)
                    The.worm.downloadBrain();
            }
            return true;
        }
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
