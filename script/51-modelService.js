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
    model.add(tf.layers.dense({ units: Math.floor(this.inputLayerSize / this.game.config.ai.layerToInputRatio) }));
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
    const firstHalfSize = Math.ceil(tensorA.size / 2);
    const secondHalfSize = tensorA.size - firstHalfSize;
    return tf.tidy(() => {
        const a = tensorA.slice([0], [firstHalfSize]);
        const b = tensorB.slice([firstHalfSize], [secondHalfSize]);
        return a.concat(b);
    });
}

// ModelService.prototype.mutateBias = function (models) {  //Todo: Is this of any use?
//     let me = this;
//     let rand = new Random();
//     return models.map(item => {
//         let model = tf.sequential();
//         model.add(tf.layers.dense({
//             units: me.inputLayerSize,
//             inputShape: [me.inputVectorSize],
//             activation: 'sigmoid',
//             kernelInitializer: 'leCunNormal',
//             useBias: true,
//             biasInitializer: tf.initializers.constant({ value: rand.getInRange(-2, 2), }),
//         }));
//         model.add(tf.layers.dense({ units: 4 }));

//         return model;
//     });
// }
