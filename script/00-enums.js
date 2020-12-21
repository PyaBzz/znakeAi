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

var ButtonKey = Object.freeze({
    Start: "Start",
    Pause: "Pause",
    Resume: "Resume",
    End: "End",
});

var EventKey = Object.freeze({
    wormBorn: "wormBorn",
    foodEaten: "foodEaten",
    pause: "pause",
    resume: "resume",
    slowDown: "slowDown",
    speedUp: "speedUp",
    wormDied: "wormDied",
    generationEnd: "generationEnd",
    averageLenChanged: "averageLenChanged",
    targetReached: "targetReached",
    evolutionEnd: "evolutionEnd",
});
