class Overlay {
    constructor(game) {
        this.game = game;
        this.element = document.getElementById('overlay');

        if (this.game.config.devMode) {
            this.element.classList.add('overlay-dev');
            this.line2 = "Developer mode";
        }

        this.bindHandler();
        this.popUp();
    }

    //Todo: Keep references to elements instead of finding in DOM everytime
    get line1() { return document.getElementById('overlay-line1').innerText }
    set line1(val) { document.getElementById('overlay-line1').innerText = val; }
    get line2() { return document.getElementById('overlay-line2').innerText }
    set line2(val) { document.getElementById('overlay-line2').innerText = val; }
    get line3() { return document.getElementById('overlay-line3').innerText }
    set line3(val) { document.getElementById('overlay-line3').innerText = val; }

    bindHandler() {
        let me = this;
        this.element.onclick = function () {
            me.popDown();
            me.unbindHandler();
            me.element.classList.add("translucent");
            me.line1 = "PAUSE";
            me.line2 = "";
            me.line3 = "";
            me.game.onSplashClicked();
        };
    }

    unbindHandler() {
        this.element.onclick = null;
    }

    popUp() {
        this.element.classList.replace('popdown', 'popup');
    }

    popDown() {
        this.element.classList.replace('popup', 'popdown');
    }
}
