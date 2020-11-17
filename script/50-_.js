Ai = function (game) {
    this.game = game;
    this.runLoopId = 0;
    this.generation = [];
    this.fertileCount = 4;
    this.neurons = 6;
    this.generationCount = this.game.config.ai.generationCount;
    this.inputVectorSize = this.game.grid.width * this.game.grid.height;

    this.initialise();
    // let inputMatrix = this.getInputMatrix();
    // this.visualise(inputMatrix);
}

Ai.prototype.initialise = function () {
    for (let i = 0; i < this.generationCount; i++)
        this.generation.push(this.createModel());
    this.currentModelIndex = 0;
    this.currentModel = this.generation[0];
}

Ai.prototype.generationFinished = function () {
    this.populateNextGeneration();
    this.game.restart();
}

Ai.prototype.populateNextGeneration = function () {
    let winners = this.getWinners();
    const crossover1 = this.crossOver(winners[0], winners[1]);
    const crossover2 = this.crossOver(winners[2], winners[3]);
    // const mutatedWinners = this.mutateBias(winners);
    const mutatedWinners = [this.createModel(), this.createModel()];
    this.generation = [crossover1, ...winners, crossover2, ...mutatedWinners];
    this.currentModelIndex = 0;
    log("Next gen: " + this.generation.length);
    this.currentModel = this.generation[0];
}

Ai.prototype.getWinners = function () {
    return this.generation.getWithHighest(m => m.score, this.fertileCount);
}

Ai.prototype.crossOver = function (a, b) {
    const biasA = a.layers[0].bias.read();
    const biasB = b.layers[0].bias.read();
    return this.setBias(a, this.exchangeBias(biasA, biasB));
}

Ai.prototype.setBias = function (model, bias) {
    model.layers[0].bias.write(bias);
    return model;
}

Ai.prototype.exchangeBias = function (tensorA, tensorB) {
    const size = Math.ceil(tensorA.size / 2);
    return tf.tidy(() => {
        const a = tensorA.slice([0], [size]);
        const b = tensorB.slice([size], [size]);
        return a.concat(b);
    });
}

// Ai.prototype.mutateBias = function (models) {
//     let me = this;
//     let rand = new Random();
//     return models.map(item => {
//         let model = tf.sequential();
//         model.add(tf.layers.dense({
//             units: 90,
//             inputShape: [this.inputVectorSize],
//             activation: 'sigmoid',
//             kernelInitializer: 'leCunNormal',
//             useBias: true,
//             biasInitializer: tf.initializers.constant({ value: rand.getInRange(-2, 2), }),
//         }));
//         model.add(tf.layers.dense({ units: 20 }));
//         model.add(tf.layers.dense({ units: 4 }));

//         return model;
//     });
// }

Ai.prototype.createModel = function () {
    let model = tf.sequential();
    model.add(tf.layers.dense({ units: 90, inputShape: [this.inputVectorSize] }));  //Todo: Make units a function of the grid size
    model.add(tf.layers.dense({ units: 20 }));
    model.add(tf.layers.dense({ units: 4 }));
    // const optimiser = tf.train.sgd(0.1);
    // this.currentModel.compile({ loss: "meanSquaredError", optimizer: optimiser });
    return model;
}

Ai.prototype.pickNextModel = function (score) {
    this.currentModel.score = score;
    this.currentModelIndex++;
    if (this.currentModelIndex < this.generationCount) {
        this.currentModel = this.generation[this.currentModelIndex];
        return true;
    }
    else return false;
}

Ai.prototype.getNextDirection = function () {
    // let myRandom = new Random();
    // return myRandom.pickElement(Object.values(directionEnum));
    let me = this;
    let inputVector = this.getInputVector();
    let modelOutput = tf.tidy(() => {
        let inputTensor = tf.tensor(inputVector, [1, me.inputVectorSize]);
        return me.currentModel.predict(inputTensor, args = { batchSize: 1 });
    });
    let direction = this.getDirectionFromOutput(modelOutput);
    return direction;
}

Ai.prototype.getDirectionFromOutput = function (tensor) {
    // tensor.print();
    let array = tensor.arraySync()[0];
    let indexOfMax = array.getIndexOfMax();
    return indexOfMax + 1;  // because directions start from 1
}

Ai.prototype.getInputMatrix = function () {
    let gridCells = this.game.grid.cells;
    let values = [];
    for (let row of gridCells)
        values.push(row.map(this.getCellValue));
    return values;
}

Ai.prototype.getInputVector = function () {
    return this.game.grid.cells.flat().map(this.getCellValue);
}

Ai.prototype.getCellValue = function (cell) {
    if (cell.isFood)
        return 0;
    if (cell.isBlank)
        return 1;
    if (cell.isDeadly)
        return 2;
}

Ai.prototype.visualise = function (matrix) {
    tfvis.visor();
    const inputObj = { values: matrix };
    const surface = { name: "dasoo name", tab: "dasoo tab" }
    tfvis.render.heatmap(surface, inputObj);
}
