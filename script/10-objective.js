"use strict";

class Objective {
    #subscriptions = {};
    static #instance = null;

    constructor() {
        if (Objective.#instance)
            throw new Error("Do not instantiate a singleton class twice");
        Objective.#instance = this;
        this.#subscribeEvents();
    }

    static get instance() { return Objective.#instance ? Objective.#instance : new Objective() }

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

    #onWormDied(age, len, worm) {
        if (age >= Config.target.age || len >= Config.target.length) {
            const shouldDownload = confirm(`Target length of ${Config.target.length} reached!\nWould you like to download this TensorFlow neural net?`);
            if (shouldDownload)
                worm.downloadBrain();
        }
    }

    #evoReachedTarget() {
        // return this.#genCounter >= Config.generation.rounds
        //     || this.#averageLen >= Config.target.averageLen;
    }

    #onGenerationEnd() {
        //
    }
}
