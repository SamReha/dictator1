var showNewBuildings = function(callback) {
    var makeBuildingCompletionEvents = function(list, listIndex) {
        // If we've handled every new building, bail out and execute the callback.
        if (listIndex >= list.length) {
            callback();
            return;
        }

        // Figure out our pretty data - like a custom message and image.
        var buildingName = MainGame.board.at(list[listIndex]).getBuilding().playerLabel;
        var message = 'A ' + buildingName + ' has been constructed!';

        // Tween to the tile
        MainGame.board.cameraCenterOn(list[listIndex]);

        // Wait a bit, then spawn the event.
        var timer = MainGame.game.time.create(true);
        timer.add(300, function() {
        var e = Event.createNew();
            e.setModel([
                            {
                                portrait: 'exclamation_01', 
                                description: message, 
                                buttonTexts: ["OK"]
                            }
                        ]);

            e.setController([
                [function() {
                    e.suicide();
                    makeBuildingCompletionEvents(list, ++listIndex);
                }]
            ]);
        }, null);
        timer.start();
    };

    // Start by getting a list of all new buildings that will appear this turn.
    var newBuildingIndexes = MainGame.board.findBuilding().filter(function(buildingIndex) {
        return MainGame.board.at(buildingIndex).getBuilding().startingTurn === MainGame.global.turn;
    });
    
    // Then, start recursively spawning events to handle each notification
    makeBuildingCompletionEvents(newBuildingIndexes, 0);
};

var showNewPeople = function(callback) {
    var oldPopulation = MainGame.population.count();
    updatePopulation(true, true);
    var deltaPopulation = MainGame.population.count() - oldPopulation;

    var e = Event.createNew();
    e.setModel([
                    {
                        portrait: 'exclamation_01', 
                        description: 'The year is now ' + (1949 + MainGame.global.turn) + '. The population has increased by ' + deltaPopulation + ' citizens.', 
                        buttonTexts: ["OK"]
                    }
                ]);

    e.setController([
        [function() {
            e.suicide();
            callback();
        }]
    ]);
};

var showHomelessCamps = function(callback) {
    var makeBuildingCompletionEvents = function(list, listIndex) {
        // If we've handled every new building, bail out and execute the callback.
        if (listIndex >= list.length) {
            callback();
            return;
        }

        // Figure out our pretty data - like a custom message and image.
        var buildingName = MainGame.board.at(list[listIndex]).getBuilding().playerLabel;
        var message = 'Due to a lack of available housing, a homeless camp has formed!';

        // Tween to the tile
        MainGame.board.cameraCenterOn(list[listIndex]);

        // Wait a bit, then spawn the event.
        var timer = MainGame.game.time.create(true);
        timer.add(300, function() {
        var e = Event.createNew();
            e.setModel([
                            {
                                portrait: 'exclamation_01', 
                                description: message, 
                                buttonTexts: ["OK"]
                            }
                        ]);

            e.setController([
                [function() {
                    e.suicide();
                    makeBuildingCompletionEvents(list, ++listIndex);
                }]
            ]);
        }, null);
        timer.start();
    };

    // Start by getting a list of all new buildings that will appear this turn.
    var newBuildingIndexes = MainGame.board.findBuilding('shantyTown').filter(function(buildingIndex) {
        return MainGame.board.at(buildingIndex).getBuilding().startingTurn === MainGame.global.turn;
    });
    
    // Then, start recursively spawning events to handle each notification
    makeBuildingCompletionEvents(newBuildingIndexes, 0);
};

var showThermometerUpdate = function(callback) {
    // Get new delta (how much the thermometer will change by this turn)
    Global.thermometerDelta = Global.freedom + Global.unrest - 100;

    // Apply delta
    Global.thermometerFill = Phaser.Math.clamp(Global.thermometerFill + Global.thermometerDelta, 0, 100);

    // Check if unit spawn
    if (Global.thermometerFill >= 100) {
        Global.thermometerFill = 50;

        // Compute angriest citizen
        var workingClass = MainGame.population.lowList();
        workingClass.sort(function(a, b) {
            return b.unrest - a.unrest;
        });
        var citizenToRiot = workingClass[0];
    
        var didSpawn = Unit.spawnUnitAt(Unit.Riot, citizenToRiot.home);

        if (didSpawn) {
            // Tween to the tile
            MainGame.board.cameraCenterOn(citizenToRiot.home);

            // Remove them from their home
            MainGame.board.at(citizenToRiot.home).getBuilding().removePerson();
            citizenToRiot.home = null;

            // Remove them from their workplace
            var workIndex = citizenToRiot.workplace;
            if (workIndex !== null) {
                var workPlace = MainGame.board.at(workIndex).getBuilding();
                workPlace.removePerson();
                citizenToRiot.work = null;
            }

            // Wait a bit, then spawn the event.
            var timer = MainGame.game.time.create(true);
            timer.add(2100, function() {
                var e = Event.createNew();
                e.setModel([
                                {
                                    portrait: 'exclamation_01', 
                                    description: 'Due to rising tensions, a citizen has begun to riot!', 
                                    buttonTexts: ["OK"]
                                }
                            ]);

                e.setController([
                    [function() {
                        e.suicide();
                        callback();
                    }]
                ]);
            }, null);
            timer.start();
        }
    } else {
        // Else, no spawn occured, so we should just move on
        callback();
    }
};

var showUnitAction = function(callback) {
    var processUnitUpdates = function(unitList, index) {
        // If we've handled every unit, bail out and execute the callback.
        if (index >= unitList.length) {
            callback();
            return;
        }

        // Tween to the tile
        MainGame.board.cameraCenterOn(unitList[index].currentIndex);

        // Update the unit
        unitList[index].takeTurn();

        // Wait a bit, then process the next unit.
        var timer = MainGame.game.time.create(true);
        timer.add(2100, function() {
            processUnitUpdates(unitList, ++index);
        }, null);
        timer.start();
    }

    // Start by getting a list of all active units.
    var units = MainGame.board.findUnits(null).map(function(unitIndex) {
        return MainGame.board.at(unitIndex).getUnit();
    });
    
    // Then, start recursively spawning events to handle each notification
    processUnitUpdates(units, 0);
};