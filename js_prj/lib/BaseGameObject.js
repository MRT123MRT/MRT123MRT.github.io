export default class BaseGameObject {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.type = "BaseGameObject";
    }

    update() { }
    draw(ctx) { }
}