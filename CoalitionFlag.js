var CoalitionFlag = {
	createNew: function() {
		/* global MainGame */
		var coalitionFlag = MainGame.game.make.group();
		coalitionFlag.x = MainGame.game.width;

		// Properties
		coalitionFlag.bannerSprite = MainGame.game.make.sprite(0, 0, 'flag_background');
		coalitionFlag.bannerSprite.anchor.x = 1;
		coalitionFlag.addChild(coalitionFlag.bannerSprite);

		coalitionFlag.beauroGroup = MainGame.game.make.group();
		coalitionFlag.beauroGroup.x = -120 * 2;
		coalitionFlag.beauroGroup.y = 48;
		coalitionFlag.addChild(coalitionFlag.beauroGroup);

		coalitionFlag.merchantGroup = MainGame.game.make.group();
		coalitionFlag.merchantGroup.x = -120;
		coalitionFlag.merchantGroup.y = 48;
		coalitionFlag.addChild(coalitionFlag.merchantGroup);

		coalitionFlag.militaryGroup = MainGame.game.make.group();
		coalitionFlag.militaryGroup.y = 48;
		coalitionFlag.addChild(coalitionFlag.militaryGroup);

		coalitionFlag.addCoalitionMenu = AddCoalitionMenu.createNew();

		// Create the add member buttons
		var addBureaucratButton = AddCoalitionButton.createNew('bureaucrat', coalitionFlag.addCoalitionMenu);
		coalitionFlag.beauroGroup.addChild(addBureaucratButton);
		coalitionFlag.merchantGroup.addChild(AddCoalitionButton.createNew('merchant', coalitionFlag.addCoalitionMenu));
		coalitionFlag.militaryGroup.addChild(AddCoalitionButton.createNew('military', coalitionFlag.addCoalitionMenu));

		// Functions
		// Update - updates data only, should be called every half second
		coalitionFlag.updateSelf = function() { CoalitionFlag.updateSelf(coalitionFlag); };
		//coalitionFlag.updateLoop = MainGame.game.time.events.loop(500, coalitionFlag.update, coalitionFlag);

		return coalitionFlag;
	},
	
	updateSelf: function(coalitionFlag) {
		// KILL ALL CHILDREN (except don't we should probably track the view buttons in separate groups from the add buttons)
		//coalitionFlag.beauroGroup.removeAll();
		//coalitionFlag.merchantGroup.removeAll();
		//coalitionFlag.militaryGroup.removeAll();
		
		// Get list of coalition members
		var coalition = MainGame.population.highList();
		
		// Create all the viewButtons
		for (var i in coalition) {
			var coalitionMember = coalition[i];
			
			if (coalitionMember.type === 'bureaucrat') {
				coalitionFlag.beauroGroup.addChild(ViewCoalitionButton.createNew(coalitionMember));
			} else if (coalitionMember.type === 'merchant') {
				coalitionFlag.merchantGroup.addChild(ViewCoalitionButton.createNew(coalitionMember));
			} else if (coalitionMember.type === 'military') {
				coalitionFlag.militaryGroup.addChild(ViewCoalitionButton.createNew(coalitionMember));
			}
		}
	},
	
	
};

var AddCoalitionButton = {
	createNew: function(typeString, addCoalitionMenu) {
		// First, figure out a texture
		var textureString = '';
		if (typeString === 'military') {
			textureString = 'add_military_button';
		} else if (typeString === 'merchant') {
			textureString = 'add_merchant_button';
		} else if (typeString === 'bureaucrat') {
			textureString = 'add_beauro_button';
		}
		
		var addButton = MainGame.game.make.button(0, 0, textureString, function() { AddCoalitionButton.clickHandler(addCoalitionMenu); }, addButton, 2, 0, 1);
		addButton.anchor.x = 1;
		addButton.name = 'Add ' + typeString + ' Button';

		return addButton;
	},

	clickHandler: function(addCoalitionMenu) {
		addCoalitionMenu.updateSelf();
		addCoalitionMenu.visible = !addCoalitionMenu.visible;
	}
};

var ViewCoalitionButton = {
	createNew: function(coalitionMember) {
		// First, figure out a texture
		var textureString = '';
		if (coalitionMember.type === 'military') {
			textureString = 'military_thumbnail';
		} else if (coalitionMember.type === 'merchant') {
			textureString = 'merchant_thumbnail';
		} else if (coalitionMember.type === 'bureaucrat') {
			textureString = 'beauro_thumbnail';
		}
		
		var viewButton = MainGame.game.make.button(0, 0, textureString);
		//viewButton.anchor.x = 1;

		// Set a click handler - open the detail panel for the given person

		return viewButton;
	}
};

var AddCoalitionMenu = {
	createNew: function() {
		// Use this texture as a placeholder until we get a proper generic menu bg
		var addCoalitionMenu = MainGame.game.add.sprite(0, 0, 'building_detail_backpanel');
		addCoalitionMenu.anchor.x = 0.5;
		addCoalitionMenu.anchor.y = 0.5;
		addCoalitionMenu.x = MainGame.game.width / 2;
		addCoalitionMenu.y = MainGame.game.height / 2;

		// Set class functions
        addCoalitionMenu.updateSelf = function() { AddCoalitionMenu.updateSelf(addCoalitionMenu); };

		addCoalitionMenu.visible = false;

		return addCoalitionMenu;
	},

	updateSelf: function(addCoMenu) {
		var socialElite = MainGame.population.midList();

        console.log("LowList", MainGame.population.lowList());
        console.log(socialElite);
	},
};