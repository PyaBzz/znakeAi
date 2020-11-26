znakeConfig = {
    devMode: true,
    stepTime: 20,  // milliseconds
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
        kernelInit: kernelInitEnum.randomNormal,
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
