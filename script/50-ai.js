class Ai {
    constructor(game) {
        this.game = game;
        this.population = this.game.config.ai.population;
        this.reproducingPopulation = this.game.config.ai.reproducingPopulation;
        this.inputVectorSize = game.config.ai.inputVectorSize;
        this.modelService = new ModelService(game, this.inputVectorSize);
        this.totalModels = 0;
        this.totalAge = 0;
        this.totalLen = 0;
        this.bindEvents();
        this.needsFirstPopulation = true;
    }

    //Todo: Refactor a stat object
    get averageAge() { return this.totalAge / this.totalModels }
    get AverageLen() { return this.totalLen / this.totalModels }

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
            this.game.onAncestorLoad(true);
        }).catch(err => this.game.onAncestorLoad(false))
    }

    getNextModel() {
        if (this.needsFirstPopulation)
            this.populateFirstGeneration();

        if (this.nextModelIndex === this.population) {
            this.game.onGenerationDone(this.genMinAge, this.genMaxAge, this.genMinLen, this.genMaxLen);
            this.populateNextGeneration();
        }

        this.currentModel = this.generation[this.nextModelIndex];
        this.totalModels++;
        this.nextModelIndex++;
        this.game.onNewModel();
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
        let fittest = this.getFittest(); //Todo: Think about population ratios
        let toMutate = fittest.clone();
        let mutants = toMutate.map(m => this.modelService.mutate(m));
        this.generation = [...fittest, ...mutants];
        this.generationNumber++;
        this.nextModelIndex = 0;
        this.game.onNewGeneration();
        this.resetGenerationStats();
    }

    getFittest() {
        let me = this;
        return this.generation.getTop(m => me.fitnessFunc(m), me.reproducingPopulation).items;
    }

    fitnessFunc(model) {
        return model.wormAge + (model.wormLength - 1) * this.game.grid.playableCellCount;
    }

    onWormDied(worm) {
        this.currentModel.wormAge = worm.age;
        this.totalAge += worm.age;
        this.currentModel.wormLength = worm.length;
        this.totalLen += worm.length;
        if (worm.age < this.genMinAge) this.genMinAge = worm.age;
        if (worm.age > this.genMaxAge) this.genMaxAge = worm.age;
        if (worm.length < this.genMinLen) this.genMinLen = worm.length;
        if (worm.length > this.genMaxLen) this.genMaxLen = worm.length;
    }

    resetGenerationStats() {
        this.genMinAge = Number.MAX_VALUE;
        this.genMaxAge = 0;
        this.genMinLen = Number.MAX_VALUE;
        this.genMaxLen = 0;
    }
} 