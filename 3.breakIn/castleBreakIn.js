gameController.backgroundImageFile = 'grass.png';
gameController.preloadImages('castle.png', 'wall.png', 'block1.png', 'block2.png', 'block3.png');
gameController.preloadImageSheets('ballSheet.png', 'princessSheet.png');

class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = 'A block';
        this.imageFile = 'block1.png';
        this.immovable = true;
        gameController.addSprite(this);
        Block.blocksToDestroy = Block.blocksToDestroy + 1;
    }

    handleBallHit() {
        gameController.deleteSprite(this);
        Block.blocksToDestroy = Block.blocksToDestroy - 1;
        if (Block.blocksToDestroy === 0) {
            gameController.endGame('Congratulations!\n\nPrincess Ann can continue her pursuit\nof the mysterious stranger!');
        }
    }
}

// This "static" variable exists at the class level.
// That is, there is one variable shared by all class objects, not a separate one in each object.
Block.blocksToDestroy = 0;

// A for loop is convenient for arranging blocks.
for (let i = 0; i < 5; i++) {
    new Block(200 + i * gameController.gridSize, 200);
}

class ExtraLifeBlock extends Block {
    constructor(x, y) {
        super(x, y); // call superclass constructor
        this.imageFile = 'block2.png'; // change image that was set by superclass 
        Block.blocksToDestroy = Block.blocksToDestroy - 1; // these blocks are indestructible, so adjust count
    }

    handleBallHit() {
        princess.addALife(); // override (replace) superclass behavior
    }
}

new ExtraLifeBlock(200, 250);

class ExtraBallBlock extends Block {
    constructor(x, y) {
        super(x, y); // call superclass constructor
        this.imageFile = 'block3.png'; // change image that was set by superclass 
    }

    handleBallHit() {
        super.handleBallHit(); // call function in superclass
        new Ball(); // extend superclass behavior
    }
}

new ExtraBallBlock(300, 250);

let castle = {
    name: 'A spooky castle',
    imageFile: 'castle.png',
    x: 0,
    y: 0,
    immovable: true
};
gameController.addSprite(castle);

let leftWall = {
    name: 'Left wall',
    imageFile: 'wall.png',
    x: 0,
    y: 200,
    immovable: true
};
gameController.addSprite(leftWall);

let rightWall = {
    name: 'Right wall',
    imageFile: 'wall.png',
    x: gameController.displayWidth - gameController.gridSize,
    y: 200,
    immovable: true
};
gameController.addSprite(rightWall);

let princess = {
    name: 'Princess Ann',
    imageSheetFile: 'princessSheet.png',
    x: gameController.displayWidth / 2,
    y: gameController.displayHeight - gameController.gridSize,
    stepSize: 3,
    immovable: true,
    collisionArea: { width: gameController.gridSize / 3, height: 1, xOffset: gameController.gridSize / 3 },
    handleLeftArrowKey: function() {
        this.playAnimation('left');
        this.x = Math.max(gameController.gridSize, this.x - this.stepSize);
    },
    handleRightArrowKey: function() {
        this.playAnimation('right');
        this.x = Math.min(gameController.displayWidth - 2 * gameController.gridSize, this.x + this.stepSize);
    },
    header: function(thePrincess, theBall) {
        // Ball's bounce angle differs from vertical according to horizontal offset with princess.
        theBall.angle = 90 + 2 * (thePrincess.x - theBall.x);
        
        // Ann's collision area limits collisions to a small area high in the 48x48 image.
        // But there can still be problems if the angle of approach is more horizontal than vertical.
        // For example, she could run into the ball from the side and "hold" it due to ongoing collisions.
        // The following code seems to be a fairly decent solution.
        
        // If the ball's bottom edge is too far below the top of Ann's head ...
        if (thePrincess.y - theBall.y < gameController.gridSize) {
            // ... adjust it upwards.
            theBall.y = thePrincess.y - gameController.gridSize;
        }
    },
    lives: 1,
    handleGameLoop: function() {
        // Set up a text area to display the number of lives remaining.
        this.livesDisplay = gameController.createTextArea(gameController.displayWidth - 3 * gameController.gridSize, 20);
        this.updateLivesDisplay();
        delete this.handleGameLoop;
    },
    addALife: function() {
        this.lives = this.lives + 1;
        this.updateLivesDisplay();
    },
    loseALife: function() {
        this.lives = this.lives - 1;
        this.updateLivesDisplay();
        if (this.lives > 0) {
            new Ball(); // create a ball to restart play
        } else {
            gameController.endGame('The mysterious stranger has escaped\nPrincess Ann for now!\n\nBetter luck next time.');
        }
    },
    updateLivesDisplay: function() {
        gameController.writeToTextArea(this.livesDisplay, 'Lives: ' + this.lives);
    }
};
gameController.addSprite(princess);
princess.defineAnimation('left', 9, 11);
princess.defineAnimation('right', 3, 5);

class Ball {
    constructor() {
        this.name = 'Ann\'s souvenir East Alexandria soccer ball';
        this.imageSheetFile = 'ballSheet.png';
        this.x = gameController.displayWidth / 2;
        this.y = gameController.displayHeight / 2;
        this.speed = 1;
        this.collisionArea = { width: 30, height: 30, xOffset: 9, yOffset: 9 };
        this.angle = 50 + Math.random() * 80;
        gameController.addSprite(this);
        this.defineAnimation('spin', 0, 11);
        // There is special behavior for collision with Princess Ann.
        gameController.addSpriteCollisionRule([princess, this], princess.header);
        // Default collision behavior for "boundary" objects.
        gameController.addSpriteCollisionRule([this, castle, leftWall, rightWall]);

        Ball.ballsInPlay = Ball.ballsInPlay + 1;
    }

    handleGameLoop() {
        // Movement starts slowly so player can get set.
        if (this.speed < 200) {
            this.speed = this.speed + 2;
            this.playAnimation('spin', true);
        } else {
            delete this.handleGameLoop;
        }
    }

    handleBoundaryContact() {
        // Ball can only contact bottom boundary-- then it's gone.
        gameController.deleteSprite(this);
        Ball.ballsInPlay = Ball.ballsInPlay - 1;
        
        // Player should only lose a life when the *last* ball goes out of play.
        if (Ball.ballsInPlay === 0) {
            princess.loseALife(); // may end the game
        }
    }
};

Ball.ballsInPlay = 0;

// We need one ball to start the game.
new Ball();

// All balls collide with all blocks; anonymous handler function relies on polymorphic dispatch.
gameController.addClassCollisionRule([Ball, Block], function(theBall, theBlock) { theBlock.handleBallHit(); });

gameController.startGame();
