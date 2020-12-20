"use strict";

class The {

    constructor() {
        throw new Error("Do not instantiate a static class");
    }

    static get grid() { return Grid.instance }
    static get gameBoard() { return GameBoard.instance }
    static get evoBoard() { return EvoBoard.instance }
    static get genBoard() { return GenBoard.instance }
    static get wormBoard() { return WormBoard.instance }
    static get feeder() { return Feeder.instance }
    static get eventBus() { return EventBus.instance }
    static get target() { return Target.instance }
}
