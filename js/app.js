//random function for placing enemies and items
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ENEMIES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
var gameStatus = 0; //changes to 1 when game is over
var Enemy = function() {
    this.sprite = ['images/smurfShip.png', 'images/gameOver.png'];
    this.cross = [108, 191, 274, 357];
    this.startCross = getRandom(0, 4);
    this.y = this.cross[this.startCross];
    this.x = -102;
    this.speed = getRandom(100, 200);
    this.right = this.x + 96;
    this.lane = this.y + 36;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // increase new enemy speed every time player makes it back to start
    this.x = this.x + (this.speed + (returns * 15)) * dt;
    this.right = this.x + 96;
    // remove enemies if out of screen
    if (this.x > 606) {
        var index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
    }
}
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[gameStatus]), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

function newEnemies() {
    //Create new enemy (smurfShip)
    var enemy = new Enemy();
    //Add enemy to allEnemies array
    allEnemies.push(enemy);
}

//Create enemies at intervals, adjusted based on level
var spawnInterval = setInterval(newEnemies, 1500);

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX PLAYER XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
var Player = function() {
    this.direction = 0;
    this.sprite = ['images/frogShipUp.png',
        'images/frogShipDn.png'
    ];
    this.x = 286;
    this.y = 425;
    this.lane = this.y + 51;
}

//assigns 1 and 0 to direction ship is going, for use in rendering
Player.prototype.update = function() {
    if (this.y >= 425) {
        this.direction = 0;
    } else if (this.y <= 11) {
        this.direction = 1;
    } else {};
    this.lane = this.y + 51;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[this.direction]), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    // move player within the canvas
    if (key === "up") {
        if (this.y - 83 >= -15) {
            this.y = this.y - (83);
            this.direction = 0;
        }
    } else if (key === "down") {
        if (this.y + 83 <= 425) {
            this.y = this.y + 83;
            this.direction = 1;
        }
    } else if (key === "right") {
        if (this.x + 86 <= 631) {
            this.x = this.x + (86);
        }
    } else if (key === "left") {
        if (this.x - 86 >= -2) {
            this.x = this.x - (86);
        }
    }
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ITEMS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Create BonusItem superclass render and update functions
var BonusItem = function() {
    this.imgCount = 0;
}
BonusItem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[this.imgCount]), this.x, this.y);
}
BonusItem.prototype.update = function(calls) {
    //iterate throught the sprites for items to "animate"
    if (calls % 10 === 0) {
        this.imgCount++;
        if (this.imgCount === 8) {
            this.imgCount = 0;
        };
    };
}
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX SHIELDS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//create BonusItem shield objects
var Shield = function() {
    BonusItem.call(this);
    this.sprite = ['images/shield-0.png', 'images/shield-1.png',
        'images/shield-2.png', 'images/shield-3.png', 'images/shield-0.png',
        'images/shield-1.png', 'images/shield-2.png', 'images/shield-3.png'
    ];
    this.row = [119, 202, 285, 368];
    this.startRow = getRandom(0, 4);
    this.y = this.row[this.startRow];
    this.col = [31, 117, 203, 289, 375, 461, 547];
    this.startCol = getRandom(0, 7);
    this.x = this.col[this.startCol];
    this.lane = this.y + 25; //common y reference
    this.center = this.x + 27; //common x reference
}
Shield.prototype = Object.create(BonusItem.prototype);
Shield.prototype.constructor = Shield;

var ShieldDeployed = function() {
    BonusItem.call(this);
    this.sprite = 'images/ShipShieldLt.png';
    this.y = 0;
    this.x = 0;

}
ShieldDeployed.prototype = Object.create(BonusItem.prototype);
ShieldDeployed.prototype.constructor = ShieldDeployed;
ShieldDeployed.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), player.x - 23, player.y);
}
var newShield = new ShieldDeployed;

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXX WEAPONS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//create BonusItem Weapon objects **not yet implemented
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

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXX EXPLOSIONS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
var Boom = function() {
    BonusItem.call(this);
    this.sprite = ["images/boom-1.png", "images/boom-2.png",
        "images/boom-3.png", "images/boom-4.png", "images/boom-5.png",
        "images/boom-6.png", "images/boom-7.png", "images/boom-8.png"
    ];
    this.x = 0;
    this.y = 0;
    this.update = function(calls) {
        if (calls % 10 === 0) {
            this.imgCount++;
            if (8 === this.imgCount) {
                var index = allItems.indexOf(this);
                allItems.splice(index, 1);
                this.imgCount = 0
            }
        }
    };
};
Boom.prototype = Object.create(BonusItem.prototype);
Boom.prototype.constructor = Boom;
var boom = new Boom;

var allItems = [];

function newItem() {
    var shield = new Shield();
    allItems.push(shield);
}
newItem();
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXX COLLISIONS DETECTION XXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

var lives = 3, //Lives counter
    kills = 0, //kill counter **not yet implemented
    shields = 0; //how many shields the player has

function checkCollisions() {
    if (allEnemies.length >= 1) {
        allEnemies.forEach(function(enemy) {
            //Check location of all enemies against player location
            //check for shield and blow up enemy, iterate kill count
            if (allItems.indexOf(newShield) > -1) {
                if (player.lane === enemy.lane) {
                    if (player.x > enemy.x - 50 && player.x - 23 < enemy.right) {
                        //update location for explosion and add it
                        boom.x = enemy.x + 12;
                        boom.y = enemy.y;
                        allItems.push(boom);
                        //blow up the enemy
                        var enemyIndex = allEnemies.indexOf(enemy);
                        allEnemies.splice(enemyIndex, 1);
                        kills++;
                        //remove the shield
                        var shieldIndex = allItems.indexOf(newShield);
                        allItems.splice(shieldIndex, 1);
                        shields--;
                    }
                }
            };
            if (player.lane === enemy.lane) {
                if (player.x > enemy.x - 50 && player.x < enemy.right) {
                    boom.x = player.x - 8;
                    boom.y = player.y + 6;
                    allItems.push(boom);
                    lives--;
                    //check if layer has any lives left
                    if (lives > 0) {
                        //reposition back to start
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
                }
            }
        });
    }
    //CHECKS FOR AND PICKS UP ITEMS
    if (allItems.length >= 1) {
        allItems.forEach(function(item) {
            //check location of ship against items
            if (player.lane === item.lane) {
                if (player.x + 30 === item.center) {
                    //pick up item
                    var index = allItems.indexOf(item);
                    allItems.splice(index, 1);
                    allItems.push(newShield);
                    shields++;
                };
            };
        });
    }
}


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXX LEVEL UP XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// increase difficulty when player makes it back to start after reaching
// the other side.  
var goal = 0; //update when player reaches other side
var returns = 0; //update when player returns to start

function levelUp() {
    if (61 === player.lane)
        if (goal === returns) goal++;
    if (476 === player.lane) {
        if (goal > returns) {
            returns++; //used to increase enemy.speed
            //add a new enemy spawn interval every 10 seconds
            spawnInterval = setInterval(newEnemies, 10000);
            //add another shield to the map
            newItem();
        }
    }
}