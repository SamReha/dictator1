// Group all our UI classes here (at least, for now)
// Holds all our in-game UI elements


var Hud = {
    styleNormal: {font:"32px myKaiti", fill:"#ffffff"},
    styleButton: {font:"32px myKaiti", fill:"#ffffff"},

    createNew: function() {

        /*global MainGame*/
        var hud = MainGame.game.add.group();
        var hudInputPriority = 2;

        hud.name = "HUD"; // Useful for debugging

        // Group1: Top Stats
        var topGroup=MainGame.game.add.group();
        topGroup.name="topGroup";
        hud.addChild(topGroup);

        //      global vars
        var statsPanel = StatsPanel.createNew();
        hud.addChild(statsPanel);

        var funPanel = FunPanel.createNew();
        hud.addChild(funPanel);

        //      Coalition Flag
        topGroup.coalitionFlag = CoalitionFlag.createNew();
        //topGroup.addChild(topGroup.coalitionFlag);

        // Exit / Pause button
        var btnExit = MainGame.game.make.button(0, 0, 'small_generic_button', null, MainGame, 0, 1, 2, 2);
        btnExit.name = 'Exit Button';
        btnExit.input.priorityID = hudInputPriority;
        hud.addChild(btnExit);

        var btnExitText = MainGame.game.make.text(0, 0, 'Exit', Hud.styleButton);
        btnExitText.anchor.x = 0.5;
        btnExitText.anchor.y = 0.5;
        btnExitText.x = btnExit.width / 2;
        btnExitText.y = btnExit.height / 2;
        btnExit.addChild(btnExitText);

        // "Next Turn" button
        var btnNextTurn=MainGame.game.make.button(MainGame.game.width, MainGame.game.height, 'med_generic_button',
            MainGame.nextTurn, MainGame, 0, 1, 2, 2);
        btnNextTurn.name = 'btnNextTurn';
        btnNextTurn.input.priorityID = hudInputPriority;
        btnNextTurn.anchor.x = 1;
        btnNextTurn.anchor.y = 1;
        hud.addChild(btnNextTurn);

        var btnNextTurnText = MainGame.game.make.text(0, 0, 'Next Turn', Hud.styleButton);
        btnNextTurnText.anchor.x = 0.5;
        btnNextTurnText.anchor.y = 0.5;
        btnNextTurnText.x = -btnNextTurn.width / 2;
        btnNextTurnText.y = -btnNextTurn.height / 2;
        btnNextTurn.addChild(btnNextTurnText);

        // Group2: Build
        var buildGroup=MainGame.game.make.group();
        buildGroup.name="buildGroup";
        hud.addChild(buildGroup);
        //      "Build" button
        var buildBtn = MainGame.game.make.button(0, MainGame.game.world.height, 'med_generic_button', 
            function(){
                var menu=hud.findChild("buildMenu");
                console.assert(menu);
                menu.visible=!menu.visible;
                // disable other buttons when "Build" menu is on show
                if(menu.visible){
                    var grp=hud.findChild("statsGroup");
                }
            }, null, 0, 1, 2, 3);
        buildBtn.name="buildBtn";
        buildBtn.setChecked=true;
        buildBtn.anchor.y = 1;  // Anchor on bottom left corner
        buildBtn.inputEnabled = true;
        buildBtn.input.priorityID = 1;
        buildGroup.addChild(buildBtn);

        var buildBtnText = MainGame.game.make.text(0, 0, 'Build', Hud.styleButton);
        buildBtnText.anchor.x = 0.5;
        buildBtnText.anchor.y = 0.5;
        buildBtnText.x = buildBtn.width / 2;
        buildBtnText.y = -buildBtn.height / 2;
        buildBtn.addChild(buildBtnText);

        //      "Build" menu
        var buildMenu = MainGame.game.make.group();
        buildMenu.name="buildMenu";
        buildMenu.visible = false;
        buildGroup.addChild(buildMenu);

        // buildMenu: UI groups
        var bureauGroup = MainGame.game.make.group();
        bureauGroup.position.y = MainGame.game.world.height-400; // Magic numbers!
        buildMenu.addChild(bureauGroup);

        var merchantGroup = MainGame.game.make.group();
        merchantGroup.position.y = MainGame.game.world.height-250; // Magic numbers!
        buildMenu.addChild(merchantGroup);

        var militaryGroup = MainGame.game.make.group();
        militaryGroup.position.y = MainGame.game.world.height-100; // Magic numbers!
        buildMenu.addChild(militaryGroup);

        // buildMenu -: buyBuildingBtn, seeCoalitionBtn, etc.
        var buyMansionBtn = MainGame.game.make.button(0, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, buyMansionBtn, 'mansion');}, buildMenu, 0, 1, 2, 3);
        buyMansionBtn.input.priorityID = hudInputPriority;
        buyMansionBtn.anchor.y = 1;  // Anchor on bottom left corner
        var mansionText = MainGame.game.make.text(0, -40, "Buy Mansion\n$10K", Hud.styleNormal);
        mansionText.anchor.y = 1;
        buyMansionBtn.addChild(mansionText);
        bureauGroup.addChild(buyMansionBtn);

        // Setup buildMenu purchase button text
        var buyMansionBtnText = MainGame.game.make.text(0, 0, 'Buy', Hud.styleButton);
        buyMansionBtnText.anchor.x = 0.5;
        buyMansionBtnText.anchor.y = 0.5;
        buyMansionBtnText.x = buyMansionBtn.width / 2;
        buyMansionBtnText.y = -buyMansionBtn.height / 2;
        buyMansionBtn.addChild(buyMansionBtnText);

        var buySuburbBtn = MainGame.game.make.button(200, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, buySuburbBtn, 'suburb');}, buildMenu, 0, 1, 2, 3);
        buySuburbBtn.input.priorityID = hudInputPriority;
        buySuburbBtn.anchor.y = 1;  // Anchor on bottom left corner
        var suburbText = MainGame.game.make.text(0, -40, "Buy Suburb\n$10K", Hud.styleNormal);
        suburbText.anchor.y = 1;
        buySuburbBtn.addChild(suburbText);
        bureauGroup.addChild(buySuburbBtn);

        // Setup buildMenu purchase button text
        var buySuburbBtnText = MainGame.game.make.text(0, 0, 'Buy', Hud.styleButton);
        buySuburbBtnText.anchor.x = 0.5;
        buySuburbBtnText.anchor.y = 0.5;
        buySuburbBtnText.x = buySuburbBtn.width / 2;
        buySuburbBtnText.y = -buySuburbBtn.height / 2;
        buySuburbBtn.addChild(buySuburbBtnText);

        var buyApartmentBtn = MainGame.game.make.button(400, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, buyApartmentBtn, 'apartment');}, buildMenu, 0, 1, 2, 3);
        buyApartmentBtn.input.priorityID = hudInputPriority;
        buyApartmentBtn.anchor.y = 1;  // Anchor on bottom left corner
        var apartmentText = MainGame.game.make.text(0, -40, "Buy Apartment\n$10K", Hud.styleNormal);
        apartmentText.anchor.y = 1;
        buyApartmentBtn.addChild(apartmentText);
        bureauGroup.addChild(buyApartmentBtn);

        // Setup buildMenu purchase button text
        var buyApartmentBtnText = MainGame.game.make.text(0, 0, 'Buy', Hud.styleButton);
        buyApartmentBtnText.anchor.x = 0.5;
        buyApartmentBtnText.anchor.y = 0.5;
        buyApartmentBtnText.x = buyApartmentBtn.width / 2;
        buyApartmentBtnText.y = -buyApartmentBtn.height / 2;
        buyApartmentBtn.addChild(buyApartmentBtnText);

        var buySchoolBtn = MainGame.game.make.button(600, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, buySchoolBtn, 'school');}, buildMenu, 0, 1, 2, 3);
        buySchoolBtn.input.priorityID = hudInputPriority;
        buySchoolBtn.anchor.y = 1;  // Anchor on bottom left corner
        var schoolText = MainGame.game.make.text(0, -40, "Buy School\n$15K", Hud.styleNormal);
        schoolText.anchor.y = 1;
        buySchoolBtn.addChild(schoolText);
        bureauGroup.addChild(buySchoolBtn);

        // Setup buildMenu purchase button text
        var buySchoolBtnText = MainGame.game.make.text(0, 0, 'Buy', Hud.styleButton);
        buySchoolBtnText.anchor.x = 0.5;
        buySchoolBtnText.anchor.y = 0.5;
        buySchoolBtnText.x = buySchoolBtn.width / 2;
        buySchoolBtnText.y = -buySchoolBtn.height / 2;
        buySchoolBtn.addChild(buySchoolBtnText);

        var buyFactoryBtn = MainGame.game.make.button(0, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, buyFactoryBtn, 'lumberYard');}, buildMenu, 0, 1, 2, 3);
        buyFactoryBtn.input.priorityID = hudInputPriority;
        buyFactoryBtn.anchor.y = 1;  // Anchor on bottom left corner
        var factoryText = MainGame.game.make.text(0, -40, "Buy LumberYard\n$30K", Hud.styleNormal);
        factoryText.anchor.y = 1;
        buyFactoryBtn.addChild(factoryText);
        merchantGroup.addChild(buyFactoryBtn);

        // Setup buildMenu purchase button text
        var buyFactoryBtnText = MainGame.game.make.text(0, 0, 'Buy', Hud.styleButton);
        buyFactoryBtnText.anchor.x = 0.5;
        buyFactoryBtnText.anchor.y = 0.5;
        buyFactoryBtnText.x = buyFactoryBtn.width / 2;
        buyFactoryBtnText.y = -buyFactoryBtn.height / 2;
        buyFactoryBtn.addChild(buyFactoryBtnText);

        var buyArmyBaseBtn = MainGame.game.make.button(0, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, buyArmyBaseBtn, 'armyBase');}, buildMenu, 0, 1, 2, 3);
        buyArmyBaseBtn.input.priorityID = hudInputPriority;
        buyArmyBaseBtn.anchor.y = 1;  // Anchor on bottom left corner
        var armyBaseText = MainGame.game.make.text(0, -40, "Buy Army Base\n$30K", Hud.styleNormal);
        armyBaseText.anchor.y = 1;
        buyArmyBaseBtn.addChild(armyBaseText);
        militaryGroup.addChild(buyArmyBaseBtn);

        // Setup buildMenu purchase button text
        var buyArmyBaseBtnText = MainGame.game.make.text(0, 0, 'Buy', Hud.styleButton);
        buyArmyBaseBtnText.anchor.x = 0.5;
        buyArmyBaseBtnText.anchor.y = 0.5;
        buyArmyBaseBtnText.x = buyArmyBaseBtn.width / 2;
        buyArmyBaseBtnText.y = -buyArmyBaseBtn.height / 2;
        buyArmyBaseBtn.addChild(buyArmyBaseBtnText);

        var buyRoad = MainGame.game.make.button(200, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, buyRoad, 'road');}, buildMenu, 0, 1, 2, 3);
        buyRoad.input.priorityID = hudInputPriority;
        buyRoad.anchor.y = 1;  // Anchor on bottom left corner
        var roadText = MainGame.game.make.text(0, -40, "Buy Road\n$2K", Hud.styleNormal);
        roadText.anchor.y = 1;
        buyRoad.addChild(roadText);
        militaryGroup.addChild(buyRoad);

        // Setup buildMenu purchase button text
        var buyRoadText = MainGame.game.make.text(0, 0, 'Buy', Hud.styleButton);
        buyRoadText.anchor.x = 0.5;
        buyRoadText.anchor.y = 0.5;
        buyRoadText.x = buyRoad.width / 2;
        buyRoadText.y = -buyRoad.height / 2;
        buyRoad.addChild(buyRoadText);

        // Need to adjust beginBuilding() to handle arable vs weak farms
        var buyFarm = MainGame.game.make.button(400, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, buyFarm, 'arableFarm');}, buildMenu, 0, 1, 2, 3);
        buyFarm.input.priorityID = hudInputPriority;
        buyFarm.anchor.y = 1;  // Anchor on bottom left corner
        var farmText = MainGame.game.make.text(0, -40, "Buy Farm\n$10K", Hud.styleNormal);
        farmText.anchor.y = 1;
        buyFarm.addChild(farmText);
        militaryGroup.addChild(buyFarm);

        // Setup buildMenu purchase button text
        var buyFarmText = MainGame.game.make.text(0, 0, 'Buy', Hud.styleButton);
        buyFarmText.anchor.x = 0.5;
        buyFarmText.anchor.y = 0.5;
        buyFarmText.x = buyFarm.width / 2;
        buyFarmText.y = -buyFarm.height / 2;
        buyFarm.addChild(buyFarmText);
        
        return hud;
    },

    findChild: function(from,name){
        if(from.name && from.name===name)
            return from;
        if(!from.children || !from.children.length)
            return false;
        var count=from.children.length;
        for(var i=0;i<count;i++){
            var ch=from.getChildAt(i);
            var result=Hud.findChild(ch,name);
            if(result)
                return result;
        }
        return false;
    },
    showBuildMenu: function(hud) {
        var buildMenu=hud.findChild("buildMenu");
        console.assert(buildMenu);
        buildMenu.visible=!buildMenu.visible;
    },
    showStatusMenu: function(){

    },
    beginBuilding: function(menu, button, buildingType) {
        //console.log(buildingType);
        //console.log( MainGame.game.cache.getJSON('buildingData')[buildingType].cost);
        if (Global.money >= MainGame.game.cache.getJSON('buildingData')[buildingType].cost) {
            // Reset the button state (quick hack)
            button.frame = 1; // This should be whatever frame corresponds to the default state in the sprite sheet

            // Hide build menu
            menu.visible = false;
    
            // Create a building placer
            var buildingPlacer = BuildingPlacer.createNew(buildingType);
        }
    },
};

