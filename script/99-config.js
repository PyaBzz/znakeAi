znakeConfig = {
    devMode: true,
    gridHeight: 8,  // cells >= 4
    gridWidth: 8,  // cells >= 4
    wormStepTime: 80,  // milliseconds
    numberOfFoodCellsAtOnce: 3,
    startAtCentre: true,
    keys: {
        pause: ' ',
    },
    soundVolume: 0.15,  // [0~1]
    ai: {
        layerToInputRatio: 4,
        maxWormAge: 20,
        population: 20,
        reproducingPopulation: 10,
    }
}


//Todo: Experiment with model save, load, etc.
//Todo: Experiment with model history, crossover, genetic algorithm, etc.
//Todo: Use the tidy() function for model operations
//Todo: After implementing genetic algorithm, considre adding other criterial like life time of the worm
