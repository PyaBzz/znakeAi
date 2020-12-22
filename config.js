"use strict";

var Config = deepFreeze({
	devMode: false,
	statFileName: 'znakeResult',
	grid: {
		height: 11,  // Greater than 4
		width: 11,  // Greater than 4
	},
	keyboard: {
		pause: ' ',
	},
	evolution: {
		rounds: 3,
		target: {
			averageLen: 0,
		},
	},
	generation: {
		rounds: 130,
		population: 32,  // Only even numbers
		target: {
		},
	},
	worm: {
		startAtCentre: true,
		stepTime: {
			fast: 1,  // milliseconds
			slow: 100,  // milliseconds
		},
		target: {
			age: 0,
			length: 4,
			offerDownload: false,
			downloadPath: 'downloads://znakeBrain',
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
	},
});

onload = function () {
	var game = The.game;
}
