Worm = function (game, brain) {
    this.game = game;
    this.brain = brain;
    this.grid = this.game.grid;
    this.feeder = this.game.feeder;
    this.maxAge = this.game.config.worm.maxAge;
    this.age = 0;
    this.sections = [];
    let origin = this.grid.getStartCell();
    let originIsFood = origin.isFood;
    this.sections.push(origin);
    this.head.beHead();
    if (originIsFood)
        this.feeder.dropFood();
    this.currentDirection = directionEnum.right;
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
    let direction = this.getNextDirection();
    if (this.shouldConsiderDirection(direction)) {
        this.currentDirection = direction;
    } else {
        //
    }
    let nextCell = this.grid.getNextCell(this.head, this.currentDirection);

    if (nextCell.isDeadly) {
        this.die();
    }
    else if (nextCell.isFood) {
        this.moveHeadTo(nextCell);
        this.game.onFoodEaten();
        this.moveTail();  //Disables worm growth
    }
    else {
        this.moveHeadTo(nextCell);
        this.moveTail();
    }
    this.game.onStepTaken();
    if (this.age === this.maxAge)
        this.die();
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
        if (dirCode === oppositeDirectionEnum[this.currentDirection]) // No backwards moving
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

Worm.prototype.getDirectionFromOutput = function (tensor) {
    let array = tensor.arraySync()[0];
    let indexOfMax = array.getMax().index;
    return indexOfMax + 1;  // because directions start from 1
}

Worm.prototype.getInputVector = function () {
    const dist = this.grid.head.getDistanceTo(this.grid.food);
    return [dist, dist];
}

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } },
    isMulticellular: { get: function () { return this.length !== 1 } },
});
