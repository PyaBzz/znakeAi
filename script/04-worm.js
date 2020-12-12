class Worm {
    constructor(game, brain) {
        this.game = game;
        this.brain = brain;
        this.grid = this.game.grid;
        this.feeder = this.game.feeder;
        this.maxStepsToFood = this.grid.playableCellCount;
        this.stepsSinceLastMeal = 0;
        this.age = 0;
        this.sections = [];
        let origin = this.grid.getStartCell();
        let originIsFood = origin.isFood;
        this.sections.push(origin);
        this.head.beHead();
        if (originIsFood)
            this.feeder.dropFood();
        this.currentDirection = Direction.right;
        this.directionFuncs = {};
        this.inputVectorSize = this.game.config.ai.inputVectorSize;
        this.fastStepTime = this.game.config.fastStepTime;
        this.slowStepTime = this.game.config.slowStepTime;
        this.defaultStepTime = this.game.config.defaultStepTime;
        let me = this;
        this.intervaller = new Intervaller(() => me.step(), me.defaultStepTime);
    }

    get head() { return this.sections[0] }
    get tail() { return this.sections.last }
    get length() { return this.sections.length }
    get isUnicellular() { return this.length === 1 }
    get isMulticellular() { return this.length !== 1 }

    run() {
        this.intervaller.run();
    }

    speedUp() {
        this.intervaller.setPeriod(this.fastStepTime);
    }

    slowDown() {
        this.intervaller.setPeriod(this.slowStepTime);
    }

    stopRunning() {
        this.intervaller.stop();
    }

    step() {
        this.age++;
        this.stepsSinceLastMeal++;
        this.game.onStepTaken();
        let direction = this.getNextDirection();
        this.currentDirection = direction;
        let nextCell = this.getNextCell();

        if (nextCell.isDeadly) {
            this.die();
        }
        else if (nextCell.isFood) {
            this.moveHeadTo(nextCell);
            this.stepsSinceLastMeal = 0;
            this.game.onFoodEaten();
        }
        else {
            this.moveHeadTo(nextCell);
            this.moveTail();
        }
        if (this.stepsSinceLastMeal === this.maxStepsToFood)
            this.die();
    }

    getNextCell() {
        if (this.currentDirection === Direction.up)
            return this.head.up;
        if (this.currentDirection === Direction.right)
            return this.head.right;
        if (this.currentDirection === Direction.down)
            return this.head.down;
        if (this.currentDirection === Direction.left)
            return this.head.left;
    }

    getNextDirection() {
        let me = this;
        let inputVector = this.getInputVector();
        let modelOutput = tf.tidy(() => {
            let inputTensor = tf.tensor(inputVector, [1, me.inputVectorSize]);
            return me.brain.predict(inputTensor, { batchSize: 1 });
        });
        let direction = this.getDirectionFromOutput(modelOutput);
        return direction;
    }

    moveHeadTo(nextHeadCell) {
        this.head.beWorm();
        this.sections.addToFront(nextHeadCell);
        this.head.beHead();
    }

    moveTail() {
        this.tail.beBlank();
        this.sections.takeLastOut();
    }

    disappear(nextHeadCell) {
        this.sections.forEach(s => s.beBlank());
    }

    die(nextHeadCell) {
        this.sections.forEach(s => s.beBlank());
        this.game.onWormDied();
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
        const foodDiffHor = this.grid.food.col - this.head.col;
        const foodDiffVer = this.grid.food.row - this.head.row;
        const foodSignalHor = foodDiffHor === 0 ? 0 : 1 / foodDiffHor;
        result.push(foodSignalHor);
        const foodSignalVer = foodDiffVer === 0 ? 0 : 1 / foodDiffVer;
        result.push(foodSignalVer);

        let deathVector = this.head.getDiff2Death(Direction.up);
        const deathSignalUp = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalUp);

        deathVector = this.head.getDiff2Death(Direction.up, Direction.right);
        const deathSignalUpRight = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalUpRight);

        deathVector = this.head.getDiff2Death(Direction.right);
        const deathSignalRight = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalRight);

        deathVector = this.head.getDiff2Death(Direction.right, Direction.down);
        const deathSignalDownRight = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalDownRight);

        deathVector = this.head.getDiff2Death(Direction.down);
        const deathSignalDown = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalDown);

        deathVector = this.head.getDiff2Death(Direction.down, Direction.left);
        const deathSignalDownLeft = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalDownLeft);

        deathVector = this.head.getDiff2Death(Direction.left);
        const deathSignalLeft = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalLeft);

        deathVector = this.head.getDiff2Death(Direction.left, Direction.up);
        const deathSignalUpLeft = - 1 / bazMath.amplitude(deathVector);
        result.push(deathSignalUpLeft);

        return result;
    }
}
