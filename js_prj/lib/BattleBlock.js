import BaseGameObject from "./BaseGameObject.js";
import Bullet from "./Bullet.js";


export default class BattleBlock extends BaseGameObject {
    constructor(game, lives, x, y,speed,) {
        super(game);
        
        this.x = x;
        this.y = y;
        this.width = 123;
        this.height = 120;
        

        
        this.enemyCount = 0;
        this.lastBullet = new Date().getTime();
        this.bulletDelay = Math.random() * 1000;
        this.activated = false;
        this.speed = speed||1;


        this.frame = 0;
        this.shooterImage =new Image();
        this.shooterImage.src ='../images/shooter.png';
        this.spriteWidth= 123;
        this.spriteHeight= 120;
        this.staggerFrame = 8;
        this.gameFrame = 0;

        this.maxHealth =lives;
        this.lives = lives;
        this.widthBar = 100;
        this.heightBar = 10;
        this.color = "#e06253";
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
            this.widthBar = this.widthBar - (100/this.maxHealth);

            if (this.lives <= 0) {
                this.game.removeGameObject(this);

                this.game.enemyCount++;

                //this.game.gameOver();
            }

        }
    }

    update() {
        super.update();

        if ((new Date().getTime() - this.lastBullet) > this.bulletDelay) {
            this.bulletDelay = Math.random() * 2000;
            this.lastBullet = new Date().getTime();
            this.game.addGameObject(new Bullet(this.game, this.type, -10, this.x , this.y + this.height/2 +10 ));

        }
        
        if (this.x < 0 || this.x > window.innerWidth) {
            this.game.removeGameObject(this);
        }

        this.x = this.x -this.speed;

        if (this.x < this.game.canvas.width/3)
            this.game.gameOver();

        this.animation();
    }

    animation(){
        
        if(this.gameFrame % this.staggerFrame ==0){
            if(this.frame<11)
            this.frame++;
        else 
            this.frame = 0;
            
        }
        this.gameFrame++;
        
    }

    draw(ctx) {
         super.draw(ctx);
         this.game.ctx.lineWidth = 3;
         this.game.ctx.strokeStyle = "#FFFFFF";
         ctx.strokeRect(this.x, this.y -8, 100,10);
         this.game.ctx.fillStyle = this.color;
         this.game.ctx.fillRect(this.x, this.y -8, this.widthBar, this.heightBar);

        
        ctx.drawImage(this.shooterImage,1353-(this.frame * this.spriteWidth),0,this.spriteWidth,this.spriteHeight, this.x, this.y, this.spriteWidth,this.spriteHeight)
    
        this.game.ctx.fillText(this.lives, this.x + (this.width / 2), this.y + (this.height / 2))

    }
}