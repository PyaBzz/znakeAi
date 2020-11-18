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

Object.defineProperties(Worm.prototype, {
    head: { get: function () { return this.sections[0] } },
    tail: { get: function () { return this.sections.last } },
    length: { get: function () { return this.sections.length } },
    isUnicellular: { get: function () { return this.length === 1 } },
    isMulticellular: { get: function () { return this.length !== 1 } },
});
