znakeConfig = {
    devMode: false,
    fastStepTime: 1,  // milliseconds
    slowStepTime: 100,  // milliseconds
    startAtCentre: true,
    worm: {
        targetLength: 30,
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
        population: 32,
        reproducingPopulation: 16, // Half of the population
        activation: NeuronActivation.linear,
        kernelInit: NeuronInitialiser.leCunNormal,
        useBias: true,
        mutateBias: true,
        biasInit: NeuronInitialiser.zeros,
        mutationNoiseLevel: 0.04,  //Standard deviation of the normal noise
    }
}

//Todo: Refactor all classes to ES6 notation
//Todo: Add stat collection of convergence