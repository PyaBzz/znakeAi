"use strict";

class Reporter {
    static #instance = null;

    constructor() {
        if (Reporter.#instance)
            throw new Error("Do not instantiate a singleton class twice");

        Reporter.#instance = this;
    }

    static get instance() {
        return Reporter.#instance ? Reporter.#instance : new Reporter();
    }

    generate(data) {
        let evoCount = 0;
        let successCount = 0;
        let genCount = 0;
        data.forEach(row => {
            evoCount++;
            successCount += row[1] ? 1 : 0;
            genCount += row[2];
            row.push((successCount / evoCount).toFixed(3));
            row.push((genCount / evoCount).toFixed(3));
        });
        data.unshift(["Evolution", "TargetMet", "Generations", "TotalWorms", "AverageLen", "MaxLen", "Run.Ave.Success", "Run.Ave.Gens"]);
        data.unshift([""]);
        data.unshift(["--------------", "--------------", "--------------", "--- Result ---", "--------------", "--------------", "--------------", "--------------"]);
        data.unshift([""]);
        data.unshift([""]);
        data.unshift([""]);
        data.unshift([Config.neuralNet.inputSize, Config.neuralNet.layerSizes, Config.neuralNet.mutationDiversity]);
        data.unshift(["InputSize", "NeuralNetLayers", "mutationDiversity"]);
        data.unshift([""]);
        data.unshift(["--------------", "--------------", "--------------", "NeuralNet Config", "--------------", "--------------", "--------------", "--------------"]);
        CsvFiler.download(data, this.#getFileName(), Config.report.columnWidth);
    }

    #getFileName() {
        return `${Config.report.fileName}-${Config.neuralNet.inputSize}-${Config.neuralNet.layerSizes.join(',')}-${Config.neuralNet.mutationDiversity}`
    }
}
