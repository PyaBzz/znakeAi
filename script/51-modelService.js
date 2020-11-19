ModelService = function (game) {
    this.game = game;
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    this.inputLayerSize = Math.floor(this.inputVectorSize / this.game.config.ai.layerToInputRatio);
}

ModelService.prototype.initialise = function () {
}

ModelService.prototype.createModel = function () {
    let model = tf.sequential();
    model.add(tf.layers.dense({ units: this.inputLayerSize, inputShape: [this.inputVectorSize] }));
    model.add(tf.layers.dense({ units: 4 }));
    // const optimiser = tf.train.sgd(0.1);
    // this.currentModel.compile({ loss: "meanSquaredError", optimizer: optimiser });
    return model;
}

ModelService.prototype.getCrossovers = function (parentWorms) {
    let children = []
    let numberOfMatings = Math.floor(parentWorms.length / 2);
    for (i = 0; i < numberOfMatings; i++) {
        let mother = parentWorms[2 * i];
        let father = parentWorms[2 * i + 1];
        children.push(this.crossOver(mother, father));
    }
    // if (children.length % 2)
    //     children.push(parentWorms.last);
    return children;
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
