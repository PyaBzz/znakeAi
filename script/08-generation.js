"use strict";

class Generation {
    static infoKey = Object.freeze({ wormNo: "Worm No" });
    #wormCounter = 0;

    constructor() {
    }

    run() {
        this.#wormCounter++;
        return new Promise((resHandler, rejHandler) => {
            if (this.#wormCounter <= Config.generation.population) {
                const worm = new Worm();
                const wormResPromise = worm.run();
                return wormResPromise.then(wormRes => {
                    log(wormRes.stat + this.#wormCounter);
                    return resHandler(this.run());
                });
            } else {
                resHandler(new GenerationResult());
            }
        });
    }
}

class GenerationResult {
    stat = "gen result";

    constructor() {
        //Todo: Implement
    }
}
