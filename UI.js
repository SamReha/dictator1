// Group all our UI classes here (at least, for now)
// Holds all our in-game UI elements


var Hud = {
    styleNormal: {font:"32px myKaiti", fill:"#ffffff"},

    createNew: function() {

        /*global MainGame*/
        var hud = MainGame.game.add.group();

        hud.name = "HUD"; // Useful for debugging

        // Group1: Top Stats
        var topGroup=MainGame.game.add.group();
        topGroup.name="topGroup";
        hud.addChild(topGroup);
        //      top bar bg
        var topBg=topGroup.create(0,0,'topBar');
        //      global vars
        var topText=MainGame.game.make.text(20,0,"",Hud.styleNormal);
        topGroup.addChild(topText);
        MainGame.game.time.events.loop(500, function(){
            topText.text=MainGame.global.toString()+" Pop:"+MainGame.population.count();
        }, topText);

        // "Next Turn" button
        var btnNextTurn=MainGame.game.make.button(750,0,"btnNextTurn",
            MainGame.nextTurn,MainGame,0,1,2,3);
        btnNextTurn.name="btnNextTurn";
        hud.addChild(btnNextTurn);

        // Group2: Build
        var buildGroup=MainGame.game.make.group();
        buildGroup.name="buildGroup";
        hud.addChild(buildGroup);
        //      "Build" button
        var buildBtn = MainGame.game.make.button(0, MainGame.game.world.height, 'buttonSprite', 
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
        buildGroup.addChild(buildBtn);
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
        var buyMansionBtn = MainGame.game.make.button(0, 0, 'buttonSprite', function() {Hud.beginBuilding(buildMenu, 'mansion');}, buildMenu, 0, 1, 2, 3);
        buyMansionBtn.anchor.y = 1;  // Anchor on bottom left corner
        var mansionText = MainGame.game.make.text(0, -40, "Buy Mansion\n$10K", Hud.styleNormal);
        mansionText.anchor.y = 1;
        buyMansionBtn.addChild(mansionText);
        bureauGroup.addChild(buyMansionBtn);

        var buySuburbBtn = MainGame.game.make.button(200, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buySuburbBtn.anchor.y = 1;  // Anchor on bottom left corner
        var suburbText = MainGame.game.make.text(0, -40, "Buy Suburb\n$10K", Hud.styleNormal);
        suburbText.anchor.y = 1;
        buySuburbBtn.addChild(suburbText);
        bureauGroup.addChild(buySuburbBtn);

        var buyApartmentBtn = MainGame.game.make.button(400, 0, 'buttonSprite', function() {Hud.beginBuilding(buildMenu, 'apartment');}, buildMenu, 0, 1, 2, 3);
        buyApartmentBtn.anchor.y = 1;  // Anchor on bottom left corner
        var apartmentText = MainGame.game.make.text(0, -40, "Buy Apartment\n$10K", Hud.styleNormal);
        apartmentText.anchor.y = 1;
        buyApartmentBtn.addChild(apartmentText);
        bureauGroup.addChild(buyApartmentBtn);

        var buySchoolBtn = MainGame.game.make.button(600, 0, 'buttonSprite', function() {Hud.beginBuilding(buildMenu, 'school');}, buildMenu, 0, 1, 2, 3);
        buySchoolBtn.anchor.y = 1;  // Anchor on bottom left corner
        var schoolText = MainGame.game.make.text(0, -40, "Buy School\n$15K", Hud.styleNormal);
        schoolText.anchor.y = 1;
        buySchoolBtn.addChild(schoolText);
        bureauGroup.addChild(buySchoolBtn);

        var buyFactoryBtn = MainGame.game.make.button(0, 0, 'buttonSprite', function() {Hud.beginBuilding(buildMenu, 'lumberYard');}, buildMenu, 0, 1, 2, 3);
        buyFactoryBtn.anchor.y = 1;  // Anchor on bottom left corner
        var factoryText = MainGame.game.make.text(0, -40, "Buy LumberYard\n$30K", Hud.styleNormal);
        factoryText.anchor.y = 1;
        buyFactoryBtn.addChild(factoryText);
        merchantGroup.addChild(buyFactoryBtn);

        var buyArmyBaseBtn = MainGame.game.make.button(0, 0, 'buttonSprite', function() {Hud.beginBuilding(buildMenu, 'armyBase');}, buildMenu, 0, 1, 2, 3);
        buyArmyBaseBtn.anchor.y = 1;  // Anchor on bottom left corner
        var armyBaseText = MainGame.game.make.text(0, -40, "Buy Army Base\n$30K", Hud.styleNormal);
        armyBaseText.anchor.y = 1;
        buyArmyBaseBtn.addChild(armyBaseText);
        militaryGroup.addChild(buyArmyBaseBtn);

        var buyRoad = MainGame.game.make.button(200, 0, 'buttonSprite', function() {Hud.beginBuilding(buildMenu, 'road');}, buildMenu, 0, 1, 2, 3);
        buyRoad.anchor.y = 1;  // Anchor on bottom left corner
        var roadText = MainGame.game.make.text(0, -40, "Buy Road\n$2K", Hud.styleNormal);
        roadText.anchor.y = 1;
        buyRoad.addChild(roadText);
        militaryGroup.addChild(buyRoad);

        // hud.buildMenu.buildingPurchaseList = [
        //     BuildingPurchaseOption.createNew(null, "Mansion",   10),
        //     BuildingPurchaseOption.createNew(null, "Suburbs",   10),
        //     BuildingPurchaseOption.createNew(null, "Apartment", 10),
        //     BuildingPurchaseOption.createNew(null, "School",    15),
        //     BuildingPurchaseOption.createNew(null, "Factory",   30),
        //     BuildingPurchaseOption.createNew(null, "Army Base", 30)
        // ];
        // // create a text
        // // var style = { font: "32px STKaiti", fill: "#ff0044 ", wordWrap: true, wordWrapWidth: 500, align: "center", backgroundColor: "#ffff00 " };
        // // var text = MainGame.game.make.text(200, 200, "Buy Apartment", style);
        // // text.anchor.set(0.5);

        // var button = MainGame.game.make.button(0, 0, 'buttonSprite', null, null, 0, 1, 2, 3);
        // button.name="TopLeft";
        // hud.addChild(button);
        // button.testFunc=function(){console.log("Calling topleft's test func.");console.log("and this param is"+this.name);this.visible=false;};

        // /*global MainGame*/
        // hud.buildMenuButton = MainGame.game.add.button(150, MainGame.game.world.height, 'buttonSprite', button.testFunc, button, 0, 1, 2, 3);
        // hud.buildMenuButton.anchor.y = 1;  // Anchor on bottom left corner
        // hud.buildMenuButton.name="Bottom";
        
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
        bP.anchor.x = bP.anchor.y = 0.5;
        
        bP.deltaTime =  10; // How frequently update is called, in ms
        bP.buildingType = buildingType;
        bP.canBuild = false;
        bP.mapIndex = null;

        bP.update = function() { BuildingPlacer.update(bP); };
        bP.clickHandler = function(activePointer) { BuildingPlacer.clickHandler(bP, activePointer); };
        bP.cancelBuild = function() { BuildingPlacer.cancelBuild(bP); };
        
        //console.log(MainGame.game.input);
        
        MainGame.game.time.events.loop(BuildingPlacer.deltaTime, bP.update, bP);
        MainGame.game.input.onDown.add(bP.clickHandler, bP, bP, MainGame.game.input.activePointer);

        return bP;
    },

    update: function(self) {
        // Track the mouse
        self.x = MainGame.game.input.x;
        self.y = MainGame.game.input.y;
        
        // Is the mouse over a build-ready tile, or is if offsides?
        self.mapIndex = MainGame.board.hitTest(MainGame.game.input.x, MainGame.game.input.y);
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
        // if (pointer.rightButton.isDown) {
        //     self.cancelBuild();
        //     return;
        // }
        
        if (self.canBuild) {
            var tile = MainGame.board.at(self.mapIndex);
            // // Get the building data for our current building
            // let buildingData = MainGame.game.cache.getJSON('buildingData')[self.buildingType];
            
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

// add me before HUD!!!
var MapSelector={
    createNew: function(){
        /*global MainGame*/
        var ms=MainGame.game.add.group();        

        // Class vars
        ms.name="MapSelector";
        ms.curIndex=-1;
        ms.mouseHoverTimer=MainGame.game.time.events.loop(50, MapSelector.updateBuildingInfo, ms);
        ms.buildingInfo=MapSelector.makeBuildingInfo(ms);
        ms.addChild(ms.buildingInfo);

        // Class funcs
        ms.updateBuildingInfo=function(){MapSelector.updateBuildingInfo(ms)};

        return ms;
    },
    makeBuildingInfo: function(ms){
        var bi=MainGame.game.make.group();
        // Test text style
        var style = { font: "20px STKaiti", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, align: "center", backgroundColor: "#ffff00 " };
        // bg (the grad)
        bi.bg=MainGame.game.make.sprite(0,0,"grpBldInfo");
        bi.addChild(bi.bg);
        // label (bld name/lv)
        bi.label=MainGame.game.make.text(10,0,"",style,bi);
        bi.addChild(bi.label);
        // label2 (people)
        bi.label2=MainGame.game.make.text(10,30,"",style,bi);
        bi.addChild(bi.label2);
        // label3 (health)
        bi.label3=MainGame.game.make.text(10,60,"",style,bi);
        bi.addChild(bi.label3);
        // label3 (health)
        bi.label4=MainGame.game.make.text(10,90,"",style,bi);
        bi.addChild(bi.label4);
        // label3 (health)
        bi.label5=MainGame.game.make.text(10,120,"",style,bi);
        bi.addChild(bi.label5);
        // Hire button
        bi.button=MainGame.game.make.button(30, 180, "btnHire", 
            function(){
                console.log("[MapSelector] Hire people for index: ",ms.curIndex);
                // TODO
                /*global MainGame*/
                var bld=MainGame.board.at(ms.curIndex).building;
                if(bld.people>=bld.maxPeople){
                    return;
                }
                // var actual=1;
                console.log("[MapSelector] and the building's type/name is:["+bld.type+","+bld.name+"]");
                MainGame.population.hire(ms.curIndex);
                //bld.people=bld.people+actual; [this is now done in building.addPerson()]
                // update display
                bi.label2.text="People: "+bld.people+"/"+bld.maxPeople;

                for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
                    var outType = bld.effects[outIndex].type;
                    if(outType==="health"){ 
                        outType="Health";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(ms.curIndex);
                    }else if(outType==="education"){
                        outType="Edu";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(ms.curIndex);
                    }else if(outType==="freedom"){
                        outType="Extra Freedom";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(ms.curIndex);
                    }else if(outType==="unrest"){
                        outType="Extra Unrest";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(ms.curIndex);
                    }else if(outType==="money"){    outType="Money";    }

                    if(outIndex===0){
                        bi.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }else if(outIndex===1){
                        bi.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }else if(outIndex===2){
                        bi.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }
                }
            }, ms, 0, 1, 2, 3);
        bi.addChild(bi.button);
        // Fire button
        bi.button2=MainGame.game.make.button(100,180,"btnFire",
            function(){
                console.log("[MapSelector] Fire people for index: ",ms.curIndex);
                // TODO
                /*global MainGame*/
                var bld=MainGame.board.at(ms.curIndex).building;
                if(bld.people<=0){
                    return;
                }
                // var actual=1;
                console.log("[MapSelector] and the building's type/name is:["+bld.type+","+bld.name+"]");
                MainGame.population.fire(ms.curIndex);
                //bld.people=bld.people-actual; [this is now done in building.addPerson()]
                // update display
                bi.label2.text="People: "+bld.people+"/"+bld.maxPeople;

                for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
                    var outType = bld.effects[outIndex].type;
                    if(outType==="health"){ 
                        outType="Health";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(ms.curIndex);
                    }else if(outType==="education"){
                        outType="Edu";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(ms.curIndex);
                    }else if(outType==="freedom"){
                        outType="Extra Freedom";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(ms.curIndex);
                    }else if(outType==="unrest"){
                        outType="Extra Unrest";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(ms.curIndex);
                    }else if(outType==="money"){    outType="Money";    }

                    if(outIndex===0){
                        bi.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }else if(outIndex===1){
                        bi.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }else if(outIndex===2){
                        bi.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }
                }
            }, ms, 0,1,2,3);
        bi.addChild(bi.button2);

        bi.visible=false;
        return bi;
    },
    updateBuildingInfo: function(){
        this.buildingInfo.visible=true;
        /*global MainGame*/
        var mouseX=MainGame.game.input.x;
        var mouseY=MainGame.game.input.y;
        var index=MainGame.board.hitTest(mouseX,mouseY);
        if(index===null){
            this.buildingInfo.visible=false;
            return;
        }
        if(this.curIndex===index){
            if(!MainGame.board.at(index).hasBuilding())
                this.buildingInfo.visible=false;
            return;
        }
        this.curIndex=index;
        var tile=MainGame.board.at(index);
        var bld=tile.getBuilding();
        if(bld===null || bld.isEmpty()){
            this.buildingInfo.visible=false;
            return;
        }
        var str=bld.name+" Lv"+bld.level;
        var str2="People: "+bld.people+"/"+bld.maxPeople;
        var str3="";
        var str4="";
        var str5="";
        this.buildingInfo.label.text=str;
        this.buildingInfo.label2.text=str2;
        if(bld.subtype==="housing"){
            str3="Health: "+bld.health;
            str4="Education: "+bld.education;
            str5="Shelter: "+bld.shelter;
        }
        if(bld.effects[0].type!==null){
            for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
                var outType = bld.effects[outIndex].type;
                var outValue = bld.effects[outIndex].outputTable[bld.people];
                if(outType==="health"){ outType="Health";   }
                else if(outType==="education"){ outType="Edu";  }
                else if(outType==="freedom"){   outType="Extra Freedom";    }
                else if(outType==="unrest"){    outType="Extra Unrest"; }
                else if(outType==="money"){
                    outType="Money";
                    outValue="$"+outValue+"K";
                }

                if(outIndex===0){
                    str3=outType+" Output: "+outValue;
                }else if(outIndex===1){
                    str4=outType+" Output: "+outValue;
                }else if(outIndex===2){
                    str5.text=outType+" Output: "+outValue;
                }
            }
        }
        this.buildingInfo.label3.text=str3;
        this.buildingInfo.label4.text=str4;
        this.buildingInfo.label5.text=str5;
        this.buildingInfo.x=tile.x;
        this.buildingInfo.y=tile.y;
    },
};