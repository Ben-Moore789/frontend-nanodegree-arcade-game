/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        calls=0,
        lastTime;

    canvas.width = 606;
    canvas.height = 600;
    ctx.fillStyle = "#00FF00";
    ctx.font="10px Orbitron";    

    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        calls++;
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt,calls);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */

        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt,calls) {
        updateEntities(dt,calls);
        checkCollisions();
        levelUp();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt,calls) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        allItems.forEach(function(item) {
            item.update(calls);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        ctx.drawImage(Resources.get('images/spaceBackground4.png'),0,0);
        //add text to scores and counters
        ctx.font="10px Orbitron";    
        ctx.fillText("level",272,565);
        ctx.fillText("lives",328,565);
        ctx.fillText("shields",378,565);
        ctx.fillText("kills",442,565);
        ctx.font="20px Orbitron";    
        ctx.fillText(returns+1,272,585);
        ctx.fillText(lives,332,585);
        ctx.fillText(shields,388,585);
        ctx.fillText(kills,442,585);
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        allItems.forEach(function(item) {
            item.render();
        });
        player.render();        
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/smurfShip.png', 'images/gameOver.png', // Serenity and Reaver ships
        'images/frogShipUp.png', 'images/frogShipDn.png', // belong to Joss Whedon's Firefly
        'images/ShipShieldLt.png',
        'images/spaceBackground4.png',
        'images/shield-0.png', 'images/shield-1.png', //by Niantic Labs. Copyright 2015
        'images/shield-2.png', 'images/shield-3.png', 
        'images/strike-1.png', 'images/strike-2.png', //by Niantic Labs. Copyright 2015
        'images/strike-3.png', 'images/strike-4.png', 
        'images/strike-5.png', 'images/strike-6.png', 
        'images/strike-7.png', 'images/strike-8.png', 
        'images/boom-1.png', 'images/boom-2.png',
        'images/boom-3.png', 'images/boom-4.png',
        'images/boom-5.png', 'images/boom-6.png',
        'images/boom-7.png', 'images/boom-8.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
