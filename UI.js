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

        var moneyPanel = MoneyPanel.createNew();
        hud.moneyPanel = moneyPanel;
        hud.addChild(moneyPanel);

        //      global vars
        var statsPanel = StatsPanel.createNew();
        hud.statsPanel = statsPanel;
        hud.addChild(statsPanel);

        var funPanel = FunPanel.createNew();
        hud.funPanel = funPanel;
        hud.addChild(funPanel);

        //      Coalition Flag
        var coalitionFlag = CoalitionFlag.createNew();
        hud.coalitionFlag = coalitionFlag;
        hud.addChild(hud.coalitionFlag);

        // Menu test buttons
        // hud.singleFolderButton = MainGame.game.make.button(0,moneyPanel.height,'small_generic_button',
        //     function(){
        //         /*global SingleFolder*/
        //         SingleFolder.createNew();
        //     }, MainGame, 1, 0, 2, 2);
        // hud.singleFolderButton.input.priorityID = hudInputPriority;
        // hud.addChild(hud.singleFolderButton);

        // hud.doubleFolderButton = MainGame.game.make.button(0,hud.singleFolderButton.y + hud.singleFolderButton.height,'small_generic_button',
        //     function(){
        //         /*global DoubleFolder*/
        //         DoubleFolder.createNew();
        //     }, MainGame, 1, 0, 2, 2);
        // hud.doubleFolderButton.input.priorityID = hudInputPriority;
        // hud.addChild(hud.doubleFolderButton);

        // hud.globalBinderButton = MainGame.game.make.button(0,hud.doubleFolderButton.y + hud.doubleFolderButton.height,'small_generic_button',
        //     function(){
        //         /*global Binder*/
        //         Binder.createNew(Binder.global,0);
        //     }, MainGame, 1, 0, 2, 2);
        // hud.globalBinderButton.input.priorityID = hudInputPriority;
        // hud.addChild(hud.globalBinderButton);

        // hud.buildingBinderButton = MainGame.game.make.button(0,hud.globalBinderButton.y + hud.globalBinderButton.height,'small_generic_button',
        //     function(){
        //         /*global Binder*/
        //         Binder.createNew(Binder.building,0,MainGame.board.findBuilding("school",null,null,null)[0]);
        //     }, MainGame, 1, 0, 2, 2);
        // hud.buildingBinderButton.input.priorityID = hudInputPriority;
        // hud.addChild(hud.buildingBinderButton);

        // hud.clipboardBinderButton = MainGame.game.make.button(0,hud.buildingBinderButton.y + hud.buildingBinderButton.height,'small_generic_button',
        //     function(){
        //         /*global Clipboard*/
        //         Clipboard.createNew();
        //     }, MainGame, 1, 0, 2, 2);
        // hud.clipboardBinderButton.input.priorityID = hudInputPriority;
        // hud.addChild(hud.clipboardBinderButton);


        // "Next Turn" button
        hud.btnNextTurn = MainGame.game.make.button(MainGame.game.width, MainGame.game.height, 'endturn_button',
            function() {
                /*global MainGame*/
                hud.btnNextTurn.sfx.play();
                hud.btnNextTurn.sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds

                MainGame.nextTurn();
            }, MainGame, 1, 0, 2, 2);
        hud.btnNextTurn.name = 'endturn_button';
        hud.btnNextTurn.input.priorityID = hudInputPriority;
        hud.btnNextTurn.anchor.x = 1;
        hud.btnNextTurn.anchor.y = 1;
        hud.btnNextTurn.sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        hud.addChild(hud.btnNextTurn);

        hud.btnNextTurnMask = MainGame.game.make.sprite(hud.btnNextTurn.x, hud.btnNextTurn.y, 'endturn_button_mask');
        hud.btnNextTurnMask.inputEnabled = true;
        hud.btnNextTurnMask.input.priorityID = hud.btnNextTurn.input.priorityID + 1;
        hud.btnNextTurnMask.anchor.x = 1;
        hud.btnNextTurnMask.anchor.y = 1;
        hud.btnNextTurnMask.visible = false;
        hud.addChild(hud.btnNextTurnMask);

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

        hud.setEndTurnActive = function(active) { Hud.setEndTurnActive(hud, active); };
        
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

    beginBuilding: function(menu, mask, button, buildingType) {
        // This is the quickest place to add a sound effect for build menu options, so I'll do it here. I'm sorry - Sam
        var sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        sfx.play();

        if (Global.money >= MainGame.game.cache.getJSON('buildingData')[buildingType].cost) {
            // Reset the button state (quick hack)
            button.frame = 1; // This should be whatever frame corresponds to the default state in the sprite sheet

            // Hide build menu
            menu.visible=false;
            mask.visible=false;
            MainGame.global.buildMenuIsOpen = false;
    
            // Create a building placer
            var buildingPlacer = BuildingPlacer.createNew(buildingType, menu, mask);
        }
    },

    // Determines whether to end turn button is active or inactive
    setEndTurnActive: function(hud, active) {
        hud.btnNextTurnMask.visible = !active;
        hud.btnNextTurn.frame = 0; // Make sure we don't get stuck in the down state
    },
};

