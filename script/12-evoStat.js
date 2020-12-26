"use strict";

class EvoStat {
    static #instance = null;
    #data = [];
    #evoCount = 0;
    #successCount = 0;
    #genCount = 0;

    constructor() {
        if (EvoStat.#instance)
            throw new Error("Do not instantiate a singleton class twice");

        EvoStat.#instance = this;
    }

    static get instance() {
        return EvoStat.#instance ? EvoStat.#instance : new EvoStat();
    }

    add(dataRow) {
        // const dataRow = [this.#evoCounter, evoTargetMet, evo.genCount, evo.totalWorms, evo.averageLen.toFixed(3), evo.maxLen];
        this.#evoCount++;
        this.#successCount += dataRow[1];
        this.#genCount += dataRow[2];
        const aveSuccess = (this.#successCount / this.#evoCount).toFixed(3);
        const aveGens = (this.#genCount / this.#evoCount).toFixed(3);
        dataRow.push(aveSuccess, aveGens);
        this.#data.push(dataRow);
        The.evoLogBoard.log(dataRow);
    }

    download() {
        this.#data.unshift(["Evo", "Success", "Gens", "Worms", "Ave.Len", "MaxLen", "Ave.Success", "Ave.Gens"]);
        this.#data.unshift([""]);
        this.#data.unshift(["--------------", "--------------", "--------------", "--- Result ---", "--------------", "--------------", "--------------", "--------------"]);
        this.#data.unshift([""]);
        this.#data.unshift([""]);
        this.#data.unshift([""]);
        this.#data.unshift([Config.neuralNet.inputSize, "[" + Config.neuralNet.layerSizes.join(',') + "]", Config.neuralNet.geneticDiversity]);
        this.#data.unshift(["InputSize", "NeuralNetLayers", "geneticDiversity"]);
        this.#data.unshift([""]);
        this.#data.unshift(["--------------", "--------------", "--------------", "NeuralNet Config", "--------------", "--------------", "--------------", "--------------"]);
        CsvFiler.download(this.#data, this.#getFileName(), Config.report.columnWidth);
    }

    #getFileName() {
        return `${Config.report.fileName}-${Config.neuralNet.inputSize}-[${Config.neuralNet.layerSizes.join(',')}]-${Config.neuralNet.geneticDiversity}`
    }
}

class EvoLogBoard {
    static #instance = null;
    #board;

    constructor() {
        if (EvoLogBoard.#instance)
            throw new Error("Do not instantiate a singleton class twice");

        const parent = document.getElementById('evolog');

        this.#board = new Logboard(
            parent,
            ["Evo", "Success", "Gens", "Worms", "Ave.Len", "MaxLen", "Ave.Success", "Ave.Gens"],
            "Evolution Log"
        );

        EvoLogBoard.#instance = this;
    }

    static get instance() {
        return EvoLogBoard.#instance ? EvoLogBoard.#instance : new EvoLogBoard();
    }

    log(...args) { this.#board.log(...args) };
}
