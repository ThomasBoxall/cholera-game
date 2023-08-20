// game-board vars
let board;
let boardWidth = window.innerWidth < 750 ? window.innerWidth - 20 : 750;
let boardHeight = 250;
let context;


// peson
let personWidth = 40;
let personHeight = 40;
let personX = 50;
let personY = boardHeight - personHeight;
let personImg;

let person = {
    x : personX,
    y : personY,
    width : personWidth,
    height : personHeight
}

// cholera
let choleraArray = [];

let choleraWidth = 40;
let choleraHeight = 40;
let choleraX = boardWidth - 30;
let choleraY = boardHeight - choleraHeight;

let choleraImg;

// physics vars (fixed)
let VELOCITYX_FIXED = -8 // cholera moving left speed
let VELOCITYY_FIXED = -1;
let GRAVITY_FIXED = 0.4;

// physics vars (changed in game)
let velocityX;
let velocityY;
let gravity;

// game control vars
let gameOver = false;
let score = 0;
let gameOverBigText;
let introText;
let choleraInterval;


window.onload = function(){
    board = document.getElementById("game-board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    gameOverBigText = document.getElementById("go-big-text");
    introText = document.getElementById("big-text");

    loadingMenu();
}

function loadingMenu(){
    // entry point to the game, holds at a "press to start"

    introText.innerHTML = "Tap or press space to start";
    
    document.addEventListener("keydown", checkInitGame);
    document.addEventListener("click", checkInitGame);
}

function checkInitGame(e){
    // starts the game 
    console.log(e);
    if (e.isTrusted == true){
        // let introText = document.getElementById("big-text");
        introText.innerHTML = "";
        gameOverBigText.innerHTML = "";
        document.removeEventListener("keydown", checkInitGame);
        document.removeEventListener("click", checkInitGame);
        console.log("Cheese");
        starGame();
    }
    
}

function starGame(){
    // sets up game values then launches into mainGameLoop

    // draw person
    personImg = new Image();
    personImg.src = "./assets/person.png";
    personImg.onload = function(){
        context.drawImage(personImg, person.x, person.y, person.width, person.height);
    }

    choleraImg = new Image();
    choleraImg.src = "./assets/microbe.png";

    gameOver = false;
    choleraArray = [];
    score = 0; 

    velocityX = VELOCITYX_FIXED;
    velocityY = VELOCITYY_FIXED;
    gravity = GRAVITY_FIXED;
    
    choleraInterval = setInterval(placeCholera, 1000) // 1000ms
    document.addEventListener("keydown", movePerson);
    document.addEventListener("click", movePerson);
    mainGameLoop();    
}

function mainGameLoop(){
    console.log("daveE");
    let updateFrame = requestAnimationFrame(mainGameLoop);
    if(gameOver){
        gameOverBigText.innerHTML = `Game Over! You Scored ${score}`;
        document.removeEventListener("keydown", movePerson);
        document.removeEventListener("click", movePerson);
        clearInterval(choleraInterval);
        cancelAnimationFrame(updateFrame);
        loadingMenu();
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    person.y = Math.min(person.y+ velocityY, personY);
    context.drawImage(personImg, person.x, person.y, person.width, person.height);

    // loop thru choleras and draw them on canvas also check for collisions and kill person if touching
    for (let i = 0; i < choleraArray.length; i++){
        let cholera = choleraArray[i];
        cholera.x += velocityX; // moves cholera along desired amount
        context.drawImage(cholera.img, cholera.x, cholera.y, cholera.width, cholera.height);

        // now detect collisions
        if (detectCollisions(person, cholera)){
            gameOver = true;
            personImg.src = "./assets/person-dead.png";
            personImg.onload = function(){
                context.drawImage(personImg, person.x, person.y, person.width, person.height);
            }
        }
    }

    // display the score
    // eventually do something else with this ie stick outside the canvas
    context.fillStyle="white";
    context.font="20px courier ";
    score++;
    context.fillText(`${score}`, boardWidth - 60, 20);
}

function movePerson(e){
    if ((e.code == "Space" || e.code == "ArrowUp" || e.type == "click") && person.y == personY){
        // jump 
        velocityY = -10
    } else if (e.code =="ArrowDown"){
        person.y = personY;
    }
}

function placeCholera(){
    let cholera = {
        img : choleraImg,
        x : choleraX,
        y : choleraY,
        width : choleraWidth,
        height: choleraHeight
    }

    choleraArray.push(cholera);

    if (choleraArray.length > 5){
        choleraArray.shift(); // deletes first element from the array to keep it short
    }
}

function detectCollisions(a, b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}