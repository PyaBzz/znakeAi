Worm = function (game) {
    this.game = game;
    this.sections = [];
    let origin = this.game.grid.getStartCell();
    let originIsFood = origin.isFood;
    this.sections.push(origin);
    this.head.beWorm();
    if (originIsFood)
        this.game.feeder.dropFood();
    this.currentDirection = directionEnum.right;
    this.age = 0;
    this.directionFuncs = {};
    this.game.infoboard.updateScore(this.length);
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    this.brain = this.game.ai.getNextModel();
}

Worm.prototype.step = function () {
    this.age++;
    let direction = this.getNextDirection();
    if (this.shouldConsiderDirection(direction)) {
        this.currentDirection = direction;
    } else {
        log("Avoid self bite");
    }
    let nextCell = this.game.grid.getNextCell(this.head, this.currentDirection);
    this.game.infoboard.updateAge(this.age);

    if (nextCell.isDeadly) {
        this.sections.doToAll(s => s.beBlank());
        this.game.ai.currentModelScored(this.length);
        this.game.wormDied();
    }
    else if (nextCell.isFood) {
        this.moveHeadTo(nextCell);
        this.game.foodEaten();
    }
    else {
        this.moveHeadTo(nextCell);
        this.moveTail();
    }
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
    this.sections.addToFront(nextHeadCell);
    this.head.beWorm();
}

Worm.prototype.moveTail = function () {
    this.tail.beBlank();
    this.sections.takeLastOut();
}

Worm.prototype.disappear = function (nextHeadCell) {
    this.sections.doToAll(s => s.beBlank());
}

Worm.prototype.getDirectionFromOutput = function (tensor) {
    let array = tensor.arraySync()[0];
    let indexOfMax = array.getIndexOfMax();
    return indexOfMax + 1;  // because directions start from 1
}

Worm.prototype.getInputVector = function () {
    return this.game.grid.cells.flat().map(c => c.getValue());
}

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } },
    isMulticellular: { get: function () { return this.length !== 1 } },
});
