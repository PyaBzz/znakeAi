"use strict";

class Target {
    #subscriptionRefs = {};
    static #instance = null;

    constructor() {
        if (Target.#instance)
            throw new Error("Do not instantiate a singleton class twice");
        Target.#instance = this;

    }

    static get instance() { return Target.#instance ? Target.#instance : new Target() }

    #subscribeEvents() {
        const me = this;
        this.#subscriptionRefs[EventBus.key.wormDied] = The.eventBus.subscribe(EventBus.key.wormDied, (...args) => this.#onWormDied(...args));
        this.#subscriptionRefs[EventBus.key.generationEnd] = The.eventBus.subscribe(EventBus.key.generationEnd, (...args) => this.#onGenerationEnd(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptionRefs) {
            const ref = this.#subscriptionRefs[key];
            The.eventBus.unsubscribe(key, ref);
        }
    }

    #onWormDied() {
        //
    }

    #onGenerationEnd() {
        //
    }
}
