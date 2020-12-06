znakeConfig = {
    devMode: false,
    stepTime: 1,  // milliseconds
    startAtCentre: true,
    worm: {
        maxAge: 60,
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
        population: 20,
        reproducingPopulation: 30, // Half of the population
        activation: activationEnum.relu,
        kernelInit: initialiserEnum.leCunNormal,
        useBias: true,
        biasInit: initialiserEnum.randomNormal,
        mutationNoiseLevel: 0.01,  //Standard deviation of the normal noise
    }
}

infoboardKeysEnum = Object.freeze({
    Length: "Length",
    Age: "Age",
    WormNo: "Worm No",
    Generation: "Generation",
    TotalWorms: "Total Worms",
    AverageAge: "Average Age",
    AverageLen: "Average Length",
    genMinAge: "Gen. Min Age",
    genMaxAge: "Gen. Max Age",
    genMinLen: "Gen. Min Length",
    genMaxLen: "Gen. Max Length",
    ancestor: "Use Ancestor",
});

//Todo: Reduce output paths to 3 for "Forward", "Left", "Right" but then lifetime is an invalid score for worms that steer circularly all the time!
