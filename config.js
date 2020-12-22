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
			averageLen: 0,
		},
	},
	generation: {
		rounds: 3000,
		target: {
		},
	},
	worm: {
		population: 32,  // Only even numbers
		startAtCentre: true,
		stepTime: {
			fast: 1,  // milliseconds
			slow: 100,  // milliseconds
		},
		target: {
			age: 0,
			length: 16,
			offerBrainDownload: false,
			brainDownloadFileName: 'downloads://znakeBrain',
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
	statCsv: {
		fileName: 'znakeResult',
		columnWidth: 14,
	}
});

onload = function () {
	var game = The.game;
}
