znakeConfig = {
    devMode: false,
    stepTime: 1,  // milliseconds
    startAtCentre: true,
    worm: {
        targetLength: 16,
    },
    grid: {
        height: 16,  // Only even numbers greater than 4
        width: 16,  // Only even numbers greater than 4
    },
    keys: {
        pause: ' ',
    },
    ai: {
        layerSizes: [8, 4],  // Only even numbers
        population: 64,
        reproducingPopulation: 32, // Half of the population
        activation: NeuronActivation.linear,
        kernelInit: NeuronInitialiser.leCunNormal,
        useBias: true,
        mutateBias: true,
        biasInit: NeuronInitialiser.zeros,
        mutationNoiseLevel: 0.01,  //Standard deviation of the normal noise
    }
}

//Todo: Add stat collection of convergence
