znakeConfig = {
    devMode: true,
    stepTime: 20,  // milliseconds
    startAtCentre: true,
    numberOfFoodCellsAtOnce: 10,
    worm: {
        maxAge: 40,
        targetLength: 6,
    },
    grid: {
        height: 20,  // cells >= 4
        width: 20,  // cells >= 4
    },
    keys: {
        pause: ' ',
    },
    ai: {
        layerSizes: [100, 60, 4],  // Only even numbers
        population: 40,
        reproducingPopulation: 20, // Half of the population
    }
}

//Todo: Lifetime is an invalid score for worms that steer circularly all the time!
//Todo: Check if both weights and biases are mutated
//Todo: Make sure bias and activation are the ones used in flappy bird
//Todo: Reduce output paths to 3 for "Forward", "Left", "Right"
//Todo: Experiment with model save, load, etc.
//Todo: Experiment with model history, crossover, genetic algorithm, etc.
//Todo: Use the tidy() function for model operations
//Todo: After implementing genetic algorithm, considre adding other criterial like life time of the worm
