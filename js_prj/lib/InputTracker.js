export default class InputTracker {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', this.keyDown.bind(this));
        window.addEventListener('keyup', this.keyUp.bind(this));
    }

    keyDown(e) {
        this.keys[e.key] = true;                          
    }
    
    keyUp(e) {
        this.keys[e.key] = false;
    }

    isKeyDown(key) {
        return this.keys[key];
    }

    isKeyUp(key) {
        return !this.isKeyDown(key);
    }

}