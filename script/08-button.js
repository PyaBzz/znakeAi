class Button {
    constructor(game, element) {
        this.game = game;
        this.element = element;
        this.beStartButton();
    }

    beStartButton() {
        let me = this;
        this.game.mouse.bindById(this.element.id, () => me.game.start());
    }

    beRestartButton() {
        this.element.firstChild.textContent = "Restart";
        let me = this;
        this.game.mouse.bindById(this.element.id, () => me.game.restart());
    }
}
