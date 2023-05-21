import Player from "../lib/Player.js";
import InputTracker from "../lib/InputTracker.js";
import BattleBlock from "../lib/BattleBlock.js";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

class Game {

    constructor() {

        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.fillCanvas();
        //this.gameObjects = [];
        this.bullets = [];
        this.battleBlocks = [];
        this.killCount = 0;
        this.defaultLives = 30;
        this.isPause = true;
        this.isGameOver = false;
        this.minBattelBlockXp = 3;
        this.maxBattelBlockXp = 10;
        this.minYspawn = 80;
        this.maxYspawn = this.canvas.height - 100;

        this.lineXposition = this.canvas.width / 3;
        this.lineTransparency = 0.2;
        this.lineWidth = 10;
        this.lineYposition = 0;

        this.player = new Player(this,
            {
                up: 'ArrowUp',
                down: 'ArrowDown',
                left: 'ArrowLeft',
                right: 'ArrowRight',
                shoot: 'e'
            },
            "#2f9146",
            this.defaultLives,

        )

        document.getElementById("resumeBtn").addEventListener("click", this.resume.bind(this));
        document.getElementById("startBtn").addEventListener("click", this.resume.bind(this));
        window.addEventListener("blur", this.pause.bind(this))

        this.gameStarted = false;


        let battleBlockSpeed = 1;
        setInterval(() => {
            if (this.isPause === true) return;
            this.battleBlocks.push(new BattleBlock(this, getRandomInt(this.minBattelBlockXp, this.maxBattelBlockXp), canvas.width, getRandomInt(this.minYspawn, this.maxYspawn), battleBlockSpeed));
            battleBlockSpeed += 0.1;
        }, 1000)


        this.inputTracker = new InputTracker();

        window.addEventListener('resize', this.fillCanvas.bind(this));
        window.addEventListener('load', this.fillCanvas.bind(this));

        window.addEventListener('keyup', ((event) => {
            if (event.key === ' ') {
                if (this.isGameOver)
                    location.reload();
                if (this.isPause)
                    this.resume();
                else
                    this.pause();
            }
        }).bind(this))

    }

    removeBattleBlockObject(gameObject) {
        const index = this.battleBlocks.indexOf(gameObject);
        if (index > -1) {
            this.battleBlocks.splice(index, 1);
        }
    }

    removeBulletObject(gameObject) {
        const index = this.bullets.indexOf(gameObject);
        if (index > -1) {
            this.bullets.splice(index, 1);
        }
    }

    resume() {
        if (this.gameOver === true) return;
        console.log("resume");
        this.isPause = false
        document.getElementById("startPopup").classList.add("hidden");
        document.getElementById("resumePopup").classList.add("hidden");
    }

    pause() {
        console.log("pause");
        this.isPause = true
        document.getElementById("startPopup").classList.add("hidden");
        document.getElementById("resumePopup").classList.remove("hidden");
    }

    gameOver() {
        this.isGameOver = true;
        this.isPause = true;
        document.getElementById("gameOverPopup").classList.remove("hidden");
        document.getElementById("gameOverPopup").classList.add("game_over");
        localStorage.setItem("record", this.player.record);
    }


    addBulletObject(gameObject) {
        this.bullets.push(gameObject);
    }

    borderLine() {
        this.ctx.globalAlpha = this.lineTransparency;
        this.ctx.fillStyle = "#8ed1a0"
        this.ctx.fillRect(this.lineXposition - this.lineWidth, this.lineYposition, this.lineWidth, this.canvas.height);
    }

    fillCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.fillStyle = "#16011e";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    update() {
        if (this.isPause === true || this.isGameOver === true) return;

        const gameObjects = [...this.battleBlocks, ...this.bullets, this.player];
        for (const gameObject of gameObjects) { gameObject.update(); }

        for (let i = 0; i < gameObjects; i++) {
            for (let j = 0; j < gameObjects; j++) {
                if (i != j) {
                    const gameObject1 = this.gameObjects[i];
                    const gameObject2 = this.gameObjects[j];

                    if (gameObject1?.inCollisionWith(gameObject2)) {
                        gameObject1?.onCollision(gameObject2);
                        gameObject2?.onCollision(gameObject1);
                    }
                }
            }
        }

    }

    draw(ctx) {

        this.fillCanvas();
        ctx.save();
        this.borderLine();
        ctx.restore();

        for (const gameObject of this.bullets) {
            ctx.save();
            gameObject.draw(ctx);
            ctx.restore();
        }

        for (const gameObject of this.battleBlocks) {
            ctx.save();
            gameObject.draw(ctx);
            ctx.restore();
        }

        ctx.save();
        this.player.draw(ctx);
        ctx.restore();

    }

    loop() {
        this.update();
        this.draw(this.ctx);

        requestAnimationFrame(this.loop.bind(this));
    }
}

const game = new Game();
game.loop();

export default game;