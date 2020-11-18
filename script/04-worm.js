Worm = function (game) {
    this.game = game;
    this.sections = [];
    this.sections.push(this.game.grid.getStartCell());
    this.head.beWorm();
    this.directionQueue = [2];
    this.currentDirection = 2;
    this.previousDirection = 2;
    this.age = 0;
    this.directionFuncs = {};
    this.mapKeys();
    this.game.infoboard.updateScore(this.length);
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    if (this.game.ai.pickNextModel(this.length)) {
        this.brain = this.game.ai.currentModel;
    } else {
        this.game.ai.generationFinished();
        this.game.ai.pickNextModel(this.length);
        this.brain = this.game.ai.currentModel;
    }
}

Worm.prototype.update = function () {
    this.age++;
    let nextCell = this.getNextCell();

    if (nextCell.isDeadly) {
        this.sections.doToAll(s => s.beBlank());
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

Worm.prototype.moveHeadTo = function (nextHeadCell) {
    this.sections.addToFront(nextHeadCell);
    this.head.beWorm();
}

Worm.prototype.moveTail = function () {
    this.tail.beBlank();
    this.sections.takeLastOut();
}

Worm.prototype.getNextCell = function () {
    if (this.directionQueue.hasAny)
        this.currentDirection = this.directionQueue.takeFirstOut();
    return this.game.grid.getNextCell(this);
}

Worm.prototype.disappear = function (nextHeadCell) {
    this.sections.doToAll(s => s.beBlank());
}

Worm.prototype.mapKeys = function () {
    let me = this;
    for (let directionName in directionEnum) {
        let directionCode = directionEnum[directionName];
        this.directionFuncs[directionCode] = function () {
            if (me.shouldIgnoreDirection(directionCode))
                return;
            me.directionQueue.push(directionCode);
            me.previousDirection = directionCode;
        };
    }
}

Worm.prototype.shouldIgnoreDirection = function (dirCode) {
    if (dirCode === this.previousDirection)
        return true;
    if (this.isMulticellular && dirCode === oppositeDirectionEnum[this.previousDirection]) // No backwards moving
        return true;
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

Worm.prototype.getDirectionFromOutput = function (tensor) {
    let array = tensor.arraySync()[0];
    let indexOfMax = array.getIndexOfMax();
    return indexOfMax + 1;  // because directions start from 1
}

Worm.prototype.getInputVector = function () {
    return this.game.grid.cells.flat().map(this.getCellValue);
}

Worm.prototype.getCellValue = function (cell) {
    if (cell.isFood)
        return 0;
    if (cell.isBlank)
        return 1;
    if (cell.isDeadly)
        return 2;
}

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } },
    isMulticellular: { get: function () { return this.length !== 1 } },
});
