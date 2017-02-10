// Group all our UI classes here (at least, for now)
// Holds all our in-game UI elements
var Hud = {    
    createNew: function() {
        var hud = MainGame.game.add.group();
        hud.name = "HUD"; // Useful for debugging

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
        var mansionText = MainGame.game.make.text(0, -40, "Buy Mansion\n $10", style);
        mansionText.anchor.y = 1;
        buyMansionBtn.addChild(mansionText);
        bureauGroup.addChild(buyMansionBtn);

        var buySuburbBtn = MainGame.game.make.button(200, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buySuburbBtn.anchor.y = 1;  // Anchor on bottom left corner
        var suburbText = MainGame.game.make.text(0, -40, "Buy Suburb\n $10", style);
        suburbText.anchor.y = 1;
        buySuburbBtn.addChild(suburbText);
        bureauGroup.addChild(buySuburbBtn);

        var buyApartmentBtn = MainGame.game.make.button(400, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buyApartmentBtn.anchor.y = 1;  // Anchor on bottom left corner
        var apartmentText = MainGame.game.make.text(0, -40, "Buy Apartment\n $10", style);
        apartmentText.anchor.y = 1;
        buyApartmentBtn.addChild(apartmentText);
        bureauGroup.addChild(buyApartmentBtn);

        var buySchoolBtn = MainGame.game.make.button(600, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buySchoolBtn.anchor.y = 1;  // Anchor on bottom left corner
        var schoolText = MainGame.game.make.text(0, -40, "Buy School\n $15", style);
        schoolText.anchor.y = 1;
        buySchoolBtn.addChild(schoolText);
        bureauGroup.addChild(buySchoolBtn);

        var buyFactoryBtn = MainGame.game.make.button(0, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buyFactoryBtn.anchor.y = 1;  // Anchor on bottom left corner
        var factoryText = MainGame.game.make.text(0, -40, "Buy Factory\n $30", style);
        factoryText.anchor.y = 1;
        buyFactoryBtn.addChild(factoryText);
        merchantGroup.addChild(buyFactoryBtn);

        var buyArmyBaseBtn = MainGame.game.make.button(0, 0, 'buttonSprite', null, buildMenu, 0, 1, 2, 3);
        buyArmyBaseBtn.anchor.y = 1;  // Anchor on bottom left corner
        var armyBaseText = MainGame.game.make.text(0, -40, "Buy Army Base\n $30", style);
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
    }
}

/*
// A menu option that can be purchased by the player (should trigger building placement mode)
var BuildingPurchaseOption = {
    icon: null,
    name: "",
    cost: 0,
    purchaseable: false,
    
    createNew: function(icon, name, cost) {
        this.icon = icon;
        this.name = name;
        this.cost = cost;
        
        return this;
    }
}

// The menu itself, controlled by the HUD
var BuildMenu = {
    buildingPurchaseList: [
        BuildingPurchaseOption.createNew(null, "Mansion",   10),
        BuildingPurchaseOption.createNew(null, "Suburbs",   10),
        BuildingPurchaseOption.createNew(null, "Apartment", 10),
        BuildingPurchaseOption.createNew(null, "School",    15),
        BuildingPurchaseOption.createNew(null, "Factory",   30),
        BuildingPurchaseOption.createNew(null, "Army Base", 30)
    ],
    visible: false,
    
    createNew: function() {
        return this;
    }
}
*/
