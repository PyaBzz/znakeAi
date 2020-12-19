"use strict";

class Worm {
    constructor() {
    }

    run() {
        return new Promise((resHandler, rejHandler) => {
            const steps = [1, 2, 3];
            steps.forEachInterval(elem => null, 100, () => resHandler(new WormResult()));
        });
    }
}

class WormResult {
    stat = "worm result";

    constructor() {
        //Todo: Implement
    }
}
