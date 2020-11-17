soundDefinitions = Object.freeze({
    "foodBeep": [2000, 70],
    "mouseInBeep": [3000, 50],
    "mouseOutBeep": [2500, 50]
});

znakeSound = function (volume) {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.connect(this.audioCtx.destination);
    this.gainNode.gain.value = volume;

    for (let key in soundDefinitions) {
        let oscillatorName = key + "Oscillator";
        this[oscillatorName] = this.audioCtx.createOscillator();
        this[oscillatorName].frequency.value = soundDefinitions[key][0];
        this[oscillatorName].connect(this.gainNode);
        this[oscillatorName].start();
        this[oscillatorName].disconnect();

        this[key] = function () {
            let me = this;
            this[oscillatorName].connect(this.gainNode);
            setTimeout(() => { me[oscillatorName].disconnect() }, soundDefinitions[key][1]);
        }
    }
}
