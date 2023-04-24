import BaseGameObject from "./BaseGameObject.js";
import Bullet from "./Bullet.js";

export default class BattleBlock extends BaseGameObject {
    constructor(game, color, lives, x, y) {
        super(game);

        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.color = color;

        this.lives = lives;
        this.enemyCount = 0;
        this.lastBullet = new Date().getTime();
        this.bulletDelay = Math.random() * 100000;
        this.activated = false;
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
            

            if (this.lives <= 0) {
                this.game.removeGameObject(this);
                
                this.enemyCount++;
                
                //this.game.gameOver();
            }
            console.log(this.enemyCount);
        }
    }

    update() {
        super.update();

        if ((new Date().getTime() - this.lastBullet) > this.bulletDelay) {
            this.bulletDelay = Math.random() * 10000;
            this.lastBullet = new Date().getTime();
            this.game.addGameObject(new Bullet(this.game, this.type, "#ff2146", -10, this.x + this.width / 2, this.y + this.height + 10));

        }
        this.x--;
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