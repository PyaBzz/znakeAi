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
}

Ai.prototype.populateNextGeneration = function () {
    let winners = this.getTheBest();
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

Ai.prototype.currentModelDied = function (worm) {
    this.currentModel.age = worm.age;
    this.totalAge += worm.age;
    this.currentModel.wormLength = worm.length;
    this.totalScore += worm.length;
}

Ai.prototype.getTheBest = function () {
    return this.generation.getTop(m => m.age + m.wormLength * this.game.config.worm.maxAge / 2, this.reproducingPopulation).items;
}

Object.defineProperties(Ai.prototype, {
    averageAge: { get: function () { return this.totalAge / this.totalModels } },
    averageScore: { get: function () { return this.totalScore / this.totalModels } },
});
