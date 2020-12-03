Ai = function (game) {
    this.game = game;
    this.generation = [];
    this.generationNumber = 1;
    this.population = this.game.config.ai.population;
    this.reproducingPopulation = this.game.config.ai.reproducingPopulation;
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    this.modelService = new ModelService(game);
    this.game.infoboard.set(infoboardKeysEnum.Generation, this.generationNumber);
    this.initialise();
}

Ai.prototype.initialise = function () {
    for (let i = 0; i < this.population; i++)
        this.generation.push(this.modelService.createModel());
    this.currentModelIndex = 0;
    this.currentModel = this.generation[0];
}

Ai.prototype.getNextModel = function () {
    this.currentModelIndex++;
    if (this.currentModelIndex < this.population) {
        this.currentModel = this.generation[this.currentModelIndex];
        return this.currentModel;
    }
    else {
        this.populateNextGeneration();
        return this.currentModel;
    }
}

Ai.prototype.currentModelDied = function (worm) {
    this.currentModel.wormLength = worm.length;
    this.currentModel.age = worm.age;
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
    this.currentModelIndex = 0;
    this.currentModel = this.generation[0];
    this.generationNumber++;
    this.game.infoboard.set(infoboardKeysEnum.Generation, this.generationNumber);
}

Ai.prototype.getTheBest = function () {
    return this.generation.getTop(m => m.age + m.wormLength * this.game.config.worm.maxAge / 2, this.reproducingPopulation).items;
}
