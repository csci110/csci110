gameController.backgroundImageFile = 'floor.png';
gameController.preloadImages('horizontalWall.png', 'verticalWall.png');
gameController.preloadImages('marcus.png', 'stranger.png', 'princess.png');
gameController.showScore = true;

let floorWidth = gameController.displayWidth - 3 * gameController.gridSize;
let floorHeight = gameController.displayHeight - 3 * gameController.gridSize;

let princess = {
    imageFile: 'princess.png',
    x: gameController.gridSize + Math.random() * floorWidth, 
    y: gameController.gridSize + Math.random() * floorHeight,
    speed: 200, 
    angle: Math.random() * 360, 
    handleMouseClick: function() {
        gameController.endGame();
    }
};

gameController.addSprite(princess);

let marcus = {
    name: 'Marcus the Wizard',
    imageFile: 'marcus.png',
    x: gameController.gridSize + Math.random() * floorWidth,
    y: gameController.gridSize + Math.random() * floorHeight,
    speed: 100,
    angle: Math.random() * 360,
    handleMouseClick: function() {
        gameController.score = gameController.score - 10;
        this.speed = this.speed * 1.1;
        this.x = gameController.gridSize + Math.random() * floorWidth;
        this.y = gameController.gridSize + Math.random() * floorHeight;
    }
};

gameController.addSprite(marcus);

let stranger = {
    name: 'The mysterious stranger',
    imageFile: 'stranger.png',
    x: gameController.gridSize + Math.random() * floorWidth,
    y: gameController.gridSize + Math.random() * floorHeight,
    speed: 300,
    angle: Math.random() * 360,
    handleMouseClick: function() {
        gameController.score = gameController.score + 10;
        this.speed = this.speed * 1.1;
        this.x = gameController.gridSize + Math.random() * floorWidth;
        this.y = gameController.gridSize + Math.random() * floorHeight;
    }
};

gameController.addSprite(stranger);

let topWall = {
    imageFile: 'horizontalWall.png',
    x: 0,
    y: 0,
    immovable: true
};

gameController.addSprite(topWall);

let bottomWall = {
    imageFile: 'horizontalWall.png',
    x: 0,
    y: gameController.displayHeight - gameController.gridSize,
    immovable: true
};

gameController.addSprite(bottomWall);

let leftWall = {
    imageFile: 'verticalWall.png',
    x: 0,
    y: gameController.gridSize,
    immovable: true
};

gameController.addSprite(leftWall);

let rightWall = {
    imageFile: 'verticalWall.png',
    x: gameController.displayWidth - gameController.gridSize,
    y: gameController.gridSize,
    immovable: true
};

gameController.addSprite(rightWall);

let allSprites = [princess, marcus, stranger, topWall, bottomWall, leftWall, rightWall];
gameController.addSpriteCollisionRule(allSprites);
    
gameController.startGame();
