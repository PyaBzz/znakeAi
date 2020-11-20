znakeConfig = {
    devMode: true,
    gridHeight: 14,  // cells >= 4
    gridWidth: 14,  // cells >= 4
    wormStepTime: 40,  // milliseconds
    numberOfFoodCellsAtOnce: 10,
    startAtCentre: true,
    keys: {
        pause: ' ',
    },
    ai: {
        layerToInputRatio: 4,
        maxWormAge: 40,
        population: 40,
        reproducingPopulation: 20,
    }
}


//Todo: Experiment with model save, load, etc.
//Todo: Experiment with model history, crossover, genetic algorithm, etc.
//Todo: Use the tidy() function for model operations
//Todo: After implementing genetic algorithm, considre adding other criterial like life time of the worm
