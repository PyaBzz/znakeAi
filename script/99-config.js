znakeConfig = {
    devMode: false,
    fastStepTime: 1,  // milliseconds
    slowStepTime: 100,  // milliseconds
    startAtCentre: true,
    worm: {
        targetLength: 30, //Todo: Add other target criteria like generation number, average length, etc.
    },
    grid: {
        height: 10,  // Only even numbers greater than 4
        width: 10,  // Only even numbers greater than 4
    },
    keys: {
        pause: ' ',
    },
    ai: {
        layerSizes: [4],  // Only even numbers
        inputVectorSize: 6,
        population: 32,
        reproducingPopulation: 16, // Half of the population
        activation: NeuronActivation.linear,
        kernelInit: NeuronInitialiser.leCunNormal,
        useBias: false,
        mutateBias: true,
        biasInit: NeuronInitialiser.zeros,
        mutationDiversity: 0.1,  //Standard deviation of the normal noise
    }
}

//Todo: Refactor all classes to ES6 notation
//Todo: Add stat collection of convergence
//Todo: Start food dropping in the middle then gradually distribute around
