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

        //      global vars
        var statsPanel = StatsPanel.createNew();
        hud.addChild(statsPanel);

        var funPanel = FunPanel.createNew();
        hud.addChild(funPanel);

        //      Coalition Flag
        hud.coalitionFlag = CoalitionFlag.createNew();
        hud.addChild(hud.coalitionFlag);

        // "Next Turn" button
        hud.btnNextTurn = MainGame.game.make.button(MainGame.game.width, MainGame.game.height, 'endturn_button',
            function() {
                /*global MainGame*/
                MainGame.nextTurn();
                hud.btnNextTurn.sfx.play();
                hud.btnNextTurn.sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
            }, MainGame, 1, 0, 2, 2);
        hud.btnNextTurn.name = 'endturn_button';
        hud.btnNextTurn.input.priorityID = hudInputPriority;
        hud.btnNextTurn.anchor.x = 1;
        hud.btnNextTurn.anchor.y = 1;
        hud.btnNextTurn.sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        hud.addChild(hud.btnNextTurn);

        // Group2: Build
        var buildGroup=MainGame.game.make.group();
        buildGroup.name="buildGroup";
        hud.addChild(buildGroup);
        //      "Build" button
        var buildBtn = MainGame.game.make.button(0, MainGame.game.world.height, 'build_button', 
            function(){
                /*global BuildMenu*/
                BuildMenu.createNew();
                buildBtn.sfx.play();
                buildBtn.sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
            }, null, 1, 0, 2, 2);
        buildBtn.name="buildBtn";
        buildBtn.setChecked=true;
        buildBtn.anchor.y = 1;  // Anchor on bottom left corner
        buildBtn.inputEnabled = true;
        buildBtn.input.priorityID = 1;
        buildBtn.sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        buildGroup.addChild(buildBtn);
        
        return hud;
    },

    findChild: function(from, name) {
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

    beginBuilding: function(menu, mask, button, buildingType) {
        // This is the quickest place to add a sound effect for build menu options, so I'll do it here. I'm sorry - Sam
        var sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        sfx.play();

        //console.log( MainGame.game.cache.getJSON('buildingData')[buildingType].cost);
        if (Global.money >= MainGame.game.cache.getJSON('buildingData')[buildingType].cost) {
            // Reset the button state (quick hack)
            button.frame = 1; // This should be whatever frame corresponds to the default state in the sprite sheet

            // Hide build menu
            menu.visible=false;
            mask.visible=false;
    
            // Create a building placer
            var buildingPlacer = BuildingPlacer.createNew(buildingType, menu, mask);
        }
    },
};

