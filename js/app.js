//random function for placing enemies and items
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/smurfShip.png';
    this.cross = [108,191,274,357];
    this.startCross = getRandom(0,4);
    this.y = this.cross[this.startCross];
    this.x = -102;
    this.speed = getRandom(100,200);
    this.right = this.x+96;
    this.lane = this.y+36;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    this.right = this.x+96;
    // remove enemies if out of screen
    if (this.x > 606) {
        var index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
    }
}
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
function newEnemies(){
    //Create new enemy (smurfShip)
    var enemy = new Enemy();
    //Add enemy to allEnemies array
    allEnemies.push(enemy);
}

//Create enemies at 2second intervals
var spawnInterval = setInterval(newEnemies, 1500);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.direction = 0;
    this.sprite = ['images/frogShipUp.png',
        'images/frogShipDn.png'];
    this.x=273;
    this.y=425;
    this.lane = this.y+51;
}

Player.prototype.update=function(){
    if (this.y>=425) {
        this.direction=0;
    } else if (this.y<=11) {
        this.direction=1;
    }else{};
    this.lane = this.y+51;
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite[this.direction]), this.x, this.y);
}

Player.prototype.handleInput=function(key){
    // move player within the canvas
    if (key === "up") {
        if (this.y - 83 >= -15) {
            this.y = this.y - (83);
            this.direction=0;
        }
    } else if (key === "down") {
        if (this.y + 83 <= 425) {
           this.y = this.y + 83;
           this.direction=1;
        }
    } else if (key === "right") {
        if (this.x + 86 <= 606) {
           this.x = this.x + (86);
        }
    } else if (key === "left") {
        if (this.x - 86 >= -2) {
            this.x = this.x - (86);
        }
    }
}

// Place the player object in a variable called player
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

//Create BonusItem superclass render and update functions
var BonusItem = function(){
    this.imgCount=0;
}
BonusItem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite[this.imgCount]), this.x, this.y);
}
BonusItem.prototype.update = function(calls){
    if (calls%10===0) {
        this.imgCount++;
        if (this.imgCount===8) {
            this.imgCount=0;
        };
    };
}

//create BonusItem shield objects
var Shield = function(){
    BonusItem.call(this);
    this.sprite = ['images/shield-0.png','images/shield-1.png',
        'images/shield-2.png','images/shield-3.png', 'images/shield-0.png',
        'images/shield-1.png','images/shield-2.png','images/shield-3.png'];
    this.row = [119,202,285,368];
    this.startRow = getRandom(0,4);
    this.y = this.row[this.startRow];
    this.col = [18,104,190,276,362,448,534];
    this.startCol = getRandom(0,7);
    this.x = this.col[this.startCol];
    this.lane = this.y+25;
    this.center = this.x+27;
}
Shield.prototype = Object.create(BonusItem.prototype);
Shield.prototype.constructor = Shield;


//create BonusItem Weapon objects
var Weapon = function(){
    BonusItem.call(this);
    this.sprite = ['images/strike-1.png','images/strike-2.png',
        'images/strike-3.png','images/strike-4.png','images/strike-5.png',
        'images/strike-6.png','images/strike-7.png','images/strike-8.png'];
    this.x = 96;
    this.y = 41;
    this.lane = this.y+20;
    this.center = this.x+35;
}
Weapon.prototype = Object.create(BonusItem.prototype);
Weapon.prototype.constructor = Weapon;

var Boom = function() {
    BonusItem.call(this);
    this.sprite = [ "images/boom-1.png", "images/boom-2.png", 
        "images/boom-3.png", "images/boom-4.png", "images/boom-5.png", 
        "images/boom-6.png", "images/boom-7.png", "images/boom-8.png" ];
    this.x = 0;
    this.y = 0;
    this.update = function(calls) {
        if (calls % 10 === 0) {
            this.imgCount++;
            if (8 === this.imgCount) {
                var index = allItems.indexOf(this);
                allItems.splice(index, 1);
                this.imgCount=0
            }
        }
    };
};
Boom.prototype = Object.create(BonusItem.prototype);
Boom.prototype.constructor = Boom;
var boom = new Boom;

var allItems = [];
function newItem(){
    var shield = new Shield();
    allItems.push(shield);
    var weapon = new Weapon ();
    allItems.push(weapon);
}
newItem();

function checkCollisions() {
    if(allEnemies.length >= 1) {
        allEnemies.forEach(function(enemy) {
            //Check location of all enemies against player location
            //reset player if collision
            if(player.lane === enemy.lane){
                if (player.x > enemy.x-50 && player.x < enemy.right) {
                    boom.x=player.x-8;
                    boom.y=player.y+6;
                    allItems.push(boom);
                    player.x = 273;
                    player.y = 425;
                }
            }
        });
    }
    if(allItems.length >= 1) {
        allItems.forEach(function(item){
            //check location of ship against items
            //pick up item
            if(player.lane === item.lane){
                if (player.x+30 === item.center) {
                    var index = allItems.indexOf(item);
                    allItems.splice(index, 1);
                };
            };
        });
    }
}