var Unit = {
    unitData: null,
    unitNumber: 0,

    // Type things
    Army: 'soldier',
    Riot: 'rioter',
    Homeless: 'homeless',

    // Styling of numerical label
    textStyle: { font: '24px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },

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
        unit.isAttacking = false;
        unit.number = ++Unit.unitNumber;
        unit.updateNum = 0;

        unit.counter = MainGame.game.make.sprite(0, 0, unit.type + '_counter_background');
        unit.counter.anchor.set(0.5, 0);
        unit.counter.x = unit.width/2;
        unit.counter.y = 55;
        unit.counter.label = MainGame.game.make.text(0, 10, unit.health, this.textStyle);
        unit.counter.label.x = -unit.counter.label.width/2;
        unit.counter.addChild(unit.counter.label);
        unit.addChild(unit.counter);

        unit.icon = MainGame.game.make.sprite(0, 0, unit.type + '_icon');
        unit.icon.anchor.set(0.5, 0);
        unit.icon.x = unit.width/2;
        unit.addChild(unit.icon);

        // SFX
        unit.spawnSfx = MainGame.game.make.audio(unit.type + '_spawn');
        unit.attackSfx = MainGame.game.make.audio(unit.type + '_attack');
        unit.moveSfx = MainGame.game.make.audio(unit.type + '_move');
        unit.deathSfx = MainGame.game.make.audio(unit.type + '_death');

        unit.spawnSfx.play();

        unit.takeTurn = function() { Unit.takeTurn(unit); };
        unit.move = function(newIndex) { Unit.move(unit, newIndex); };
        unit.hasTarget = function() { return unit.target !== null; };
        unit.addPeople = function(people) { Unit.addPeople(unit, people); };
        unit.subtractPeople = function(people) { Unit.subtractPeople(unit, people); };
        unit.takeDamage = function(people) { Unit.takeDamage(unit,people)};
        unit.kill = function() { Unit.kill(unit); };

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
                existingUnit.addPeople(startingHealth);
                console.log("[Unit] merged new rioter into existing riot");
                existingUnit.spawnSfx.play();
                return existingUnit; // Aaaaand we're done here. Don't need to actually create a unit
            } else {
                // Gotta find a new tile.
                return Unit._recursiveSpawn(unitType, index, 1);
            }
        } else {
            // If the tile is free, spawn here.
            var spawnTile = MainGame.board.at(index);
            Unit.loadUnitData();
            spawnTile.unit = Unit.createNew(Unit.unitData[unitType], index);
            spawnTile.addChild(spawnTile.unit);

            return spawnTile.unit; // Unit was successfully spawned
        }
    },

    // Wont try to merge if it encounters a unit
    _recursiveSpawn(unitType, index, distance) {
        var indexes = MainGame.board.allAdjacent(index, distance); // An array of tile indexes

        // Base case: we've checked every tile. Give up. - FIX THIS
        if (indexes.length >= MainGame.board.tileCount()) return false;

        // Filter out all neighbors that already have units (if we wanna merge, we'll have to be more clever)
        var freeIndexes = indexes.filter(function(tileIndex) {
                return !MainGame.board.at(tileIndex).hasUnit();
            }
        );

        // If there are no free tiles within the current range, then recur with a greater range
        if (freeIndexes.length === 0) return Unit._recursiveSpawn(index, distance++);

        // We've found a free tile, so let's spawn here.
        var spawnIndex = freeIndexes[0];
        var spawnTile = MainGame.board.at(spawnIndex);
        Unit.loadUnitData();
        spawnTile.unit = Unit.createNew(Unit.unitData[unitType], spawnIndex);
        spawnTile.addChild(spawnTile.unit);

        return spawnTile.unit; // Unit was successfully spawned
    },

    /* Renamed nextTurn() to takeTurn() so that Units wouldn't be processed in Board's nextTurn() */
    takeTurn: function(unit) {
        ++unit.updateNum;
        //console.log("unit @ "+unit.currentIndex+" - update # "+unit.updateNum);
        UnitAI.takeTurn(unit);
    },

    move: function(unit, newIndex) {
        if (newIndex === null) return; // Handy - if you pass null, that means you don't really want to move. Silly, but whatever.
        console.assert(newIndex >= 0 && newIndex < MainGame.board.tileCount(), "[Unit] Cannot move unit to invalid index!");

        var currentTile = MainGame.board.at(unit.currentIndex);
        var newTile = MainGame.board.at(newIndex);

        // Move the unit and apply a simple tween animation
        if (!newTile.hasUnit()) {
            unit.moveSfx.play();

            // Compute the movement vector between us and our destination
            var currentXY = currentTile.world;
            var newXY = newTile.world;
            var deltaXY = {
                x: (newXY.x - currentXY.x)/MainGame.board.currentScale, // Unapply the board scale so that we get the right amount in pixels
                y: (newXY.y - currentXY.y)/MainGame.board.currentScale
            };
            if(newIndex > unit.currentIndex){
                newTile.setUnit(unit);
                currentTile.setUnit(null);
                unit.currentIndex = newIndex;

                // Unapply tweened movement
                unit.x -= deltaXY.x;
                unit.y -= deltaXY.y;

                var tween = MainGame.game.add.tween(unit).to({x:0,y:0}, 1000, Phaser.Easing.Linear.None, true);
            } else {
                var tween = MainGame.game.add.tween(unit).to(deltaXY, 1000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function(){
                newTile.setUnit(unit);
                currentTile.setUnit(null);
                unit.currentIndex = newIndex;

                // Unapply tweened movement
                unit.x -= deltaXY.x;
                unit.y -= deltaXY.y;
            },this);
 
            }

        }
    },

    addPeople: function(unit, people) {
        unit.health += people;

        // update health marker
        unit.counter.label.text = unit.health;

        // update sprite
        unit.frame = unit.health-1;
    },

    subtractPeople: function(unit, people) {
        unit.health -= people;

        if (unit.health <= 0){
            MainGame.board.at(unit.currentIndex).setUnit(null);
            unit.destroy();
            return;
        }

        // update health marker
        unit.counter.label.text = unit.health;

        // update sprite
        unit.frame = unit.health-1;
    },

    takeDamage: function(unit, people){
        unit.health -= people;

        if (unit.health <= 0){
            unit.kill();
            return;
        }

        // update health marker
        unit.counter.label.text = unit.health;

        // update sprite
        unit.frame = unit.health-1;
    },

    kill: function(unit) {
        // Play death sound
        unit.deathSfx.play();

        // Play death animation

        // Remove from game
        MainGame.board.at(unit.currentIndex).setUnit(null);
        unit.destroy();
    }
};