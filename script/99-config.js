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
        height: 6,  // Only even numbers greater than 4
        width: 6,  // Only even numbers greater than 4
    },
    keys: {
        pause: ' ',
    },
    ai: {
        layerSizes: [100, 60, 4],  // Only even numbers
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
    AverageScore: "Average Score",
    genMinAge: "Gen. Min Age",
    genMaxAge: "Gen. Max Age",
    genMinScore: "Gen. Min Score",
    genMaxScore: "Gen. Max Score",
});

//Todo: Add minAge, maxAge, minScore and maxScore to a new infoboard because average values converge very slowly
//Todo: Change cell values to reflect their distance to the food cell!
//Todo: Add download of generation stats to the UI
//Todo: Reduce output paths to 3 for "Forward", "Left", "Right" but then lifetime is an invalid score for worms that steer circularly all the time!
//Todo: Experiment with model save, load, etc.
//Todo: Experiment with model history, crossover, genetic algorithm, etc.
//Todo: Use the tidy() function for model operations
//Todo: After implementing genetic algorithm, considre adding other criterial like life time of the worm
