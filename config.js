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
		rounds: 1,
		target: {
			averageLen: 1.1,
		},
	},
	generation: {
		population: 32,  // Only even numbers
		target: {
			rounds: 130,
		},
	},
	worm: {
		startAtCentre: true,
		stepTime: {
			fast: 1,  // milliseconds
			slow: 100,  // milliseconds
		},
		target: {
			length: 30,
			lifeSpan: 100,
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
