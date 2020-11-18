// So I’m going to create this structure:
example.prototype.makeModel = function () {
    const NEURONS = 6;
    const hiddenLayer = tf.layers.dense({
        units: NEURONS,
        inputShape: [2],
        activation: 'sigmoid',
        kernelInitializer: 'leCunNormal',
        useBias: true,
        biasInitializer: 'randomNormal',
    });
    const outputLayer = tf.layers.dense({ units: 1, });
}

// The logic to tell if the bird should flap or not:
// if (output > 0.5) { bird.flap(); }
// So the output will be somewhere between 0 and 1
// Sounds like our activation function is the wellknown sigmoid
// I chose the kernel initialiser and bias initialiser by trying and checking the ones that would leave my output somewhere around 0.5.
// Now we have our model and we can start creating our population of birds using the genetic algorithm.

example.prototype.evolvePopulation = function () {
    const Winners = this.selection();
    const crossover1 = this.crossOver(Winners[0], Winners[1]);
    const crossover2 = this.crossOver(Winners[2], Winners[3]);
    const mutatedWinners = this.mutateBias(Winners);
    this.Population = [crossover1, ...Winners, crossover2, ...mutatedWinners];
}
// As you can see, the new population is consistent of 4 previous winners, 2 crossovers and 4 mutated winners.To create a crossover, we're using the following function:[code]

example.prototype.crossOver = function (a, b) {
    const biasA = a.layers[0].bias.read(); // This will return a tensor containing the biases values for the layer.
    const biasB = b.layers[0].bias.read();
    return this.setBias(a, this.exchangeBias(biasA, biasB));
}

//Remember tidy? We’re operating over the tensors we got in the crossover function.
example.prototype.exchangeBias = function (tensorA, tensorB) {
    const size = Math.ceil(tensorA.size / 2);
    return tf.tidy(() => {
        const a = tensorA.slice([0], [size]);
        const b = tensorB.slice([size], [size]);
        return a.concat(b);
    });
}
// Because I don’t want to change the original bias, I’m copying it.
// Note that TensforFlow.js’ objects are immutable, so the function write will return a new tensor, rather than setting it.

example.prototype.setBias = function (model, bias) {
    const newModel = Object.assign({}, model);
    newModel.layers[0].bias = newModel.layers[0].bias.write(bias);
    return newModel;
}
// I want to create mutated individuals, so my mutate function will return a new model with a random bias:
example.prototype.mutateBias = function (population) {
    return population.map(bird => {
        const hiddenLayer = tf.layers.dense({
            units: NEURONS,
            inputShape: [2],
            activation: 'sigmoid',
            kernelInitializer: 'leCunNormal',
            useBias: true,
            biasInitializer: tf.initializers.constant({ value: this.random(-2, 2), }),
        });
        return this.createModel(bird.index, hiddenLayer);
    });
}


// Influenced by the first examples I found in the tutorials, I decided to train the model, but without really thinking about it.
// In order to test a model we have to use fit API:
// Note that training a model is an asynchronous process, so we're using async/wait in our example.
trainPopulation = function (population) {
    return population.map(async model =>
        await model.fit(tf.tensor2d(model.history), tf.tensor1d(model.outputHistory), { shuffle: true, })
    );
}

// Predicting the result from a model is not an async operation, but getting the output value is.
tf.tidy(() => {
    const outputs = this.Population[bird.index].predict(tf.tensor2d([inputs]));
    outputs.data().then(output => {
        if (output > 0.5)
            bird.flap();
    });
});
// So which data are we training? You see we’re using model.history as our first parameter and model.outputHistory as our second parameter.
// I decided to collect the inputs and outputs from the model and see if we could speed up the population evolution, but I wasn't sure if that would help.
// What I noticed right away is how slow it is to train a model. And well, it’s not an easy task.
// But what about evolving the population faster? No, training the model didn’t help.
// Training the model will usually require us to have correct input data and the desired output, so we teach the model how to behave when we get such inputs,
// but our problem in particular is about to find the best way and just evolve the population with that knowledge.
// As we haven’t had the proper inputs and outputs beforehand, therefore training the model didn’t help.
