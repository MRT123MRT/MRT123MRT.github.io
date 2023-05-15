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
        this.battleBlock = [];
        this.killCount = 0;
        this.defaultLives = 30;
        this.isPause = true;
        this.isGameOver = false;

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

        this.gameObjects.push(this.player);
        this.gameStarted = false;
        this.line = this.canvas.width / 3;

        let battleBlockSpeed = 1;

        setInterval(() => {
            if (this.isPause === true) return;
            this.gameObjects.push(new BattleBlock(this, getRandomInt(3, 10), canvas.width - 60, getRandomInt(80, this.canvas.height - 100), battleBlockSpeed));
            battleBlockSpeed += 0.1;
        }, 1000 - battleBlockSpeed)


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

    removeGameObject(gameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
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


    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    borderLine() {
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillStyle = "#8ed1a0"
        this.ctx.fillRect((this.line) - 10, 0, 10, this.canvas.height);
    }

    fillCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.fillStyle = "#16011e";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    update() {
        ``

        if (this.isPause === true || this.isGameOver === true) return;

        for (const gameObject of this.gameObjects) {
            gameObject.update();
        }


        for (let i = 0; i < this.gameObjects.length; i++) {
            for (let j = 0; j < this.gameObjects.length; j++) {
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
        for (const gameObject of this.gameObjects) {
            ctx.save();
            gameObject.draw(ctx);
            ctx.restore();
        }


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