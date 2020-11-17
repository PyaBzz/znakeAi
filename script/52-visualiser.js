Visualiser = function (game) {
}

Visualiser.prototype.visualise = function (matrix) {
    tfvis.visor();
    const inputObj = { values: matrix };
    const surface = { name: "dasoo name", tab: "dasoo tab" }
    tfvis.render.heatmap(surface, inputObj);
}
