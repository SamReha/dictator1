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

		var bureauText = MainGame.game.make.text(bm.width/6, 20, "Bureaucratic", this.styleNormal);
		bureauText.anchor.x = 0.5;
		bureauGroup.addChild(bureauText);

		var bureauGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCover1');
		bureauGroupCover.inputEnabled = true;
		bureauGroupCover.input.priorityID = hudInputPriority + 10;
		bureauGroupCover.visible = false;
		bm.addChild(bureauGroupCover);

		var merchantGroup = MainGame.game.make.group();
		merchantGroup.position.x = bm.width/3;
		bm.addChild(merchantGroup);

		var merchantText = MainGame.game.make.text(bm.width/6, 20, "Financial", this.styleNormal);
		merchantText.anchor.x = 0.5;
		merchantGroup.addChild(merchantText);

		var merchantGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCover1');
		merchantGroupCover.inputEnabled = true;
		merchantGroupCover.input.priorityID = hudInputPriority + 10;
		merchantGroupCover.position.x = bm.width/3;
		merchantGroupCover.visible = false;
		bm.addChild(merchantGroupCover);

		var militaryGroup = MainGame.game.make.group();
		militaryGroup.position.x = bm.width*2/3;
		bm.addChild(militaryGroup);

		var militaryText = MainGame.game.make.text(bm.width/6, 20, "Military", this.styleNormal);
		militaryText.anchor.x = 0.5;
		militaryGroup.addChild(militaryText);

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
		var buyMansionBtn = MainGame.game.make.button((bm.width/8), (bm.height/4), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyMansionBtn, 'mansion');},
			buildMenu, 0, 1, 2, 2);
		buyMansionBtn.anchor.x = 0.5;  // Anchor in center
		buyMansionBtn.anchor.y = 1;  // Anchor on bottom left corner
		var mansionText = MainGame.game.make.text(0, -40, "Mansion\n₸10", BuildMenu.styleNormal);
		mansionText.anchor.x = 0.5;
		mansionText.anchor.y = 1;
		buyMansionBtn.addChild(mansionText);
		defaultGroup.addChild(buyMansionBtn);

		// Mansion Tooltip
		ToolTip.addTipTo(buyMansionBtn, hudInputPriority, 'Mansions are high-class private residences.\n\nEach mansion can house one resident.\nMansions provide excellent shelter.',
			buildMenu.x + defaultGroup.x + buyMansionBtn.x,
			buildMenu.y + defaultGroup.y + buyMansionBtn.y);

        // SUBURB
		var buySuburbBtn = MainGame.game.make.button((bm.width*3/8), (bm.height/4), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buySuburbBtn, 'suburb');},
			buildMenu, 0, 1, 2, 2);
		buySuburbBtn.anchor.x = 0.5;  // Anchor in center
		buySuburbBtn.anchor.y = 1;  // Anchor on bottom left corner
		var suburbText = MainGame.game.make.text(0, -40, "Suburb\n₸10", BuildMenu.styleNormal);
		suburbText.anchor.x = 0.5;
		suburbText.anchor.y = 1;
		buySuburbBtn.addChild(suburbText);
		defaultGroup.addChild(buySuburbBtn);

		// Suburb Tooltip
		ToolTip.addTipTo(buySuburbBtn, hudInputPriority, 'Suburbs are the staple residence of the middle class.\n\nEach suburb can house up to five residents.\nSuburbs provide decent shelter.',
			buildMenu.x + defaultGroup.x + buySuburbBtn.x,
			buildMenu.y + defaultGroup.y + buySuburbBtn.y);

        // APARTMENT
		var buyApartmentBtn = MainGame.game.make.button((bm.width*5/8), (bm.height/4), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyApartmentBtn, 'apartment');},
			buildMenu, 0, 1, 2, 2);
		buyApartmentBtn.anchor.x = 0.5;  // Anchor in center
		buyApartmentBtn.anchor.y = 1;  // Anchor on bottom left corner
		var apartmentText = MainGame.game.make.text(0, -40, "Apartment\n₸10", BuildMenu.styleNormal);
		apartmentText.anchor.x = 0.5;
		apartmentText.anchor.y = 1;
		buyApartmentBtn.addChild(apartmentText);
		defaultGroup.addChild(buyApartmentBtn);

		// Apartment Tooltip
		ToolTip.addTipTo(buyApartmentBtn, hudInputPriority, 'High rise apartments provide high density housing for the working class.\n\nEach apartment can house up to ten residents.\nApartments provide poor shelter.',
			buildMenu.x + defaultGroup.x + buyApartmentBtn.x,
			buildMenu.y + defaultGroup.y + buyApartmentBtn.y);

        // ROAD
		var buyRoadBtn = MainGame.game.make.button((bm.width*7/8), (bm.height/4), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyRoadBtn, 'road');},
			buildMenu, 0, 1, 2, 2);
		buyRoadBtn.anchor.x = 0.5;  // Anchor in center
		buyRoadBtn.anchor.y = 1;  // Anchor on bottom left corner
		var roadText = MainGame.game.make.text(0, -40, "Road\n₸2", BuildMenu.styleNormal);
		roadText.anchor.x = 0.5;
		roadText.anchor.y = 1;
		buyRoadBtn.addChild(roadText);
		defaultGroup.addChild(buyRoadBtn);

		// Road Tooltip
		ToolTip.addTipTo(buyRoadBtn, hudInputPriority, 'Roads allow citizens to travel between where they live\nand where they work.\n\nEach road tile generates a small amount of Freedom.',
			buildMenu.x + defaultGroup.x + buyRoadBtn.x - 100, // Magic number, but keeps it from falling off the screen
			buildMenu.y + defaultGroup.y + buyRoadBtn.y);

		// SCHOOL
		var buySchoolBtn = MainGame.game.make.button((bm.width/4), 5*(bm.height/12), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buySchoolBtn, 'school');},
			buildMenu, 0, 1, 2, 2);
		buySchoolBtn.anchor.x = 0.5;  // Anchor in center
		buySchoolBtn.anchor.y = 1;  // Anchor on bottom left corner
		var schoolText = MainGame.game.make.text(0, -40, "School\n₸15", BuildMenu.styleNormal);
		schoolText.anchor.x = 0.5;
		schoolText.anchor.y = 1;
		buySchoolBtn.addChild(schoolText);
		bureauGroup.addChild(buySchoolBtn);

		// Road Tooltip
		ToolTip.addTipTo(buySchoolBtn, hudInputPriority, 'Schools educate your citizenry. Citizens enjoy living in neighborhoods\nwith good schools,\nand some jobs have education requirements for workers.\n\nEach teacher will generate a small amount of Education for nearby homes.\nEach teacher will generate a small amount of Freedom.',
			buildMenu.x + buySchoolBtn.x, 
			buildMenu.y + buySchoolBtn.y);

		// PARK
		var buyParkBtn = MainGame.game.make.button((bm.width/11), (2*(bm.height/3)-10), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyParkBtn, 'park');},
			buildMenu, 0, 1, 2, 2);
		buyParkBtn.anchor.x = 0.5;  // Anchor in center
		buyParkBtn.anchor.y = 1;
		var parkText = MainGame.game.make.text(0, -40, "Park\n₸15", BuildMenu.styleNormal);
		parkText.anchor.x = 0.5;
		parkText.anchor.y = 1;
		buyParkBtn.addChild(parkText);
		bureauGroup.addChild(buyParkBtn);

		// Park Tooltip
		ToolTip.addTipTo(buyParkBtn, hudInputPriority, 'Parks beautify your country.\n\nEach park worker lowers Unrest by a\nsmall amount.',
			buildMenu.x + bureauGroup.x + buyParkBtn.x,
			buildMenu.y + bureauGroup.y + buyParkBtn.y);


		// FACTORY / LUMBERYARD
		var buyFactoryBtn = MainGame.game.make.button((bm.width/12), 5*(bm.height/12), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyFactoryBtn, 'lumberYard');},
			buildMenu, 0, 1, 2, 2);
		buyFactoryBtn.anchor.x = 0.5;  // Anchor in center
		buyFactoryBtn.anchor.y = 1;  // Anchor on bottom left corner
		var factoryText = MainGame.game.make.text(0, -40, "LumberYard\n₸30", BuildMenu.styleNormal);
		factoryText.anchor.x = 0.5;
		factoryText.anchor.y = 1;
		buyFactoryBtn.addChild(factoryText);
		merchantGroup.addChild(buyFactoryBtn);

		// Factory Tooltip
		ToolTip.addTipTo(buyFactoryBtn, hudInputPriority, 'Lumber Yards are the backbone of your economy.\nLumber Yards generate Funds when worked.\n\nEach lumber jack generates a small amount of money per turn.\nLumber Yards must be built on Forest tiles.',
			buildMenu.x + merchantGroup.x + buyFactoryBtn.x,
			buildMenu.y + merchantGroup.y + buyFactoryBtn.y);

		// ARMYBASE
		var buyArmyBaseBtn = MainGame.game.make.button((bm.width/12), 5*(bm.height/12), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyArmyBaseBtn, 'armyBase');},
			buildMenu, 0, 1, 2, 2);
		buyArmyBaseBtn.anchor.x = 0.5;  // Anchor in center
		buyArmyBaseBtn.anchor.y = 1;  // Anchor on bottom left corner
		var armyBaseText = MainGame.game.make.text(0, -40, "Army Base\n₸30", BuildMenu.styleNormal);
		armyBaseText.anchor.x = 0.5;
		armyBaseText.anchor.y = 1;
		buyArmyBaseBtn.addChild(armyBaseText);
		militaryGroup.addChild(buyArmyBaseBtn);

		// Army Base Tooltip
		ToolTip.addTipTo(buyArmyBaseBtn, hudInputPriority, 'The military is your last line of defense against an unruly populace.\nArmy Bases can be used to spawn Soldiers in the event of a Popular\nRevolution.\n\nEach soldier can be deployed for a small fee.\nEach solder removes a small amount of Freedom when deployed.',
			buildMenu.x + militaryGroup.x + buyArmyBaseBtn.x - 50,
			buildMenu.y + militaryGroup.y + buyArmyBaseBtn.y);

		// Police Station
		var buyPoliceStationBtn = MainGame.game.make.button((bm.width/4), 5*(bm.height/12), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyPoliceStationBtn, 'police');},
			buildMenu, 0, 1, 2, 2);
		buyPoliceStationBtn.anchor.x = 0.5;  // Anchor in center
		buyPoliceStationBtn.anchor.y = 1;  // Anchor on bottom left corner
		var policeStationText = MainGame.game.make.text(0, -40, "Police Station\n₸30", BuildMenu.styleNormal);
		policeStationText.anchor.x = 0.5;
		policeStationText.anchor.y = 1;
		buyPoliceStationBtn.addChild(policeStationText);
		militaryGroup.addChild(buyPoliceStationBtn);

		// Police Station Tooltip
		ToolTip.addTipTo(buyPoliceStationBtn, hudInputPriority, 'Police Stations are an effective means of exerting\ncontrol over your populace.\n\nEach police officer removes a small amount of\nFreedom.',
			buildMenu.x + militaryGroup.x + buyPoliceStationBtn.x - 100,
			buildMenu.y + militaryGroup.y + buyPoliceStationBtn.y);

		// FARM
		var buyFarmBtn = MainGame.game.make.button((bm.width/11), 5*(bm.height/12), 'buy_button', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyFarmBtn, 'fertileFarm');},
			buildMenu, 0, 1, 2, 2);
		buyFarmBtn.anchor.x = 0.5;  // Anchor in center
		buyFarmBtn.anchor.y = 1;  // Anchor on bottom left corner
		var farmText = MainGame.game.make.text(0, -40, "Farm\n₸10", BuildMenu.styleNormal);
		farmText.anchor.x = 0.5;
		farmText.anchor.y = 1;
		buyFarmBtn.addChild(farmText);
		bureauGroup.addChild(buyFarmBtn);

		// Police Station Tooltip
		ToolTip.addTipTo(buyFarmBtn, hudInputPriority, 'Everyone needs to eat, and citizens love to\nhave abundant access to food.\n\nEach farmer provides a small amount of\nfood to nearby homes.',
			buildMenu.x + bureauGroup.x + buyFarmBtn.world.x,
			buildMenu.y + bureauGroup.y + buyFarmBtn.world.y);

		/*global Person*/
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat).length;
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant).length;
		var military = MainGame.population.typeRoleList(Person.Hi, Person.Military).length;

		if (bureaucrats === 0) {
			bureauGroupCover.visible = true;
			ToolTip.addTipTo(bureauGroupCover, hudInputPriority + 10, 'Hire a Minister of Bureaucracy\nto unlock these options', 0, 0);
			var position = {
				x: buildMenu.x + bureauGroupCover.x + bureauGroupCover.width/2 - bureauGroupCover.toolTip.width/2,
				y: buildMenu.y + bureauGroupCover.y + bureauGroupCover.height/2 - bureauGroupCover.toolTip.height/2
			};
			bureauGroupCover.toolTip.x = position.x;
			bureauGroupCover.toolTip.y = position.y;
		}
		if (merchants === 0) {
			merchantGroupCover.visible = true;
			ToolTip.addTipTo(merchantGroupCover, hudInputPriority + 10, 'Hire a Minister of Finance\nto unlock these options', 0, 0);
			var position = {
				x: buildMenu.x + merchantGroupCover.x + merchantGroupCover.width/2 - merchantGroupCover.toolTip.width/2,
				y: buildMenu.y + merchantGroupCover.y + merchantGroupCover.height/2 - merchantGroupCover.toolTip.height/2
			};
			merchantGroupCover.toolTip.x = position.x;
			merchantGroupCover.toolTip.y = position.y;
		}
		if (military === 0) {
			militaryGroupCover.visible = true;
			ToolTip.addTipTo(militaryGroupCover, hudInputPriority + 10, 'Hire a Minister of The Military\nto unlock these options', 0, 0);
			var position = {
				x: buildMenu.x + militaryGroupCover.x + militaryGroupCover.width/2 - militaryGroupCover.toolTip.width/2,
				y: buildMenu.y + militaryGroupCover.y + militaryGroupCover.height/2 - militaryGroupCover.toolTip.height/2
			};
			militaryGroupCover.toolTip.x = position.x;
			militaryGroupCover.toolTip.y = position.y;
		}

		return buildMenu;
	},

	buttonPosition: function(bgSprite, btnSprites, vertical){
		if(!bgSprite || !btnSprites || vertical===null)
			return;

		for(var count=0; count<btnSprites.length; ++count){

		}
	}
}