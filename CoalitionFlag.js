var CoalitionFlag = {
	origin: {x:500,y:120},
	unitWidth: 48,

	createNew: function() {
		/* global MainGame */
		var coalitionFlag = MainGame.game.make.sprite(CoalitionFlag.origin.x, CoalitionFlag.origin.y, '');
		coalitionFlag.anchor.x = 1;

		// Fetch the coaltion members
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat);
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant);
		var militaries = MainGame.population.typeRoleList(Person.Hi, Person.Military);

		// For each faction, decide whether we need a face or a placeholder
		coalitionFlag.bureaucrat = CoalitionFlag.getCoalitionPortrait(bureaucrats, CoalitionFlag.showBureaucratContract);
		//coalitionFlag.addChild(coalitionFlag.bureaucrat);
		//coalitionFlag.addChild(CoalitionFlag.getCoalitionPortrait(merchants));
		//coalitionFlag.addChild(CoalitionFlag.getCoalitionPortrait(militaries));
		
		// Functions
		// Update - should be called externally whenever a coalition member is hired, fired or killed.
		coalitionFlag.updateSelf = function() { CoalitionFlag.updateSelf(coalitionFlag); };

		return coalitionFlag;
	},
	
	updateSelf: function(coalitionFlag) {
		// Fetch the coaltion members
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat);
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant);
		var militaries = MainGame.population.typeRoleList(Person.Hi, Person.Military);

		// Remove old buttons

		// Get new buttons
	},

	getCoalitionPortrait: function(coalitionList, callBack) {
		if (coalitionList.length != 0) {
			var member = coalitionList[0];
			var spriteTexture = 'smallPort' + member.portIndex;

			return MainGame.game.make.button(0, 0, spriteTexture, callBack);
		} else {
			return MainGame.game.make.sprite(0, 0, 'defaultSmallPort');
		}
	},

	showMilitaryContract: function() {
		console.log("Show Military Contract!");
	},

	showBureaucratContract: function() {
		console.log("Show Bureaucrat Contract!");
	},

	showMerchantContract: function() {
		console.log("Show Merchant Contract!");
	},
};