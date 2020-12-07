znakeConfig = {
    devMode: false,
    stepTime: 1,  // milliseconds
    startAtCentre: true,
    worm: {
        maxAge: 60,  //Todo: Instead of this, allow a number of steps between eatings equal to the total explorable area of the grid then lifetime becomes a good score!
        targetLength: 6,
    },
    grid: {
        height: 16,  // Only even numbers greater than 4
        width: 16,  // Only even numbers greater than 4
    },
    keys: {
        pause: ' ',
    },
    ai: {
        layerSizes: [4],  // Only even numbers
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

//Todo: Add option to disable display
