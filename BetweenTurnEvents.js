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