// Building Placer Object
// Dynamically extends sprite
var BuildingPlacer = {
    textStyle: { font: '32px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },

    createNew: function(buildingType, menu, mask) {
        var buildingPlacer = MainGame.game.add.sprite(0, 0, buildingType);

        var zoom = MainGame.board.currentScale;
        buildingPlacer.scale.set(zoom,zoom);
        buildingPlacer.anchor.x = buildingPlacer.anchor.y = 0.5;
        buildingPlacer.alpha = 0.85;
        
        buildingPlacer.deltaTime =  10; // How frequently update is called, in ms
        buildingPlacer.buildingType = buildingType;
        buildingPlacer.canBuild = true;
        buildingPlacer.mapIndex = null;

        // Add some explanatory text
        var hintText = MainGame.game.make.text(MainGame.game.width/2, MainGame.game.height*0.9, ' Press ESC to cancel build ', this.textStyle);
        hintText.anchor.set(0.5, 0.5);
        var hint = MainGame.game.add.graphics();
        hint.lineStyle(0);
        hint.beginFill('#000000', 0.666);
        hint.drawRect(hintText.x - hintText.width/2, hintText.y - hintText.height/2, hintText.width, hintText.height);
        hint.endFill();
        hint.addChild(hintText);
        buildingPlacer.hint = hint;

        // Assume we have 5 building sounds
        var soundIndex = Math.ceil(Math.random()*5);
        buildingPlacer.sfx = game.make.audio('building_placement_' + soundIndex);

        buildingPlacer.updateSelf = function() { BuildingPlacer.updateSelf(buildingPlacer, menu, mask); };
        buildingPlacer.clickHandler = function(activePointer) { BuildingPlacer.clickHandler(buildingPlacer, activePointer, menu, mask); };
        buildingPlacer.cancelBuild = function() { BuildingPlacer.cancelBuild(buildingPlacer); };

        MainGame.global.isBuilding = true;
        
        buildingPlacer.placerTimer = MainGame.game.time.create(false);
        buildingPlacer.placerTimer.loop(buildingPlacer.deltaTime, function() { buildingPlacer.updateSelf(); }, buildingPlacer);
        buildingPlacer.placerTimer.start();
        MainGame.game.input.onUp.add(buildingPlacer.clickHandler, buildingPlacer, 10, MainGame.game.input.activePointer);

        return buildingPlacer;
    },

    updateSelf: function(self, menu, mask) {
        // Track the mouse
        self.x = MainGame.game.input.x;
        self.y = MainGame.game.input.y;
        
        // Is the mouse over a build-ready tile, or is if offsides?
        self.mapIndex = MainGame.board.hitTest(self.x, self.y);
        if (self.mapIndex != null) {
            var tile = MainGame.board.at(self.mapIndex);
            // Might be nice to move these into Tile as convenience methods...
            var terrainType = tile.terrain.key;
            // If the terrain is impassable, or a building already exists
            self.canBuild = !(terrainType === 'mountain' || terrainType === 'water' || tile.hasBuilding());
        } else self.canBuild = false;

        // Check for build cancel
        if (MainGame.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
            menu.visible = true;
            mask.visible = true;
            MainGame.global.buildMenuIsOpen = true;
            game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)).play();
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
                newTint = 0x808080;
            }
            
            // Create a building object
            var newBuilding = Building.createNew({name:self.buildingType,startingTurn:startTurn,people:0});
            if(newBuilding.startingTurn- MainGame.global.turn>0){
                newBuilding.loadTexture('construction',0,false);
                newBuilding.tint = newTint;
                
                newBuilding.constructionIcon = MainGame.game.make.sprite(0,0,"construction_icon");
                newBuilding.constructionIcon.anchor.setTo(1,0);
                newBuilding.constructionIcon.x=192;
                newBuilding.addChild(newBuilding.constructionIcon);

                newBuilding.counterIcon = MainGame.game.make.sprite(0,0,"counter_icon"+(newBuilding.startingTurn- MainGame.global.turn));
                newBuilding.counterIcon.anchor.setTo(1,1);
                newBuilding.counterIcon.x=192;
                newBuilding.counterIcon.y=newBuilding.constructionIcon.height*2;
                newBuilding.addChild(newBuilding.counterIcon);
            }

            // Set the tile's building to that object
            tile.setBuilding(newBuilding);
            
            // Bill the player
            MainGame.global.money -= newBuilding.cost;

            MainGame.population.update(false);

            // Make some noise!
            self.sfx.play();
            
            // End build mode
            //tile.events.onInputUp._shouldPropagate = false; Nope
            //tile.events.onInputUp._bindings.shift(); Nope
            // self.inputEnabled = true;
            // self.input.priorityID = 100;
            // console.log(tile.events.onInputUp);

            MainGame.board.controller.dontPan = true;

            menu.destroy();
            mask.destroy();
            self.cancelBuild();
        } else {
            console.log("Can't touch this!");
            game.make.audio('empty_click_' + Math.ceil(Math.random()*5)).play();
        }
    },
    
    cancelBuild: function(self) {
        MainGame.global.isBuilding = false;
        MainGame.game.input.onUp.remove(self.clickHandler, self, 10, MainGame.game.input.activePointer);
        self.hint.destroy();
        self.placerTimer.stop();
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

        statsPanel.sfxArray = [
            // game.make.audio('paper_click_2'),
            // game.make.audio('paper_click_3'),
            // game.make.audio('paper_click_5'),
            // game.make.audio('paper_click_7')
            game.make.audio('typewriter_click_1'),
            game.make.audio('typewriter_click_2'),
            game.make.audio('typewriter_click_3'),
            game.make.audio('typewriter_click_4'),
            game.make.audio('typewriter_click_5')
        ];

        // Year
        statsPanel.yearGroup = MainGame.game.make.button(0, 0, 'year_icon', function(){
            Binder.createNew(Binder.global,0);
            statsPanel.sfxArray[Math.floor(Math.random()*statsPanel.sfxArray.length)].play();
        }, 0, 1, 0, 2);
        statsPanel.yearGroup.x = this.horizontalPad;
        statsPanel.yearGroup.y = (this.unitHeight + this.verticalPad) * 0 + this.verticalPad;

        ToolTip.addTipTo(statsPanel.yearGroup, 2, 'Current Year', statsPanel.x, statsPanel.y + statsPanel.yearGroup.y + 12);
        statsPanel.yearGroup.toolTip.x -= statsPanel.yearGroup.toolTip.width;

        statsPanel.yearGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, 1949+MainGame.global.turn, this.textStyle);
        statsPanel.yearGroup.addChild(statsPanel.yearGroup.textLabel);
        statsPanel.addChild(statsPanel.yearGroup);

        // Population
        statsPanel.popGroup = MainGame.game.make.button(this.horizontalPad, (this.unitHeight + this.verticalPad) * 1, 'population_icon', function(){
            Binder.createNew(Binder.global,2);
            statsPanel.sfxArray[Math.floor(Math.random()*statsPanel.sfxArray.length)].play();
        }, 0, 1, 0, 2);

        ToolTip.addTipTo(statsPanel.popGroup, 2, 'Total Population', statsPanel.x, statsPanel.y + statsPanel.popGroup.y + 12);
        statsPanel.popGroup.toolTip.x -= statsPanel.popGroup.toolTip.width;

        statsPanel.popGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '0 ', this.textStyle);
        statsPanel.popGroup.addChild(statsPanel.popGroup.textLabel);
        statsPanel.addChild(statsPanel.popGroup);

        // Social Elite
        statsPanel.socialEliteGroup = MainGame.game.make.button(this.horizontalPad + statsPanel.width*1/5, (this.unitHeight + this.verticalPad) * 2, 'social_elite_icon', function(){
            Binder.createNew(Binder.global, 3);
            statsPanel.sfxArray[Math.floor(Math.random()*statsPanel.sfxArray.length)].play();
        }, 0, 1, 0, 2);

        ToolTip.addTipTo(statsPanel.socialEliteGroup, 2, 'Social Elite', statsPanel.x, statsPanel.y + statsPanel.socialEliteGroup.y + 12);
        statsPanel.socialEliteGroup.toolTip.x -= statsPanel.socialEliteGroup.toolTip.width;

        statsPanel.socialEliteGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '0 ', this.textStyle);
        statsPanel.socialEliteGroup.addChild(statsPanel.socialEliteGroup.textLabel);
        statsPanel.addChild(statsPanel.socialEliteGroup);

        // Working Class
        statsPanel.workingClassGroup = MainGame.game.make.button(this.horizontalPad + statsPanel.width*1/5, (this.unitHeight + this.verticalPad) * 3, 'working_class_icon', function(){
            Binder.createNew(Binder.global, 4);
            statsPanel.sfxArray[Math.floor(Math.random()*statsPanel.sfxArray.length)].play();
        }, 0, 1, 0, 2);

        ToolTip.addTipTo(statsPanel.workingClassGroup, 2, 'Working Class', statsPanel.x, statsPanel.y + statsPanel.workingClassGroup.y + 12);
        statsPanel.workingClassGroup.toolTip.x -= statsPanel.workingClassGroup.toolTip.width;

        statsPanel.workingClassGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '0 ', this.textStyle);
        statsPanel.workingClassGroup.addChild(statsPanel.workingClassGroup.textLabel);
        statsPanel.addChild(statsPanel.workingClassGroup);

        // Homelessness
        statsPanel.homelessGroup = MainGame.game.make.sprite(0,0, 'homeless_icon');
        statsPanel.homelessGroup.x = this.horizontalPad + statsPanel.width*1/5;
        statsPanel.homelessGroup.y = (this.unitHeight + this.verticalPad) * 4;

        ToolTip.addTipTo(statsPanel.homelessGroup, 2, 'Homeless Citizens', statsPanel.x + statsPanel.width/5, statsPanel.y + statsPanel.homelessGroup.y + 12);
        statsPanel.homelessGroup.toolTip.x -= statsPanel.homelessGroup.toolTip.width;

        statsPanel.homelessGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '0 ', this.textStyle);
        statsPanel.homelessGroup.addChild(statsPanel.homelessGroup.textLabel);
        statsPanel.addChild(statsPanel.homelessGroup);

        // Unemployment
        statsPanel.unemploymentGroup = MainGame.game.make.sprite(0,0, 'unemployed_icon');
        statsPanel.unemploymentGroup.x = this.horizontalPad + statsPanel.width*1/5;
        statsPanel.unemploymentGroup.y = (this.unitHeight + this.verticalPad) * 5;
        
        ToolTip.addTipTo(statsPanel.unemploymentGroup, 2, 'Jobless Citizens', statsPanel.x + statsPanel.width/5, statsPanel.y + statsPanel.unemploymentGroup.y + 12);
        statsPanel.unemploymentGroup.toolTip.x -= statsPanel.unemploymentGroup.toolTip.width;

        statsPanel.unemploymentGroup.textLabel = MainGame.game.make.text(48 + this.horizontalPad, this.verticalTextOffset, '0 ', this.textStyle);
        statsPanel.unemploymentGroup.addChild(statsPanel.unemploymentGroup.textLabel);
        statsPanel.addChild(statsPanel.unemploymentGroup);

        var branch = MainGame.game.make.graphics();
        branch.lineStyle(2,0xffffff,1);
        branch.moveTo(statsPanel.popGroup.x+statsPanel.popGroup.width/5,statsPanel.popGroup.y);
        branch.lineTo(statsPanel.popGroup.x+statsPanel.popGroup.width/5,statsPanel.unemploymentGroup.y-statsPanel.unemploymentGroup.height/2);
        branch.moveTo(statsPanel.popGroup.x+statsPanel.popGroup.width/5,statsPanel.socialEliteGroup.y-statsPanel.socialEliteGroup.height/2);
        branch.lineTo(statsPanel.socialEliteGroup.x-statsPanel.width/20,statsPanel.socialEliteGroup.y-statsPanel.socialEliteGroup.height/2);
        branch.moveTo(statsPanel.popGroup.x+statsPanel.popGroup.width/5,statsPanel.workingClassGroup.y-statsPanel.workingClassGroup.height/2);
        branch.lineTo(statsPanel.workingClassGroup.x-statsPanel.width/20,statsPanel.workingClassGroup.y-statsPanel.workingClassGroup.height/2);
        branch.moveTo(statsPanel.popGroup.x+statsPanel.popGroup.width/5,statsPanel.homelessGroup.y-statsPanel.homelessGroup.height/2);
        branch.lineTo(statsPanel.homelessGroup.x-statsPanel.width/20,statsPanel.homelessGroup.y-statsPanel.homelessGroup.height/2);
        branch.moveTo(statsPanel.popGroup.x+statsPanel.popGroup.width/5,statsPanel.unemploymentGroup.y-statsPanel.unemploymentGroup.height/2);
        branch.lineTo(statsPanel.unemploymentGroup.x-statsPanel.width/20,statsPanel.unemploymentGroup.y-statsPanel.unemploymentGroup.height/2);

        statsPanel.branch = MainGame.game.make.sprite(statsPanel.popGroup.x+statsPanel.popGroup.width/5,statsPanel.popGroup.y+statsPanel.popGroup.height,branch.generateTexture());
        statsPanel.addChild(statsPanel.branch);

        // Set update loop
        var timer = MainGame.game.time.create(false);
        timer.loop(300, function() {
            var globalStats = MainGame.global;

            var newPop = MainGame.population.count() + ' ';
            var newElite = MainGame.population.highList().length + MainGame.population.midList().length + ' ';
            var newWorkingClass = MainGame.population.lowList().length;
            var newHomeless = MainGame.population.findNotHoused().length + ' ';
            var newUnemployment = MainGame.population.findNotEmployed().length + ' ';
            var newYear = 1949 + globalStats.turn + ' ';

            statsPanel.yearGroup.textLabel.text = newYear;
            statsPanel.popGroup.textLabel.text = newPop;
            statsPanel.socialEliteGroup.textLabel.text = newElite;
            statsPanel.workingClassGroup.textLabel.text = newWorkingClass;
            statsPanel.homelessGroup.textLabel.text = newHomeless;
            statsPanel.unemploymentGroup.textLabel.text = newUnemployment;
        }, statsPanel);
        timer.start();

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
        thermometer.tube.fluid = MainGame.game.make.sprite(0, 20, 'red');
        thermometer.tube.fluid.alpha = this.barOpacity;
        thermometer.tube.fluid.height = 8;
        thermometer.tube.addChild(thermometer.tube.fluid);
        thermometer.addChild(thermometer.tube);

        // Properties
        thermometer.delta = 0;      // Percent change per turn

        // Class functions
        thermometer.updateData = function() { RiotThermometer.updateData(thermometer); };
        thermometer.setVisibility = function() { RiotThermometer.setVisibility(thermometer); };

        // Set update loop
        var timer = MainGame.game.time.create(false);
        timer.loop(500, function() {
            thermometer.updateData();
        }, thermometer);
        timer.start();

        return thermometer;
    },

    updateData: function(thermometer) {
        thermometer.setVisibility();

        // Only bother updating if I am visible.
        if (thermometer.visible) {
            var fillAmount = (MainGame.global.thermometerFill/100) * thermometer.tube.width; // thermometerFill is percent fill of thermometer
            MainGame.game.add.tween(thermometer.tube.fluid).to({width: fillAmount}, 200).start();
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
    barOpacity: .80,

    createNew: function() {
        var funPanel = MainGame.game.make.sprite(0, 0, 'fun_panel_backpanel');
        funPanel.anchor.set(0.5, 0.5);
        funPanel.x = MainGame.game.width / 2;
        funPanel.inputEnabled = true;
        funPanel.input.priorityID = 1;

        // Meter
        funPanel.meter = MainGame.game.make.sprite(0, 5, 'freedomUnrestMeter');
        funPanel.meter.anchor.x = 0.5;
        funPanel.addChild(funPanel.meter);

        // Do the magic bars
        funPanel.freedomBar = MainGame.game.make.sprite(-funPanel.meter.width/2, 4, 'blue');
        funPanel.freedomBar.alpha = this.barOpacity;
        funPanel.freedomBar.height = 16;
        funPanel.meter.addChild(funPanel.freedomBar);

        funPanel.unrestBar = MainGame.game.make.sprite(funPanel.meter.width/2, 28, 'red');
        funPanel.unrestBar.alpha = this.barOpacity;
        funPanel.unrestBar.height = 16;
        funPanel.meter.addChild(funPanel.unrestBar);

        // Meter foreground
        funPanel.meterForeground = MainGame.game.make.sprite(0, 5, 'freedomUnrestMeter_foreground');
        funPanel.meterForeground.anchor.x = 0.5;
        funPanel.addChild(funPanel.meterForeground);

        // Freedom
        funPanel.freeSprite = MainGame.game.make.sprite(0, 5, 'freedom_icon');
        funPanel.freeSprite.x = -funPanel.meter.width/2 - funPanel.freeSprite.width/2 - 5;
        funPanel.freeSprite.anchor.x = 0.5;

        ToolTip.addTipTo(funPanel.freeSprite, 2, 'Total Freedom', funPanel.x + funPanel.freeSprite.x, 48);
        funPanel.addChild(funPanel.freeSprite);

        // Unrest
        funPanel.unrestSprite = MainGame.game.make.sprite(0, 5, 'unrest_icon');
        funPanel.unrestSprite.x = funPanel.meter.width/2 + funPanel.unrestSprite.width/2 + 5;
        funPanel.unrestSprite.anchor.x = 0.5;

        ToolTip.addTipTo(funPanel.unrestSprite, 2, 'Total Unrest', funPanel.x + funPanel.unrestSprite.x, 48);
        funPanel.addChild(funPanel.unrestSprite);

        // Riot Thermometer
        funPanel.thermometer = RiotThermometer.createNew(-145, 65);
        funPanel.addChild(funPanel.thermometer);

        // Particles!
        //  Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
        funPanel.steam = MainGame.game.add.emitter(funPanel.x, funPanel.y+funPanel.meter.height, funPanel.meter.height);
        funPanel.steam.width = funPanel.meter.width;

        funPanel.steam.makeParticles(['whitePuff0', 'whitePuff1', 'whitePuff2', 'whitePuff3', 'whitePuff4', 'whitePuff5', 'whitePuff6', 'whitePuff7', 'whitePuff8', 'whitePuff9', 'whitePuff10']);

        funPanel.steam.minParticleSpeed.set(0, 0);
        funPanel.steam.maxParticleSpeed.set(0, -100);

        funPanel.steam.setAlpha(0.0, 0.6, 400, Phaser.Easing.Linear.None, true);
        funPanel.steam.minParticleScale = 0.25;
        funPanel.steam.maxParticleScale = 0.5;
        funPanel.steam.gravity = -200;

        //  false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
        //  The 5000 value is the lifespan of each particle before it's killed
        funPanel.steam.start(false, 800, 10);
        funPanel.steam.on = false;

        // Class functions
        funPanel.updateData = function() { FunPanel.updateData(funPanel); };

        // Set update loop
        var timer = MainGame.game.time.create(false);
        timer.loop(500, function() {
            funPanel.updateData();
        }, funPanel);
        timer.start();

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
        MainGame.game.add.tween(funPanel.freedomBar).to({width: globalStats.freedom/100 * funPanel.meter.width}, 200).start();
        MainGame.game.add.tween(funPanel.unrestBar).to({width: -globalStats.unrest/100 * funPanel.meter.width}, 200).start();

        // Is it getting steamy up in here?
        funPanel.steam.frequency = 110 - funPanel.thermometer.delta;
        funPanel.steam.width = (funPanel.thermometer.delta/100 * funPanel.meter.width) * 0.9 + (funPanel.meter.width * 0.1);
        funPanel.steam.x = MainGame.game.width/2 - funPanel.meter.width/2 + funPanel.freedomBar.width - (funPanel.thermometer.delta/100 * funPanel.meter.width)/2;
        funPanel.steam.on = funPanel.thermometer.visible;
    },
}

var ToolTip = {
    textSize: 16,
    horizontalPad: 5,
    verticalPad: 0,
    black: 0x000000,
    opacity: 0.666,

    // Whatever you're doing, you prooobably want to use addTipTo!
    createNew: function(tipText) {
        var style = { font: this.textSize + 'px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle' };
        var toolTipText = MainGame.game.make.text(this.horizontalPad, 2, tipText, style);
        toolTipText.text = tipText;

        var toolTip = MainGame.game.add.group();
        toolTip.backPanel = MainGame.game.make.graphics();
        toolTip.backPanel.lineStyle(0);
        toolTip.backPanel.beginFill(this.black, this.opacity);
        toolTip.backPanel.drawRect(0, 0, toolTipText.width + (this.horizontalPad * 2), toolTipText.height + (this.verticalPad * 2));
        toolTip.backPanel.endFill();
        toolTip.addChild(toolTip.backPanel);

        toolTip.textLabel = toolTipText;
        toolTip.addChild(toolTipText);
        toolTip.visible = false;

        toolTip.updateData = function(newTipText) { ToolTip.updateData(toolTip, newTipText) };
        toolTip.show = function() { ToolTip.show(toolTip) };
        toolTip.hide = function() { ToolTip.hide(toolTip) };

        return toolTip;
    },

    // Creates a tooltip with the passed-in string, and also handles the configuration details of setting a position, adding it as a child of the parent, and configuring the parent's input options
    // Prereq: parent is a sprite, or other input-enable-able object
    // Side effect: parent is now input enabled
    addTipTo: function(parent, inputPriority, tipText, x, y) {
        parent.inputEnabled = true;
        parent.input.priorityID = inputPriority;
        parent.toolTip = ToolTip.createNew(tipText);
        parent.toolTip.x = x;
        parent.toolTip.y = y;
        parent.events.onInputOver.add(function() {parent.toolTip.show();}, null);
        parent.events.onInputOut.add(function() {parent.toolTip.hide();}, null);
    },

    updateData: function(toolTip, newTipText) {
        toolTip.textLabel.text = newTipText;
        toolTip.backPanel.clear();
        toolTip.backPanel.beginFill(this.black, this.opacity);
        toolTip.backPanel.drawRect(0, 0, toolTip.textLabel.width + (this.horizontalPad * 2), toolTip.textLabel.height + (this.verticalPad * 2));
        toolTip.backPanel.endFill();
    },

    show: function(toolTip) {
        MainGame.game.world.bringToTop(toolTip);
        toolTip.visible = true;
        toolTip.alpha = 0;

        toolTip.timer = MainGame.game.time.create(true);
        toolTip.timer.add(500, function() {
            toolTip.tween = MainGame.game.add.tween(toolTip).to({alpha:1.0}, 250, Phaser.Easing.Linear.None, true);
        });
        toolTip.timer.start();
    },

    hide: function(toolTip) {
        toolTip.visible = false;
        toolTip.timer.removeAll();
    }
};

var UIPointer = {
    UP:    'up',
    DOWN:  'down',
    LEFT:  'left',
    RIGHT: 'right',

    createNew: function(xPos, yPos, direction, duration, callback, autostart) {
        // Validate parameters
        console.assert(direction === this.UP || direction === this.DOWN || direction === this.LEFT || direction === this.RIGHT);

        // Create pointer with correct sprite
        uiPointer = MainGame.game.add.sprite(xPos, yPos, 'pointer_' + direction);

        // Configure anchor point and create tween target
        switch (direction) {
            case this.UP:
                uiPointer.anchor.set(0.5, 0);
                var deltaXY = {x: xPos, y: yPos + uiPointer.height};
                break;

            case this.DOWN:
                uiPointer.anchor.set(0.5, 1);
                var deltaXY = {x: xPos, y: yPos - uiPointer.height};
                break;

            case this.LEFT:
                uiPointer.anchor.set(0, 0.5);
                var deltaXY = {x: xPos - uiPointer.width, y: yPos};
                break;

            case this.RIGHT:
                uiPointer.anchor.set(1, 0.5);
                var deltaXY = {x: xPos + uiPointer.width, y: yPos};
                break;

            default:
                var deltaXY = {x: xPos, y: yPos};
                break;
        }

        // Create tween
        uiPointer.tween = MainGame.game.add.tween(uiPointer).to(deltaXY, 500, Phaser.Easing.Quadratic.InOut, autostart, 0, -1, true);
        uiPointer.timer = MainGame.game.time.create(true);

        // If we get a negative or null duration value, loop infinitely.
        if (duration >= 0) {
            uiPointer.timer.add(duration, function() {
                callback();
                uiPointer.tween.stop(true);
                uiPointer.destroy();
            });
            if (autostart) uiPointer.timer.start();
        }

        uiPointer.start = function() { UIPointer.start(uiPointer); };
        uiPointer.pause = function() { UIPointer.pause(uiPointer); };
        uiPointer.stop = function() { UIPointer.stop(uiPointer); };

        return uiPointer;
    },

    start: function(uiPointer) {
        uiPointer.tween.start();
        uiPointer.timer.start();
    },

    pause: function(uiPointer) {
        uiPointer.tween.pause();
        uiPointer.timer.pause();
    },

    stop: function(uiPointer) {
        uiPointer.tween.stop(false);
        uiPointer.timer.stop(true);
        uiPointer.destroy();
    }
};