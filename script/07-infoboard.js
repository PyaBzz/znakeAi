InfoBoard = function (game) {
    this.game = game;
    this.score = document.getElementById('score');
    this.age = document.getElementById('age');
    this.generation = document.getElementById('generation');
}

InfoBoard.prototype.updateScore = function (number) {
    this.score.innerHTML = number;
}

InfoBoard.prototype.updateAge = function (number) {
    this.age.innerHTML = number;
}

InfoBoard.prototype.updateGeneration = function (number) {
    this.generation.innerHTML = number;
}

InfoBoard.prototype.reset = function () {
    this.updateScore(1); // Minimum length
}
