"use strict";

var Config = deepFreeze({
	devMode: false,
	grid: {
		height: 11,  // Greater than 4
		width: 11,  // Greater than 4
	},
	keyboard: {
		pause: ' ',
	},
	evolution: {
		rounds: 2,
		target: {
			length: 30,
			averageLen: 4,
			generationCount: 3,
			lifeSpan: 100,
		},
	},
	generation: {
		population: 32,  // Only even numbers
	},
	worm: {
		startAtCentre: true,
		stepTime: {
			fast: 1,  // milliseconds
			slow: 100,  // milliseconds
		},
	},
	neuralNet: {
		inputSize: 10,
		layerSizes: [4],  // Only even numbers
		activation: NeuronActivation.linear,
		kernelInit: NeuronInitialiser.leCunNormal,
		useBias: false,
		biasInit: NeuronInitialiser.zeros,
		mutationDiversity: 0.1,  //Standard deviation of the normal noise
		downloadPath: 'downloads://znakeAi-model',
	},
});

onload = function () {
	var game = new Game(Config);
}
