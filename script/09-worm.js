"use strict";

class Worm {
    #brain;
    #inputVectorSize;
    #grid;
    #stepTime;
    #intervaller;
    #gameCallbacks = {};
    #sections = [];
    #maxStepsToFood;
    #direction = null;
    #stepsSinceLastMeal = 0;
    #age = 0;

    constructor(brain, inputVectorSize, grid, startAtCentre, stepTime, gameCallbacks) {
        this.#brain = brain;
        this.#grid = grid;
        copyProperties(gameCallbacks, this.#gameCallbacks);
        const origin = grid.getStartCell(startAtCentre);
        const originWasFood = origin.isFood;
        this.#sections.push(origin);
        this.#head.beHead();
        this.#direction = {
            queue: [Direction.right],
            current: Direction.right,
            lastInput: Direction.right,
        };
        let me = this;

        this.#intervaller = new Intervaller(() => {
            me.#step();
            me.#gameCallbacks.onStepTaken(me.#age);
        }, stepTime.fast);

        this.#stepTime = stepTime;
        this.#inputVectorSize = inputVectorSize;
        this.#maxStepsToFood = grid.playableCellCount;
        this.#gameCallbacks.onWormBorn(originWasFood);
    }

    get #head() { return this.#sections[0] }
    get #tail() { return this.#sections.last }
    get #length() { return this.#sections.length }
    get #isUnicellular() { return this.#length === 1 }
    get #isMulticellular() { return this.#length !== 1 }

    run() {
        this.#intervaller.run();
    }

    #step() {
        this.#age++;
        this.#stepsSinceLastMeal++;
        this.#gameCallbacks.onStepTaken();
        const dir = this.getNextDirection();
        this.#direction.current = dir;
        let nextCell = this.getNextCell();

        if (nextCell.isDeadly) {
            this.die();
        }
        else if (nextCell.isFood) {
            this.moveHeadTo(nextCell);
            this.#stepsSinceLastMeal = 0;
            this.#gameCallbacks.onFoodEaten(this.#length);
        }
        else {
            this.moveHeadTo(nextCell);
            this.moveTail();
        }
        if (this.#stepsSinceLastMeal === this.#maxStepsToFood)
            this.die();
    }

    speedUp() {
        this.#intervaller.setPeriod(this.#stepTime.fast);
    }

    slowDown() {
        this.#intervaller.setPeriod(this.#stepTime.slow);
    }

    stop() {
        this.#intervaller.stop();
    }

    getNextCell() {
        if (this.#direction.current === Direction.up)
            return this.#head.up;
        if (this.#direction.current === Direction.right)
            return this.#head.right;
        if (this.#direction.current === Direction.down)
            return this.#head.down;
        if (this.#direction.current === Direction.left)
            return this.#head.left;
    }

    getNextDirection() {
        let me = this;
        let inputVector = this.getInputVector();
        let modelOutput = tf.tidy(() => {
            let inputTensor = tf.tensor(inputVector, [1, me.#inputVectorSize]);
            return me.#brain.predict(inputTensor, { batchSize: 1 });
        });
        return this.getDirectionFromOutput(modelOutput);
    }

    moveHeadTo(nextHeadCell) {
        this.#head.beWorm();
        this.#sections.addToFront(nextHeadCell);
        this.#head.beHead();
    }

    moveTail() {
        this.#tail.beBlank();
        this.#sections.takeLastOut();
    }

    disappear() {
        this.#sections.forEach(s => s.beBlank());
    }

    die() {
        this.stop();
        this.disappear();
        this.#gameCallbacks.onWormDied(this.#age, this.#length);
    }

    getDirectionFromOutput(tensor) { //Todo: Should reduce output paths to 3 stepping directions? "Forward", "Left", "Right"
        let array = tensor.arraySync()[0];
        let indexOfMax = array.getMax().index;
        if (indexOfMax === 0)
            return Direction.up;
        if (indexOfMax === 1)
            return Direction.right;
        if (indexOfMax === 2)
            return Direction.down;
        if (indexOfMax === 3)
            return Direction.left;
    }

    getInputVector() {
        let result = [];
        const foodDiffHor = this.#grid.food.col - this.#head.col;
        const foodDiffVer = this.#grid.food.row - this.#head.row;
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
}