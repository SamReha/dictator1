var Unit = {
    unitData: null,

    // Type things
    Army: 'soldier',
    Riot: 'rioter',
    Homeless: 'homeless',

    maxSize: 5,

    loadUnitData: function() {
        if (Unit.unitData === null) {
            Unit.unitData = MainGame.game.cache.getJSON('unitData');
            console.log("[Unit] Data loaded.");
        }
    },
    
    createNew: function(data, startingIndex) {
        console.assert(data !== null, "[Unit] Cannot instantiate unit with no data!");
        console.assert(startingIndex >= 0 && startingIndex < MainGame.board.tileCount(), "[Unit] Cannot place unit at invalid index!");

        var unit = MainGame.game.make.sprite(0, 0, data.sprite);

        unit.type = data.type;
        unit.health = data.startingHealth;
        unit.currentIndex = startingIndex;
        unit.origin = startingIndex;
        unit.target = null;

        unit.nextTurn = function() { Unit.nextTurn(unit); };
        unit.move = function(newIndex) { Unit.move(unit, newIndex); };
        unit.update = function() { Unit.update(unit); };
        unit.addPeople = function(people) {Unit.addPeople(unit, people); };
        unit.subtractPeople = function(people) {Unit.subtractPeople(unit, people); };
        unit.kill = function() {Unit.kill(unit); };

        return unit;
    },

    // Similar to create new, but handles A) creating unit on a tile that already has a unit and B) childing the unit to the parent tile.
    // As a convenience, returns true if the spawn was successful, and false otherwise.
    spawnUnitAt: function(unitType, index) {
        console.assert(unitType === this.Army || unitType === this.Riot || unitType === this.Homeless);
        this.loadUnitData();

        var tile = MainGame.board.at(index);
        var building = tile.getBuilding();
        var startingHealth = this.unitData[unitType].startingHealth;

        // Test the current index. If there's already a unit here, try to increase it's power by one. Otherwise, find an open tile to spawn on.
        if (tile.hasUnit()) {
            var existingUnit = tile.getUnit();

            // Can we attempt a merge?
            if (existingUnit.type === unitType && existingUnit.health + startingHealth <= this.maxSize) {
                existingUnit.health += startingHealth;
                return true; // Aaaaand we're done here. Don't need to actually create a unit
            } else {
                // Gotta find a new tile.
                return false;
            }
        } else {
            // If the tile is free, spawn here.
            var spawnTile = MainGame.board.at(index);
            Unit.loadUnitData();
            spawnTile.unit = Unit.createNew(Unit.unitData[unitType], index);
            spawnTile.addChild(spawnTile.unit);

            return true; // Unit was sucessfully spawned
        }

        // // If we got an index, then spawn a unit (otherwise, board is completely full and we can assume the player is in enough trouble as is)
        // if (spawnIndex !== -1) {
            
        // } else {
        //     console.log('[Global] Failed to spawn unit');
        //     return false;
        // }
    },

    _recursiveSpawn(unit, index, depth) {
        if (depth > MainGame.board.tileCount()) return false; // Base case: we have checked every tile, and failed to find a free tile

        // Test the current index. If there's already a unit here, try to increase it's power by one. Otherwise, find an open tile to spawn on.
        if (tile.hasUnit()) {
            var existingUnit = tile.getUnit();

            // Can we attempt a merge?
            if (existingUnit.type === unitType && existingUnit.health + startingHealth <= this.maxSize) {
                existingUnit.health += startingHealth;
                return true; // Aaaaand we're done here. Don't need to actually create a unit
            } else {
                // Gotta find a new tile.
                return Unit._recursiveSpawn(unit, index, depth++);
            }
        } else {
            // If the tile is free, spawn here.
            var spawnTile = MainGame.board.at(spawnIndex);
            Unit.loadUnitData();
            spawnTile.unit = Unit.createNew(Unit.unitData[unitType], spawnIndex, citizenToRiot.name);
            spawnTile.addChild(spawnTile.unit);

            return true; // Unit was sucessfully spawned
        }
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