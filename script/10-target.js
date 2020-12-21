"use strict";

class Target {
    #subscriptions = {};
    static #instance = null;
    #reached = false;

    constructor() {
        if (Target.#instance)
            throw new Error("Do not instantiate a singleton class twice");
        Target.#instance = this;
        this.#subscribeEvents();
    }

    static get instance() { return Target.#instance ? Target.#instance : new Target() }
    get reached() { return this.#reached }

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

    #onWormDied(age, len) {
        if (Config.target.length && len >= Config.target.length) {
            const shouldDownload = confirm(`Target length of ${Config.target.length} reached!\nWould you like to download this TensorFlow neural net?`);
            if (shouldDownload)
                The.worm.downloadBrain();
            this.#reached = true;
            The.eventBus.notify(EventKey.targetReached);
        } else if (Config.target.age && age >= Config.target.age) {
            const shouldDownload = confirm(`Target age of ${Config.target.length} reached!\nWould you like to download this TensorFlow neural net?`);
            if (shouldDownload)
                The.worm.downloadBrain();
            this.#reached = true;
            The.eventBus.notify(EventKey.targetReached);
        } else if (Config.target.averageLen && The.evolution.averageLen >= Config.target.averageLen) {
            alert(`Average length of ${Config.target.averageLen} reached`);
            this.#reached = true;
            The.eventBus.notify(EventKey.targetReached);
        }
        else {
            //nothing
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
