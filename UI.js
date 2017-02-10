// Group all our UI classes here (at least, for now)
// Holds all our in-game UI elements
var Hud = {    
    createNew: function() {
        //var timer = MainGame.game.time.events.loop(100, function(num){console.log("timer test!" + num);}, Hud, 5);

        /*global MainGame*/
        var hud = MainGame.game.add.group();
        hud.name = "HUD"; // Useful for debugging

        var testSprite = TestSprite.createNew();
        hud.addChild(testSprite);

        // Test text style
        var style = { font: "32px STKaiti", fill: "#ff0044 ", wordWrap: true, wordWrapWidth: 500, align: "center", backgroundColor: "#ffff00 " };

        // hud -: showBuildMenuBtn, buildMenu
        var buildMenu = MainGame.game.make.group();
        buildMenu.name = "buildMenu";
        buildMenu.visible = false;
        hud.addChild(buildMenu);

        // Build Menu UI groups
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
        var buyMansionBtn = MainGame.game.make.button(0, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buyMansionBtn.anchor.y = 1;  // Anchor on bottom left corner
        var mansionText = MainGame.game.make.text(0, -40, "Buy Mansion\n$10", style);
        mansionText.anchor.y = 1;
        buyMansionBtn.addChild(mansionText);
        bureauGroup.addChild(buyMansionBtn);

        var buySuburbBtn = MainGame.game.make.button(200, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buySuburbBtn.anchor.y = 1;  // Anchor on bottom left corner
        var suburbText = MainGame.game.make.text(0, -40, "Buy Suburb\n$10", style);
        suburbText.anchor.y = 1;
        buySuburbBtn.addChild(suburbText);
        bureauGroup.addChild(buySuburbBtn);

        var buyApartmentBtn = MainGame.game.make.button(400, 0, 'buttonSprite', Hud.buildApartment, buildMenu, 0, 1, 2, 3);
        buyApartmentBtn.anchor.y = 1;  // Anchor on bottom left corner
        var apartmentText = MainGame.game.make.text(0, -40, "Buy Apartment\n$10", style);
        apartmentText.anchor.y = 1;
        buyApartmentBtn.addChild(apartmentText);
        bureauGroup.addChild(buyApartmentBtn);

        var buySchoolBtn = MainGame.game.make.button(600, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buySchoolBtn.anchor.y = 1;  // Anchor on bottom left corner
        var schoolText = MainGame.game.make.text(0, -40, "Buy School\n$15", style);
        schoolText.anchor.y = 1;
        buySchoolBtn.addChild(schoolText);
        bureauGroup.addChild(buySchoolBtn);

        var buyFactoryBtn = MainGame.game.make.button(0, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buyFactoryBtn.anchor.y = 1;  // Anchor on bottom left corner
        var factoryText = MainGame.game.make.text(0, -40, "Buy Factory\n$30", style);
        factoryText.anchor.y = 1;
        buyFactoryBtn.addChild(factoryText);
        merchantGroup.addChild(buyFactoryBtn);

        var buyArmyBaseBtn = MainGame.game.make.button(0, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buyArmyBaseBtn.anchor.y = 1;  // Anchor on bottom left corner
        var armyBaseText = MainGame.game.make.text(0, -40, "Buy Army Base\n$30", style);
        armyBaseText.anchor.y = 1;
        buyArmyBaseBtn.addChild(armyBaseText);
        militaryGroup.addChild(buyArmyBaseBtn);

        // Toggles visibility of buildMenu
        var showBuildMenuBtn = MainGame.game.make.button(0, MainGame.game.world.height, 'buttonSprite', Hud.showBuildMenu, buildMenu, 0, 1, 2, 3);
        showBuildMenuBtn.anchor.y = 1;  // Anchor on bottom left corner
        hud.addChild(showBuildMenuBtn);

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

    showBuildMenu: function() {
        this.visible = !this.visible;
    },

    buildApartment: function() {
        // Hide build menu
        this.visible = false;

        // Create a building placer
        var buildingPlacer = BuildingPlacer.createNew('apartment');
    },
};

// Building Placer Object
var BuildingPlacer = {
    buildingType: "",

    createNew: function(buildingType) {
        var buildingPlacer = {};

        buildingPlacer.buildingType = buildingType;
        buildingPlacer.update = function() { BuildingPlacer.update(buildingPlacer); };

        return buildingPlacer;
    },

    update: function(self) {
        console.log(self.buildingType);
    }
};

var TestSprite = {
    createNew: function() {
        /*global MainGame*/
        var t = MainGame.game.add.sprite(0,0,'apartment1');
        var timer = MainGame.game.time.events.loop(100, t.frameUpdate, t);

        // dream
        t.frameUpdate=function(){
            //var pos=MainGame.game.input.mousePointer.x;
            /*global MainGame*/
            t.x=MainGame.game.input.x;
            t.y=MainGame.game.input.y;
        };

         // assume that works
        //var timer=MainGame.game.make.timer("myTimer",100);
        //timer.setCallbackFunc(t, t.frameUpdate);

        return t;
    },

// add me before HUD!!!
var MapSelector={
    createNew: function(){
        /*global MainGame*/
        var ms=MainGame.game.add.group();        

        // Class vars
        ms.name="MapSelector";
        ms.curIndex=-1;
        ms.mouseHoverTimer=MainGame.game.time.events.loop(500, MapSelector.updateBuildingInfo, ms);
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
        // button
        bi.button=MainGame.game.make.button(60, 100, "btnHire", 
            function(){
                console.log("[MapSelector] Hire people for index:",ms.curIndex);
                // TODO
                /*global MainGame*/
                var bld=MainGame.board.at(ms.curIndex).building;
                var emptySpace=bld.maxPeople-bld.people;
                var actual=3;
                // var actual=MainGame.population.moveTo(ms.curIndex, emptySpace, "job");
                bld.people=bld.people+actual;
                // update display
                bi.label2.text="People: "+bld.people+"/"+bld.maxPeople;
            }, ms, 0, 1, 2, 3);
        bi.addChild(bi.button);
        bi.visible=false;
        return bi;
    },
    updateBuildingInfo: function(){
        this.buildingInfo.visible=true;
        /*global MainGame*/
        var mouseX=MainGame.game.input.x;
        var mouseY=MainGame.game.input.y;
        var index=MainGame.board.indexFrom(mouseX,mouseY);
        if(index===null){
            this.buildingInfo.visible=false;
            return;
        }
        if(this.curIndex===index){
            return;
        }
        this.curIndex=index;
        var tile=MainGame.board.at(index);
        var bld=tile.building;
        if(bld===null || bld.isEmpty()){
            this.buildingInfo.visible=false;
            return;
        }
        var str=bld.name+" Lv"+bld.level;
        var str2="People: "+bld.people+"/"+bld.maxPeople;
        this.buildingInfo.label.text=str;
        this.buildingInfo.label2.text=str2;
        this.buildingInfo.x=tile.x;
        this.buildingInfo.y=tile.y;
    },
};