Ai = function (game) {
    this.game = game;
    this.population = this.game.config.ai.population;
    this.reproducingPopulation = this.game.config.ai.reproducingPopulation;
    this.inputVectorSize = 2;
    this.modelService = new ModelService(game, this.inputVectorSize);
    this.populateFirstGeneration();
    this.totalModels = 0;
    this.totalAge = 0;
    this.totalLen = 0;
    this.bindEvents();
}

Ai.prototype.bindEvents = function () {
    this.jsonUpload = document.getElementById('json-upload');
    this.binUpload = document.getElementById('bin-upload');
    this.jsonUpload.onchange = function () { log("JSON file uploaded"); }
    this.binUpload.onchange = function () { log("BIN file uploaded"); }
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
    this.resetGenerationStats();
}

Ai.prototype.getFittest = function () {
    let me = this;
    return this.generation.getTop(m => me.fitnessFunc(m), me.reproducingPopulation).items;
}

Ai.prototype.fitnessFunc = function (model) {
    return model.wormAge / this.game.config.worm.maxAge + model.wormLength;
}

Ai.prototype.onWormDied = function (worm) {
    this.currentModel.wormAge = worm.age;
    this.totalAge += worm.age;
    this.currentModel.wormLength = worm.length;
    this.totalLen += worm.length;
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
    AverageLen: { get: function () { return this.totalLen / this.totalModels } },
});
