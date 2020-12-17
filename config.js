Config = Object.freeze({
	devMode: false,
	stepTime: {
		fast: 1,  // milliseconds
		slow: 100,  // milliseconds
	},
	startAtCentre: true,
	worm: {
		targetLength: 30, //Todo: Add other target criteria like generation number, average length, etc.
	},
	grid: {
		height: 11,  // Greater than 4
		width: 11,  // Greater than 4
	},
	keys: {
		pause: ' ',
	},
	ai: {
		layerSizes: [4],  // Only even numbers
		inputVectorSize: 10,
		population: 32,  // Only even numbers
		activation: NeuronActivation.linear,
		kernelInit: NeuronInitialiser.leCunNormal,
		useBias: false,
		biasInit: NeuronInitialiser.zeros,
		mutationDiversity: 0.1,  //Standard deviation of the normal noise
		downloadPath: 'downloads://znakeAi-model',
	}
});

onload = function () {
	game = new Game(Config);
}
