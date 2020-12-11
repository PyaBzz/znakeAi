class ModelService {
    constructor(game, inputVectorSize) {
        this.game = game;
        this.layerSizes = game.config.ai.layerSizes;
        this.activation = game.config.ai.activation;
        this.kernelInit = game.config.ai.kernelInit;
        this.mutationDiversity = game.config.ai.mutationDiversity;
        this.useBias = game.config.ai.useBias;
        this.biasInit = game.config.ai.biasInit;
        this.mutateBias = game.config.ai.mutateBias;
        this.inputVectorSize = inputVectorSize;
    }

    initialise() {
    }

    createModel() {
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

    // getOffsprings(parentWorms) {
    //     let children = []
    //     let numberOfMatings = Math.floor(parentWorms.length / 2);
    //     for (i = 0; i < numberOfMatings; i++) {
    //         let mother = parentWorms[2 * i];
    //         let father = parentWorms[2 * i + 1];
    //         children.push(this.mate(mother, father));
    //     }
    //     return children;
    // }

    // mate(mother, father) { //Todo: Does mating do any good?
    //     return tf.tidy(() => {
    //         let offspring = this.clone(mother);
    //         for (let i = 0; i < mother.layers.length; i++) {
    //             const motherLayer = mother.layers[i];
    //             const fatherLayer = father.layers[i];
    //             const childLayer = offspring.layers[i];

    //             const motherWeights = motherLayer.getWeights();
    //             const fatherWeights = fatherLayer.getWeights();

    //             const motherCoefficients = motherWeights[0];
    //             const fatherCoefficients = fatherWeights[0];

    //             const motherBiases = motherWeights[1];
    //             const fatherBiases = fatherWeights[1];

    //             const mixedCoefficients = this.mix(motherCoefficients, fatherCoefficients);
    //             const mixedBiases = this.mix(motherBiases, fatherBiases);
    //             childLayer.setWeights([mixedCoefficients, mixedBiases]);
    //         }
    //         return offspring;
    //     });
    // }

    // mix(tensorA, tensorB) {
    //     return tf.tidy(() => {
    //         const axis = 0; //Todo: Properly mix instead of half-half
    //         const [firstHalf, discardedA] = tf.split(tensorA, 2, axis);
    //         const [discardedB, secondHalf] = tf.split(tensorB, 2, axis);
    //         res = tf.concat([firstHalf, secondHalf], axis);
    //         return res;
    //     });
    // }

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

    clone(sourceModel) {
        return tf.tidy(() => {
            let clone = this.createModel();
            for (let i = 0; i < sourceModel.layers.length; i++) {
                const sourceLayer = sourceModel.layers[i];
                const weights = sourceLayer.getWeights();
                const targetLayer = clone.layers[i];
                targetLayer.setWeights(weights);
            }
            return clone;
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
