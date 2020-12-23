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
        const rounds = data.length;
        let successCount = 0;
        let totalWorms = 0;
        data.forEach(row => {
            successCount += data[1] ? 1 : 0;
            totalWorms += row[3];
        });
        const successRate = successCount / rounds;
        const averageWorms = totalWorms / rounds;
        data.unshift(["Evolution", "TargetMet", "Generations", "TotalWorms", "AverageLen", "MaxLen", "RunningAverageGens"]);
        data.unshift([""]);
        data.unshift(["--------------", "--------------", "--------------", "--- DETAILS ---", "--------------", "--------------", "--------------"]);
        data.unshift([""]);
        data.unshift([""]);
        data.unshift([""]);
        data.unshift([successRate.toFixed(3), averageWorms.toFixed(3)]);
        data.unshift(["SuccessRate", "Ave.WormCount"]);
        data.unshift([""]);
        data.unshift(["--------------", "--------------", "--------------", "--- STATS ---", "--------------", "--------------", "--------------"]);
        CsvFiler.download(data, Config.report.fileName, Config.report.columnWidth);
    }
}
