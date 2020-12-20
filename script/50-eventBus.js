"use strict";
//Todo: Add events for everything, connect all objects to it
//Todo: Move to bazJS as reusable
class EventBus {
    static key = Object.freeze({
        wormBorn: "wormBorn",
        stepTaken: "stepTaken",
        foodEaten: "foodEaten",
        pause: "pause",
        resume: "resume",
        slowDown: "slowDown",
        speedUp: "speedUp",
        wormDied: "wormDied",
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
        if (!this.#funcs[key])
            this.#funcs[key] = [];
        this.#funcs[key].push(func);
        return this.#funcs[key].last;
    }

    notify(key, ...args) {
        const funcArray = this.#funcs[key];
        if (!funcArray)
            throw new Error(`No subscription found with key ${key}`);
        for (let listenerFunc of funcArray)
            ifFunctionRun(listenerFunc, ...args);
    }

    unsubscribe(key, listenerRef) {
        const funcArray = this.#funcs[key];
        if (!funcArray)
            throw new Error(`No subscription found with key ${key}`);
        const ind = funcArray.indexOf(listenerRef);
        if (ind !== -1)
            funcArray.splice(ind, 1);
    }
}
