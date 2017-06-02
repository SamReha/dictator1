/*global MainGame*/

var BuildMenu = {
    styleNormal: {font:"24px myKaiti", fill:"#ffffff", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
    styleButton: {font:"32px myKaiti", fill:"#ffffff", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
    hudInputPriority: 60,

	createNew: function(highData) {
		MainGame.global.buildMenuOpened = true;
		MainGame.global.buildMenuIsOpen = true;

		var buildMenu = MainGame.game.add.sprite(0,0,'buildMenuBg');
		buildMenu.position.set(MainGame.game.width/2 - buildMenu.width/2, MainGame.game.height/2 - buildMenu.height/2);

		// audio
		buildMenu.sfx = game.make.audio('message_close');

		// setup the mask
		/* global DUiMask */
		buildMenu.uiMask = DUiMask.createNew();
		buildMenu.uiMask.setController(50, function() {
			MainGame.global.buildMenuIsOpen = false;
			MainGame.global.buildMenu = null;
			buildMenu.uiMask.destroy();
			buildMenu.sfx.play();
			buildMenu.destroy();
		});

		// let build menu block click events
		buildMenu.inputEnabled = true;
		buildMenu.input.priorityID = this.hudInputPriority - 1;

		// Money Text
		var moneyText = MainGame.game.make.text(100, 60, 'Money:\n₸' + MainGame.global.money, this.styleButton);
		buildMenu.addChild(moneyText);

		// buildMenu: UI groups
		var bureauGroup = MainGame.game.make.group();
		bureauGroup.position.y = buildMenu.height*1/3;
		buildMenu.addChild(bureauGroup);

		var bureauText = MainGame.game.make.text(buildMenu.width/6, 25, "Bureaucratic", this.styleNormal);
		bureauText.anchor.x = 0.5;
		bureauGroup.addChild(bureauText);

		var bureauGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCoverAlpha1');
		bureauGroupCover.inputEnabled = true;
		bureauGroupCover.input.priorityID = this.hudInputPriority + 1;
		bureauGroupCover.position.y = buildMenu.height*1/3;
		bureauGroupCover.visible = false;
		buildMenu.addChild(bureauGroupCover);

		var merchantGroup = MainGame.game.make.group();
		merchantGroup.position.x = buildMenu.width/3;
		merchantGroup.position.y = buildMenu.height*1/3;
		buildMenu.addChild(merchantGroup);

		var merchantText = MainGame.game.make.text(buildMenu.width/6, 25, "Financial", this.styleNormal);
		merchantText.anchor.x = 0.5;
		merchantGroup.addChild(merchantText);

		var merchantGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCoverAlpha1');
		merchantGroupCover.inputEnabled = true;
		merchantGroupCover.input.priorityID = this.hudInputPriority + 1;
		merchantGroupCover.position.x = buildMenu.width/3;
		merchantGroupCover.position.y = buildMenu.height*1/3;
		merchantGroupCover.visible = false;
		buildMenu.addChild(merchantGroupCover);

		var militaryGroup = MainGame.game.make.group();
		militaryGroup.position.x = buildMenu.width*2/3;
		militaryGroup.position.y = buildMenu.height*1/3;
		buildMenu.addChild(militaryGroup);

		var militaryText = MainGame.game.make.text(buildMenu.width/6, 25, "Military", this.styleNormal);
		militaryText.anchor.x = 0.5;
		militaryGroup.addChild(militaryText);

		var militaryGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCoverAlpha1');
		militaryGroupCover.inputEnabled = true;
		militaryGroupCover.input.priorityID = this.hudInputPriority + 1;
		militaryGroupCover.position.x = buildMenu.width*2/3;
		militaryGroupCover.position.y = buildMenu.height*1/3;
		militaryGroupCover.visible = false;
		buildMenu.addChild(militaryGroupCover);

		var defaultGroup = MainGame.game.make.group();
		defaultGroup.position.y = 0;//buildMenu.height*2/3;
		buildMenu.addChild(defaultGroup);

		// var defaultGroupCover = MainGame.game.add.sprite(0,0,'buildMenuCover2');
		// defaultGroupCover.inputEnabled = true;
		// defaultGroupCover.input.priorityID = this.hudInputPriority + 10;
		// defaultGroupCover.position.y = buildMenu.height*2/3;
		// defaultGroupCover.visible = false;
		// buildMenu.addChild(defaultGroupCover);

		// Use this to make sure tool tips have their own layer to draw on
		buildMenu.toolTipLayer = MainGame.game.make.group();
		buildMenu.addChild(buildMenu.toolTipLayer);

		// Before we start making buttons, let's make a dictionary to keep track of them
		buildMenu.buttons = {};

		// MANSION
		var buyMansionBtn = BuildMenu.makePurchaseButton(340, (buildMenu.height/8), 'mansion', function() {
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyMansionBtn, 'mansion');
			buyMansionBtn.toolTip.hide();
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'Mansion\n\nA high-class private residence.\nHouses one resident.\nProvides excellent shelter.');
		buildMenu.buttons['mansion'] = buyMansionBtn;
		defaultGroup.addChild(buyMansionBtn);

        // SUBURB
		var buySuburbBtn = BuildMenu.makePurchaseButton(buyMansionBtn.x + buyMansionBtn.width*1.65, (buildMenu.height/8), 'suburb', function() {
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buySuburbBtn, 'suburb');
			buySuburbBtn.toolTip.hide();
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'Suburb\n\nA middle-class residence.\nHouses up to five residents.\nProvides decent shelter.');
		buildMenu.buttons['suburb'] = buySuburbBtn;
		defaultGroup.addChild(buySuburbBtn);

        // APARTMENT
		var buyApartmentBtn = BuildMenu.makePurchaseButton(buySuburbBtn.x + buySuburbBtn.width*1.65, (buildMenu.height/8), 'apartment', function() {
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyApartmentBtn, 'apartment');
			buyApartmentBtn.toolTip.hide();
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'Apartment\n\nHigh density residence for the working-class.\nHouses up to ten residents.\nProvides poor shelter.');
		buildMenu.buttons['apartment'] = buyApartmentBtn;
		defaultGroup.addChild(buyApartmentBtn);

        // ROAD
		var buyRoadBtn = BuildMenu.makePurchaseButton(buyApartmentBtn.x + buyApartmentBtn.width*1.65, (buildMenu.height/8), 'road', function() {
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyRoadBtn, 'road');
			buyRoadBtn.toolTip.hide();
			MainGame.global.boughtRoad = true;
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'Road\n\nConnects residences to workplaces.\nGenerates a small amount of Freedom.');
		buildMenu.buttons['road'] = buyRoadBtn;
		defaultGroup.addChild(buyRoadBtn);

		// FARM
		var buyFarmBtn = BuildMenu.makePurchaseButton(40, 6*(buildMenu.height/12), 'farm', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyFarmBtn, 'farm');
			buyFarmBtn.toolTip.hide();
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'Farm\n\nEach employed farmer generates Health for nearby homes.');
		buildMenu.buttons['farm'] = buyFarmBtn;
		defaultGroup.addChild(buyFarmBtn);

		// SCHOOL
		var buySchoolBtn = BuildMenu.makePurchaseButton(buyFarmBtn.x + buyFarmBtn.width*1.65, 6*(buildMenu.height/12), 'school', function() {
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buySchoolBtn, 'school');
			buySchoolBtn.toolTip.hide();
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'School\n\nCitizens enjoy living in neighborhoods with good schools\nEach employed teacher generates Culture.\nEach employed teacher generates Freedom.');
		buildMenu.buttons['school'] = buySchoolBtn;
		defaultGroup.addChild(buySchoolBtn);

		// PARK
		var buyParkBtn = BuildMenu.makePurchaseButton(buyFarmBtn.x, buyFarmBtn.y + buyFarmBtn.height*1.65, 'park', function() {
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyParkBtn, 'park');
			buyParkBtn.toolTip.hide();
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'Park\n\nBeautifies your country.\nEach employed worker lowers Unrest.');
		buildMenu.buttons['park'] = buyParkBtn;
		defaultGroup.addChild(buyParkBtn);

		// FACTORY
		var buyFactoryBtn = BuildMenu.makePurchaseButton(340, 6*(buildMenu.height/12), 'factory', function() {
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyFactoryBtn, 'factory');
			buyFactoryBtn.toolTip.hide();
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'Factory\n\nEach employed worker generates money per year.');
		buildMenu.buttons['factory'] = buyFactoryBtn;
		defaultGroup.addChild(buyFactoryBtn);

		// ARMYBASE
		var buyArmyBaseBtn = BuildMenu.makePurchaseButton(625, 6*(buildMenu.height/12), 'armyBase', function() {
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyArmyBaseBtn, 'armyBase');
			buyArmyBaseBtn.toolTip.hide();
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'Army Base\n\nEach employed soldier can be deployed for a small fee.\nSoldiers automatically seek out and destroy Rioters.\nEach solder reduces Freedom when deployed.');
		buildMenu.buttons['armyBase'] = buyArmyBaseBtn;
		defaultGroup.addChild(buyArmyBaseBtn);

		// Police Station
		var buyPoliceStationBtn = BuildMenu.makePurchaseButton(buyArmyBaseBtn.x + buyArmyBaseBtn.width*1.65, 6*(buildMenu.height/12), 'police', function(){
			Hud.beginBuilding(buildMenu, buildMenu.uiMask, buyPoliceStationBtn, 'police');
			buyPoliceStationBtn.toolTip.hide();
		},
		buildMenu, 1, 0, 2, 0, buildMenu.toolTipLayer, 'Police Station\n\nEach employed police officer reduces Freedom.');
		buildMenu.buttons['police'] = buyPoliceStationBtn;
		defaultGroup.addChild(buyPoliceStationBtn);

		/*global Person*/
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat).length;
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant).length;
		var military = MainGame.population.typeRoleList(Person.Hi, Person.Military).length;

		if (bureaucrats === 0) {
			bureauGroupCover.visible = true;
			ToolTip.addTipTo(bureauGroupCover, this.hudInputPriority + 1, 'Hire a Minister of Bureaucracy\nto unlock these options', 0, 0);
			var position = {
				x: buildMenu.x + bureauGroupCover.x + bureauGroupCover.width/2 - bureauGroupCover.toolTip.width/2,
				y: buildMenu.y + bureauGroupCover.y + bureauGroupCover.height/2 - bureauGroupCover.toolTip.height/2
			};
			bureauGroupCover.toolTip.x = position.x;
			bureauGroupCover.toolTip.y = position.y;
		}
		if (merchants === 0) {
			merchantGroupCover.visible = true;
			ToolTip.addTipTo(merchantGroupCover, this.hudInputPriority + 1, 'Hire a Minister of Finance\nto unlock these options', 0, 0);
			var position = {
				x: buildMenu.x + merchantGroupCover.x + merchantGroupCover.width/2 - merchantGroupCover.toolTip.width/2,
				y: buildMenu.y + merchantGroupCover.y + merchantGroupCover.height/2 - merchantGroupCover.toolTip.height/2
			};
			merchantGroupCover.toolTip.x = position.x;
			merchantGroupCover.toolTip.y = position.y;
		}
		if (military === 0) {
			militaryGroupCover.visible = true;
			ToolTip.addTipTo(militaryGroupCover, this.hudInputPriority + 1, 'Hire a Minister of The Military\nto unlock these options', 0, 0);
			var position = {
				x: buildMenu.x + militaryGroupCover.x + militaryGroupCover.width/2 - militaryGroupCover.toolTip.width/2,
				y: buildMenu.y + militaryGroupCover.y + militaryGroupCover.height/2 - militaryGroupCover.toolTip.height/2
			};
			militaryGroupCover.toolTip.x = position.x;
			militaryGroupCover.toolTip.y = position.y;
		}

		buildMenu.disableButton = function(name) { BuildMenu.disableButton(buildMenu, name); };
		buildMenu.enableButton = function(name) { BuildMenu.enableButton(buildMenu, name); };

		// Special tutorial logic
		// If we are in the tutorial...
		if (Tutorial.activeTut.name !== 'tutorialEnd') {
			if (Tutorial.activeTut.name === 'Roads' || Tutorial.activeTut.name === 'OpenBuildMenu') {
				buildMenu.disableButton('apartment');
				buildMenu.disableButton('suburb');
				buildMenu.disableButton('mansion');
			} else if (Tutorial.activeTut.name === 'housing' || Tutorial.activeTut.name === 'OpenBuildMenuHousing' || Tutorial.activeTut.name === 'PlacingHouse') {
				buildMenu.disableButton('road');
			} else {
				// If we're in the tutorial (but not on a phase that requires the build menu), lock down all options
				for (var key in buildMenu.buttons) {
					buildMenu.buttons[key].setInteractable(false);
				}
			}
		}

		return buildMenu;
	},

	makePurchaseButton: function(x, y, buildingName, callback, callbackContext, up, down, over, out, toolTipLayer, toolTipText) {
		var buildingData = Building.getData(buildingName);
		console.assert(buildingData !== undefined);

		var button = MainGame.game.make.button(x, y, 'buy_button', function() {
			if (button.interactable) {
				callback();
			}
		}, callbackContext, up, down, over, out); // callbackContext may not be getting applied properly in this case

		button.inputEnabled = true;
		button.input.priorityID = this.hudInputPriority;
		button.interactable = true;

		// Use this for organizing the z-depth of text, image and tool tip
		button.group = MainGame.game.make.group();
		button.addChild(button.group);

		button.image = MainGame.game.make.sprite(0, 0, buildingName);
		button.image.anchor.set(0.5, 0.5);
		button.image.scale.set(0.3, 0.3);
		button.image.position.set(button.width/2, button.height/2);
		button.group.addChild(button.image);

		button.text = MainGame.game.make.text(0, 0, '₸' + buildingData.cost, this.styleNormal);
		button.text.anchor.set(0.5, 0);
		button.text.position.set(button.width/2, button.height - button.text.height);
		button.group.addChild(button.text);

		button.toolTip = ToolTip.createNew(toolTipText);
		button.toolTip.position.set(x, y + button.height);
		button.events.onInputOver.add(function() {
			if (button.interactable) {
				MainGame.game.make.audio('pencil_circle_light_' + MainGame.game.rnd.integerInRange(1, 10)).play();
			} else {
				button.frame = 0;
			}
			button.toolTip.show();
		}, null);
		button.events.onInputOut.add(function() {
			button.toolTip.hide();
		}, null);
		toolTipLayer.addChild(button.toolTip);

		button.setInteractable = function(bool) { BuildMenu.setInteractable(button, bool); };

		// If the player is too broke to buy something...
		if (MainGame.global.money < buildingData.cost) {
			button.text.addColor('red', 0);
			button.setInteractable(false);
		}

		// If the player doesn't have a minister of the correct type...
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat).length;
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant).length;
		var military = MainGame.population.typeRoleList(Person.Hi, Person.Military).length;

		switch (buildingData.faction) {
			case 'Bureaucratic':
				button.setInteractable(bureaucrats > 0);
				break;
			case 'Commerce':
				button.setInteractable(merchants > 0);
				break;
			case 'Military':
				button.setInteractable(military > 0);
				break;
			default:
				break;
		}

		return button;
	},

	setInteractable: function(button, bool) {
		if (bool) {
			button.tint = 0xFFFFFF;
			button.image.tint = 0xFFFFFF;
			button.interactable = true;
		} else {
			button.tint = 0x555555;
			button.image.tint = 0x555555;
			button.interactable = false;
		}
	},

	disableButton: function(buildMenu, name) {
		var button = buildMenu.buttons[name];
		console.assert(button !== undefined);

		button.setInteractable(false);
	},

	enableButton: function(buildMenu, name) {
		var button = buildMenu.buttons[name];
		console.assert(button !== undefined);

		// If the player is too broke to buy something...
		if (MainGame.global.money < buildingData.cost) {
			button.text.addColor('red', 0);
			button.setInteractable(false);
			return;
		}

		// If the player doesn't have a minister of the correct type...
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat).length;
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant).length;
		var military = MainGame.population.typeRoleList(Person.Hi, Person.Military).length;

		switch (buildingData.faction) {
			case 'Bureaucratic':
				button.setInteractable(bureaucrats > 0);
				return;
				break;
			case 'Commerce':
				button.setInteractable(merchants > 0);
				return;
				break;
			case 'Military':
				button.setInteractable(military > 0);
				return;
				break;
			default:
				break;
		}

		// If we made it this far, set the button to active.
		button.setInteractable(true);
	},
}