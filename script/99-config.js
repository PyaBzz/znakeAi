znakeConfig = {
    devMode: true,
    gridHeight: 8,  // cells >= 4
    gridWidth: 8,  // cells >= 4
    movingTimeStep: 80,  // milliseconds
    numberOfFoodCellsAtOnce: 1,
    startAtCentre: true,
    keys: {
        up: 'E',
        right: 'F',
        down: 'D',
        left: 'S',
        pause: ' ',
    },
    soundVolume: 0.15,  // [0~1]
    ai: {
        lifeCount: 1,
        generationCount: 8,
    }
}


//Todo: Experiment with model save, load, etc.
//Todo: Experiment with model history, crossover, genetic algorithm, etc.
//Todo: Use the tidy() function for model operations
//Todo: After implementing genetic algorithm, considre adding other criterial like life time of the worm
