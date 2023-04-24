import Player from "../lib/Player.js";
import InputTracker from "../lib/InputTracker.js";
import BattleBlock from "../lib/BattleBlock.js";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);}

export default class Game {

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.fillCanvas();
        this.gameObjects = [];

        this.defaultLives = 300;

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

        this.gameObjects.push(this.player);
        

        let iterator = 1;
        let lines = 10;
        
        setInterval(() => {
        
            if (iterator === lines)
                iterator = 1;
        
                
                this.gameObjects.push(new BattleBlock(this, "#cccc46", getRandomInt(3, 10),canvas.width - 60,canvas.height / lines * iterator ));
        
        
            iterator++;
        
        }, 500)




        this.inputTracker = new InputTracker();

        window.addEventListener('resize', this.fillCanvas.bind(this));
        window.addEventListener('load', this.fillCanvas.bind(this));
    }

    removeGameObject(gameObject) {
        let index = this.gameObjects.indexOf(gameObject);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }


    fillCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.fillStyle = "#123456";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    update() {
        for (let gameObject of this.gameObjects) {
            gameObject.update();
        }


        for (let i = 0; i < this.gameObjects.length; i++) {
            for (let j = 0; j < this.gameObjects.length; j++) {
                if (i != j) {
                    let gameObject1 = this.gameObjects[i];
                    let gameObject2 = this.gameObjects[j];

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

        for (let gameObject of this.gameObjects) {
            gameObject.draw(ctx);
        }
        ctx.fillText("Lives:"+this.player.lives, 200 ,60);
        //ctx.fillText("Kills:"+this.BattleBlock.enemyCount, 200 ,80);
    }

    loop() {
        this.update();
        this.draw(this.ctx);
        requestAnimationFrame(this.loop.bind(this));
    }
}

const game = new Game();
game.loop();