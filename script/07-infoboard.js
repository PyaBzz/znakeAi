InfoBoard = function (game) {
    this.game = game;
    this.score = document.getElementById('score');
    this.lifeCount = document.getElementById('life-count');
}

InfoBoard.prototype.updateScore = function (number) {
    this.score.innerHTML = number;
}

InfoBoard.prototype.life = function (number) {
    this.lifeCount.innerHTML = number;
}

InfoBoard.prototype.reset = function () {
    this.updateScore(1); // Minimum length
}
