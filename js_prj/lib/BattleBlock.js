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
        this.widthAnnimationSprite = 1476
        this.shootingYposition = this.y + this.height / 2 + 10; // the y position relatively the frame to shoot the bullet from

        this.maxHealth = lives;
        this.lives = lives;

        this.widthLife = 100;// red width of the lives
        this.heightLife = 10;// red height of the lives

        this.widthBar = 100; //the width of th whole life bar
        this.heightBar = 10; //the height of th whole life bar
        this.borderLifeBar = 3;

        this.color = "#e06253";
        //this.lineXposition = this.game.canvas.width / 3
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
            this.widthLife = this.widthLife - (100 / this.maxHealth);

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
            this.game.addBulletObject(new Bullet(this.game, this.type, this.defaultBulletSpeed, this.x, this.shootingYposition)); //

        }

        if (this.x < 0 || this.x > window.innerWidth) {
            this.game.removeBattleBlockObject(this);
        }

        this.x = this.x - this.speed;

        if (this.x < this.game.lineXposition - 20) // the minus 20 is the mooving 20 px to the left of the enemy to make the game over.
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
        this.game.ctx.lineWidth = this.borderLifeBar;
        this.game.ctx.strokeStyle = "#FFFFFF";
        ctx.strokeRect(this.x, this.y, this.widthBar, this.heightBar);
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.x, this.y, this.widthLife, this.heightBar);


        ctx.drawImage(this.shooterImage, this.widthAnnimationSprite - this.width - (this.currentFrame * this.width), 0, this.width, this.height, this.x, this.y, this.width, this.height)

       

    }
}