const board = document.querySelector('.board');
const startbutton = document.querySelector(".btn-start")
const modal = document.querySelector(".modal")
const startGameModal = document.querySelector(".start-game")
const gameOverModal = document.querySelector(".game-over")
const restartBtn = document.getElementById("restart");
const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")

const blockSize = 21;
const boardSize = 420;

let highScore = localStorage.getItem("highScore") || 0
let score = 0
let time = "00-00"

highScoreElement.innerText = highScore

const rows = boardSize / blockSize;
const cols = boardSize / blockSize;

board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

const blocks = {};

// grid create
for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);

        blocks[`${row}-${col}`] = block;
    }
}

// snake
let snake = [
    {x:5,y:5},
    {x:4,y:5},
    {x:3,y:5}
];

let direction = "down";
let intervalId = null;
let timeIntervalId = null;

let food = {
    x:Math.floor(Math.random()*rows),
    y:Math.floor(Math.random()*cols)
}

// render
function render(){

    Object.values(blocks).forEach(block=>{
        block.classList.remove("fill","food");
    });

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });

    blocks[`${food.x}-${food.y}`].classList.add("food");
}

// move snake
function move(){

    let head = {...snake[0]};

    if(direction === "left") head.y -= 1;
    if(direction === "right") head.y += 1;
    if(direction === "up") head.x -= 1;
    if(direction === "down") head.x += 1;

    // wall collision
    if(
        head.x < 0 ||
        head.y < 0 ||
        head.x >= rows ||
        head.y >= cols
    ){
        clearInterval(intervalId)

        modal.style.display ="flex"
        startGameModal.style.display ="none"
        gameOverModal.style.display ="flex"

        return
    }

    // food eat
    if(head.x === food.x && head.y === food.y){

        snake.unshift(head)

        food = {
            x:Math.floor(Math.random()*rows),
            y:Math.floor(Math.random()*cols)
        }

        score += 10
        scoreElement.innerText = score

        if(score > highScore){
            highScore = score
            localStorage.setItem("highScore",highScore)
            highScoreElement.innerText = highScore
        }

    }else{

        snake.unshift(head)
        snake.pop()

    }

    render()
}

// keyboard control
document.addEventListener("keydown",(e)=>{

    if(e.key === "ArrowUp" && direction !== "down")
        direction = "up";

    else if(e.key === "ArrowDown" && direction !== "up")
        direction = "down";

    else if(e.key === "ArrowLeft" && direction !== "right")
        direction = "left";

    else if(e.key === "ArrowRight" && direction !== "left")
        direction = "right";

})

// start game
startbutton.addEventListener("click",()=>{

    modal.style.display ="none"

    intervalId = setInterval(move,200)

    timeIntervalId = setInterval(()=>{

        let [min,sec] = time.split("-").map(Number)

        if(sec == 59){
            min += 1
            sec = 0
        }else{
            sec += 1
        }

        time = `${min}-${sec}`
        timeElement.innerText = time

    },1000)

})

// restart
function restartGame(){

    snake = [
        {x:5,y:5},
        {x:4,y:5},
        {x:3,y:5}
    ]

    score = 0
    scoreElement.innerText = score

    food = {
        x:Math.floor(Math.random()*rows),
        y:Math.floor(Math.random()*cols)
    }

    modal.style.display ="none"

    render()

}

if(restartBtn){
    restartBtn.addEventListener("click",restartGame)
}

// first render
render()