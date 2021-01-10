"use strict";

var Config = Obj.deepFreeze({
	devMode: false,
	grid: {
		draw: true,
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
		population: 32,
		reproducingPopulationRatio: 0.2, // in range (0 ~ 1)
		rounds: 3000,
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
		geneticDiversity: 0.1,  //Standard deviation of the Gaussian noise
	},
	report: {
		fileName: 'znakeRes',
		columnWidth: 18,
	}
});

onload = function () {
	var game = The.game;
}
