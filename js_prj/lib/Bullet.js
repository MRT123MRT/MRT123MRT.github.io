import BaseGameObject from "./BaseGameObject.js";
import Player from "./Player.js";

export default class Bullet extends BaseGameObject {
    constructor(game, parentType, speed, x, y) {
        super(game);

        this.type = "Bullet";
        this.parentType = parentType;

        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 15;


        this.speedX = speed;
        this.bulletImage = new Image();
        this.bulletImage.src = (parentType !== "Player") ? '../images/bullet_yellow.jpg' : '../images/bullet_pink.jpg';

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


        if (gameObject.type !== this.parentType && this.parentType !== gameObject.parentType) {
            this.game.removeBulletObject(this);
        }

    }

    update() {
        super.update();
        this.x += this.speedX;

        if (this.x < 0 || this.x > window.innerWidth) {
            this.game.removeBulletObject(this);
        }
    }

    draw(ctx) {
        ctx.save();
        super.draw(ctx);

        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.bulletImage, this.x, this.y, this.width, this.height);
        ctx.restore();
    }   
}