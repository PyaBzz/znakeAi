//###########################  Overlay  ############################################
Overlay = function (game) {
    this.game = game;
    this.element = document.getElementById('overlay');

    if (game.config.runMode === runModeEnum.auto) {
        this.element.classList.add('overlay-ai');
        this.line2 = "AI autoplay!";
    }
    else if (this.game.config.devMode) {
        this.element.classList.add('overlay-dev');
        this.line2 = "Developer mode";
    }
    else {
        this.element.classList.add('overlay-manual');
        this.line2 = "Manual mode";
    }

    this.bindHandler();
    this.popUp();
}

Overlay.prototype.bindHandler = function () {
    let me = this;
    this.element.onclick = function () {
        me.popDown();
        me.unbindHandler();
        me.element.classList.add("translucent");
        me.line1 = "PAUSE";
        me.line2 = "";
        me.line3 = "";
        me.game.splashClicked();
    };
}

Overlay.prototype.unbindHandler = function () {
    this.element.onclick = null;
}

Overlay.prototype.popUp = function () {
    this.element.classList.replace('popdown', 'popup');
}

Overlay.prototype.popDown = function () {
    this.element.classList.replace('popup', 'popdown');
}

Object.defineProperties(Overlay.prototype, {
    line1: {
        get: function () { return document.getElementById('overlay-line1').innerText },
        set: function (val) { document.getElementById('overlay-line1').innerText = val; }
    },
    line2: {
        get: function () { return document.getElementById('overlay-line2').innerText },
        set: function (val) { document.getElementById('overlay-line2').innerText = val; }
    },
    line3: {
        get: function () { return document.getElementById('overlay-line3').innerText },
        set: function (val) { document.getElementById('overlay-line3').innerText = val; }
    },
});

//############################  Info Board  ######################################
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

//############################  Button  ######################################
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