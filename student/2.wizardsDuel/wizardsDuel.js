gameController.preloadImageSheets('BuuSpriteSheet.png', 'GokuSpriteSheet.png');
gameController.backgroundImageFile = 'ShootStar.png';
let Goku = {
    name: 'Goku the Saiyan',
    imageSheetFile: 'GokuSpriteSheet.png',
    x: gameController.gridSize,
    y: gameController.displayHeight - gameController.gridSize,
    stepSize: 3,
    immovable: true
};
let Buu = {
    name: 'Kid Buu',
    imageSheetFile: 'BuuSpriteSheet.png',
    x: gameController.displayWidth - 2 * gameController.gridSize,
    y: gameController.gridSize,
    angle: 270,
    speed: 200,
    immovable: true,
    handleGameLoop: function() {
        // When game starts, move down 
        this.playAnimation('down');
        delete this.handleGameLoop;
        // handle subsequent passes
        this.handleGameLoop = function() { // Switch directions at top or bottom
            if (this.y < 0) {
                this.y = 0;
                this.angle = 270;
                this.playAnimation('down');
            }
            else if (this.y > gameController.displayHeight - gameController.gridSize) {
                this.y = gameController.displayHeight - gameController.gridSize;
                this.angle = 90;
                this.playAnimation('up');
            }
            this.handleAnimationEnd = function() {
                if (this.angle === 90) {
                    this.playAnimation('up');
                }
                else if (this.angle === 270) {
                    this.playAnimation('down');
                }
            };
            if (Buu && Math.random() < .03) {
                let spell = new BuuSpell(this.x - gameController.gridSize, this.y);
                spell.playAnimation('magic', true);
                this.playAnimation('left');
            }
        };
    }
};
class GokuSpell {
    constructor(x, y) { // executed when an object of this class is created
        this.name = 'A spell cast by Goku';
        this.imageSheetFile = 'marcusSpellSheet.png';
        this.x = x + gameController.gridSize;
        this.y = y;
        this.angle = 0;
        this.speed = 200;
        gameController.addSprite(this);
        this.collisionArea = { width: gameController.gridSize, height: 10, xOffset: 0, yOffset: gameController.gridSize / 2 - 5 };
        gameController.addSpriteCollisionRule([this, Buu], this.defeatBuu);
        this.defineAnimation('magic', 0, 7); // you can place other properties and methods here that you want every 
        // object in the class to have or to execute *at the time it is created*
    } // you can place methods here that will belong to every object in the class
    defeatBuu(sprite1, sprite2) {
        let fireball = new Fireball(Buu.x, Buu.y);
        Buu = null;
        gameController.deleteSprite(sprite1);
        gameController.deleteSprite(sprite2);
        fireball.handleAnimationEnd = function() {
            gameController.endGame('Congratulations!\n\nGoku has defeated the diabolical\nBuu with the pink guu!');
        };
    }
}
class BuuSpell {
    constructor(x, y) { // executed when an object of this class is created
        this.name = 'Buus Spell';
        this.imageSheetFile = 'strangerSpellSheet.png';
        this.x = x + gameController.gridSize;
        this.y = y;
        this.angle = 180;
        this.speed = 200;
        gameController.addSprite(this);
        this.collisionArea = { width: gameController.gridSize, height: 10, xOffset: 0, yOffset: gameController.gridSize / 2 - 5 };
        gameController.addSpriteCollisionRule([this, Goku], this.defeatGoku);
        this.defineAnimation('magic', 0, 7); // you can place other properties and methods here that you want every 
        // object in the class to have or to execute *at the time it is created*
    } // you can place methods here that will belong to every object in the class
    defeatGoku(sprite1, sprite2) {
        let fireball = new Fireball(Goku.x, Goku.y);
        Goku = null;
        gameController.deleteSprite(sprite1);
        gameController.deleteSprite(sprite2);
        fireball.handleAnimationEnd = function() {
            gameController.endGame('Goku is defeated by the diabolical\nBuu with the pink guu!\n\nBetter luck next time.');
        };
    }
}
let spellClasses = ['GokuSpell', 'BuuSpell'];
gameController.addClassCollisionRule(spellClasses, spellCollisionHandler); //HANDLE COLLISIONS//
Goku.defineAnimation('up', 0, 0);
Goku.defineAnimation('down', 0, 0);
Goku.defineAnimation('right', 0, 2);
Buu.defineAnimation('up', 0, 0);
Buu.defineAnimation('down', 0, 0);
Buu.defineAnimation('left', 0, 1);
gameController.addSprite(Goku);
gameController.addSprite(Buu);
gameController.startGame();
