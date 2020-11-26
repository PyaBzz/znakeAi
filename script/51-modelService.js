ModelService = function (game) {
    this.game = game;
    this.layerSizes = game.config.ai.layerSizes;
    this.activation = game.config.ai.activation;
    this.kernelInit = game.config.ai.kernelInit;
    this.useBias = game.config.ai.useBias;
    this.biasInit = game.config.ai.biasInit;
    this.inputVectorSize = game.grid.width * game.grid.height;

    // let test = tf.ones([2, 2]);
    // let noised = this.addNoise(test);
    // test.print();
    // noised.print();
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
                activation: this.activation,
                kernelInitializer: this.kernelInit,
                useBias: this.useBias,
                biasInitializer: this.biasInit,
            }));
        else
            model.add(tf.layers.dense({
                units: layerSize,
                activation: this.activation,
                kernelInitializer: this.kernelInit,
                useBias: this.useBias,
                biasInitializer: this.biasInit,
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
    //Todo: Should we tidy() here?
    let offspring = this.clone(mother);
    for (let i = 0; i < mother.layers.length; i++) {
        const motherLayer = mother.layers[i];
        const fatherLayer = father.layers[i];
        const childLayer = offspring.layers[i];

        const motherWeights = motherLayer.getWeights();
        const fatherWeights = fatherLayer.getWeights();

        const motherCoefficients = motherWeights[0];
        const fatherCoefficients = fatherWeights[0];

        const motherBiases = motherWeights[1];
        const fatherBiases = fatherWeights[1];

        const mixedCoefficients = this.mix(motherCoefficients, fatherCoefficients);
        const mixedBiases = this.mix(motherBiases, fatherBiases);
        childLayer.setWeights([mixedCoefficients, mixedBiases]);
    }
    return offspring;
}

ModelService.prototype.mix = function (tensorA, tensorB) {
    return tf.tidy(() => {
        const axis = 0;
        const [firstHalf, discardedA] = tf.split(tensorA, 2, axis);
        const [discardedB, secondHalf] = tf.split(tensorB, 2, axis);
        res = tf.concat([firstHalf, secondHalf], axis);
        return res;
    });
}

ModelService.prototype.mutate = function (model) {
    //Todo: Should we tidy() here?
    const mutant = this.clone(model);
    for (let i = 0; i < model.layers.length; i++) {
        const originalLayer = model.layers[i];
        const mutatedLayer = mutant.layers[i];

        const originalWeights = originalLayer.getWeights();
        const originalCoefficients = originalWeights[0];
        const originalBiases = originalWeights[1];

        const mutatedCoefficients = this.addNoise(originalCoefficients);
        const mutatedBiases = this.addNoise(originalBiases);

        mutatedLayer.setWeights([mutatedCoefficients, mutatedBiases]);
    }
    return mutant;
}

ModelService.prototype.clone = function (sourceModel) {
    //Todo: Should we tidy() here?
    let clone = this.createModel();
    for (let i = 0; i < sourceModel.layers.length; i++) {
        const sourceLayer = sourceModel.layers[i];
        const weights = sourceLayer.getWeights();
        const targetLayer = clone.layers[i];
        targetLayer.setWeights(weights);
    }
    return clone;
}

ModelService.prototype.addNoise = function (tensor) {
    const shape = tensor.shape;
    let noiseTensor = tf.truncatedNormal(shape, 0, 0.4);
    // noiseTensor.print();
    return tf.add(tensor, noiseTensor);
}
