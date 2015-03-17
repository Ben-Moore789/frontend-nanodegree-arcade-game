//function to assist in placing enemies and items randomly
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ENEMIES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
var gameStatus = 0; //this variable is used to change enemy sprite when game is over

var Enemy = function() {
    this.sprite = ['images/smurfShip.png', 'images/gameOver.png'];
    this.cross = [108, 191, 274, 357]; // y position lanes
    this.startCross = getRandom(0, 4);
    this.y = this.cross[this.startCross]; //place enemy in random crossing lane
    this.x = -102;
    this.speed = getRandom(100, 200); //number to adjust enemy speed
    this.right = this.x + 96; //right edge of enemy for collision detection
    this.lane = this.y + 36; //lane designation for collision detection
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // incorporating the returns variable increases the speed of all new enemies
    // as the player progesses through the game, therefore increasing difficulty
    this.x = this.x + (this.speed + (returns * 15)) * dt;
    this.right = this.x + 96;
    // remove enemies if out of screen
    if (this.x > 606) {
        var index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
    }
};

// Draw the enemy on the screen, if the game is over, enemy sprite is "Game Over"
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[gameStatus]), this.x, this.y);
};

//instantiate enemies
var allEnemies = [];

function newEnemies() {
    //Create new enemy (smurfShip)
    var enemy = new Enemy();
    //Add enemy to allEnemies array
    allEnemies.push(enemy);
};

//Create enemies at intervals, additions handled in levelUP function
var spawnInterval = setInterval(newEnemies, 1500);

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX PLAYER XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
var Player = function() {
    this.direction = 0; //up or down determines sprite
    this.sprite = [ "images/frogShipUp.png", "images/frogShipDn.png" ];
    this.x = 286;
    this.y = 425;
    this.lane = this.y + 51;
};


Player.prototype.update = function() {
    //if the player is at the bottom of the screen, turn him to face up
    //if he is a the top, turn him around
    if (this.y >= 425) this.direction = 0; else if (this.y <= 11) this.direction = 1;
    this.lane = this.y + 51;//updates the lane property for collision detection
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[this.direction]), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if ("up" === key) {
        if (this.y - 83 >= -15) {
            this.y -= 83;
            this.direction = 0;
        }
    } else if ("down" === key) {
        if (this.y + 83 <= 425) {
            this.y += 83;
            this.direction = 1;
        }
    } else if ("right" === key) {
        if (this.x + 86 <= 606) {
            this.x += 86;
        }
    } else if ("left" === key) 
        if (this.x - 86 >= -2){ 
            this.x -= 86;
        }
};

//instantiate player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(a) {
    var keys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    player.handleInput(keys[a.keyCode]);
});

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ITEMS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Create BonusItem superclass render and update functions
var BonusItem = function() {
    this.imgCount = 0;
}

BonusItem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[this.imgCount]), this.x, this.y);
}

BonusItem.prototype.update = function(calls) {
    //this function animates the objects. every tenth time the update function
    //is called for the object, the imgCount property is iterated allowing 
    //for iteration through the sprites assigned to that object
    if (calls % 10 === 0) {
        this.imgCount++;
        if (this.imgCount === 8) { //here it checks to see if an item is at it's last sprite
            if (this === boom){ //here it checks if the item is actually an explosion
                var index = allItems.indexOf(this); //and removes it if it is
                allItems.splice(index,1);
                this.imgCount = 0; //set imgCount back to 0 for new versions
            }else{this.imgCount = 0;//normal items start the sequence of sprites over
            };
        };
    }
}

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX SHIELDS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//create BonusItem shield objects
var Shield = function() {
    BonusItem.call(this);
    this.sprite = [ "images/shield-0.png", "images/shield-1.png", 
        "images/shield-2.png", "images/shield-3.png", "images/shield-0.png", 
        "images/shield-1.png", "images/shield-2.png", "images/shield-3.png"];
    this.row = [ 119, 202, 285, 368 ]; //list of y positions for lanes
    this.startRow = getRandom(0, 4); 
    this.y = this.row[this.startRow]; //assign random y position
    this.col = [ 31, 117, 203, 289, 375, 461, 547 ]; //list of x positions
    this.startCol = getRandom(0, 7); 
    this.x = this.col[this.startCol];//assign random x position
    this.lane = this.y + 25; //common y reference for collision detection
    this.center = this.x + 27; //common x reference for collision detection
}

Shield.prototype = Object.create(BonusItem.prototype);

Shield.prototype.constructor = Shield;

