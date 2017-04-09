var Unit = {
    unitData: null,

    // Type things
    Army: 'soldier',
    Riot: 'rioter',
    Homeless: 'homeless',

    loadUnitData: function() {
        if (Unit.unitData === null) {
            Unit.unitData = MainGame.game.cache.getJSON('unitData');
            console.log("[Unit] Data loaded.");
        }
    },
    
    createNew: function(data, startingIndex, name) {
        console.assert(data !== null, "[Unit] Cannot instantiate unit with no data!");
        console.assert(startingIndex >= 0 && startingIndex < MainGame.board.tileCount(), "[Unit] Cannot place unit at invalid index!");

        var unit = MainGame.game.make.sprite(0, 0, data.sprite);

        unit.type = data.type;
        unit.health = data.startingHealth;
        unit.currentIndex = startingIndex;
        unit.origin = startingIndex;
        unit.name = name;
        unit.target = null;

        unit.nextTurn = function() { Unit.nextTurn(unit); };
        unit.move = function(newIndex) { Unit.move(unit, newIndex); };
        unit.update = function() { Unit.update(unit); };
        unit.addPeople = function(people) {Unit.addPeople(unit, people); };
        unit.subtractPeople = function(people) {Unit.subtractPeople(unit, people); };
        unit.kill = function() {Unit.kill(unit); };

        return unit;
    },

    nextTurn: function(unit) {
        UnitAI.takeTurn(unit);
    },

    move: function(unit, newIndex) {
        if (newIndex === null) return; // Handy - if you pass null, that means you don't really want to move. Silly, but whatever.
        console.assert(newIndex >= 0 && newIndex < MainGame.board.tileCount(), "[Unit] Cannot move unit to invalid index!");

        var currentTile = MainGame.board.at(unit.currentIndex);
        var newTile = MainGame.board.at(newIndex);

        // TODO: Maybe lerp an animation as it moves between tiles?
        if (!newTile.hasUnit()) {
            newTile.setUnit(unit);
            currentTile.setUnit(null);
            unit.currentIndex = newIndex;
        } else {
            // Do I need to merge the groups?
        }
    },

    addPeople: function(unit, people) {
        unit.health += people;

        // update health marker

        // maybe update sprite
    },

    subtractPeople: function(unit, people) {
        unit.health -= people;

        if (unit.health <= 0){
            MainGame.board.at(unit.currentIndex).setUnit(null);
            unit.destroy();
        }

        // maybe update sprite
    },

    kill: function(unit) {
        // Play death sound
        
        // Play death animation

        // Remove from game
        MainGame.board.at(unit.currentIndex).setUnit(null);
        unit.destroy();
    }
};