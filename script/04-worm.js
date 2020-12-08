Worm = function (game, brain) {
    this.game = game;
    this.brain = brain;
    this.grid = this.game.grid;
    this.feeder = this.game.feeder;
    this.stepsBetweenMeals = this.grid.playableCellCount;
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
    this.inputVectorSize = this.game.ai.inputVectorSize;
    this.stepTime = this.game.config.stepTime;
    let me = this;
    this.intervaller = new Intervaller(() => me.step(), me.stepTime);
}

Worm.prototype.run = function () {
    this.intervaller.run();
}

Worm.prototype.stopRunning = function () {
    this.intervaller.stop();
}

Worm.prototype.step = function () {
    this.age++;
    this.stepsSinceLastMeal++;
    this.game.onStepTaken();
    let direction = this.getNextDirection();
    if (this.shouldConsiderDirection(direction)) {
        this.currentDirection = direction;
    } else {
        //
    }
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
    if (this.stepsSinceLastMeal === this.stepsBetweenMeals)
        this.die();
}

Worm.prototype.getNextCell = function () {
    if (this.currentDirection === Direction.up)
        return this.head.up;
    if (this.currentDirection === Direction.right)
        return this.head.right;
    if (this.currentDirection === Direction.down)
        return this.head.down;
    if (this.currentDirection === Direction.left)
        return this.head.left;
}

Worm.prototype.getNextDirection = function () {
    let me = this;
    let inputVector = this.getInputVector();
    let modelOutput = tf.tidy(() => {
        let inputTensor = tf.tensor(inputVector, [1, me.inputVectorSize]);
        return me.brain.predict(inputTensor, args = { batchSize: 1 });
    });
    let direction = this.getDirectionFromOutput(modelOutput);
    return direction;
}

Worm.prototype.shouldConsiderDirection = function (dirCode) {
    if (this.isUnicellular)
        return true;
    else {
        if (dirCode === OppositeDirection[this.currentDirection]) // No backwards moving
            return false;
        else
            return true;
    }
}

Worm.prototype.moveHeadTo = function (nextHeadCell) {
    this.head.beWorm();
    this.sections.addToFront(nextHeadCell);
    this.head.beHead();
}

Worm.prototype.moveTail = function () {
    this.tail.beBlank();
    this.sections.takeLastOut();
}

Worm.prototype.disappear = function (nextHeadCell) {
    this.sections.forEach(s => s.beBlank());
}

Worm.prototype.die = function (nextHeadCell) {
    this.sections.forEach(s => s.beBlank());
    this.game.onWormDied();
}

Worm.prototype.getDirectionFromOutput = function (tensor) { //Todo: Reduce output paths to 3 stepping directions for "Forward", "Left", "Right"
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

Worm.prototype.getInputVector = function () { //Todo: Should inputs be in a similar range?
    const foodDiffHor = Math.sign(this.grid.food.col - this.head.col);
    const foodDiffVer = Math.sign(this.grid.food.row - this.head.row);
    const deathDistUp = this.head.getDistance2Death(Direction.up);
    const deathDistRight = this.head.getDistance2Death(Direction.right);
    const deathDistDown = this.head.getDistance2Death(Direction.down);
    const deathDistLeft = this.head.getDistance2Death(Direction.left);
    return [foodDiffHor, foodDiffVer, deathDistUp, deathDistRight, deathDistDown, deathDistLeft];
}

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } },
    isMulticellular: { get: function () { return this.length !== 1 } },
});
