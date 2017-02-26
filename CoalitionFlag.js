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

		// Functions
		// Update - updates data only, should be called every half second
		coalitionFlag.update = function() { CoalitionFlag.update(coalitionFlag); };
		coalitionFlag.updateLoop = MainGame.game.time.events.loop(500, coalitionFlag.update, coalitionFlag);

		return coalitionFlag;
	},
	
	update: function(coalitionFlag) {
		// KILL ALL CHILDREN
		coalitionFlag.beauroGroup.removeAll();
		coalitionFlag.merchantGroup.removeAll();
		coalitionFlag.militaryGroup.removeAll();
		
		// Get list of coalition members
		var coalition = [];//MainGame.population.getCoalition();
		
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
		
		// Create the add member buttons
		coalitionFlag.beauroGroup.addChild(AddCoalitionButton.createNew('bureaucrat'));
		coalitionFlag.merchantGroup.addChild(AddCoalitionButton.createNew('merchant'));
		coalitionFlag.militaryGroup.addChild(AddCoalitionButton.createNew('military'));
	},
	
	
};

var AddCoalitionButton = {
	createNew: function(typeString) {
		// First, figure out a texture
		var textureString = '';
		if (typeString === 'military') {
			textureString = 'add_military_button';
		} else if (typeString === 'merchant') {
			textureString = 'add_merchant_button';
		} else if (typeString === 'bureaucrat') {
			textureString = 'add_beauro_button';
		}
		
		var addButton = MainGame.game.make.button(0, 0, textureString, 0, 1, 2);
		addButton.anchor.x = 1;

		// Set a click handler - open a hire menu for the given type

		return addButton;
	}
}

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
		viewButton.anchor.x = 1;

		// Set a click handler - open the detail panel for the given person

		return viewButton;
	}
}