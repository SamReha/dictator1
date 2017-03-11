var CoalitionFlag = {
	origin: {x:0,y:120},
	unitWidth: 48,
	vertPadding: 0,

	createNew: function() {
		/* global MainGame */
		var coalitionFlag = MainGame.game.make.group();
		coalitionFlag.x = MainGame.game.width;

		// Properties
		coalitionFlag.beauroGroup = MainGame.game.make.group();
		coalitionFlag.beauroGroup.x = 0;
		coalitionFlag.beauroGroup.y = CoalitionFlag.origin.y;
		coalitionFlag.addChild(coalitionFlag.beauroGroup);

		coalitionFlag.merchantGroup = MainGame.game.make.group();
		coalitionFlag.merchantGroup.x = 0;
		coalitionFlag.merchantGroup.y = CoalitionFlag.origin.y + CoalitionFlag.unitWidth*1;
		coalitionFlag.addChild(coalitionFlag.merchantGroup);

		coalitionFlag.militaryGroup = MainGame.game.make.group();
		coalitionFlag.militaryGroup.y = CoalitionFlag.origin.y + CoalitionFlag.unitWidth*2;
		coalitionFlag.addChild(coalitionFlag.militaryGroup);

		coalitionFlag.addCoalitionMenu = AddCoalitionMenu.createNew();

		// Do the initial creation of all our coaltion member UI elements
		coalitionFlag.elementSize = {x:1,y:1};

		// Get list of coalition members
		var coalition = MainGame.population.highList();
		coalitionFlag.bureaucrats = [];
		coalitionFlag.merchants = [];
		coalitionFlag.militaries = [];
		
		// Create all the viewButtons
		for (var i in coalition) {
			var coalitionMember = coalition[i];
			
			if (coalitionMember.type === 'bureaucrat') {
				//coalitionFlag.beauroGroup.addChild(ViewCoalitionButton.createNew(coalitionMember)); should be adding to ListView
				coalitionFlag.bureaucrats.push(coalitionMember);
			} else if (coalitionMember.type === 'merchant') {
				//coalitionFlag.merchantGroup.addChild(ViewCoalitionButton.createNew(coalitionMember));
				coalitionFlag.merchants.push(coalitionMember);
			} else if (coalitionMember.type === 'military') {
				//coalitionFlag.militaryGroup.addChild(ViewCoalitionButton.createNew(coalitionMember));
				coalitionFlag.militaries.push(coalitionMember);
			}
		}
		coalitionFlag.beauroGroup.addChild(AddCoalitionButton.createNew('bureaucrat', coalitionFlag.addCoalitionMenu));
		coalitionFlag.beauroGroup.addChild(DListView.createNew(textures, margin, coalitionFlag.elementSize, CoalitionFlag.showCoalitionContract(), true, 1));

		coalitionFlag.merchantGroup.addChild(AddCoalitionButton.createNew('merchant', coalitionFlag.addCoalitionMenu));
		coalitionFlag.merchantGroup.addChild(DListView.createNew());

		coalitionFlag.militaryGroup.addChild(AddCoalitionButton.createNew('military', coalitionFlag.addCoalitionMenu));
		coalitionFlag.militaryGroup.addChild(DListView.createNew());

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

	showCoalitionContract: function() {

	}
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

        console.log("MidList", MainGame.population.midList());
        console.log(socialElite);
	},
};