// Building Placer Object
// Dynamically extends sprite
var BuildingPlacer = {
    createNew: function(buildingType) {
        var bP = MainGame.game.add.sprite(0, 0, buildingType + '1');

        var zoom = MainGame.board.currentScale;
        bP.scale.set(zoom,zoom);

        bP.anchor.x = bP.anchor.y = 0.5;
        
        bP.deltaTime =  10; // How frequently update is called, in ms
        bP.buildingType = buildingType;
        bP.canBuild = false;
        bP.mapIndex = null;

        bP.update = function() { BuildingPlacer.update(bP); };
        bP.clickHandler = function(activePointer) { BuildingPlacer.clickHandler(bP, activePointer); };
        bP.cancelBuild = function() { BuildingPlacer.cancelBuild(bP); };

        bP.inputEnabled = true;
        bP.input.priorityID = 1;
        
        MainGame.game.time.events.loop(BuildingPlacer.deltaTime, bP.update, bP);
        MainGame.game.input.onDown.add(bP.clickHandler, bP, 10, MainGame.game.input.activePointer);

        return bP;
    },

    update: function(self) {
        // Track the mouse
        self.x = MainGame.game.input.x;
        self.y = MainGame.game.input.y;
        
        // Is the mouse over a build-ready tile, or is if offsides?
        self.mapIndex = MainGame.board.hitTest(self.x, self.y);
        if (self.mapIndex != null) {
            let tile = MainGame.board.at(self.mapIndex);
            // Might be nice to move these into Tile as convenience methods...
            let terrainType = tile.terrain.key;
            let tileResource = tile.res.key;
            let hasBuilding = tile.getBuilding().name != null ? true : false;
            // If the terrain is impassable, or a building already exists
            self.canBuild = !(terrainType === 'mountain' || terrainType === 'water' || hasBuilding);
            
            // Special consideration: lumberYards can only be built on forest
            if (self.buildingType === 'lumberYard' && self.canBuild) {
                self.canBuild = tileResource === 'forest' ? true : false;
            }
        } else self.canBuild = false;
        
        // Update tint
        if (self.canBuild) {
            self.tint = 0x00ff00;
        } else {
            self.tint = 0xff0000;
        }
    },
    
    clickHandler: function(self, pointer) {
        console.log("Handler invoked with priority 10!");

        if (self.canBuild) {
            var tile = MainGame.board.at(self.mapIndex);
            
            // Find building's starting turn
            /*global Global*/
            var startTurn = Global.turn;
            var newTint = 0xffffff;
            if(self.buildingType !== 'road'){
                startTurn += 2;
                newTint = 0x444444;
            }
            
            // Create a building object
            if (self.buildingType === 'arableFarm' && tile.getResType() !== 'wheat') {
                self.buildingType = 'weakFarm';
            }
            var newBuilding = Building.createNew({name:self.buildingType,level:1,startingTurn:startTurn,people:0});
            newBuilding.tint = newTint;

            // Set the tile's building to that object
            tile.setBuilding(newBuilding);
            
            // Bill the player
            Global.money -= newBuilding.cost;

            /*global updatePopulation*/
            updatePopulation(false,false);
            
            // End build mode
            self.cancelBuild();
        } else {
            console.log("Can't touch this!");
            self.cancelBuild();
        }
    },
    
    cancelBuild: function(self) {
        MainGame.game.input.onDown.remove(self.clickHandler, self, self, MainGame.game.input.activePointer);
        
        self.kill();
    }
};

