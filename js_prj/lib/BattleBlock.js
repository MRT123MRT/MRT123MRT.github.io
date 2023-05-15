import BaseGameObject from "./BaseGameObject.js";
import Bullet from "./Bullet.js";


export default class BattleBlock extends BaseGameObject {
    constructor(game, lives, x, y, speed,) {
        super(game);

        this.x = x;
        this.y = y;
        this.width = 123;
        this.height = 120;



        this.killCount = 0;
        this.lastBulletTime = new Date().getTime();
        this.bulletDelay = Math.random() * 1000;

        this.speed = speed || 1;
        this.bulletSpawnDefiner = 6000; //lower num-> less time between two enemy shots 


        this.currentFrame = 0; //which frame out of 12 is being drawn now
        this.shooterImage = new Image();
        this.shooterImage.src = '../images/shooter.png';
        this.starggerFrames = 8; //once every how many frames to update the animation frame of the player. (1) is normal speed animation, higher the num => slower animation
        this.gameFrame = 0; //how many global gameframes passed
        this.defaultBulletSpeed = -10;
        this.maxAnimationFrame = 12;

        this.maxHealth = lives;
        this.lives = lives;
        this.widthBar = 100;
        this.heightBar = 10;
        this.color = "#e06253";
        this.line = this.game.canvas.width / 3
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


        if (gameObject.type === "Bullet" && gameObject.parentType === "Player") {
            this.lives--;
            this.widthBar = this.widthBar - (100 / this.maxHealth);

            if (this.lives <= 0) {
                this.game.removeBattleBlockObject(this);

                this.game.killCount++;
                if (this.game.killCount > this.game.player.record) {
                    this.game.player.record = this.game.killCount;
                    document.getElementById("fireworks").classList.remove("hidden");
                    document.getElementById("fireworks1").classList.remove("hidden");
                    document.getElementById("new_record_text").classList.remove("hidden");
                }

            }

        }
    }

    update() {
        super.update();

        if ((new Date().getTime() - this.lastBulletTime) > this.bulletDelay) {
            this.bulletDelay = Math.random() * this.bulletSpawnDefiner;
            this.lastBulletTime = new Date().getTime();
            this.game.addBulletObject(new Bullet(this.game, this.type, this.defaultBulletSpeed, this.x, this.y + this.height / 2 + 10));

        }

        if (this.x < 0 || this.x > window.innerWidth) {
            this.game.removeBattleBlockObject(this);
        }                           

        this.x = this.x - this.speed;

        if (this.x < this.game.line - 20)
            this.game.gameOver();

        this.animation();
    }

    animation() {

        if (this.gameFrame % this.starggerFrames === 0) {
            if (this.currentFrame < this.maxAnimationFrame - 1)
                this.currentFrame++;
            else
                this.currentFrame = 0;

        }
        this.gameFrame++;

    }

    draw(ctx) {
        super.draw(ctx);
        this.game.ctx.lineWidth = 3;
        this.game.ctx.strokeStyle = "#FFFFFF";
        ctx.strokeRect(this.x, this.y - 8, 100, 10);
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.x, this.y - 8, this.widthBar, this.heightBar);


        ctx.drawImage(this.shooterImage, 1353 - (this.currentFrame * this.width), 0, this.width, this.height, this.x, this.y, this.width, this.height)

        this.game.ctx.fillText(this.lives, this.x + (this.width / 2), this.y + (this.height / 2))

    }
}