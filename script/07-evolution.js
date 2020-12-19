"use strict";

class Evolution {
    static infoKey = Object.freeze({ generationNo: "Generation No" });
    #genCounter = 0;

    constructor() {
    }

    run() {
        this.#genCounter++;
        return new Promise((resHandler, rejHandler) => {
            if (this.#genCounter <= Config.evolution.target.generationCount) { //Todo: Implement other criteria to determine if target is reached
                const gen = new Generation();
                const genResPromise = gen.run();
                return genResPromise.then(genRes => {
                    log(genRes.stat + this.#genCounter);
                    return resHandler(this.run());
                });
            } else {
                resHandler(new EvolutionResult());
            }
        });
    }
}

class EvolutionResult {
    stat = "evo result";

    constructor() {
        //Todo: Implement
    }
}
