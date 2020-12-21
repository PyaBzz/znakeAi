"use strict";

class Objective {
    #subscriptionRefs = {};
    static #instance = null;

    constructor() {
        if (Objective.#instance)
            throw new Error("Do not instantiate a singleton class twice");
        Objective.#instance = this;

    }

    static get instance() { return Objective.#instance ? Objective.#instance : new Objective() }

    #subscribeEvents() {
        const me = this;
        this.#subscriptionRefs[EventKey.wormDied] = The.eventBus.subscribe(EventKey.wormDied, (...args) => this.#onWormDied(...args));
        this.#subscriptionRefs[EventKey.generationEnd] = The.eventBus.subscribe(EventKey.generationEnd, (...args) => this.#onGenerationEnd(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptionRefs) {
            const ref = this.#subscriptionRefs[key];
            The.eventBus.unsubscribe(key, ref);
        }
    }

    #onWormDied() {
        // if (this.#reachedTarget()) { //Todo: Implement
        //     const shouldDownload = confirm(`Target length of ${Config.target.length} reached!\nWould you like to download the current AI model`);
        //     if (shouldDownload)
        //         this.#brain.save(Config.neuralNet.downloadPath); //Todo: Include model details in file name
        // }
    }

    #wormReachedTarget() {
        // return this.#length >= Config.target.length
        //     || this.#age >= Config.target.age;
    }

    #evoReachedTarget() {
        // return this.#genCounter >= Config.target.generations
        //     || this.#averageLen >= Config.target.averageLen;
    }

    #onGenerationEnd() {
        //
    }
}
