ModelService = function (game) {
    this.game = game;
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    this.inputLayerSize = Math.floor(this.inputVectorSize / this.game.config.ai.layerToInputRatio);
}

ModelService.prototype.initialise = function () {
}

ModelService.prototype.createModel = function () {
    let model = tf.sequential();
    model.add(tf.layers.dense({ units: this.inputLayerSize, inputShape: [this.inputVectorSize] }));  //Todo: Make units a function of the grid size
    model.add(tf.layers.dense({ units: 4 }));
    // const optimiser = tf.train.sgd(0.1);
    // this.currentModel.compile({ loss: "meanSquaredError", optimizer: optimiser });
    return model;
}

ModelService.prototype.crossOver = function (modelA, modelB) {
    const biasA = modelA.layers[0].bias.read();
    const biasB = modelB.layers[0].bias.read();
    return this.setBias(modelA, this.exchangeBias(biasA, biasB));
}

ModelService.prototype.setBias = function (model, bias) {
    model.layers[0].bias.write(bias);
    return model;
}

ModelService.prototype.exchangeBias = function (tensorA, tensorB) {
    const size = Math.ceil(tensorA.size / 2);
    return tf.tidy(() => {
        const a = tensorA.slice([0], [size]);
        const b = tensorB.slice([size], [size]);
        return a.concat(b);
    });
}
