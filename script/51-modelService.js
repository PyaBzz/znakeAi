ModelService = function (game) {
    this.game = game;
    this.layerSizes = game.config.ai.layerSizes;
    this.inputVectorSize = game.grid.width * game.grid.height;
}

ModelService.prototype.initialise = function () {
}

ModelService.prototype.createModel = function () {
    let model = tf.sequential();

    for (let layerSize of this.layerSizes) {
        if (model.layers.length === 0)
            model.add(tf.layers.dense({
                units: layerSize,
                inputShape: [this.inputVectorSize],
                activation: 'sigmoid',
                kernelInitializer: 'leCunNormal',
                useBias: true,
            }));
        else
            model.add(tf.layers.dense({
                units: layerSize,
                activation: 'sigmoid',
                kernelInitializer: 'leCunNormal',
                useBias: true,
            }));
    }
    // const optimiser = tf.train.sgd(0.1);
    // this.currentModel.compile({ loss: "meanSquaredError", optimizer: optimiser });
    return model;
}

ModelService.prototype.getOffsprings = function (parentWorms) {
    let children = []
    let numberOfMatings = Math.floor(parentWorms.length / 2);
    for (i = 0; i < numberOfMatings; i++) {
        let mother = parentWorms[2 * i];
        let father = parentWorms[2 * i + 1];
        children.push(this.mate(mother, father));
    }
    // if (children.length % 2)
    //     children.push(parentWorms.last);
    return children;
}

ModelService.prototype.mate = function (mother, father) {
    let offspring = this.clone(mother);
    for (let i = 0; i < this.layerSizes.length; i++) {
        const biasesA = offspring.layers[i].bias.read();
        const biasesB = father.layers[i].bias.read();
        const mixedBiases = this.getMixture(biasesA, biasesB);
        offspring.layers[i].bias.write(mixedBiases);
    }
    return offspring;
}

ModelService.prototype.getMixture = function (tensorA, tensorB) {
    const firstHalfSize = Math.ceil(tensorA.size / 2);
    const secondHalfSize = tensorA.size - firstHalfSize;
    return tf.tidy(() => {
        const a = tensorA.slice([0], [firstHalfSize]);
        const b = tensorB.slice([firstHalfSize], [secondHalfSize]);
        return a.concat(b);
    });
}

ModelService.prototype.clone = function (sourceModel) {
    //Todo: Should we tidy() here?
    let clone = this.createModel();
    for (let i = 0; i < sourceModel.layers.length; i++) {
        const sourceLayer = sourceModel.layers[i];
        const biases = sourceLayer.bias.read();
        const weights = sourceLayer.getWeights();
        const targetLayer = clone.layers[i];
        targetLayer.bias.write(biases);
        targetLayer.setWeights(weights);
    }
    return clone;
}

// ModelService.prototype.mutateBias = function (models) {  // Is this of any use?
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
