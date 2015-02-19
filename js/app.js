//animation function for images
var calls=0; //counts number of times update is called
var imgCount=0; //counter for animating images
animate = function(){
    calls++;
    if (calls%10===0) {
        imgCount++;
        if (imgCount===8) {
            imgCount=0;
        };
    };
}
//random function for placing enemies and items
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/reaverShip.png';
    this.cross = [108,191,274,357];
    this.startCross = getRandom(0,3);
    this.y=this.cross[this.startCross];
    this.x=-102;
    this.speed = getRandom(140,200);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
}
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.sprite = 'images/serenityShip.png';
    this.x=359;
    this.y=425;
}

Player.prototype.update=function(dt){
    // this.x = this.x + this.speed * dt;
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // ctx.drawImage(Resources.get('images/ShipShieldLt.png'), this.x-20, this.y-5);
}

Player.prototype.handleInput=function(key){
    // move player within the canvas
    if (key === "up") {
        if (this.y - 83 >= -15) {
            this.y = this.y - (83);
        }
    } else if (key === "down") {
        if (this.y + 83 <= 425) {
           this.y = this.y + 83;
        }
    } else if (key === "right") {
        if (this.x + 86 <= 606) {
           this.x = this.x + (86);
        }
    } else {
        if (this.x - 86 >= -2) {
            this.x = this.x - (86);
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < 5; i++) {
    allEnemies.push( new Enemy());
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
}
BonusItem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite[imgCount]), this.x, this.y);
}
BonusItem.prototype.update = animate;

//create BonusItem shield objects
var Shield = function(){
    BonusItem.call(this);
    this.sprite = ['images/shield-0.png',
        'images/shield-1.png',
        'images/shield-2.png',
        'images/shield-3.png',
        'images/shield-0.png',
        'images/shield-1.png',
        'images/shield-2.png',
        'images/shield-3.png'];
    this.x = 18;
    this.y = 36;
}
Shield.prototype = Object.create(BonusItem.prototype);
Shield.prototype.constructor = Shield;
var shield = new Shield();

//create BonusItem Weapon objects
var Weapon = function(){
    BonusItem.call(this);
    this.sprite = ['images/strike-1.png',
        'images/strike-2.png',
        'images/strike-3.png',
        'images/strike-4.png',
        'images/strike-5.png',
        'images/strike-6.png',
        'images/strike-7.png',
        'images/strike-8.png'];
    this.x = 96;
    this.y = 41;
}

Weapon.prototype = Object.create(BonusItem.prototype);
Weapon.prototype.constructor = Weapon;
var weapon = new Weapon ();