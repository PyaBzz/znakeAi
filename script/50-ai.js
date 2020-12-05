Ai = function (game) {
    this.game = game;
    this.population = this.game.config.ai.population;
    this.reproducingPopulation = this.game.config.ai.reproducingPopulation;
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    this.modelService = new ModelService(game);
    this.populateFirstGeneration();
    this.totalModels = 0;
    this.totalAge = 0;
    this.totalScore = 0;
}

Ai.prototype.getNextModel = function () {
    if (this.nextModelIndex === this.population)
        this.populateNextGeneration();

    this.currentModel = this.generation[this.nextModelIndex];
    this.totalModels++;
    this.nextModelIndex++;
    this.game.onNewModel();
    return this.currentModel;
}

Ai.prototype.populateFirstGeneration = function () {
    this.generation = [];
    for (let i = 0; i < this.population; i++)
        this.generation.push(this.modelService.createModel());
    this.generationNumber = 1;
    this.nextModelIndex = 0;
    this.resetGenerationStats();
}

Ai.prototype.populateNextGeneration = function () {
    this.game.onGenerationDone(this.genMinAge, this.genMaxAge, this.genMinLen, this.genMaxLen);
    let winners = this.getFittest();
    winners.shuffle();
    let offspring = this.modelService.getOffsprings(winners);
    winners.shuffle();
    let mutatingWinners = winners.clone(0, offspring.length); //This is 1/4 of the population
    let mutatedWinners = mutatingWinners.map(m => this.modelService.mutate(m))
    this.generation = [...offspring, ...winners, ...mutatedWinners];
    // for (i = this.generation.length; i < this.population; i++)
    //     this.generation[i] = this.modelService.createModel();
    this.generationNumber++;
    this.nextModelIndex = 0;
    this.game.onNewGeneration();
}

Ai.prototype.getFittest = function () {
    let me = this;
    return this.generation.getTop(m => me.fitnessFunc(m), me.reproducingPopulation).items;
}

Ai.prototype.fitnessFunc = function (model) {
    return model.wormAge + model.wormLength * this.game.config.worm.maxAge / 2;
}

Ai.prototype.onWormDied = function (worm) {
    this.currentModel.wormAge = worm.age;
    this.totalAge += worm.age;
    this.currentModel.wormLength = worm.length;
    this.totalScore += worm.length;
    if (worm.age < this.genMinAge) this.genMinAge = worm.age;
    if (worm.age > this.genMaxAge) this.genMaxAge = worm.age;
    if (worm.length < this.genMinLen) this.genMinLen = worm.length;
    if (worm.length > this.genMaxLen) this.genMaxLen = worm.length;
}

Ai.prototype.resetGenerationStats = function () {
    this.genMinAge = this.game.config.worm.maxAge;
    this.genMaxAge = 0;
    this.genMinLen = this.game.config.worm.targetLength;
    this.genMaxLen = 0;
}

Object.defineProperties(Ai.prototype, {
    averageAge: { get: function () { return this.totalAge / this.totalModels } },
    averageScore: { get: function () { return this.totalScore / this.totalModels } },
});
