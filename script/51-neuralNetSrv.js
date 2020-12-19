"use strict";

class NeuralNetSrv {
    #inputSize = Config.neuralNet.inputSize;
    #layerSizes = Config.neuralNet.layerSizes;
    #activation = Config.neuralNet.activation;
    #kernelInit = Config.neuralNet.kernelInit;
    #useBias = Config.neuralNet.useBias;
    #biasInit = Config.neuralNet.biasInit;
    #mutationDiversity = Config.neuralNet.mutationDiversity;

    constructor() {
    }

    create() {
        return tf.tidy(() => {
            let model = tf.sequential();
            for (let layerSize of this.#layerSizes) {
                if (model.layers.length === 0)
                    model.add(tf.layers.dense({
                        units: layerSize,
                        inputShape: [this.#inputSize],
                        activation: this.#activation,
                        kernelInitializer: this.#kernelInit,
                        useBias: this.#useBias,
                        biasInitializer: this.#biasInit,
                    }));
                else
                    model.add(tf.layers.dense({
                        units: layerSize,
                        activation: this.#activation,
                        kernelInitializer: this.#kernelInit,
                        useBias: this.#useBias,
                        biasInitializer: this.#biasInit,
                    }));
            }
            return model;
        });
    }

    clone(sourceModel) {
        return tf.tidy(() => {
            let clone = this.create();
            for (let i = 0; i < sourceModel.layers.length; i++) {
                const sourceLayer = sourceModel.layers[i];
                const weights = sourceLayer.getWeights();
                const targetLayer = clone.layers[i];
                targetLayer.setWeights(weights);
            }
            return clone;
        });
    }

    mutate(model) {
        return tf.tidy(() => {
            const mutant = this.clone(model);
            for (let i = 0; i < model.layers.length; i++) {
                const originalLayer = model.layers[i];
                const mutatedLayer = mutant.layers[i];

                const originalWeights = originalLayer.getWeights();
                if (this.#useBias) {
                    const originalCoefficients = originalWeights[0];
                    const originalBiases = originalWeights[1];
                    const mutatedCoefficients = this.#addNoise(originalCoefficients);
                    const mutatedBiases = this.#addNoise(originalBiases);
                    mutatedLayer.setWeights([mutatedCoefficients, mutatedBiases]);
                } else {
                    const originalCoefficients = originalWeights[0];
                    const mutatedCoefficients = this.#addNoise(originalCoefficients);
                    mutatedLayer.setWeights([mutatedCoefficients]);
                }
            }
            return mutant;
        });
    }

    #addNoise(tensor) {
        return tf.tidy(() => {
            const shape = tensor.shape;
            let noiseTensor = tf.truncatedNormal(shape, 0, this.#mutationDiversity);
            return tf.add(tensor, noiseTensor);
        });
    }
}
