"use strict";

class Worm {
    #config = Config.worm;
    #inputSize = Config.neuralNet.inputSize;
    #neuralNetSrv; //Todo: Make neuralNetSrv static
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
        this.#neuralNetSrv = new NeuralNetSrv();
        this.#brain = brain || this.#neuralNetSrv.create();

        const origin = Grid.instance.getStartCell(this.#config.startAtCentre);
        const originWasFood = origin.isFood;
        this.#sections.push(origin);
        this.#head.beHead();

        let me = this;
        this.#intervaller = new Intervaller(() => {
            me.#step();
        }, this.#config.stepTime.fast);

        this.#maxStepsToFood = Grid.instance.playableCellCount;
    }

    get #head() { return this.#sections[0] }
    get #tail() { return this.#sections.last }
    get #length() { return this.#sections.length }

    run() {
        return new Promise((resHandler, rejHandler) => {
            // const steps = [1, 2, 3];
            // steps.forEachInterval(elem => null, 100, () => resHandler(new WormResult()));
            this.#intervaller.run(); //Todo: Adopt this
        });
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
        }
        else {
            this.#moveHeadTo(nextCell);
            this.#moveTail();
        }
        if (this.#stepsSinceLastMeal === this.#maxStepsToFood)
            this.#die();
    }

    speedUp() {
        this.#intervaller.setPeriod(this.#config.stepTime.fast);
    }

    slowDown() {
        this.#intervaller.setPeriod(this.#config.stepTime.slow);
    }

    stop() {
        this.#intervaller.stop();
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
        this.stop();
        this.#disappear();
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
