// New:
// Canvas 
// Objects inside Arrays 
// addEventListener 
// pop and unshift 
// clearInterval 

// Problem: 
// Food spawning on top of Lights 

// Set up canvas 
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

// Background Image 
var backgroundImage = new Image();
// Food Image 
var item = new Image();
backgroundImage.src = "grid_updated.png";
item.src = "item.png";

var exclamation = new Image();
exclamation.src = "exclamation.png";

var gameOverScreen = new Image();
gameOverScreen.src = "gameOverScreen.png";

// Audio
var cavernMusic = new Audio();
var encounterMusic = new Audio();
var snakeScream = new Audio();
var gameOverTheme = new Audio();
var alertSound = new Audio();
var collectItem = new Audio();

cavernMusic.src = "cavern.mp3";
cavernMusic.currentTime = 0.5;
encounterMusic.src = "encounter.mp3";
snakeScream.src = "scream.mp3";
gameOverTheme.src = "gameovertheme.mp3";
alertSound.src = "alert.mp3";
collectItem.src = "collect.mp3";



// Dimension of each grid space 
var box = 32;
var score = 0; 

// Speed the snake moves 
var speed = 100;
var alert = false; 

// Snake Object, (x,y) coordinate system 
var snake = [];
snake[0] ={x: 9 * box, y: 10 * box};


// Generate random food coordinates 
var food = {x: (Math.floor(Math.random() * 17) + 1) * box,
            y: (Math.floor(Math.random() * 15) + 3) * box
};

var light_color = "yellow";

var light = {
    number: 1,
    position: [],
    countdown: 3
};

light.position[0] = {x: (Math.floor(Math.random() * 17) + 1) * box,
            y: (Math.floor(Math.random() * 15) + 3) * box
};

function addLight(){
    light.position[light.number] = {x: (Math.floor(Math.random() * 17) + 1) * box,
        y: (Math.floor(Math.random() * 15) + 3) * box
    };

    while(foodSpawn(light.position,snake) && itemSpawn(light.position[light.number],food)){
        light.position[light.number] = {x: (Math.floor(Math.random() * 17) + 1) * box,
            y: (Math.floor(Math.random() * 15) + 3) * box
        }; 
    }
    ++(light.number);
}

var d;
var n;
// Event when key is pressed, direction function called 
document.addEventListener("keydown", direction);
function direction(event){
    // Each direction on keyboard associated with a number key 
    if(event.keyCode == 37 && d != "RIGHT"){
        d = "LEFT";
    }else if (event.keyCode == 38 && d != "DOWN"){
        d = "UP";
    }else if (event.keyCode == 39 && d != "LEFT"){
        d = "RIGHT";
    }else if (event.keyCode == 40 && d != "UP"){
        d = "DOWN";
    }

    if(event.keyCode == 78){
        food = {x: (Math.floor(Math.random() * 17) + 1) * box,
            y: (Math.floor(Math.random() * 15) + 3) * box
        };
    }
}

function triggerAlert(){
    for(var i = 0; i < light.number; ++i){
        if(snake[0].x == light.position[i].x && snake[0].y == light.position[i].y){
            cavernMusic.pause();
            alertSound.play();
            alert = true;
            light.countdown--;
            if(light.countdown == 0){
                light_color = "red";
            }
            if(light.countdown < 0){
                clearInterval(gameStart);
                encounterMusic.pause();
                snakeScream.play();
                
        
                setTimeout(function(){
                    encounterMusic.pause();
                    gameOverTheme.play();
                    ctx.drawImage(gameOverScreen,0,96);
                    document.getElementById('restart').hidden = false;
                },1200)
                break;
            }
        }
    }
}

function drawImage(){

    triggerAlert();

    if(!alert){
        cavernMusic.play();
        cavernMusic.loop = true;
    }

    if(alert){
        setTimeout(function(){
            encounterMusic.play();
        },1000);
    }
    
    // Draw Background Image 
    ctx.drawImage(backgroundImage,0,0);

    // Score 
    
    ctx.fillStyle = "white";
    ctx.font = "45px Comic Sans";
    ctx.fillText(score,2*box,1.6*box);

    // Add the first light 
    for(var i = 0; i < light.number; ++i){
        ctx.fillStyle = light_color;
        ctx.fillRect(light.position[i].x,light.position[i].y,box,box)
    }

    // Draw the Snake 
    for(var i = 0; i < snake.length; ++i){
        if(i == 0){
            ctx.fillStyle = "#F1EDC4";
            ctx.fillRect(snake[i].x,snake[i].y,box,box);
        }else{
            ctx.fillStyle = "#353535";
            ctx.fillRect(snake[i].x,snake[i].y,box,box);
        }
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }

    // Draw Food 
    ctx.drawImage(item,food.x,food.y);
    ctx.drawImage(item,20,20);
    // Snake Head (Old Position)
    snakeX = snake[0].x;
    snakeY = snake[0].y;

    // Check which direction player is currently moving in, update head position  
    if(d == "RIGHT"){
        snakeX += box;
    }else if (d == "LEFT"){
        snakeX -= box;
    }else if (d == "UP"){
        snakeY -= box;
    }else if (d == "DOWN"){
        snakeY += box;
    }

        // Create new Head object 
        var newHead = {
            x: snakeX,
            y: snakeY
        }

          

    // See if the player has reached a Game Over 
    if(snake[0].x < box || snake[0].x > box * 17 || snake[0].y < box * 3 || snake[0].y > box * 17 || collison(newHead,snake)){
        clearInterval(gameStart);
        cavernMusic.pause();
        snakeScream.play();
        

        setTimeout(function(){
            gameOverTheme.play();
            encounterMusic.pause();
            ctx.drawImage(gameOverScreen,0,96);
            document.getElementById('restart').hidden = false;
        },1200)
    }
    // Add Head to front of the Snake array  
    snake.unshift(newHead);

    if(snake[0].x == food.x && snake[0].y == food.y){
        collectItem.play();
        addLight();
        score++;
        // Generate new coordinates for food 
        food = {x: (Math.floor(Math.random() * 17) + 1) * box,
            y: (Math.floor(Math.random() * 15) + 3) * box
        };

        // Ensures food doesn't spawn on top of the Snake 
        while(foodSpawn(food,snake) && foodSpawnLight(food,light)){
            food = {x: (Math.floor(Math.random() * 17) + 1) * box,
                y: (Math.floor(Math.random() * 15) + 3) * box
            };
        }
        // Add new head without using snake pop therefore adding a new tail  
    }else{
        // Pop no longer needed tail piece after Head updates 
        snake.pop(); 
    }

}

// Check to see if Snake collided with himself 
function collison(head,array){
    for(var i = 1; i < array.length-1; ++i){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// Finds new coordinates for food 
function foodSpawn(food,snake){
    for(var i = 0; i < snake.length; ++i){
        if(food.x == snake[i].x && food.y == snake[i].y){
            return true;
        }
    }
    return false;
}

function itemSpawn(light,food){
    if(light.x == food.x && light.y == food.y){
            return true;
    }   
    return false;
}

function foodSpawnLight(food,light){
    for(var i = 0; i < light.number; ++i){
        if(food.x == light.position[i].x && food.y == light.position[i].y){
            return true;
        }
    }
    return false;
}

function restartGame(){
    location.reload();
}


var gameStart = setInterval(function(){  
    drawImage();
},200);

function easyGame(){
    speed = 100;
}

function hardGame(){
    speed = 50;
}

// Food not generated where Snake is 
// Music and SFX 
// Images, Scoreboard, ! 
// Color Scheme 
// Restart 









