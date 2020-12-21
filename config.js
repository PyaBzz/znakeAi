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
	},
	generation: {
		rounds: 130,
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
		downloadPath: 'downloads://znakeBrain',
	},
	objective: {
		averageLen: 10,
		length: 24,
		age: 400,
	},
});

onload = function () {
	var game = The.game;
}
