Ai = function (game) {
    this.game = game;
    this.runLoopId = 0;
    this.generation = [];
    this.generationNumber = 1;
    this.population = this.game.config.ai.population;
    this.reproducingPopulation = this.game.config.ai.reproducingPopulation;
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    this.modelService = new ModelService(game);
    this.game.infoboard.updateGeneration(this.generationNumber);
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

Ai.prototype.currentModelDied = function (length, age) {
    this.currentModel.wormLength = length;
    this.currentModel.age = age;
}

Ai.prototype.populateNextGeneration = function () {
    let winners = this.getTheBest();
    let offspring = this.modelService.getCrossovers(winners);
    // const mutatedWinners = this.mutateBias(winners);  //Todo: Use these in the generation
    const mutatedWinners = [this.modelService.createModel(), this.modelService.createModel()];
    this.generation = [...offspring, ...winners, ...mutatedWinners];
    this.currentModelIndex = 0;
    this.currentModel = this.generation[0];
    this.generationNumber++;
    this.game.infoboard.updateGeneration(this.generationNumber);
}

Ai.prototype.getTheBest = function () {
    return this.generation.getWithHighest(m => m.wormLength * 20 + m.age, this.reproducingPopulation);
}

// Ai.prototype.mutateBias = function (models) {
//     let me = this;
//     let rand = new Random();
//     return models.map(item => {
//         let model = tf.sequential();
//         model.add(tf.layers.dense({
//             units: this.inputLayerSize,
//             inputShape: [this.inputVectorSize],
//             activation: 'sigmoid',
//             kernelInitializer: 'leCunNormal',
//             useBias: true,
//             biasInitializer: tf.initializers.constant({ value: rand.getInRange(-2, 2), }),
//         }));
//         model.add(tf.layers.dense({ units: 4 }));

//         return model;
//     });
// }
