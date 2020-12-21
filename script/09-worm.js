"use strict";

class Worm {
    #config = Config.worm;
    static #defaultPeriod = null;
    #subscriptions = {};
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
        this.#maxStepsToFood = The.grid.playableCellCount;
    }

    get #head() { return this.#sections[0] }
    get #tail() { return this.#sections.last }
    get #length() { return this.#sections.length }
    get fitness() { return this.#age + (this.#length - 1) * The.grid.playableCellCount }

    #subscribeEvents() {
        const me = this;
        this.#subscriptions[EventKey.pause] = The.eventBus.subscribe(EventKey.pause, (...args) => me.#stop(...args));
        this.#subscriptions[EventKey.resume] = The.eventBus.subscribe(EventKey.resume, (...args) => me.#resume(...args));
        this.#subscriptions[EventKey.speedUp] = The.eventBus.subscribe(EventKey.speedUp, (...args) => me.#speedUp(...args));
        this.#subscriptions[EventKey.slowDown] = The.eventBus.subscribe(EventKey.slowDown, (...args) => me.#slowDown(...args));
    }

    #unsubscribeEvents() {
        const me = this;
        for (let key in this.#subscriptions) {
            const ref = this.#subscriptions[key];
            The.eventBus.unsubscribe(key, ref);
        }
    }

    run() {
        const origin = The.grid.getStartCell(this.#config.startAtCentre);
        const originWasFood = origin.isFood;
        this.#sections.push(origin);
        this.#head.beHead();
        if (originWasFood)
            The.eventBus.notify(EventKey.foodEaten);
        this.#subscribeEvents();
        const me = this;
        this.#intervaller = new Intervaller(() => me.#step(), Worm.#defaultPeriod || Config.worm.stepTime.fast);
        this.#intervaller.run();
    }

    #step() {
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
            The.eventBus.notify(EventKey.foodEaten);
        }
        else {
            this.#moveHeadTo(nextCell);
            this.#moveTail();
        }
        if (this.#stepsSinceLastMeal === this.#maxStepsToFood)
            this.#die();

        this.#updateBoard();
    }

    #speedUp() {
        Worm.#defaultPeriod = this.#config.stepTime.fast;
        this.#intervaller.setPeriod(this.#config.stepTime.fast);
    }

    #slowDown() {
        Worm.#defaultPeriod = this.#config.stepTime.slow;
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
        const foodDiffHor = The.grid.food.col - this.#head.col;
        const foodDiffVer = The.grid.food.row - this.#head.row;
        const foodSignalHor = foodDiffHor === 0 ? 0 : 1 / foodDiffHor;
        result.push(foodSignalHor);
        const foodSignalVer = foodDiffVer === 0 ? 0 : 1 / foodDiffVer;
        result.push(foodSignalVer);

        let deathVector = this.#head.getDiff(target => target.isDeadly, Direction.up);
        const deathSignalUp = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalUp);

        deathVector = this.#head.getDiff(target => target.isDeadly, Direction.up, Direction.right);
        const deathSignalUpRight = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalUpRight);

        deathVector = this.#head.getDiff(target => target.isDeadly, Direction.right);
        const deathSignalRight = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalRight);

        deathVector = this.#head.getDiff(target => target.isDeadly, Direction.right, Direction.down);
        const deathSignalDownRight = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalDownRight);

        deathVector = this.#head.getDiff(target => target.isDeadly, Direction.down);
        const deathSignalDown = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalDown);

        deathVector = this.#head.getDiff(target => target.isDeadly, Direction.down, Direction.left);
        const deathSignalDownLeft = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalDownLeft);

        deathVector = this.#head.getDiff(target => target.isDeadly, Direction.left);
        const deathSignalLeft = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalLeft);

        deathVector = this.#head.getDiff(target => target.isDeadly, Direction.left, Direction.up);
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
        The.eventBus.notify(EventKey.wormDied, this.#age, this.#length, this);
        this.#unsubscribeEvents();
    }

    downloadBrain() {
        const filePath = Config.neuralNet.downloadPath + "-" + Config.neuralNet.layerSizes.toString("-");
        this.#brain.save(filePath);
    }

    replicate() {
        return new Worm(this.#brain);
    }

    mutate() {
        const mutantBrain = NeuralNetSrv.instance.mutate(this.#brain);
        return new Worm(mutantBrain);
    }

    #updateBoard() {
        The.wormBoard.set({
            [WormBoard.key.len]: this.#length,
            [WormBoard.key.age]: this.#age,
        });
    }
}

class WormBoard {
    static #instance = null;
    static key = Object.freeze({
        wormNo: "Worm No",
        len: "Length",
        age: "Age",
    });
    #board = new Infoboard(
        document.getElementById("worm-board"),
        {
            [WormBoard.key.wormNo]: 0,
            [WormBoard.key.age]: 0,
            [WormBoard.key.len]: 0,
        },
        "Worm",
    );

    constructor() {
        WormBoard.#instance = this;
    }

    static get instance() {
        return WormBoard.#instance ? WormBoard.#instance : new WormBoard();
    }

    get(key) { return this.#board.get(key) }
    set(...args) { this.#board.set(...args) }
}
