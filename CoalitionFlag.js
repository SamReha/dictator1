var CoalitionFlag = {
	createNew: function() {
		var coalitionFlag = MainGame.game.make.group();
		coalitionFlag.x = MainGame.game.width;

		// Properties
		coalitionFlag.bannerSprite = MainGame.game.make.sprite(0, 0, 'flag_background');
		coalitionFlag.bannerSprite.anchor.x = 1;
		coalitionFlag.addChild(coalitionFlag.bannerSprite);

		coalitionFlag.beauroGroup = MainGame.game.make.group();
		coalitionFlag.addChild(coalitionFlag.beauroGroup);

		coalitionFlag.merchantGroup = MainGame.game.make.group();
		coalitionFlag.addChild(coalitionFlag.merchantGroup);

		coalitionFlag.militaryGroup = MainGame.game.make.group();
		coalitionFlag.addChild(coalitionFlag.militaryGroup);

		// Functions
		// Updatee

		return coalitionFlag;
	},
};

var AddCoalitionButton = {
	createNew: function(typeString) {
		var addButton = MainGame.game.make.button(/* lol parameters */);

		// Set a click handler - open a hire menu for the given type

		return addButton;
	}
}

var viewCoalitionButton = {
	createNew: function(memberName) {
		var viewButton = MainGame.game.make.button(/* lol parameters */);

		// Set a click handler - open the detail panel for the given person

		return viewButton;
	}
}