/* UI group that holds the sprites + text for the major stats */
var StatsPanel = {
    unitWidth: 140,
    unitHeight: 48,
    verticalPad: 2,
    horizontalPad: 6,
    textStyle: { font: '30px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle' },

    createNew: function() {
        var statsPanel = MainGame.game.make.group();
        statsPanel.x = MainGame.game.width - StatsPanel.unitWidth + StatsPanel.verticalPad;
        statsPanel.y = MainGame.game.height / 2;

        // Year
        statsPanel.yearGroup = MainGame.game.make.group();
        statsPanel.yearGroup.y = (StatsPanel.unitHeight + StatsPanel.horizontalPad) * 0;
        statsPanel.yearGroup.sprite = MainGame.game.make.sprite(0, 0, 'year_icon');
        statsPanel.yearGroup.addChild(statsPanel.yearGroup.sprite);
        statsPanel.yearGroup.textLabel = MainGame.game.make.text(48 + StatsPanel.verticalPad, 6, '1950', StatsPanel.textStyle);
        statsPanel.yearGroup.addChild(statsPanel.yearGroup.textLabel);
        statsPanel.addChild(statsPanel.yearGroup);

        // Population
        statsPanel.popGroup = MainGame.game.make.group();
        statsPanel.popGroup.y = (StatsPanel.unitHeight + StatsPanel.horizontalPad) * 1;
        statsPanel.popGroup.sprite = MainGame.game.make.sprite(0, 0, 'population_icon');
        statsPanel.popGroup.addChild(statsPanel.popGroup.sprite);
        statsPanel.popGroup.textLabel = MainGame.game.make.text(48 + StatsPanel.verticalPad, 6, '0', StatsPanel.textStyle);
        statsPanel.popGroup.addChild(statsPanel.popGroup.textLabel);
        statsPanel.addChild(statsPanel.popGroup);

        // Money per Turn
        statsPanel.moneyPerTurnGroup = MainGame.game.make.group();
        statsPanel.moneyPerTurnGroup.y = (StatsPanel.unitHeight + StatsPanel.horizontalPad) * 2;
        statsPanel.moneyPerTurnGroup.sprite = MainGame.game.make.sprite(0, 0, 'money_icon');
        statsPanel.moneyPerTurnGroup.addChild(statsPanel.moneyPerTurnGroup.sprite);
        statsPanel.moneyPerTurnGroup.textLabel = MainGame.game.make.text(48 + StatsPanel.verticalPad, 6, '+0', StatsPanel.textStyle);
        statsPanel.moneyPerTurnGroup.addChild(statsPanel.moneyPerTurnGroup.textLabel);
        statsPanel.addChild(statsPanel.moneyPerTurnGroup);

        // State Money (warchest)
        statsPanel.warchestGroup = MainGame.game.make.group();
        statsPanel.warchestGroup.y = (StatsPanel.unitHeight + StatsPanel.horizontalPad) * 3;
        statsPanel.warchestGroup.sprite = MainGame.game.make.sprite(0, 0, 'money_icon');
        statsPanel.warchestGroup.addChild(statsPanel.warchestGroup.sprite);
        statsPanel.warchestGroup.textLabel = MainGame.game.make.text(48 + StatsPanel.verticalPad, 6, '$0', StatsPanel.textStyle);
        statsPanel.warchestGroup.addChild(statsPanel.warchestGroup.textLabel);
        statsPanel.addChild(statsPanel.warchestGroup);

        // Swiss Bank (personal money)
        statsPanel.swissGroup = MainGame.game.make.group();
        statsPanel.swissGroup.y = (StatsPanel.unitHeight + StatsPanel.horizontalPad) * 4;
        statsPanel.swissGroup.sprite = MainGame.game.make.sprite(0, 0, 'swiss_icon');
        statsPanel.swissGroup.addChild(statsPanel.swissGroup.sprite);
        statsPanel.swissGroup.textLabel = MainGame.game.make.text(48 + StatsPanel.verticalPad, 6, '$0', StatsPanel.textStyle);
        statsPanel.swissGroup.addChild(statsPanel.swissGroup.textLabel);
        statsPanel.addChild(statsPanel.swissGroup);

        // Set update loop
        MainGame.game.time.events.loop(500, function() {
            var globalStats = MainGame.global;

            var newPop = MainGame.population.count();
            var newYear = 1949 + globalStats.turn;
            var newMoneyPerTurn = '+' + globalStats.moneyPerTurn;
            var newWarchest = '$' + globalStats.money;
            var newSwissAccount = '$' + 0;

            statsPanel.popGroup.textLabel.text = newPop;
            statsPanel.yearGroup.textLabel.text = newYear;
            statsPanel.moneyPerTurnGroup.textLabel.text = newMoneyPerTurn;
            statsPanel.warchestGroup.textLabel.text = newWarchest;
            statsPanel.swissGroup.textLabel.text = newSwissAccount;
        }, statsPanel);

        return statsPanel;
    },
}

