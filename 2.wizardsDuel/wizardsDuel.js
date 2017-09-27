// TUTORIAL VERSION

gameController.backgroundImageFile = 'floor.png';
gameController.preloadImageSheets('marcusSheet.png', 'marcusSpellSheet.png',
    'strangerSheet.png', 'fireballSheet.png', 'strangerSpellSheet.png');

let marcus = {
    name: 'Marcus the Wizard',
    imageSheetFile: 'marcusSheet.png',
    x: gameController.gridSize,
    y: gameController.displayHeight - gameController.gridSize,
    immovable: true,
    stepSize: 2,
    spellCastTime: 0,
    handleUpArrowKey: function() {
        this.playAnimation('up');
        this.y = this.y - this.stepSize;
    },
    handleDownArrowKey: function() {
        this.playAnimation('down');
        this.y = this.y + this.stepSize;
    },
    handleGameLoop: function() {
        // keep Marcus in the display area
        this.y = Math.max(0, this.y);
        this.y = Math.min(this.y, gameController.displayHeight - gameController.gridSize);
    },
    handleSpacebar: function() {
        let now = gameController.getTime(); // get time
        if (stranger && now - this.spellCastTime >= 2) {
            this.spellCastTime = now;
            let spell = new MarcusSpell(this.x + gameController.gridSize, this.y);
            spell.playAnimation('magic', true);
            this.playAnimation('right');
        }
    }
};
let stranger = {
    name: 'The Mysterious Stranger',
    imageSheetFile: 'strangerSheet.png',
    x: gameController.displayWidth - 2 * gameController.gridSize,
    y: gameController.gridSize,
    angle: 270,
    speed: 150,
    immovable: true,
    handleGameLoop: function() {
        // When game starts, move down 
        this.playAnimation('down');
        delete this.handleGameLoop;

        // handle subsequent passes
        this.handleGameLoop = function() {
            // Switch directions at top or bottom
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
            if (marcus && Math.random() < 0.02) {
                let spell = new StrangerSpell(this.x - gameController.gridSize, this.y);
                spell.playAnimation('magic', true);
                this.playAnimation('left');
            }
        };
    },
    handleAnimationEnd: function() {
        if (this.angle === 90) {
            this.playAnimation('up');
        }
        else if (this.angle === 270) {
            this.playAnimation('down');
        }
    }
};
class MarcusSpell {
    constructor(x, y) { // executed when an object of this class is created
        this.name = 'A spell cast by Marcus';
        this.imageSheetFile = 'marcusSpellSheet.png';
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.speed = 200;
        gameController.addSprite(this);
        this.defineAnimation('magic', 0, 7);
        this.collisionArea = { width: gameController.gridSize, height: 6, xOffset: 0, yOffset: gameController.gridSize / 2 - 3 };
        gameController.addSpriteCollisionRule([this, stranger], this.defeatStranger);
        // you can place other properties and methods here that you want every 
        // object in the class to have or to execute *at the time it is created*
    }
    defeatStranger(sprite1, sprite2) {
        gameController.deleteSprite(sprite1);
        gameController.deleteSprite(sprite2);
        let fireball = new Fireball(stranger.x, stranger.y);
        stranger = false;
        fireball.handleAnimationEnd = function() {
            gameController.endGame('Congratulations!\n\nMarcus has defeated the mysterious\nstranger in the dark cloak!');
        };
    };
    // you can place methods here that will belong to every object in the class
    handleBoundaryContact() {
        // Destroy spell when it leaves display area
        gameController.deleteSprite(this);
    }
}
class StrangerSpell {
    constructor(x, y) { // executed when an object of this class is created
        this.name = 'A spell cast by Stranger';
        this.imageSheetFile = 'strangerSpellSheet.png';
        this.x = x;
        this.y = y;
        this.angle = 180;
        this.speed = 200;
        gameController.addSprite(this);
        this.defineAnimation('magic', 0, 7);
        this.collisionArea = { width: gameController.gridSize, height: 6, xOffset: 0, yOffset: gameController.gridSize / 2 - 3 };
        gameController.addSpriteCollisionRule([this, marcus], this.defeatMarcus);
        // you can place other properties and methods here that you want every 
        // object in the class to have or to execute *at the time it is created*
    }
    defeatMarcus(sprite1, sprite2) {
        gameController.deleteSprite(sprite1);
        gameController.deleteSprite(sprite2);
        let fireball = new Fireball(marcus.x, marcus.y);
        marcus = false;
        fireball.handleAnimationEnd = function() {
            gameController.endGame('Marcus is defeated by the mysterious\nstranger in the dark cloak!\n\nBetter luck next time.');
        };
    };
    // you can place methods here that will belong to every object in the class
    handleBoundaryContact() {
        // Destroy spell when it leaves display area
        gameController.deleteSprite(this);
    }
}
class Fireball {
    constructor(x, y) {
        this.name = 'A ball of fire';
        this.x = x;
        this.y = y;
        this.imageSheetFile = 'fireballSheet.png';
        gameController.addSprite(this);
        this.defineAnimation('boom', 0, 15);
        this.playAnimation('boom');
    }
}
let spellClasses = ['MarcusSpell', 'StrangerSpell'];
//let spellCollisionHandler = function(spellSprite1, spellSprite2) {
function spellCollisionHandler(spellSprite1, spellSprite2) {
    let fireball = new Fireball(spellSprite1.x, spellSprite1.y);
    fireball.handleAnimationEnd = function() {
        gameController.deleteSprite(this);
    };
    gameController.deleteSprite(spellSprite1);
    gameController.deleteSprite(spellSprite2);
};
gameController.addClassCollisionRule(spellClasses, spellCollisionHandler);

gameController.addSprite(marcus);
marcus.defineAnimation('up', 0, 2);
marcus.defineAnimation('down', 6, 8);
marcus.defineAnimation('right', 3, 5);

gameController.addSprite(stranger);
stranger.defineAnimation('up', 0, 2);
stranger.defineAnimation('down', 6, 8);
stranger.defineAnimation('left', 9, 11);
gameController.startGame();
