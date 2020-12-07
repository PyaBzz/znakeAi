activationEnum = Object.freeze({
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

initialiserEnum = Object.freeze({
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