/* A separate UI element from the stats panel that accentuates the Freedom and Unrest Stats. Should be near the top of the screen */
var FunPanel = {
    unitWidth: 120,
    horizontalPad: 5,

    createNew: function() {
        var funPanel = MainGame.game.make.group();
        funPanel.x = MainGame.game.width / 2;

        // Freedom
        funPanel.freeGroup = MainGame.game.make.group();
        funPanel.freeGroup.x = -(FunPanel.unitWidth + FunPanel.horizontalPad/2);
        funPanel.freeGroup.sprite = MainGame.game.make.sprite(0, 0, 'freedom_icon');
        funPanel.freeGroup.addChild(funPanel.freeGroup.sprite);
        funPanel.freeGroup.textLabel = MainGame.game.make.text(48, 6, '0%', StatsPanel.textStyle);
        funPanel.freeGroup.addChild(funPanel.freeGroup.textLabel);
        funPanel.addChild(funPanel.freeGroup);

        // Unrest
        funPanel.unrestGroup = MainGame.game.make.group();
        funPanel.unrestGroup.x = FunPanel.horizontalPad/2;
        funPanel.unrestGroup.sprite = MainGame.game.make.sprite(0, 0, 'unrest_icon');
        funPanel.unrestGroup.addChild(funPanel.unrestGroup.sprite);
        funPanel.unrestGroup.textLabel = MainGame.game.make.text(48, 6, '0%', StatsPanel.textStyle);
        funPanel.unrestGroup.addChild(funPanel.unrestGroup.textLabel);
        funPanel.addChild(funPanel.unrestGroup);

        // Set update loop
        MainGame.game.time.events.loop(500, function() {
            var globalStats = MainGame.global;

            var newFreedom = globalStats.freedom + '%';
            var newUnrest = globalStats.unrest + '%';

            funPanel.freeGroup.textLabel.text = newFreedom;
            funPanel.unrestGroup.textLabel.text = newUnrest;
        }, funPanel);

        return funPanel;
    }
}