function newShield() {
    //Create new shield
    var shield = new Shield();
    //Add shield to items array
    allItems.push(shield);
};

//once the shield is picked up, it is deployed, this is the deployed shield object
var ShieldUp = function() {
    BonusItem.call(this);
    this.sprite = 'images/ShipShieldLt.png';
    this.y = 0; //updates when picked up
    this.x = 0; //updates when picked up
}
ShieldUp.prototype = Object.create(BonusItem.prototype);

ShieldUp.prototype.constructor = ShieldUp;

ShieldUp.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), player.x - 23, player.y);
}

var shieldUp = new ShieldUp;

//XXXXXXXXXXXXXXXXXXXXXXXXXXXX WEAPONS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//**not yet implemented, work in progress
//create BonusItem Weapon objects 
// var Weapon = function() {
//     BonusItem.call(this);
//     this.sprite = ['images/strike-1.png', 'images/strike-2.png',
//         'images/strike-3.png', 'images/strike-4.png', 'images/strike-5.png',
//         'images/strike-6.png', 'images/strike-7.png', 'images/strike-8.png'
//     ];
//     this.x = 96;
//     this.y = 41;
//     this.lane = this.y + 20;
//     this.center = this.x + 35;
// }
// Weapon.prototype = Object.create(BonusItem.prototype);
// Weapon.prototype.constructor = Weapon;

//XXXXXXXXXXXXXXXXXXXXXXXXX EXPLOSIONS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//explosion animation for ships
var Boom = function() {
    BonusItem.call(this);
    this.sprite = ["images/boom-1.png", "images/boom-2.png",
        "images/boom-3.png", "images/boom-4.png", "images/boom-5.png",
        "images/boom-6.png", "images/boom-7.png", "images/boom-8.png"
    ];
    this.x = 0; //updates when created
    this.y = 0; //updates when created
};

Boom.prototype = Object.create(BonusItem.prototype);

Boom.prototype.constructor = Boom;

var boom = new Boom;

//instantiate items list
var allItems = [];

//XXXXXXXXXXXXXXXXXXXXXX COLLISIONS DETECTION XXXXXXXXXXXXXXXXXXXXXXXXX
var lives = 3, //Lives counter
    kills = 0, //kill counter
    shields = 0; //how many shields the player has

function checkCollisions() {
   allEnemies.forEach(function(enemy) {
        //Check location of all enemies against player location
        //check for shield and blow up enemy, iterate kill count
        if (player.lane === enemy.lane && player.x > enemy.x - 50 && player.x - 23 < enemy.right) {
            if (allItems.indexOf(shieldUp) > -1) {                
                //update location for explosion and add it
                boom.x = enemy.x + 12;
                boom.y = enemy.y;
                allItems.push(boom);
                //blow up the enemy
                var enemyIndex = allEnemies.indexOf(enemy);
                allEnemies.splice(enemyIndex, 1);
                kills++;
                //remove the shield
                var shieldIndex = allItems.indexOf(shieldUp);
                allItems.splice(shieldIndex, 1);
                shields--;
            } else {
                //if there is a collision and the player has no shields
                //first blow up the player
                boom.x = player.x - 8;
                boom.y = player.y + 6;
                allItems.push(boom);
                lives--;//lose a life
                //check if player has any lives left
                if (lives > 0) {
                    //reposition back to start if has lives
                    player.x = 286;
                    player.y = 425;
                } else {
                    // move off screen
                    player.x = -100;
                    player.y = 425;
                    // change gameStatus to game over
                    Enemy.x = -506;
                    gameStatus = 1;
                };
            };
        }
    });
    //CHECKS FOR AND PICKS UP ITEMS
    if (allItems.length >= 1) {
        allItems.forEach(function(item) {
            //check location of ship against items
            if (player.lane === item.lane && player.x + 30 === item.center) {
                //pick up item
                var index = allItems.indexOf(item);
                allItems.splice(index, 1);
                allItems.push(shieldUp);
                shields++;
            };
        });
    }
}

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXX LEVEL UP XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// increase difficulty when player makes it back to start after reaching
// the other side.  
var goal = 0, //update when player reaches other side
    returns = 0; //update when player returns to start

function levelUp() {
    if (61 === player.lane && goal === returns) goal++;
    if (476 === player.lane && goal > returns) {
        //when the player returns to the beginning after having reached the other side:
        returns++; //iterate returns indicating diffculty level
        spawnInterval = setInterval(newEnemies, 1e4); // add a new enemy spawn every 10 seconds
        newShield(); //add a new shield to the map
    }
}