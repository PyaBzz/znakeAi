"use strict";

class Worm {
    #neuralNetSrv;
    #brain;

    constructor(brain) {
        this.#neuralNetSrv = new NeuralNetSrv();
        this.#brain = brain || this.#neuralNetSrv.create();
    }

    run() {
        return new Promise((resHandler, rejHandler) => {
            const steps = [1, 2, 3];
            steps.forEachInterval(elem => null, 100, () => resHandler(new WormResult()));
        });
    }

    replicate() {
        //Todo: Implement
    }

    mutate() {
        //Todo: Implement
    }
}

class WormResult {
    stat = "worm result";

    constructor() {
        //Todo: Implement
    }
}
