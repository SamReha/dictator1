/*global MainGame*/

var BuildMenu={
	styleNormal: {font:"24px myKaiti", fill:"#ffffff", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
    styleButton: {font:"32px myKaiti", fill:"#ffffff", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },

	createNew: function(highData){
		var hudInputPriority = 110;

		var buildMenu = MainGame.game.add.sprite(0,0,'peopleViewBg');

		buildMenu.x = 190, buildMenu.y = 100;

		// audio
		buildMenu.sfx = game.make.audio('message_close');

		// setup the mask
		/* global DUiMask */
		buildMenu.uiMask=DUiMask.createNew();
		buildMenu.uiMask.setController(100, function(){
			buildMenu.uiMask.destroy();
			buildMenu.sfx.play();
			buildMenu.destroy();
		});

		var bm=MainGame.game.make.sprite(0,0,"buildMenuBg");
		buildMenu.addChild(bm);

		// let build menu block click events
		bm.inputEnabled=true;
		bm.input.priorityID=101;

		// buildMenu: UI groups
		var bureauGroup = MainGame.game.make.group();
		bm.addChild(bureauGroup);
		var bureauGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCover1');
		bureauGroupCover.inputEnabled = true;
		bureauGroupCover.input.priorityID = hudInputPriority + 10;
		bureauGroupCover.visible = false;
		bm.addChild(bureauGroupCover);

		var merchantGroup = MainGame.game.make.group();
		merchantGroup.position.x = bm.width/3;
		bm.addChild(merchantGroup);
		var merchantGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCover1');
		merchantGroupCover.inputEnabled = true;
		merchantGroupCover.input.priorityID = hudInputPriority + 10;
		merchantGroupCover.position.x = bm.width/3;
		merchantGroupCover.visible = false;
		bm.addChild(merchantGroupCover);

		var militaryGroup = MainGame.game.make.group();
		militaryGroup.position.x = bm.width*2/3;
		bm.addChild(militaryGroup);
		var militaryGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCover1');
		militaryGroupCover.inputEnabled = true;
		militaryGroupCover.input.priorityID = hudInputPriority + 10;
		militaryGroupCover.position.x = bm.width*2/3;
		militaryGroupCover.visible = false;
		bm.addChild(militaryGroupCover);

		var defaultGroup = MainGame.game.make.group();
		defaultGroup.position.y = bm.height*2/3;
		bm.addChild(defaultGroup);
		// var defaultGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCover2');
		// defaultGroupCover.inputEnabled = true;
		// defaultGroupCover.input.priorityID = hudInputPriority + 10;
		// defaultGroupCover.position.y = bm.height*2/3;
		// defaultGroupCover.visible = false;
		// bm.addChild(defaultGroupCover);

		/*global Hud*/
		// buildMenu -: buyBuildingBtn, seeCoalitionBtn, etc.
		var buyMansionBtn = MainGame.game.make.button((bm.width/8), (bm.height/4), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyMansionBtn, 'mansion');},
			buildMenu, 0, 1, 0, 2);
		buyMansionBtn.input.priorityID = hudInputPriority;
		buyMansionBtn.anchor.x = 0.5;  // Anchor in center
		buyMansionBtn.anchor.y = 1;  // Anchor on bottom left corner
		var mansionText = MainGame.game.make.text(0, -40, "Mansion\n₸10", BuildMenu.styleNormal);
		mansionText.anchor.x = 0.5;
		mansionText.anchor.y = 1;
		buyMansionBtn.addChild(mansionText);
		defaultGroup.addChild(buyMansionBtn);

		// Setup buildMenu purchase button text
		var buyMansionBtnText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buyMansionBtnText.anchor.x = 0.5;
		buyMansionBtnText.anchor.y = 0.5;
		buyMansionBtnText.y = -buyMansionBtn.height / 2;
		buyMansionBtn.addChild(buyMansionBtnText);

		// Mansion Tooltip
		var mansionToolTip = ToolTip.createNew('Mansions are high-class private residences.\n\nEach mansion can house one resident.\nMansions provide excellent shelter.');
		mansionToolTip.x = -buyMansionBtn.width/2;
		buyMansionBtn.addChild(mansionToolTip);
        buyMansionBtn.events.onInputOver.add(function() {mansionToolTip.show();}, null);
        buyMansionBtn.events.onInputOut.add(function() {mansionToolTip.hide();}, null);

        // SUBURB
		var buySuburbBtn = MainGame.game.make.button((bm.width*3/8), (bm.height/4), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buySuburbBtn, 'suburb');},
			buildMenu, 0, 1, 0, 2);
		buySuburbBtn.input.priorityID = hudInputPriority;
		buySuburbBtn.anchor.x = 0.5;  // Anchor in center
		buySuburbBtn.anchor.y = 1;  // Anchor on bottom left corner
		var suburbText = MainGame.game.make.text(0, -40, "Suburb\n₸10", BuildMenu.styleNormal);
		suburbText.anchor.x = 0.5;
		suburbText.anchor.y = 1;
		buySuburbBtn.addChild(suburbText);
		defaultGroup.addChild(buySuburbBtn);

		// Setup buildMenu purchase button text
		var buySuburbBtnText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buySuburbBtnText.anchor.x = 0.5;
		buySuburbBtnText.anchor.y = 0.5;
		buySuburbBtnText.y = -buySuburbBtn.height / 2;
		buySuburbBtn.addChild(buySuburbBtnText);

		// Suburb Tooltip
		var suburbToolTip = ToolTip.createNew('Suburbs are the staple residence of the middle class.\n\nEach suburb can house up to five residents.\nSuburbs provide decent shelter.');
		suburbToolTip.x = -buySuburbBtn.width/2;
		buySuburbBtn.addChild(suburbToolTip);
        buySuburbBtn.events.onInputOver.add(function() {suburbToolTip.show();}, null);
        buySuburbBtn.events.onInputOut.add(function() {suburbToolTip.hide();}, null);

        // APARTMENT
		var buyApartmentBtn = MainGame.game.make.button((bm.width*5/8), (bm.height/4), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyApartmentBtn, 'apartment');},
			buildMenu, 0, 1, 0, 2);
		buyApartmentBtn.input.priorityID = hudInputPriority;
		buyApartmentBtn.anchor.x = 0.5;  // Anchor in center
		buyApartmentBtn.anchor.y = 1;  // Anchor on bottom left corner
		var apartmentText = MainGame.game.make.text(0, -40, "Apartment\n₸10", BuildMenu.styleNormal);
		apartmentText.anchor.x = 0.5;
		apartmentText.anchor.y = 1;
		buyApartmentBtn.addChild(apartmentText);
		defaultGroup.addChild(buyApartmentBtn);

		// Setup buildMenu purchase button text
		var buyApartmentBtnText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buyApartmentBtnText.anchor.x = 0.5;
		buyApartmentBtnText.anchor.y = 0.5;
		buyApartmentBtnText.y = -buyApartmentBtn.height / 2;
		buyApartmentBtn.addChild(buyApartmentBtnText);

		// Apartment Tooltip
		var apartmentToolTip = ToolTip.createNew('High rise apartments provide high density housing for the working class.\n\nEach apartment can house up to ten residents.\nApartments provide poor shelter.');
		apartmentToolTip.x = -buyApartmentBtn.width/2;
		buyApartmentBtn.addChild(apartmentToolTip);
        buyApartmentBtn.events.onInputOver.add(function() {apartmentToolTip.show();}, null);
        buyApartmentBtn.events.onInputOut.add(function() {apartmentToolTip.hide();}, null);

        // ROAD
		var buyRoadBtn = MainGame.game.make.button((bm.width*7/8), (bm.height/4), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyRoadBtn, 'road');},
			buildMenu, 0, 1, 0, 2);
		buyRoadBtn.input.priorityID = hudInputPriority;
		buyRoadBtn.anchor.x = 0.5;  // Anchor in center
		buyRoadBtn.anchor.y = 1;  // Anchor on bottom left corner
		var roadText = MainGame.game.make.text(0, -40, "Road\n₸2", BuildMenu.styleNormal);
		roadText.anchor.x = 0.5;
		roadText.anchor.y = 1;
		buyRoadBtn.addChild(roadText);
		defaultGroup.addChild(buyRoadBtn);

		// Setup buildMenu purchase button text
		var buyRoadBtnText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buyRoadBtnText.anchor.x = 0.5;
		buyRoadBtnText.anchor.y = 0.5;
		buyRoadBtnText.y = -buyRoadBtn.height / 2;
		buyRoadBtn.addChild(buyRoadBtnText);

		// Road Tooltip
		var roadToolTip = ToolTip.createNew('Roads allow citizens to travel between where they live\nand where they work.\n\nEach road tile generates a small amount of Freedom.');
		roadToolTip.x = -buyRoadBtn.width/2;
		buyRoadBtn.addChild(roadToolTip);
        buyRoadBtn.events.onInputOver.add(function() {roadToolTip.show();}, null);
        buyRoadBtn.events.onInputOut.add(function() {roadToolTip.hide();}, null);

		// SCHOOL
		var buySchoolBtn = MainGame.game.make.button((bm.width/4), (bm.height/4), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buySchoolBtn, 'school');},
			buildMenu, 0, 1, 0, 2);
		buySchoolBtn.input.priorityID = hudInputPriority;
		buySchoolBtn.anchor.x = 0.5;  // Anchor in center
		buySchoolBtn.anchor.y = 1;  // Anchor on bottom left corner
		var schoolText = MainGame.game.make.text(0, -40, "School\n₸15", BuildMenu.styleNormal);
		schoolText.anchor.x = 0.5;
		schoolText.anchor.y = 1;
		buySchoolBtn.addChild(schoolText);
		bureauGroup.addChild(buySchoolBtn);

		// Setup buildMenu purchase button text
		var buySchoolBtnText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buySchoolBtnText.anchor.x = 0.5;
		buySchoolBtnText.anchor.y = 0.5;
		buySchoolBtnText.y = -buySchoolBtn.height / 2;
		buySchoolBtn.addChild(buySchoolBtnText);

		// School Tooltip
		var schoolToolTip = ToolTip.createNew('Schools educate your citizenry. Citizens enjoy living in neighborhoods\nwith good schools,\nand some jobs have education requirements for workers.\n\nEach teacher will generate a small amount of Education for nearby homes.\nEach teacher will generate a small amount of Freedom.');
		schoolToolTip.x = -buySchoolBtn.width/2;
		buySchoolBtn.addChild(schoolToolTip);
        buySchoolBtn.events.onInputOver.add(function() {schoolToolTip.show();}, null);
        buySchoolBtn.events.onInputOut.add(function() {schoolToolTip.hide();}, null);

		// PARK
		var buyParkBtn = MainGame.game.make.button((bm.width/12), (bm.height/2), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyParkBtn, 'park');},
			buildMenu, 0, 1, 0, 2);
		buyParkBtn.input.priorityID = hudInputPriority;
		buyParkBtn.anchor.x = 0.5;  // Anchor in center
		buyParkBtn.anchor.y = 1;
		var parkText = MainGame.game.make.text(0, -40, "Park\n₸15", BuildMenu.styleNormal);
		parkText.anchor.x = 0.5;
		parkText.anchor.y = 1;
		buyParkBtn.addChild(parkText);
		bureauGroup.addChild(buyParkBtn);

		// Setup buildMenu purchase button text
		var buyParkBtnText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buyParkBtnText.anchor.x = 0.5;
		buyParkBtnText.anchor.y = 0.5;
		buyParkBtnText.y = -buyParkBtn.height / 2;
		buyParkBtn.addChild(buyParkBtnText);

		// Road Tooltip
		var parkToolTip = ToolTip.createNew('Parks beautify your country.\n\nEach park worker lowers Unrest by a\nsmall amount.');
		parkToolTip.x = -buyParkBtn.width/2
		buyParkBtn.addChild(parkToolTip);
        buyParkBtn.events.onInputOver.add(function() {parkToolTip.show();}, null);
        buyParkBtn.events.onInputOut.add(function() {parkToolTip.hide();}, null);


		// FACTORY / LUMBERYARD
		var buyFactoryBtn = MainGame.game.make.button((bm.width/12), (bm.height/4), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyFactoryBtn, 'lumberYard');},
			buildMenu, 0, 1, 0, 2);
		buyFactoryBtn.input.priorityID = hudInputPriority;
		buyFactoryBtn.anchor.x = 0.5;  // Anchor in center
		buyFactoryBtn.anchor.y = 1;  // Anchor on bottom left corner
		var factoryText = MainGame.game.make.text(0, -40, "LumberYard\n₸30", BuildMenu.styleNormal);
		factoryText.anchor.x = 0.5;
		factoryText.anchor.y = 1;
		buyFactoryBtn.addChild(factoryText);
		merchantGroup.addChild(buyFactoryBtn);

		// Setup buildMenu purchase button text
		var buyFactoryBtnText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buyFactoryBtnText.anchor.x = 0.5;
		buyFactoryBtnText.anchor.y = 0.5;
		buyFactoryBtnText.y = -buyFactoryBtn.height / 2;
		buyFactoryBtn.addChild(buyFactoryBtnText);

		// Lumberyard Tooltip
		var lumberyardToolTip = ToolTip.createNew('Lumber Yards are the backbone of your economy.\nLumber Yards generate Funds when worked.\n\nEach lumber jack generates a small amount of money per turn.\nLumber Yards must be built on Forest tiles.');
		lumberyardToolTip.x = -buyFactoryBtn.width/2
		buyFactoryBtn.addChild(lumberyardToolTip);
        buyFactoryBtn.events.onInputOver.add(function() {lumberyardToolTip.show();}, null);
        buyFactoryBtn.events.onInputOut.add(function() {lumberyardToolTip.hide();}, null);

		// ARMYBASE
		var buyArmyBaseBtn = MainGame.game.make.button((bm.width/12), (bm.height/4), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyArmyBaseBtn, 'armyBase');},
			buildMenu, 0, 1, 0, 2);
		buyArmyBaseBtn.input.priorityID = hudInputPriority;
		buyArmyBaseBtn.anchor.x = 0.5;  // Anchor in center
		buyArmyBaseBtn.anchor.y = 1;  // Anchor on bottom left corner
		var armyBaseText = MainGame.game.make.text(0, -40, "Army Base\n₸30", BuildMenu.styleNormal);
		armyBaseText.anchor.x = 0.5;
		armyBaseText.anchor.y = 1;
		buyArmyBaseBtn.addChild(armyBaseText);
		militaryGroup.addChild(buyArmyBaseBtn);

		// Setup buildMenu purchase button text
		var buyArmyBaseBtnText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buyArmyBaseBtnText.anchor.x = 0.5;
		buyArmyBaseBtnText.anchor.y = 0.5;
		buyArmyBaseBtnText.y = -buyArmyBaseBtn.height / 2;
		buyArmyBaseBtn.addChild(buyArmyBaseBtnText);

		// Army Base Tooltip
		var armyBaseToolTip = ToolTip.createNew('The military is your last line of defense against an unruly populace.\nArmy Bases can be used to spawn Soldiers in the event of a Popular\nRevolution.\n\nEach soldier can be deployed for a small fee.\nEach solder removes a small amount of Freedom when deployed.');
		armyBaseToolTip.x = -buyArmyBaseBtn.width/2;
		buyArmyBaseBtn.addChild(armyBaseToolTip);
        buyArmyBaseBtn.events.onInputOver.add(function() {armyBaseToolTip.show();}, null);
        buyArmyBaseBtn.events.onInputOut.add(function() {armyBaseToolTip.hide();}, null);

		// Police Station
		var buyPoliceStationBtn = MainGame.game.make.button((bm.width/4), (bm.height/4), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyPoliceStationBtn, 'police');},
			buildMenu, 0, 1, 0, 2);
		buyPoliceStationBtn.input.priorityID = hudInputPriority;
		buyPoliceStationBtn.anchor.x = 0.5;  // Anchor in center
		buyPoliceStationBtn.anchor.y = 1;  // Anchor on bottom left corner
		var policeStationText = MainGame.game.make.text(0, -40, "Police Station\n₸30", BuildMenu.styleNormal);
		policeStationText.anchor.x = 0.5;
		policeStationText.anchor.y = 1;
		buyPoliceStationBtn.addChild(policeStationText);
		militaryGroup.addChild(buyPoliceStationBtn);

		// Setup buildMenu purchase button text
		var buyPoliceStationText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buyPoliceStationText.anchor.x = 0.5;
		buyPoliceStationText.anchor.y = 0.5;
		buyPoliceStationText.y = -buyPoliceStationBtn.height / 2;
		buyPoliceStationBtn.addChild(buyPoliceStationText);

		// Police Station Tooltip
		var policeStationToolTip = ToolTip.createNew('Police Stations are an effective means of exerting\ncontrol over your populace.\n\nEach police officer removes a small amount of\nFreedom.');
		policeStationToolTip.x = -buyPoliceStationBtn.width/2;
		buyPoliceStationBtn.addChild(policeStationToolTip);
        buyPoliceStationBtn.events.onInputOver.add(function() {policeStationToolTip.show();}, null);
        buyPoliceStationBtn.events.onInputOut.add(function() {policeStationToolTip.hide();}, null);

		// FARM
		var buyFarmBtn = MainGame.game.make.button((bm.width/12), (bm.height/4), 'small_generic_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyFarmBtn, 'fertileFarm');},
			buildMenu, 0, 1, 0, 2);
		buyFarmBtn.input.priorityID = hudInputPriority;
		buyFarmBtn.anchor.x = 0.5;  // Anchor in center
		buyFarmBtn.anchor.y = 1;  // Anchor on bottom left corner
		var farmText = MainGame.game.make.text(0, -40, "Farm\n₸10", BuildMenu.styleNormal);
		farmText.anchor.x = 0.5;
		farmText.anchor.y = 1;
		buyFarmBtn.addChild(farmText);
		bureauGroup.addChild(buyFarmBtn);

		// Setup buildMenu purchase button text
		var buyFarmBtnText = MainGame.game.make.text(0, 0, 'Buy', BuildMenu.styleButton);
		buyFarmBtnText.anchor.x = 0.5;
		buyFarmBtnText.anchor.y = 0.5;
		buyFarmBtnText.y = -buyFarmBtn.height / 2;
		buyFarmBtn.addChild(buyFarmBtnText);

		// Farm Tooltip
		var farmToolTip = ToolTip.createNew('Everyone needs to eat, and citizens love to\nhave abundant access to food.\n\nEach farmer provides a small amount of\nfood to nearby homes.');
		farmToolTip.x = -buyFarmBtn.width/2;
		buyFarmBtn.addChild(farmToolTip);
        buyFarmBtn.events.onInputOver.add(function() {farmToolTip.show();}, null);
        buyFarmBtn.events.onInputOut.add(function() {farmToolTip.hide();}, null);

		/*global Person*/
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat).length;
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant).length;
		var military = MainGame.population.typeRoleList(Person.Hi, Person.Military).length;

		if(bureaucrats === 0){
			bureauGroupCover.visible = true;

			var bureauCount = MainGame.game.make.text((bm.width/6), (bm.height*7/12),
				'No Minister of Bureaucracy.', BuildMenu.styleNormal);
			bureauCount.anchor.x = 0.5;
			bureauCount.anchor.y = 0.5;
			bureauGroup.addChild(bureauCount);
		}
		if(merchants === 0){
			merchantGroupCover.visible = true;

			var merchantCount = MainGame.game.make.text((bm.width/6), (bm.height*7/12),
				'No Minister of Finance.', BuildMenu.styleNormal);
			merchantCount.anchor.x = 0.5;
			merchantCount.anchor.y = 0.5;
			merchantGroup.addChild(merchantCount);
		}
		if(military === 0){
			militaryGroupCover.visible = true;

			var militaryCount = MainGame.game.make.text((bm.width/6), (bm.height*7/12),
				'No Minister of the Military.', BuildMenu.styleNormal);
			militaryCount.anchor.x = 0.5;
			militaryCount.anchor.y = 0.5;
			militaryGroup.addChild(militaryCount);
		}
		// if(bureaucrats === 0 && merchants === 0 && military === 0)
		// 	defaultGroupCover.visible = true;

		return buildMenu;
	},

	buttonPosition: function(bgSprite, btnSprites, vertical){
		if(!bgSprite || !btnSprites || vertical===null)
			return;

		for(var count=0; count<btnSprites.length; ++count){

		}
	}
}