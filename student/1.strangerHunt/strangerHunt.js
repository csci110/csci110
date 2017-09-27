gameController.backgroundImageFile = 'floor.png';
gameController.showScore = true;
gameController.preloadImages('princess.png', 'marcus.png', 'stranger.png', 'horizontalWall.png', 'verticalWall.png');

let floorWidth = gameController.displayWidth - 3 * gameController.gridSize;
let floorHeight = gameController.displayHeight - 3 * gameController.gridSize;

let princess = {
    name: 'Princess Ann',
    imageFile: 'princess.png',
    x: gameController.gridSize + Math.random() * floorWidth, // pixels to right of upper-left corner
    y: gameController.gridSize + Math.random() * floorHeight, // pixels below upper-left corner
    speed: 200, // pixels per second
    angle: 45, // degrees counter-clockwise from horizontal ray pointing right
    handleMouseClick: function() {
        gameController.endGame()
    }    
};
let marcus = {
    name: 'Marcus',
    imageFile: 'marcus.png',
    x: gameController.gridSize + Math.random() * floorWidth, // pixels to right of upper-left corner
    y: gameController.gridSize + Math.random() * floorHeight, // pixels below upper-left cornerx: 200, // pixels to right of upper-left corner
    speed: 100, // pixels per second
    angle: 45, // degrees counter-clockwise from horizontal ray pointing right
    handleMouseClick: function() {
        gameController.score = gameController.score - 10;
    }
};
let stranger = {
    name: 'Stranger',
    imageFile: 'stranger.png',
    x: gameController.gridSize + Math.random() * floorWidth, // pixels to right of upper-left corner
    y: gameController.gridSize + Math.random() * floorHeight, // pixels below upper-left corner
    speed: 300, // pixels per second
    angle: 45, // degrees counter-clockwise from horizontal ray pointing right
    handleMouseClick: function() {
        gameController.score = gameController.score + 10;
    }
};

let topWall = {
    imageFile: 'horizontalWall.png',
    x: 0,
    y: 0,
    immovable: true
};

let rightWall = {
    imageFile: 'verticalWall.png',
    x: gameController.displayWidth - gameController.gridSize,
    y: gameController.gridSize,
    immovable: true
};

let leftWall = {
    imageFile: 'verticalWall.png',
    x: 0,
    y: gameController.gridSize,
    immovable: true
};

let bottomWall = {
    imageFile: 'horizontalWall.png',
    x: 0,
    y: gameController.displayWidth - gameController.gridSize,
    immovable: true
};

gameController.addSprite(topWall);
gameController.addSprite(bottomWall);
gameController.addSprite(rightWall);
gameController.addSprite(leftWall);
gameController.addSprite(stranger);
gameController.addSprite(marcus);
gameController.addSprite(princess);

let allSprites = [princess, marcus, stranger, topWall, bottomWall, rightWall, leftWall];
gameController.addSpriteCollisionRule(allSprites);

gameController.startGame();