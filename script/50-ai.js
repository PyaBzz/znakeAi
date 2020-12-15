class Ai {
    #gameCallbacks = {};
    #playableCellCount;

    constructor(config, playableCellCount, gameCallbacks) {
        this.#playableCellCount = playableCellCount;
        copyProperties(gameCallbacks, this.#gameCallbacks);

        this.population = config.population;
        this.mutantPopulation = this.population / 2;
        this.inputVectorSize = config.inputVectorSize;
        this.modelService = new ModelService(config);
        this.totalModels = 0;
        this.totalAge = 0;
        this.totalLen = 0;
        this.bindEvents();
        this.needsFirstPopulation = true;
    }

    //Todo: Refactor a stat object
    get averageAge() { return this.totalAge / this.totalModels }
    get averageLen() { return this.totalLen / this.totalModels }

    bindEvents() {
        this.jsonUpload = document.getElementById('json-upload');
        this.binUpload = document.getElementById('bin-upload');
        let me = this;
        this.jsonUpload.onchange = function () { };
        this.binUpload.onchange = function () { };
        this.loadButton = document.getElementById('load-button');
        this.loadButton.onclick = function () { me.loadModel() };
    }

    async loadModel() {
        if (this.jsonUpload.files.length === 0) {
            alert("Please select a JSON file to describe the model");
            return;
        }
        if (this.binUpload.files.length === 0) {
            alert("Please select a binary file for model weights");
            return;
        }

        tf.loadLayersModel(
            tf.io.browserFiles([
                this.jsonUpload.files[0],
                this.binUpload.files[0]
            ])
        ).then(function (result) {
            this.ancestorModel = result;
            this.#gameCallbacks.onAncestorLoad(true);
        }).catch(err => this.#gameCallbacks.onAncestorLoad(false))
    }

    getNextModel() {
        if (this.needsFirstPopulation)
            this.populateFirstGeneration();

        if (this.nextModelIndex === this.population) {
            this.#gameCallbacks.onGenerationDone(this.genMinAge, this.genMaxAge, this.genMinLen, this.genMaxLen);
            this.populateNextGeneration();
        }

        this.currentModel = this.generation[this.nextModelIndex];
        this.totalModels++;
        this.nextModelIndex++;
        this.#gameCallbacks.onNewModel();
        return this.currentModel;
    }

    populateFirstGeneration() {
        this.generation = [];
        if (isDefined(this.ancestorModel)) {
            for (let i = 0; i < this.population; i++)
                this.generation.push(this.modelService.clone(this.ancestorModel));
        } else {
            for (let i = 0; i < this.population; i++)
                this.generation.push(this.modelService.create());
        }

        this.generationNumber = 1;
        this.nextModelIndex = 0;
        this.resetGenerationStats();
        this.needsFirstPopulation = false;
    }

    populateNextGeneration() {
        let fittest = this.getFittest();
        let toMutate = fittest.clone();
        let mutants = toMutate.map(m => this.modelService.mutate(m));
        this.generation = [...fittest, ...mutants];
        this.generationNumber++;
        this.nextModelIndex = 0;
        this.#gameCallbacks.onNewGeneration();
        this.resetGenerationStats();
    }

    getFittest() {
        let me = this;
        return this.generation.getTop(m => me.fitnessFunc(m), me.mutantPopulation).items;
    }

    fitnessFunc(model) {
        return model.wormAge + (model.wormLength - 1) * this.#playableCellCount;
    }

    onWormDied(age, len) {
        this.currentModel.wormAge = age;
        this.totalAge += age;
        this.currentModel.wormLength = len;
        this.totalLen += len;
        if (age < this.genMinAge) this.genMinAge = age;
        if (age > this.genMaxAge) this.genMaxAge = age;
        if (len < this.genMinLen) this.genMinLen = len;
        if (len > this.genMaxLen) this.genMaxLen = len;
    }

    resetGenerationStats() {
        this.genMinAge = Number.MAX_VALUE;
        this.genMaxAge = 0;
        this.genMinLen = Number.MAX_VALUE;
        this.genMaxLen = 0;
    }
} 