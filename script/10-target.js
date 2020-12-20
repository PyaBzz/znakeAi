"use strict";

class Target {
    static #instance = null;

    constructor() {
        if (Target.#instance)
            throw new Error("Do not instantiate a singleton class twice");
        Target.#instance = this;

    }

    static get instance() { return Target.#instance ? Target.#instance : new Target() }

    #subscribeEvents() {
        const me = this;
        this.#subscriptionRefs[EventBus.key.wormDied] = EventBus.instance.subscribe(EventBus.key.wormDied, (...args) => this.#onWormDied(...args));
        this.#subscriptionRefs[EventBus.key.generationEnd] = EventBus.instance.subscribe(EventBus.key.generationEnd, (...args) => this.#onGenerationEnd(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptionRefs) {
            const ref = this.#subscriptionRefs[key];
            EventBus.instance.unsubscribe(key, ref);
        }
    }

    #onWormDied() {
        //
    }

    #onGenerationEnd() {
        //
    }
}
