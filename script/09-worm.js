"use strict";

class Worm {
    #config = Config.worm;
    #subscriptionRefs = {};
    #inputSize = Config.neuralNet.inputSize;
    #brain;
    #sections = [];
    #intervaller;
    #maxStepsToFood = 0;
    #direction = {
        queue: [Direction.right],
        current: Direction.right,
        lastInput: Direction.right,
    }
    #stepsSinceLastMeal = 0;
    #age = 0;

    constructor(brain) {
        this.#brain = brain || NeuralNetSrv.instance.create();
        this.#maxStepsToFood = Grid.instance.playableCellCount;
    }

    get #head() { return this.#sections[0] }
    get #tail() { return this.#sections.last }
    get #length() { return this.#sections.length }
    get fitness() { return this.#age + (this.#length - 1) * Grid.instance.playableCellCount }

    #subscribeEvents() {
        const me = this;
        this.#subscriptionRefs[EventBus.key.pause] = EventBus.instance.subscribe(EventBus.key.pause, (...args) => me.#stop(...args));
        this.#subscriptionRefs[EventBus.key.resume] = EventBus.instance.subscribe(EventBus.key.resume, (...args) => me.#resume(...args));
        this.#subscriptionRefs[EventBus.key.speedUp] = EventBus.instance.subscribe(EventBus.key.speedUp, (...args) => me.#speedUp(...args));
        this.#subscriptionRefs[EventBus.key.slowDown] = EventBus.instance.subscribe(EventBus.key.slowDown, (...args) => me.#slowDown(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptionRefs) {
            const ref = this.#subscriptionRefs[key];
            EventBus.instance.unsubscribe(key, ref);
        }
    }

    live(wormNumber) {
        WormInfoboard.instance.set({ [WormInfoboard.key.wormNo]: wormNumber + " /" + Config.generation.population });
        const origin = Grid.instance.getStartCell(this.#config.startAtCentre);
        const originWasFood = origin.isFood;
        this.#sections.push(origin);
        this.#head.beHead();
        if (originWasFood)
            EventBus.instance.notify(EventBus.key.foodEaten);
        this.#subscribeEvents();
        const me = this;
        this.#intervaller = new Intervaller(() => me.#step(), this.#config.stepTime.fast);
        this.#intervaller.run();
    }

    #step() { //Todo: Review
        this.#age++;
        this.#stepsSinceLastMeal++;
        const dir = this.#getNextDirection();
        this.#direction.current = dir;
        let nextCell = this.#getNextCell();

        if (nextCell.isDeadly) {
            this.#die();
        }
        else if (nextCell.isFood) {
            this.#moveHeadTo(nextCell);
            this.#stepsSinceLastMeal = 0;
            EventBus.instance.notify(EventBus.key.foodEaten);
            if (this.#reachedTarget()) {
                const shouldDownload = confirm(`Target length of ${Config.target.length} reached!\nWould you like to download the current AI model`);
                if (shouldDownload)
                    this.#brain.save(Config.neuralNet.downloadPath); //Todo: Include model details in file name
            }
        }
        else {
            this.#moveHeadTo(nextCell);
            this.#moveTail();
        }
        if (this.#stepsSinceLastMeal === this.#maxStepsToFood)
            this.#die();

        this.#updateBoard();
    }

    #reachedTarget() {
        return this.#length >= Config.target.length
            || this.#age >= Config.target.age;
    }

    #speedUp() {
        this.#intervaller.setPeriod(this.#config.stepTime.fast);
    }

    #slowDown() {
        this.#intervaller.setPeriod(this.#config.stepTime.slow);
    }

    #stop() {
        this.#intervaller.stop();
    }

    #resume() {
        this.#intervaller.run();
    }

    #getNextDirection() {
        const brainOutputTensor = this.#think();
        const brainOutputArray = brainOutputTensor.arraySync()[0];
        let indexOfMax = brainOutputArray.getMax().index;
        if (indexOfMax === 0)
            return Direction.up;
        if (indexOfMax === 1)
            return Direction.right;
        if (indexOfMax === 2)
            return Direction.down;
        if (indexOfMax === 3)
            return Direction.left;
    }

    #think() {
        const me = this;
        const inputVector = this.#getInput();
        const brainOutput = tf.tidy(() => {
            const inputTensor = tf.tensor(inputVector, [1, me.#inputSize]);
            return me.#brain.predict(inputTensor, { batchSize: 1 });
        });
        return brainOutput;
    }

    #getInput() {
        let result = [];
        const foodDiffHor = Grid.instance.food.col - this.#head.col;
        const foodDiffVer = Grid.instance.food.row - this.#head.row;
        const foodSignalHor = foodDiffHor === 0 ? 0 : 1 / foodDiffHor;
        result.push(foodSignalHor);
        const foodSignalVer = foodDiffVer === 0 ? 0 : 1 / foodDiffVer;
        result.push(foodSignalVer);

        let deathVector = this.#head.getDiff2Death(Direction.up);
        const deathSignalUp = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalUp);

        deathVector = this.#head.getDiff2Death(Direction.up, Direction.right);
        const deathSignalUpRight = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalUpRight);

        deathVector = this.#head.getDiff2Death(Direction.right);
        const deathSignalRight = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalRight);

        deathVector = this.#head.getDiff2Death(Direction.right, Direction.down);
        const deathSignalDownRight = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalDownRight);

        deathVector = this.#head.getDiff2Death(Direction.down);
        const deathSignalDown = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalDown);

        deathVector = this.#head.getDiff2Death(Direction.down, Direction.left);
        const deathSignalDownLeft = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalDownLeft);

        deathVector = this.#head.getDiff2Death(Direction.left);
        const deathSignalLeft = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalLeft);

        deathVector = this.#head.getDiff2Death(Direction.left, Direction.up);
        const deathSignalUpLeft = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalUpLeft);

        return result;
    }

    #getNextCell() {
        if (this.#direction.current === Direction.up)
            return this.#head.up;
        if (this.#direction.current === Direction.right)
            return this.#head.right;
        if (this.#direction.current === Direction.down)
            return this.#head.down;
        if (this.#direction.current === Direction.left)
            return this.#head.left;
    }

    #moveHeadTo(nextHeadCell) {
        this.#head.beWorm();
        this.#sections.addToFront(nextHeadCell);
        this.#head.beHead();
    }

    #moveTail() {
        this.#tail.beBlank();
        this.#sections.takeLastOut();
    }

    #disappear() {
        this.#sections.forEach(s => s.beBlank());
    }

    #die() {
        this.#stop();
        this.#disappear();
        EventBus.instance.notify(EventBus.key.wormDied, this.#age, this.#length);
        this.#unsubscribeEvents();
    }

    replicate() {
        return new Worm(this.#brain);
    }

    mutate() {
        const mutantBrain = NeuralNetSrv.instance.mutate(this.#brain);
        return new Worm(mutantBrain);
    }

    #updateBoard() {
        WormInfoboard.instance.set({
            [WormInfoboard.key.len]: this.#length,
            [WormInfoboard.key.age]: this.#age,
        });
    }
}

class WormInfoboard {
    static #instance = null;
    static key = Object.freeze({
        wormNo: "Worm No",
        len: "Length",
        age: "Age",
    });
    #board = new Infoboard(
        document.getElementById("worm-board"),
        {
            [WormInfoboard.key.wormNo]: 0,
            [WormInfoboard.key.len]: 0,
            [WormInfoboard.key.age]: 0,
        },
        "Worm info",
    );

    constructor() {
        WormInfoboard.#instance = this;
    }

    static get instance() {
        return WormInfoboard.#instance ? WormInfoboard.#instance : new WormInfoboard();
    }

    get(key) { return this.#board.get(key) }
    set(...args) { this.#board.set(...args) }
}
