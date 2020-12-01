Worm = function (game) {
    this.game = game;
    this.maxAge = this.game.config.worm.maxAge;
    this.age = 0;
    this.sections = [];
    let origin = this.game.grid.getStartCell();
    let originIsFood = origin.isFood;
    this.sections.push(origin);
    this.head.beHead();
    if (originIsFood)
        this.game.feeder.dropFood();
    this.currentDirection = directionEnum.right;
    this.directionFuncs = {};
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    this.brain = this.game.ai.getNextModel();
}

Worm.prototype.step = function () {
    this.age++;
    let direction = this.getNextDirection();
    if (this.shouldConsiderDirection(direction)) {
        this.currentDirection = direction;
    } else {
        //
    }
    let nextCell = this.game.grid.getNextCell(this.head, this.currentDirection);

    if (nextCell.isDeadly) {
        this.die();
    }
    else if (nextCell.isFood) {
        this.moveHeadTo(nextCell);
        this.game.foodEaten();
    }
    else {
        this.moveHeadTo(nextCell);
        this.moveTail();
    }
    this.game.infoboard.set(infoboardKeysEnum.Age, this.age);
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
    this.game.ai.currentModelDied(this.length, this.age);
}

Worm.prototype.getDirectionFromOutput = function (tensor) {
    let array = tensor.arraySync()[0];
    let indexOfMax = array.getMax().index;
    return indexOfMax + 1;  // because directions start from 1
}

Worm.prototype.getInputVector = function () {
    return this.game.grid.cells.flat().map(c => c.value);
}

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } },
    isMulticellular: { get: function () { return this.length !== 1 } },
});
