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

        //      top bar bg
        var topBg = topGroup.create(0,0,'topBar');

        //      global vars
        var topStatsGroup = TopStats.createNew();
        topGroup.addChild(topStatsGroup);

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

        // Group3: Stats
       /* var statsGroup=MainGame.game.make.group();
        statsGroup.name="statsGroup";
        hud.addChild(statsGroup);
        //      "Stats" button
        var statsBtn=MainGame.game.make.button(900, 650, 'buttonSprite',
            function(){
                var menu=hud.findChild("statsMenu");
                console.assert(menu);
                menu.visible=!menu.visible;
                if(menu.visible){
                    hud.findChild("buildBtn").visible=false;
                }
            }, null,0,1,2,3);
        statsBtn.name="statsBtn";
        statsGroup.addChild(statsBtn);
        //      "Stats" menu
        var statsMenu=MainGame.game.make.group();
        statsMenu.name="statsMenu";
        statsMenu.visible=false;
        statsGroup.addChild(statsMenu); */

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
        var buyMansionBtn = MainGame.game.make.button(0, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, 'mansion');}, buildMenu, 0, 1, 2, 3);
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

        var buySuburbBtn = MainGame.game.make.button(200, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, 'suburb');}, buildMenu, 0, 1, 2, 3);
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

        var buyApartmentBtn = MainGame.game.make.button(400, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, 'apartment');}, buildMenu, 0, 1, 2, 3);
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

        var buySchoolBtn = MainGame.game.make.button(600, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, 'school');}, buildMenu, 0, 1, 2, 3);
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

        var buyFactoryBtn = MainGame.game.make.button(0, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, 'lumberYard');}, buildMenu, 0, 1, 2, 3);
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

        var buyArmyBaseBtn = MainGame.game.make.button(0, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, 'armyBase');}, buildMenu, 0, 1, 2, 3);
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

        var buyRoad = MainGame.game.make.button(200, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, 'road');}, buildMenu, 0, 1, 2, 3);
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
        var buyFarm = MainGame.game.make.button(400, 0, 'small_generic_button', function() {Hud.beginBuilding(buildMenu, 'arableFarm');}, buildMenu, 0, 1, 2, 3);
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
    beginBuilding: function(menu, buildingType) {
        console.log(buildingType);
        console.log( MainGame.game.cache.getJSON('buildingData')[buildingType].cost);
        if (Global.money >= MainGame.game.cache.getJSON('buildingData')[buildingType].cost) {
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

/* UI group that holds the sprites + text for the stats on the top bar */
var TopStats = {
    createNew: function() {
        var unitWidth = 120;
        var style = { font: "32px STKaiti", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
        var topStats = MainGame.game.make.group();

        // Year
        topStats.yearGroup = MainGame.game.make.group();
        topStats.yearGroup.x = unitWidth;
        topStats.yearGroup.sprite = MainGame.game.make.sprite(0, 0, 'year_icon');
        topStats.yearGroup.addChild(topStats.yearGroup.sprite);
        topStats.yearGroup.textLabel = MainGame.game.make.text(48, 6, '1950', style);
        topStats.yearGroup.addChild(topStats.yearGroup.textLabel);
        topStats.addChild(topStats.yearGroup);

        // Population
        topStats.popGroup = MainGame.game.make.group();
        topStats.popGroup.x = unitWidth * 2;
        topStats.popGroup.sprite = MainGame.game.make.sprite(0, 0, 'population_icon');
        topStats.popGroup.addChild(topStats.popGroup.sprite);
        topStats.popGroup.textLabel = MainGame.game.make.text(48, 6, '0', style);
        topStats.popGroup.addChild(topStats.popGroup.textLabel);
        topStats.addChild(topStats.popGroup);

        // Freedom
        topStats.freeGroup = MainGame.game.make.group();
        topStats.freeGroup.x = unitWidth * 3;
        topStats.freeGroup.sprite = MainGame.game.make.sprite(0, 0, 'freedom_icon');
        topStats.freeGroup.addChild(topStats.freeGroup.sprite);
        topStats.freeGroup.textLabel = MainGame.game.make.text(48, 6, '0%', style);
        topStats.freeGroup.addChild(topStats.freeGroup.textLabel);
        topStats.addChild(topStats.freeGroup);

        // Unrest
        topStats.unrestGroup = MainGame.game.make.group();
        topStats.unrestGroup.x = unitWidth * 4;
        topStats.unrestGroup.sprite = MainGame.game.make.sprite(0, 0, 'unrest_icon');
        topStats.unrestGroup.addChild(topStats.unrestGroup.sprite);
        topStats.unrestGroup.textLabel = MainGame.game.make.text(48, 6, '0%', style);
        topStats.unrestGroup.addChild(topStats.unrestGroup.textLabel);
        topStats.addChild(topStats.unrestGroup);

        // Money per Turn
        topStats.moneyPerTurnGroup = MainGame.game.make.group();
        topStats.moneyPerTurnGroup.x = unitWidth * 5;
        topStats.moneyPerTurnGroup.sprite = MainGame.game.make.sprite(0, 0, 'money_icon');
        topStats.moneyPerTurnGroup.addChild(topStats.moneyPerTurnGroup.sprite);
        topStats.moneyPerTurnGroup.textLabel = MainGame.game.make.text(48, 6, '$0', style);
        topStats.moneyPerTurnGroup.addChild(topStats.moneyPerTurnGroup.textLabel);
        topStats.addChild(topStats.moneyPerTurnGroup);

        // State Money (warchest)
        topStats.warchestGroup = MainGame.game.make.group();
        topStats.warchestGroup.x = unitWidth * 6;
        topStats.warchestGroup.sprite = MainGame.game.make.sprite(0, 0, 'money_icon');
        topStats.warchestGroup.addChild(topStats.warchestGroup.sprite);
        topStats.warchestGroup.textLabel = MainGame.game.make.text(48, 6, '$0', style);
        topStats.warchestGroup.addChild(topStats.warchestGroup.textLabel);
        topStats.addChild(topStats.warchestGroup);

        // Swiss Bank (personal money)
        topStats.swissGroup = MainGame.game.make.group();
        topStats.swissGroup.x = unitWidth * 7;
        topStats.swissGroup.sprite = MainGame.game.make.sprite(0, 0, 'money_icon');
        topStats.swissGroup.addChild(topStats.swissGroup.sprite);
        topStats.swissGroup.textLabel = MainGame.game.make.text(48, 6, '$0', style);
        topStats.swissGroup.addChild(topStats.swissGroup.textLabel);
        topStats.addChild(topStats.swissGroup);

        // Set update loop
        MainGame.game.time.events.loop(500, function() {
            var globalStats = MainGame.global;

            var newPop = MainGame.population.count();
            var newYear = 1949 + globalStats.turn;
            var newUnrest = globalStats.unrest + '%';
            var newFreedom = globalStats.freedom + '%';
            var newMoneyPerTurn = '$' + globalStats.moneyPerTurn;
            var newWarchest = '$' + globalStats.money;
            var newSwissAccount = '$' + 0;

            topStats.popGroup.textLabel.text = newPop;
            topStats.freeGroup.textLabel.text = newFreedom;
            topStats.unrestGroup.textLabel.text = newUnrest;
            topStats.yearGroup.textLabel.text = newYear;
            topStats.moneyPerTurnGroup.textLabel.text = newMoneyPerTurn;
            topStats.warchestGroup.textLabel.text = newWarchest;
            topStats.swissGroup.textLabel.text = newSwissAccount;

            //topStats.textLabel.text = MainGame.global.toString() + ' Pop:' + MainGame.population.count();
        }, topStats);

        return topStats;
    },
}

// add me before HUD!!!
// Does useful things with display map data in-game, include the mouse-hover label and the buildingDetailMenu
// var MapSelector = {
//     createNew: function(){
//         /*global MainGame*/
//         var ms = MainGame.game.add.group();        

//         // Class vars
//         ms.name = "MapSelector";
//         ms.curIndex = -1;
//         ms.activeIndex = null;
//         // ms.loopingTimer = MainGame.game.time.events.loop(50, MapSelector.updateAll, ms, ms);
//         ms.buildingDetail = MapSelector.makeBuildingDetail(ms);

//         // Class funcs
//         ms.updateBuildingDetail = function(tileIndex) {MapSelector.updateBuildingDetail(ms,tileIndex)};
//         ms.positionBuildingDetail = function(b) {MapSelector.positionBuildingDetail(ms,b)};
//         // ms.updateAll = function() {MapSelector.updateAll(ms)};
//         // ms.clickHandler = function(activePointer) { MapSelector.clickHandler(ms, activePointer); };

//         // MainGame.game.input.onDown.add(ms.clickHandler, ms, ms, MainGame.game.input.activePointer);

//         return ms;
//     },

//     makeBuildingDetail: function(ms) {
//         var buildingDetail = MainGame.game.make.group();
//         var buildingDetailInputPriority = 2;

//         var style = { font: "20px STKaiti", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, boundsAlignH: "center", boundsAlignV: "middle" , backgroundColor: "#ffff00" };

//         // bg (the grad)
//         buildingDetail.bg = MainGame.game.make.sprite(0, 0, 'building_detail_backpanel');
//         var labelX = Math.floor(buildingDetail.bg.texture.width / 2);
//         var labelY = Math.floor(buildingDetail.bg.texture.height / 2);
//         buildingDetail.bg.y -= labelY;
//         buildingDetail.addChild(buildingDetail.bg);

//         // label (bld name/lv)
//         buildingDetail.label = MainGame.game.make.text(labelX, -labelY+30, "", style, buildingDetail);
//         buildingDetail.label.anchor.x = 0.5;
//         buildingDetail.label.anchor.y = 0.5;
//         buildingDetail.addChild(buildingDetail.label);

//         // label2 (people)
//         buildingDetail.label2 = MainGame.game.make.text(10, -labelY+60, "", style, buildingDetail);
//         buildingDetail.label2.anchor.y = 0.5;
//         buildingDetail.addChild(buildingDetail.label2);

//         // label3 (health)
//         buildingDetail.label3=MainGame.game.make.text(10,-labelY+90,"",style,buildingDetail);
//         buildingDetail.label3.anchor.y = 0.5;
//         buildingDetail.addChild(buildingDetail.label3);

//         // label3 (health)
//         buildingDetail.label4=MainGame.game.make.text(10,-labelY+120,"",style,buildingDetail);
//         buildingDetail.label4.anchor.y = 0.5;
//         buildingDetail.addChild(buildingDetail.label4);

//         // label3 (health)
//         buildingDetail.label5=MainGame.game.make.text(10,-labelY+150,"",style,buildingDetail);
//         buildingDetail.label5.anchor.y = 0.5;
//         buildingDetail.addChild(buildingDetail.label5);

//         // Hire button
//         buildingDetail.addPersonButton = MainGame.game.make.button(30, -labelY+200, "btnHire", 
//             function() {
//                 //console.log("[MapSelector] Hire people for index: ",ms.curIndex);
//                 // TODO
//                 /*global MainGame*/
//                 var bld = MainGame.board.at(ms.curIndex).building;
//                 if (bld.people >= bld.maxPeople) {
//                     return;
//                 }
                
//                 //console.log("[MapSelector] and the building's type/name is:["+bld.type+","+bld.name+"]");
//                 MainGame.population.hire(ms.curIndex);
//                 //bld.people=bld.people+actual; [this is now done in building.addPerson()]
//                 // update display
//                 buildingDetail.label2.text="People: "+bld.people+"/"+bld.maxPeople;

//                 for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
//                     var outType = bld.effects[outIndex].type;
//                     if(outType==="health"){ 
//                         outType="Health";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(ms.curIndex);
//                     }else if(outType==="education"){
//                         outType="Edu";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(ms.curIndex);
//                     }else if(outType==="freedom"){
//                         outType="Extra Freedom";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(ms.curIndex);
//                     }else if(outType==="unrest"){
//                         outType="Extra Unrest";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(ms.curIndex);
//                     }else if(outType==="money"){    outType="Money";    }

//                     if(outIndex===0){
//                         buildingDetail.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }else if(outIndex===1){
//                         buildingDetail.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }else if(outIndex===2){
//                         buildingDetail.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }
//                 }
//                 /*global updatePopulation*/
//                 updatePopulation(false,false);
//             }, ms, 0, 1, 2, 3);
//         buildingDetail.addPersonButton.input.priorityID = buildingDetailInputPriority;
//         buildingDetail.addChild(buildingDetail.addPersonButton);

//         // Fire button
//         buildingDetail.removePersonButton = MainGame.game.make.button(100, -labelY+200, "btnFire",
//             function() {
//                 //console.log("[MapSelector] Fire people for index: ",ms.curIndex);
//                 // TODO
//                 /*global MainGame*/
//                 var bld=MainGame.board.at(ms.curIndex).building;
//                 if(bld.people<=0){
//                     return;
//                 }
                
//                 //console.log("[MapSelector] and the building's type/name is:["+bld.type+","+bld.name+"]");
//                 MainGame.population.fire(ms.curIndex);
//                 //bld.people=bld.people-actual; [this is now done in building.addPerson()]
//                 // update display
//                 buildingDetail.label2.text="People: "+bld.people+"/"+bld.maxPeople;

//                 for(var outIndex = 0; outIndex < bld.effects.length; outIndex++) {
//                     var outType = bld.effects[outIndex].type;
//                     if(outType==="health"){ 
//                         outType="Health";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(ms.curIndex);
//                     }else if(outType==="education"){
//                         outType="Edu";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(ms.curIndex);
//                     }else if(outType==="freedom"){
//                         outType="Extra Freedom";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(ms.curIndex);
//                     }else if(outType==="unrest"){
//                         outType="Extra Unrest";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(ms.curIndex);
//                     }else if(outType==="money"){
//                         outType="Money";
//                         MainGame.global.updateMoneyPerTurn();                    }

//                     if(outIndex===0){
//                         buildingDetail.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }else if(outIndex===1){
//                         buildingDetail.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }else if(outIndex===2){
//                         buildingDetail.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }
//                 }
//                 /*global updatePopulation*/
//                 updatePopulation(false,false);
//             }, ms, 0,1,2,3);
//         buildingDetail.removePersonButton.input.priorityID = buildingDetailInputPriority;
//         buildingDetail.addChild(buildingDetail.removePersonButton);

//         buildingDetail.visible = false;
//         return buildingDetail;
//     },


//     updateBuildingDetail: function(ms, tileIndex) {
//         ms.buildingDetail.visible = true;

//         if(tileIndex===null){
//             ms.buildingDetail.visible = false;
//             return;
//         }

//         if(ms.activeIndex===tileIndex){
//             return;
//         }
//         ms.activeIndex=tileIndex;

//         if(!MainGame.board.at(tileIndex).hasBuilding()){
//             ms.buildingDetail.visible = false;
//             return;
//         }

//         var b = MainGame.board;
//         var tile = b.at(ms.activeIndex);
//         var bld = tile.getBuilding();

//         // Let's figure out what kind of info we need to display
//         var displayName = '';

//         // If this tile has no building, display terrain info
//         if (bld === null || bld.isEmpty()) {
//             // If this terrain has a natural resource, display that, otherwise display the terrain name
//             displayName = tile.getRes().key === '__default' ? tile.terrain.key : tile.getRes().key;

//             ms.buildingDetail.label2.text = ''; // Make sure this text gets cleared if it's not going to be used
//         } else {
//             displayName = bld.name;// + " Lv"+bld.level;

//             // Most buildings can contain people, but some (like roads) cannot. Be sure to correct for that.
//             if (bld.subtype === 'road') {
//                 ms.buildingDetail.label2.text = '';
//             } else {
//                 ms.buildingDetail.label2.text = "People: " + bld.people + "/" + bld.maxPeople;
//             }

//             var str3="";
//             var str4="";
//             var str5="";
            
//             if(bld.subtype==="housing"){
//                 str3="Health: "+bld.health;
//                 str4="Education: "+bld.education;
//                 str5="Shelter: "+bld.shelter;
//             }
//             if(bld.effects[0].type!==null){
//                 for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
//                     var outType = bld.effects[outIndex].type;
//                     var outValue = bld.effects[outIndex].outputTable[bld.people];
//                     if(outType==="health"){ outType="Health";   }
//                     else if(outType==="education"){ outType="Edu";  }
//                     else if(outType==="freedom"){   outType="Freedom";    }
//                     else if(outType==="unrest"){    outType="Unrest"; }
//                     else if(outType==="money"){
//                         outType="Money";
//                         outValue="$"+outValue+"K";
//                     }
            
//                     if(outIndex===0){
//                         str3=outType+" Output: "+outValue;
//                     }else if(outIndex===1){
//                         str4=outType+" Output: "+outValue;
//                     }else if(outIndex===2){
//                         str5.text=outType+" Output: "+outValue;
//                     }
//                 }
//             }
//             ms.buildingDetail.label3.text=str3;
//             ms.buildingDetail.label4.text=str4;
//             ms.buildingDetail.label5.text=str5;
//         }

//         ms.buildingDetail.label.text = displayName;

//         ms.positionBuildingDetail(b);
//     },

//     positionBuildingDetail: function(ms, b){
//         var rect = b.rectOf(ms.activeIndex,b.currentScale);
//         ms.buildingDetail.x = rect.x-b._offset.x+rect.w*.85;
//         ms.buildingDetail.y = rect.y-b._offset.y+rect.h*.5;
//         ms.buildingDetail.scale.set(b.currentScale);
//     },

    // clickHandler: function(ms, activePointer) {
    //     var b = MainGame.board;
    //     var index = MainGame.board.hitTest(activePointer.x, activePointer.y);

    //     if(index===null){
    //         ms.buildingDetail.visible = false;
    //         return;
    //     }
    //     if(ms.activeIndex===index){
    //         return;
    //     }
    //     ms.activeIndex = index;

    //     if (b.at(index).hasBuilding()) {
    //         var rect = b.rectOf(ms.activeIndex,b.currentScale);
    //         ms.buildingDetail.x = rect.x-b._offset.x;
    //         ms.buildingDetail.y = rect.y-b._offset.y;
    //         ms.buildingDetail.visible = true;
    //     } else {
    //         // Make sure the detail menu is hidden if the user is trying to click away
    //         ms.buildingDetail.visible = false;
    //     }
        
    // },
// };