Button = function (game, element) {
    this.game = game;
    this.element = element;
    this.beStartButton();
}

Button.prototype.beStartButton = function () {
    let me = this;
    this.game.mouse.bindById(this.element.id, () => me.game.start());
}

Button.prototype.beRestartButton = function () {
    this.element.firstChild.textContent = "Restart";
    let me = this;
    this.game.mouse.bindById(this.element.id, () => me.game.restart());
}