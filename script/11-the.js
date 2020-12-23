"use strict";

class The {

    constructor() {
        throw new Error("Do not instantiate a static class");
    }

    static get game() { return Game.instance }
    // static get evolution() { return The.game.currentEvo }
    // static get generation() { return The.evolution.currentGen }
    // static get worm() { return The.generation.currentWorm }
    static get grid() { return Grid.instance }
    static get feeder() { return Feeder.instance }
    static get gameBoard() { return GameBoard.instance }
    static get evoBoard() { return EvoBoard.instance }
    static get genBoard() { return GenBoard.instance }
    static get wormBoard() { return WormBoard.instance }
    static get eventBus() { return EventBus.instance }
    static get reporter() { return Reporter.instance }
    static get evoLog() { return EvoLog.instance }
}
