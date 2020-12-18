"use strict";

var Direction = Object.freeze({ up: "up", right: "right", down: "down", left: "left" });

var NeuronActivation = Object.freeze({
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

var NeuronInitialiser = Object.freeze({
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

var InfoKey = Object.freeze({
    age: "Age",
    length: "Length",
    wormNo: "Worm No",
    genNumber: "Generation No",
    genMinAge: "Last Gen. Min Age",
    genMaxAge: "Last Gen. Max Age",
    genMinLen: "Last Gen. Min Length",
    genMaxLen: "Last Gen. Max Length",
    ancestor: "Import Ancestor",
    targetLength: "Target Length",
    maxStepsToFood: "Max Steps To Food",
    totalWorms: "Total Worms",
    averageAge: "Average Age",
    averageLen: "Average Length",
    foodSpread: "Food Spread",
});

var ButtonKey = Object.freeze({
    Start: "Start",
    Pause: "Pause",
    Resume: "Resume",
});