// Building Placer Object
// Dynamically extends sprite
var BuildingPlacer = {
    createNew: function(buildingType, menu, mask) {
        var bP = MainGame.game.add.sprite(0, 0, buildingType + '1');

        var zoom = MainGame.board.currentScale;
        bP.scale.set(zoom,zoom);

        bP.anchor.x = bP.anchor.y = 0.5;
        
        bP.deltaTime =  10; // How frequently update is called, in ms
        bP.buildingType = buildingType;
        bP.canBuild = false;
        bP.mapIndex = null;

        // Assume we have 5 building sounds
        var soundIndex = Math.ceil(Math.random()*5);
        bP.sfx = game.make.audio('building_placement_' + soundIndex);

        bP.update = function() { BuildingPlacer.update(bP); };
        bP.clickHandler = function(activePointer) { BuildingPlacer.clickHandler(bP, activePointer, menu, mask); };
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
            var tile = MainGame.board.at(self.mapIndex);
            // Might be nice to move these into Tile as convenience methods...
            var terrainType = tile.terrain.key;
            var tileResource = tile.res.key;
            var hasBuilding = tile.getBuilding().name != null ? true : false;
            // If the terrain is impassable, or a building already exists
            self.canBuild = !(terrainType === 'mountain' || terrainType === 'water' || hasBuilding);
            
            // Special consideration: lumberYards can only be built on forest
            if (self.buildingType === 'lumberYard' && self.canBuild) {
                self.canBuild = tileResource === 'forest' ? true : false;
            }
        } else self.canBuild = false;

        // Check for build cancel
        if (MainGame.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
            self.cancelBuild();
        }
        
        // Update tint
        if (self.canBuild) {
            self.tint = 0x00ff00;
        } else {
            self.tint = 0xff0000;
        }
    },
    
    clickHandler: function(self, pointer, menu, mask) {
        if (self.canBuild) {
            var tile = MainGame.board.at(self.mapIndex);
            
            // Find building's starting turn
            /*global MainGame*/
            var startTurn = MainGame.global.turn;
            var newTint = 0xffffff;
            if(self.buildingType !== 'road'){
                startTurn += 2;
                newTint = 0x444444;
            }
            
            // Create a building object
            if (self.buildingType === 'fertileFarm' && tile.getResType() !== 'soy') {
                self.buildingType = 'weakFarm';
            }
            var newBuilding = Building.createNew({name:self.buildingType,level:1,startingTurn:startTurn,people:0});
            newBuilding.tint = newTint;
            if(newBuilding.startingTurn- MainGame.global.turn>0){
                newBuilding.constructionIcon = MainGame.game.make.sprite(0,0,"construction_icon");
                newBuilding.constructionIcon.anchor.setTo(1,0);
                newBuilding.constructionIcon.x=192;
                newBuilding.addChild(newBuilding.constructionIcon);

                newBuilding.counterIcon = MainGame.game.make.sprite(0,0,"counter_icon"+(newBuilding.startingTurn- MainGame.global.turn));
                newBuilding.counterIcon.anchor.setTo(1,1);
                newBuilding.counterIcon.x=192;
                newBuilding.counterIcon.y=newBuilding.height;
                newBuilding.addChild(newBuilding.counterIcon);
            }

            // Set the tile's building to that object
            tile.setBuilding(newBuilding);
            
            // Bill the player
            MainGame.global.money -= newBuilding.cost;

            /*global updatePopulation*/
            updatePopulation(false,false);

            // Make some noise!
            self.sfx.play();
            
            // End build mode
            menu.destroy();
            mask.destroy();
            self.cancelBuild();
        } else {
            console.log("Can't touch this!");
            menu.visible = true;
            mask.visible = true;
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
    verticalPad: 5,
    horizontalPad: 5,
    verticalTextOffset: 10,
    textStyle: { font: '24px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },

    createNew: function() {
        var statsPanel = MainGame.game.make.sprite(0, 0, 'stats_panel_backpanel');
        statsPanel.x = MainGame.game.width - statsPanel.width;
        statsPanel.y = MainGame.game.height / 2 - this.unitHeight + this.verticalPad;
        statsPanel.inputEnabled = true;
        statsPanel.input.priorityID = 1;

        // Year
        statsPanel.yearGroup = MainGame.game.make.sprite(0, 0, 'year_icon');
        statsPanel.yearGroup.x = this.horizontalPad;
        statsPanel.yearGroup.y = (this.unitHeight + this.verticalPad) * 0 + this.verticalPad;
        statsPanel.yearGroup.inputEnabled = true;
        statsPanel.yearGroup.input.priorityID = 2;

        var yearToolTip = ToolTip.createNew("Current Year");
        yearToolTip.x = -yearToolTip.width;
        yearToolTip.y = 12;
        statsPanel.yearGroup.addChild(yearToolTip);
        statsPanel.yearGroup.events.onInputOver.add(function() {yearToolTip.show();}, null);
        statsPanel.yearGroup.events.onInputOut.add(function() {yearToolTip.hide();}, null);

        statsPanel.yearGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, 1949+MainGame.global.turn, this.textStyle);
        statsPanel.yearGroup.addChild(statsPanel.yearGroup.textLabel);
        statsPanel.addChild(statsPanel.yearGroup);

        // Population
        statsPanel.popGroup = MainGame.game.make.button(0, 0, 'population_icon', function(){
            PeopleView.createNew();
            statsPanel.popGroup.sfxArray[Math.floor(Math.random()*statsPanel.popGroup.sfxArray.length)].play();
        }, 0, 1, 0, 2);
        statsPanel.popGroup.x = this.horizontalPad;
        statsPanel.popGroup.y = (this.unitHeight + this.verticalPad) * 1;
        statsPanel.popGroup.inputEnabled = true;
        statsPanel.popGroup.input.priorityID = 2;

        statsPanel.popGroup.sfxArray = [
            game.make.audio('paper_click_2'),
            game.make.audio('paper_click_3'),
            game.make.audio('paper_click_5'),
            game.make.audio('paper_click_7')
        ];

        var populationToolTip = ToolTip.createNew("Total Population");
        populationToolTip.x = -populationToolTip.width;
        populationToolTip.y = 12;
        statsPanel.popGroup.addChild(populationToolTip);
        statsPanel.popGroup.events.onInputOver.add(function() {populationToolTip.show();}, null);
        statsPanel.popGroup.events.onInputOut.add(function() {populationToolTip.hide();}, null);

        statsPanel.popGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '0 ', this.textStyle);
        statsPanel.popGroup.addChild(statsPanel.popGroup.textLabel);
        statsPanel.addChild(statsPanel.popGroup);

        // Homelessness
        statsPanel.homelessGroup = MainGame.game.make.sprite(0,0, 'homeless_icon');
        statsPanel.homelessGroup.x = this.horizontalPad;
        statsPanel.homelessGroup.y = (this.unitHeight + this.verticalPad) * 2;
        statsPanel.homelessGroup.inputEnabled = true;
        statsPanel.homelessGroup.input.priorityID = 2;

        var homelessToolTip = ToolTip.createNew("Homeless Citizens");
        homelessToolTip.x = -homelessToolTip.width;
        homelessToolTip.y = 12;
        statsPanel.homelessGroup.addChild(homelessToolTip);
        statsPanel.homelessGroup.events.onInputOver.add(function() {homelessToolTip.show();}, null);
        statsPanel.homelessGroup.events.onInputOut.add(function() {homelessToolTip.hide();}, null);

        statsPanel.homelessGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '0 ', this.textStyle);
        statsPanel.homelessGroup.addChild(statsPanel.homelessGroup.textLabel);
        statsPanel.addChild(statsPanel.homelessGroup);

        // Unemployment
        statsPanel.unemploymentGroup = MainGame.game.make.sprite(0,0, 'unemployed_icon');
        statsPanel.unemploymentGroup.x = this.horizontalPad;
        statsPanel.unemploymentGroup.y = (this.unitHeight + this.verticalPad) * 3;
        statsPanel.unemploymentGroup.inputEnabled = true;
        statsPanel.unemploymentGroup.input.priorityID = 2;

        var joblessToolTip = ToolTip.createNew("Jobless Citizens");
        joblessToolTip.x = -joblessToolTip.width;
        joblessToolTip.y = 12;
        statsPanel.unemploymentGroup.addChild(joblessToolTip);
        statsPanel.unemploymentGroup.events.onInputOver.add(function() {joblessToolTip.show();}, null);
        statsPanel.unemploymentGroup.events.onInputOut.add(function() {joblessToolTip.hide();}, null);

        statsPanel.unemploymentGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '0 ', this.textStyle);
        statsPanel.unemploymentGroup.addChild(statsPanel.unemploymentGroup.textLabel);
        statsPanel.addChild(statsPanel.unemploymentGroup);

        // State Money (warchest)
        statsPanel.warchestGroup = MainGame.game.make.sprite(0, 0, 'money_icon');
        statsPanel.warchestGroup.x = this.horizontalPad;
        statsPanel.warchestGroup.y = (this.unitHeight + this.verticalPad) * 4;
        statsPanel.warchestGroup.inputEnabled = true;
        statsPanel.warchestGroup.input.priorityID = 2;

        var moneyToolTip = ToolTip.createNew("National Funds");
        moneyToolTip.x = -moneyToolTip.width;
        moneyToolTip.y = 12;
        statsPanel.warchestGroup.addChild(moneyToolTip);
        statsPanel.warchestGroup.events.onInputOver.add(function() {moneyToolTip.show();}, null);
        statsPanel.warchestGroup.events.onInputOut.add(function() {moneyToolTip.hide();}, null);

        statsPanel.warchestGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, 0, '$0 ', this.textStyle);
        statsPanel.warchestGroup.addChild(statsPanel.warchestGroup.textLabel);
        statsPanel.addChild(statsPanel.warchestGroup);

        // Money Per Turn
        statsPanel.warchestGroup.moneyPerTurnText = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '(+0) ', this.textStyle);
        statsPanel.warchestGroup.moneyPerTurnText.y = 20;
        statsPanel.warchestGroup.addChild(statsPanel.warchestGroup.moneyPerTurnText);

        // Swiss Bank (personal money)
        statsPanel.swissGroup = MainGame.game.make.sprite(0, 0, 'swiss_icon');
        statsPanel.swissGroup.x = this.horizontalPad;
        statsPanel.swissGroup.y = (this.unitHeight + this.verticalPad) * 5;
        statsPanel.swissGroup.inputEnabled = true;
        statsPanel.swissGroup.input.priorityID = 2;

        var swissToolTip = ToolTip.createNew("Private Account");
        swissToolTip.x = -swissToolTip.width;
        swissToolTip.y = 12;
        statsPanel.swissGroup.addChild(swissToolTip);
        statsPanel.swissGroup.events.onInputOver.add(function() {swissToolTip.show();}, null);
        statsPanel.swissGroup.events.onInputOut.add(function() {swissToolTip.hide();}, null);

        statsPanel.swissGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '$0 ', this.textStyle);
        statsPanel.swissGroup.addChild(statsPanel.swissGroup.textLabel);
        statsPanel.addChild(statsPanel.swissGroup);

        // Set update loop
        MainGame.game.time.events.loop(300, function() {
            var globalStats = MainGame.global;

            var newPop = MainGame.population.count() + ' ';
            var newHomeless = MainGame.population.findNotHoused().length + ' ';
            var newUnemployment = MainGame.population.findNotEmployed().length + ' ';
            var newYear = 1949 + globalStats.turn + ' ';
            var newWarchest = '₸' + globalStats.money + ' ';
            var newMoneyPerTurn = (globalStats.moneyPerTurn >= 0) ? '(+' + globalStats.moneyPerTurn + ' ) ' : '(' + globalStats.moneyPerTurn + ' ) ';
            var newSwissAccount = '₸' + 0 + ' ';

            statsPanel.yearGroup.textLabel.text = newYear;
            statsPanel.popGroup.textLabel.text = newPop;
            statsPanel.homelessGroup.textLabel.text = newHomeless;
            statsPanel.unemploymentGroup.textLabel.text = newUnemployment;
            statsPanel.warchestGroup.textLabel.text = newWarchest;
            statsPanel.warchestGroup.moneyPerTurnText.text = newMoneyPerTurn;
            statsPanel.swissGroup.textLabel.text = newSwissAccount;
        }, statsPanel);

        return statsPanel;
    },
}

