export default class InputTracker {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', this.keyDown.bind(this));
        window.addEventListener('keyup', this.keyUp.bind(this));
    }

    keyDown(e) {
        console.log(e.key.toLowerCase());
        this.keys[e.key.toLowerCase()] = true;

    }

    keyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }

    isKeyDown(key) {
        return this.keys[key.toLowerCase()];
    }

    isKeyUp(key) {
        return !this.isKeyDown(key.toLowerCase());
    }

}