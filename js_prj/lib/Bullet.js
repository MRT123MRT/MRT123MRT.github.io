import BaseGameObject from "./BaseGameObject.js";

export default class Bullet extends BaseGameObject {
    constructor(game, parentType, color, speed, x, y) {
        super(game);

        this.type = "Bullet";
        this.parentType = parentType;

        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 5;
        this.color = color;


        this.speedX = speed;
    }

    inCollisionWith(gameObject) {
        if (gameObject.x < this.x + this.width &&
            gameObject.x + gameObject.width > this.x &&
            gameObject.y < this.y + this.height &&
            gameObject.y + gameObject.height > this.y) {
            return true;
        }
    }
    onCollision(gameObject) {
       

        if (gameObject.type !== this.parentType) {
            this.game.removeGameObject(this);
        }
    }

    update() {
        super.update();
        this.x += this.speedX;

        if (this.x < 0 || this.x > window.innerWidth) {
            this.game.removeGameObject(this);
        }
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}