/* A subcomponent of the FunPanel that displays when there is a risk of riot. */
var RiotThermometer = {
    drainRate: 10,
    red: 0xff0000,
    barOpacity: .80,

    createNew: function(x, y) {
        var thermometer = MainGame.game.make.sprite(x, y, 'thermometer_bulb');
        thermometer.visible = false;

        thermometer.tube = MainGame.game.make.sprite(thermometer.width, 0, 'thermometer_tube');
        thermometer.tube.fluid = MainGame.game.make.graphics();
        thermometer.tube.fluid.lineStyle(0);
        thermometer.tube.addChild(thermometer.tube.fluid);
        thermometer.addChild(thermometer.tube);

        // Properties
        thermometer.delta = 0;      // Percent change per turn
        thermometer.toolTip = ToolTip.createNew('Ow my head');

        // Class functions
        thermometer.updateData = function() { RiotThermometer.updateData(thermometer); };
        thermometer.setVisibility = function() { RiotThermometer.setVisibility(thermometer); };

        // Set update loop
        MainGame.game.time.events.loop(500, function() {
            thermometer.updateData();
        }, thermometer);

        return thermometer;
    },

    updateData: function(thermometer) {
        thermometer.setVisibility();

        // Only bother updating if I am visible.
        if (thermometer.visible) {
            var fillAmount = (MainGame.global.thermometerFill/100) * thermometer.tube.width; // thermometerFill is percent fill of thermometer
            thermometer.tube.fluid.clear();
            thermometer.tube.fluid.beginFill(this.red, this.barOpacity);
            thermometer.tube.fluid.drawRect(0, 19, fillAmount, 10);
            thermometer.tube.fluid.endFill();
        }
    },

    // Show the thermometer iff: Free and Unrest are overlapping OR there is fluid in the thermometer
    setVisibility: function(thermometer) {
        // Estimate current delta
        thermometer.delta = MainGame.global.freedom + MainGame.global.unrest - 100;

        thermometer.visible = thermometer.delta > 0 || MainGame.global.thermometerFill > 0;
    }
}

