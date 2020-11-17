ModelFactory = function (game) {
    this.game = game;
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;
    this.inputLayerSize = Math.floor(this.inputVectorSize / this.game.config.ai.layerToInputRatio);
}

ModelFactory.prototype.initialise = function () {
}

ModelFactory.prototype.createModel = function () {
    let model = tf.sequential();
    model.add(tf.layers.dense({ units: this.inputLayerSize, inputShape: [this.inputVectorSize] }));  //Todo: Make units a function of the grid size
    model.add(tf.layers.dense({ units: 4 }));
    // const optimiser = tf.train.sgd(0.1);
    // this.currentModel.compile({ loss: "meanSquaredError", optimizer: optimiser });
    return model;
}
