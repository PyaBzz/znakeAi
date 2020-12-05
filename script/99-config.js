znakeConfig = {
    devMode: true,
    stepTime: 1,  // milliseconds
    startAtCentre: true,
    numberOfFoodCellsAtOnce: 1,
    worm: {
        maxAge: 40,
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
        layerSizes: [20, 20, 4],  // Only even numbers
        population: 60,
        reproducingPopulation: 30, // Half of the population
        activation: activationEnum.relu,
        kernelInit: initialiserEnum.leCunNormal,
        useBias: true,
        biasInit: initialiserEnum.randomNormal,
    }
}

infoboardKeysEnum = Object.freeze({
    Score: "Score",
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
});

//Todo: Add download of generation stats to the UI
//Todo: Reduce output paths to 3 for "Forward", "Left", "Right" but then lifetime is an invalid score for worms that steer circularly all the time!
//Todo: Experiment with model save, load, etc.
//Todo: Experiment with model history, crossover, genetic algorithm, etc.
//Todo: Use the tidy() function for model operations
//Todo: After implementing genetic algorithm, considre adding other criterial like life time of the worm
