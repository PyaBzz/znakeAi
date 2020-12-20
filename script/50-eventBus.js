"use strict";

class EventBus {
    static key = Object.freeze({
        pause: "pause",
        resume: "resume",
        slowDown: "slowDown",
        speedUp: "speedUp",
    });
    static #instance = null;
    #funcs = {};

    constructor() {
        if (EventBus.#instance)
            throw new Error("Do not instantiate a singleton class twice");
        EventBus.#instance = this;
    }

    static get instance() { return EventBus.#instance ? EventBus.#instance : new EventBus() }

    subscribe(key, func) {
        this.#funcs[key] = func;
    }

    notify(key) {
        ifFunctionRun(this.#funcs[key]);
    }
}
