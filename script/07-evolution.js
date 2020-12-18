"use strict";

class Evolution {
    static infoKey = Object.freeze({ generationNo: "Generation No" });

    constructor() {
    }

    start() {
        return new Promise((resHandler, rejHandler) => {
            const gens = [1, 2, 3, 4, 5, 6];
            gens.forEachInterval(elem => log(elem), 500, () => resHandler("Done"));
        });
    }
}
