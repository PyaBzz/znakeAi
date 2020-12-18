"use strict";

class Stat {
    static key = Object.freeze({
        wormIndex: "wormIndex",
        age: "age",
        length: "length",
        generationNo: "generationNo",
        wormAge: "wormAge",
        wormLen: "wormLen",
        genMinAge: "genMinAge",
        genMaxAge: "genMaxAge",
        genMinLen: "genMinLen",
        genMaxLen: "genMaxLen",
        totalWorms: "totalWorms",
        totalAge: "totalAge",
        totalLen: "totalLen",
        averageAge: "averageAge",
        averageLen: "averageLen",
    });
    #data = {};

    constructor() {
        for (const key in Stat.key) {
            this.#data[key] = 0;
        }
        this.set({ [Stat.key.generationNo]: 1 });
    }

    set(items) {
        for (let key in items) {
            const val = items[key];
            if (key === Stat.key.wormAge) {
                if (val < this.#data[Stat.key.genMinAge])
                    this.#data[Stat.key.genMinAge] = val;
                if (val > this.#data[Stat.key.genMaxAge])
                    this.#data[Stat.key.genMaxAge] = val;
                this.#add([Stat.key.totalAge], val);
            }
            if (key === Stat.key.wormLen) {
                if (val < this.#data[Stat.key.genMinLen])
                    this.#data[Stat.key.genMinLen] = val;
                if (val > this.#data[Stat.key.genMaxLen])
                    this.#data[Stat.key.genMaxLen] = val;
                this.#add([Stat.key.totalLen], val);
            }
            this.#data[key] = val;
        }
    }

    #add(key, diff) {
        diff = diff || 1;
        this.#data[key] += diff;
    }

    get(key) {
        if (key === Stat.key.averageAge)
            return this.#data[Stat.key.totalAge] / this.#data[Stat.key.totalWorms];
        if (key === Stat.key.averageLen)
            return this.#data[Stat.key.totalLen] / this.#data[Stat.key.totalWorms];

        return this.#data[key];
    }

    onNewWorm() {
        this.#add([Stat.key.totalWorms], 1);
    }

    onNewGeneration() {
        this.#add([Stat.key.generationNo]);
        this.set({
            [Stat.key.genMinAge]: Number.MAX_VALUE,
            [Stat.key.genMaxAge]: 0,
            [Stat.key.genMinLen]: Number.MAX_VALUE,
            [Stat.key.genMaxLen]: 1,
        });
    }

    onNewEvolution() {
        //Todo: Add stat collection on evolution convergence
    }
}
