Ai = function (game) {
    this.game = game;
    this.population = this.game.config.ai.population;
    this.reproducingPopulation = this.game.config.ai.reproducingPopulation;
    this.inputVectorSize = 2;
    this.modelService = new ModelService(game, this.inputVectorSize);
    this.totalModels = 0;
    this.totalAge = 0;
    this.totalLen = 0;
    this.bindEvents();
    this.needsFirstPopulation = true;
}

Ai.prototype.bindEvents = function () {
    this.jsonUpload = document.getElementById('json-upload');
    this.binUpload = document.getElementById('bin-upload');
    let me = this;
    this.jsonUpload.onchange = function () { };
    this.binUpload.onchange = function () { };
    this.loadButton = document.getElementById('load-button');
    this.loadButton.onclick = function () { me.loadModel() };
}

Ai.prototype.loadModel = async function () {
    if (this.jsonUpload.files.length === 0) {
        alert("Please select a JSON file to describe the model");
        return;
    }
    if (this.binUpload.files.length === 0) {
        alert("Please select a binary file for model weights");
        return;
    }

    tf.loadLayersModel(
        tf.io.browserFiles([
            this.jsonUpload.files[0],
            this.binUpload.files[0]
        ])
    ).then(function (result) {
        this.ancestorModel = result;
        this.game.onAncestorLoad(true);
    }).catch(err => this.game.onAncestorLoad(false))
}

Ai.prototype.getNextModel = function () {
    if (this.needsFirstPopulation)
        this.populateFirstGeneration();

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
    if (isDefined(this.ancestorModel)) {
        for (let i = 0; i < this.population; i++)
            this.generation.push(this.modelService.clone(this.ancestorModel));
    } else {
        for (let i = 0; i < this.population; i++)
            this.generation.push(this.modelService.createModel());
    }

    this.generationNumber = 1;
    this.nextModelIndex = 0;
    this.resetGenerationStats();
    this.needsFirstPopulation = false;
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
