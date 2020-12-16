class Ai {
    #gameCallbacks = {};
    #playableCellCount;
    #mutantPopulation;
    #population;
    #modelService;
    #needsFirstPopulation;
    #jsonUpload;
    #binUpload;
    #loadButton;
    #ancestorModel;
    #generation = [];
    #nextModelIndex;
    #currentModel;
    #downloadPath;

    constructor(aiConfig, playableCellCount, gameCallbacks) {
        this.#playableCellCount = playableCellCount;
        copyProperties(gameCallbacks, this.#gameCallbacks);

        this.#population = aiConfig.population;
        this.#downloadPath = aiConfig.downloadPath;
        this.#mutantPopulation = this.#population / 2;
        this.#modelService = new ModelService(aiConfig);
        this.bindEvents();
        this.#needsFirstPopulation = true;
    }

    bindEvents() {
        this.#jsonUpload = document.getElementById('json-upload');
        this.#binUpload = document.getElementById('bin-upload');
        let me = this;
        this.#jsonUpload.onchange = function () { };
        this.#binUpload.onchange = function () { };
        this.#loadButton = document.getElementById('load-button');
        this.#loadButton.onclick = function () { me.loadModel() };
    }

    async loadModel() {
        if (this.#jsonUpload.files.length === 0) {
            alert("Please select a JSON file to describe the model");
            return;
        }
        if (this.#binUpload.files.length === 0) {
            alert("Please select a binary file for model weights");
            return;
        }

        const me = this;
        tf.loadLayersModel(
            tf.io.browserFiles([
                this.#jsonUpload.files[0],
                this.#binUpload.files[0]
            ])
        ).then(result => {
            me.#ancestorModel = result;
            me.#gameCallbacks.onAncestorLoad(true);
        }).catch(err => {
            me.#gameCallbacks.onAncestorLoad(false)
        });
    }

    saveModel() {
        this.#currentModel.save(this.#downloadPath);
    }

    getNextModel() {
        if (this.#needsFirstPopulation)
            this.populateFirstGeneration();

        if (this.#nextModelIndex === this.#population) {
            this.#gameCallbacks.onGenerationDone();
            this.populateNextGeneration();
        }

        this.#currentModel = this.#generation[this.#nextModelIndex];
        this.#nextModelIndex++;
        this.#gameCallbacks.onNewModel(this.#nextModelIndex);
        return this.#currentModel;
    }

    populateFirstGeneration() {
        if (isDefined(this.#ancestorModel)) {
            for (let i = 0; i < this.#population; i++)
                this.#generation.push(this.#modelService.clone(this.#ancestorModel));
        } else {
            for (let i = 0; i < this.#population; i++)
                this.#generation.push(this.#modelService.create());
        }

        this.#nextModelIndex = 0;
        this.#needsFirstPopulation = false;
    }

    populateNextGeneration() {
        let fittest = this.getFittest();
        let toMutate = fittest.clone();
        let mutants = toMutate.map(m => this.#modelService.mutate(m));
        this.#generation = [...fittest, ...mutants];
        this.#nextModelIndex = 0;
        this.#gameCallbacks.onNewGeneration();
    }

    getFittest() {
        let me = this;
        return this.#generation.getTop(m => me.fitnessFunc(m), me.#mutantPopulation).items;
    }

    fitnessFunc(model) {
        return model.wormAge + (model.wormLength - 1) * this.#playableCellCount;
    }

    onWormDied(age, len) {
        this.#currentModel.wormAge = age;
        this.#currentModel.wormLength = len;
    }
}
