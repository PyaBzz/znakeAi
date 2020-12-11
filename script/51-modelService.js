class ModelService {
    constructor(game, inputVectorSize) {
        this.game = game;
        this.layerSizes = game.config.ai.layerSizes;
        this.activation = game.config.ai.activation;
        this.kernelInit = game.config.ai.kernelInit;
        this.mutationDiversity = game.config.ai.mutationDiversity;
        this.useBias = game.config.ai.useBias;
        this.biasInit = game.config.ai.biasInit;
        this.inputVectorSize = inputVectorSize;
    }

    create() {
        return tf.tidy(() => {
            let model = tf.sequential();
            for (let layerSize of this.layerSizes) {
                if (model.layers.length === 0)
                    model.add(tf.layers.dense({
                        units: layerSize,
                        inputShape: [this.inputVectorSize],
                        activation: this.activation,
                        kernelInitializer: this.kernelInit,
                        useBias: this.useBias,
                        biasInitializer: this.biasInit,
                    }));
                else
                    model.add(tf.layers.dense({
                        units: layerSize,
                        activation: this.activation,
                        kernelInitializer: this.kernelInit,
                        useBias: this.useBias,
                        biasInitializer: this.biasInit,
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
                if (this.useBias) {
                    const originalCoefficients = originalWeights[0];
                    const originalBiases = originalWeights[1];
                    const mutatedCoefficients = this.addNoise(originalCoefficients);
                    const mutatedBiases = this.addNoise(originalBiases);
                    mutatedLayer.setWeights([mutatedCoefficients, mutatedBiases]);
                } else {
                    const originalCoefficients = originalWeights[0];
                    const mutatedCoefficients = this.addNoise(originalCoefficients);
                    mutatedLayer.setWeights([mutatedCoefficients]);
                }
            }
            return mutant;
        });
    }

    addNoise(tensor) {
        return tf.tidy(() => {
            const shape = tensor.shape;
            let noiseTensor = tf.truncatedNormal(shape, 0, this.mutationDiversity);
            return tf.add(tensor, noiseTensor);
        });
    }
}
