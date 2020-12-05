Visualiser = function (game) {
    this.game = game;
}

Visualiser.prototype.visualiseGrid = function () {
    let inputMatrix = this.getGridMatrix();
    tfvis.visor();
    const inputObj = { values: inputMatrix };
    const surface = { name: "dasoo name", tab: "dasoo tab" }
    tfvis.render.heatmap(surface, inputObj);
}

Visualiser.prototype.getGridMatrix = function () {
    let gridCells = this.game.grid.cells;
    let values = [];
    for (let row of gridCells)
        values.push(row.map(c => c.getValue()));
    return values;
}