/* A separate UI element from the stats panel that accentuates the Freedom and Unrest Stats. Should be near the top of the screen */
var FunPanel = {
    unitWidth: 120,
    horizontalPad: 5,
    textStyle: { font: '30px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
    blue: 0x03cae1,
    red: 0xff0000,
    barOpacity: .80,
    thermometerQuantity: 0,

    createNew: function() {
        var funPanel = MainGame.game.make.sprite(0, 0, 'fun_panel_backpanel');
        funPanel.anchor.set(0.5, 0.5);
        funPanel.x = MainGame.game.width / 2;
        funPanel.inputEnabled = true;
        funPanel.input.priorityID = 1;

        // Meter
        funPanel.meter = MainGame.game.make.sprite(0, 0, 'freedomUnrestMeter');
        funPanel.meter.anchor.x = 0.5;
        funPanel.meter.y = 5;
        funPanel.addChild(funPanel.meter);

        // Do the magic bars
        funPanel.freedomBar = MainGame.game.make.graphics();
        funPanel.freedomBar.lineStyle(0);
        funPanel.meter.addChild(funPanel.freedomBar);

        funPanel.unrestBar = MainGame.game.make.graphics();
        funPanel.unrestBar.lineStyle(0);
        funPanel.meter.addChild(funPanel.unrestBar);

        // Freedom
        funPanel.freeSprite = MainGame.game.make.sprite(0, 0, 'freedom_icon');
        funPanel.freeSprite.anchor.x = 0.5;
        funPanel.freeSprite.x = -funPanel.meter.width/2 - funPanel.freeSprite.width/2 - 5;
        funPanel.freeSprite.y = 5;

        funPanel.freeSprite.inputEnabled = true;
        funPanel.freeSprite.input.priorityID = 2;
        funPanel.freeSprite.toolTip = ToolTip.createNew('Total Freedom');
        funPanel.freeSprite.toolTip.y = 48;
        funPanel.freeSprite.events.onInputOver.add(function() {funPanel.freeSprite.toolTip.show();}, null);
        funPanel.freeSprite.events.onInputOut.add(function() {funPanel.freeSprite.toolTip.hide();}, null);
        funPanel.freeSprite.addChild(funPanel.freeSprite.toolTip);
        funPanel.addChild(funPanel.freeSprite);

        // Unrest
        funPanel.unrestSprite = MainGame.game.make.sprite(0, 0, 'unrest_icon');
        funPanel.unrestSprite.anchor.x = 0.5;
        funPanel.unrestSprite.x = funPanel.meter.width/2 + funPanel.unrestSprite.width/2 + 5;
        funPanel.unrestSprite.y = 5;

        funPanel.unrestSprite.inputEnabled = true;
        funPanel.unrestSprite.input.priorityID = 2;
        funPanel.unrestSprite.toolTip = ToolTip.createNew('Total Unrest');
        funPanel.unrestSprite.toolTip.y = 48;
        funPanel.unrestSprite.events.onInputOver.add(function() {funPanel.unrestSprite.toolTip.show();}, null);
        funPanel.unrestSprite.events.onInputOut.add(function() {funPanel.unrestSprite.toolTip.hide();}, null);
        funPanel.unrestSprite.addChild(funPanel.unrestSprite.toolTip);
        funPanel.addChild(funPanel.unrestSprite);

        // Riot Thermometer
        funPanel.thermometer = RiotThermometer.createNew(0, 65);
        funPanel.thermometer.x = -145;
        funPanel.addChild(funPanel.thermometer);

        // Class functions
        funPanel.updateData = function() { FunPanel.updateData(funPanel); };

        // Set update loop
        MainGame.game.time.events.loop(500, function() {
            funPanel.updateData();
        }, funPanel);

        return funPanel;
    },

    updateData(funPanel) {
        var globalStats = MainGame.global;

        var newFreedom = globalStats.freedom;
        var newUnrest = globalStats.unrest;

        // Update tooltips
        funPanel.freeSprite.toolTip.updateData('Freedom: ' + newFreedom + '%');
        funPanel.unrestSprite.toolTip.updateData('Unrest: ' + newUnrest + '%');

        // Update magic bars
        var freedomWidth = globalStats.freedom/100 * funPanel.meter.width;
        funPanel.freedomBar.clear();
        funPanel.freedomBar.beginFill(this.blue, this.barOpacity);
        funPanel.freedomBar.drawRect(-funPanel.meter.width/2, 31, freedomWidth, 10);
        funPanel.freedomBar.endFill();

        var unrestWidth = globalStats.unrest/100 * funPanel.meter.width;
        funPanel.unrestBar.clear();
        funPanel.unrestBar.beginFill(this.red, this.barOpacity);
        funPanel.unrestBar.drawRect(funPanel.meter.width/2, 7, -unrestWidth, 10);
        funPanel.unrestBar.endFill();
    },
}

var ToolTip = {
    textSize: 16,
    horizontalPad: 5,
    verticalPad: 0,
    black: 0x000000,
    opacity: 0.666,

    createNew: function(tipText) {
        var style = { font: this.textSize + 'px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle' };
        var toolTipText = MainGame.game.make.text(this.horizontalPad, 2, tipText, style);
        toolTipText.text = tipText;

        var toolTip = MainGame.game.make.graphics();
        toolTip.lineStyle(0);
        toolTip.beginFill(this.black, this.opacity);
        toolTip.drawRect(0, 0, toolTipText.width + (this.horizontalPad * 2), toolTipText.height + (this.verticalPad * 2));
        toolTip.endFill();

        toolTip.textLabel = toolTipText;
        toolTip.addChild(toolTipText);
        toolTip.visible = false;

        toolTip.updateData = function(newTipText) { ToolTip.updateData(toolTip, newTipText) };
        toolTip.show = function() { ToolTip.show(toolTip) };
        toolTip.hide = function() { ToolTip.hide(toolTip) };

        return toolTip;
    },

    updateData: function(toolTip, newTipText) {
        toolTip.textLabel.text = newTipText;
        toolTip.clear();
        toolTip.beginFill(this.black, this.opacity);
        toolTip.drawRect(0, 0, toolTip.textLabel.width + (this.horizontalPad * 2), toolTip.textLabel.height + (this.verticalPad * 2));
        toolTip.endFill();
    },

    show: function(toolTip) {
        MainGame.game.world.bringToTop(toolTip);
        toolTip.visible = true;
    },

    hide: function(toolTip) {
        toolTip.visible = false;
    }
}