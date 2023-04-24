import BaseGameObject from "../lib/BaseGameObject.js";
import Bullet from "./Bullet.js";

export default class Player extends BaseGameObject {
    constructor(game, controls, color, lives) {
        super(game);

        this.type = "Player";

        this.controls = controls;

        this.x = window.innerWidth - 2400;
        this.y = (window.innerHeight / 2) - 50;
        this.width = 100;
        this.height = 100;
        this.color = color;

        this.lives = lives;

        this.maxSpeedX = 10;
        this.accelerationX = 1;
        this.speedX = 0;

        this.maxSpeedY = 10;
        this.accelerationY = 1.5;
        this.speedY = 0;

        this.lastBullet = new Date().getTime();
        this.bulletDelay = 70;
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
        if (gameObject.type === "Bullet" && gameObject.parentType !== this.type ) {
            this.lives--;

            if (this.lives <= 0) {
                this.game.removeGameObject(this);
                //this.game.gameOver();
            }
        }
    }

    update() {
        super.update();

        if (this.game.inputTracker.isKeyDown("e") && (new Date().getTime() - this.lastBullet) > this.bulletDelay) {
            this.lastBullet = new Date().getTime();
            this.game.addGameObject(new Bullet(this.game, this.type, "#ff9146", 10, this.x + this.width + 10, this.y + this.height/2));
            
        }   


        if (this.game.inputTracker.isKeyDown(this.controls.right) && this.game.inputTracker.isKeyUp(this.controls.left))
            this.speedX += this.accelerationX;
        else if (this.game.inputTracker.isKeyDown(this.controls.left) && this.game.inputTracker.isKeyUp(this.controls.right))
            this.speedX -= this.accelerationX;
        else
            this.speedX = 0;
        if (this.speedX > this.maxSpeedX)
            this.speedX = this.maxSpeedX;
        else if (this.speedX < -this.maxSpeedX)
            this.speedX = -this.maxSpeedX;
        if (this.game.inputTracker.isKeyUp(this.controls.left) && this.game.inputTracker.isKeyUp(this.controls.right))
            this.speedX = 0;


        if (this.game.inputTracker.isKeyDown(this.controls.down) && this.game.inputTracker.isKeyUp(this.controls.up))
            this.speedY += this.accelerationY;
        else if (this.game.inputTracker.isKeyDown(this.controls.up) && this.game.inputTracker.isKeyUp(this.controls.down))
            this.speedY -= this.accelerationY;
        else
            this.speedY = 0;
        if (this.speedY > this.maxSpeedY)
            this.speedY = this.maxSpeedY;
        else if (this.speedY < -this.maxSpeedY)
            this.speedY = -this.maxSpeedY;
        if (this.game.inputTracker.isKeyUp(this.controls.down) && this.game.inputTracker.isKeyUp(this.controls.up))
            this.speedY = 0;


        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0)
            this.x = 0;
        else if ((this.x + this.width) > this.game.canvas.width)
            this.x = this.game.canvas.width - this.width;
        if (this.y < 0)
            this.y = 0;
        else if ((this.y + this.height) > this.game.canvas.height)
            this.y = this.game.canvas.height - this.height;

    }

    draw(ctx) {
        super.draw(ctx);

        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);

        this.game.ctx.font = "32px Roboto";
        this.game.ctx.fillStyle = "white";

        this.game.ctx.textAlign = "center";
        this.game.ctx.textBaseline = "middle";

        this.game.ctx.fillText(this.lives, this.x + (this.width / 2), this.y + (this.height / 2))

    }
}