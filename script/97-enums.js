Direction = Object.freeze({ up: "up", right: "right", down: "down", left: "left" });
OppositeDirection = Object.freeze({ up: "down", right: "left", down: "up", left: "right" });

CellType = Object.freeze({ head: "head", worm: "worm", wall: "wall", blank: "blank", food: "food" });
CellValue = Object.freeze({ head: -2, worm: -1, wall: -1, blank: 0, food: 2 });

NeuronActivation = Object.freeze({
    linear: "linear",
    elu: "elu",
    selu: "selu",
    relu: "relu",
    relu6: "relu6",
    sigmoid: "sigmoid",
    hardSigmoid: "hardSigmoid",
    softmax: "softmax",
    softplus: "softplus",
    softsign: "softsign",
    tanh: "tanh",
});

NeuronInitialiser = Object.freeze({
    zeros: "zeros",
    ones: "ones",
    constant: "constant",
    identity: "identity",
    glorotNormal: "glorotNormal",
    glorotUniform: "glorotUniform",
    heNormal: "heNormal",
    heUniform: "heUniform",
    leCunNormal: "leCunNormal", //A variation of truncated normal, better for higher layers
    leCunUniform: "leCunUniform",
    orthogonal: "orthogonal",
    randomNormal: "randomNormal",
    randomUniform: "randomUniform",
    truncatedNormal: "truncatedNormal",
    varianceScaling: "varianceScaling",
});

InfoboardKey = Object.freeze({
    Length: "Length",
    Age: "Age",
    WormNo: "Worm No",
    Generation: "Generation",
    TotalWorms: "Total Worms",
    AverageAge: "Average Age",
    AverageLen: "Average Length",
    genMinAge: "Last Gen. Min Age",
    genMaxAge: "Last Gen. Max Age",
    genMinLen: "Last Gen. Min Length",
    genMaxLen: "Last Gen. Max Length",
    ancestor: "Use Ancestor",
    maxStepsToFood: "Max Steps To Food",
});
