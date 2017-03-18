var CoalitionFlag = {
	origin: { x:1280, y:100 },
	unitWidth: 48,
	unitHeight: 48,
	verticalPad: 4,

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
		coalitionFlag.bureaucrat.x = -CoalitionFlag.verticalPad;
		coalitionFlag.bureaucrat.y = (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad) * 0;
		coalitionFlag.addChild(coalitionFlag.bureaucrat);

		coalitionFlag.merchant = CoalitionFlag.getCoalitionPortrait(merchants);
		coalitionFlag.merchant.x = -CoalitionFlag.verticalPad;
		coalitionFlag.merchant.y = (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad) * 1;
		coalitionFlag.addChild(coalitionFlag.merchant);

		coalitionFlag.military = CoalitionFlag.getCoalitionPortrait(militaries);
		coalitionFlag.military.x = -CoalitionFlag.verticalPad;
		coalitionFlag.military.y = (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad) * 2;
		coalitionFlag.addChild(coalitionFlag.military);
		
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
		coalitionFlag.removeChild(coalitionFlag.bureaucrat);
		coalitionFlag.removeChild(coalitionFlag.merchant);
		coalitionFlag.removeChild(coalitionFlag.military);

		// Get new buttons
		coalitionFlag.bureaucrat = CoalitionFlag.getCoalitionPortrait(bureaucrats);
		coalitionFlag.bureaucrat.x = -CoalitionFlag.verticalPad;
		coalitionFlag.bureaucrat.y = (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad) * 0;
		coalitionFlag.addChild(coalitionFlag.bureaucrat);

		coalitionFlag.merchant = CoalitionFlag.getCoalitionPortrait(merchants);
		coalitionFlag.merchant.x = -CoalitionFlag.verticalPad;
		coalitionFlag.merchant.y = (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad) * 1;
		coalitionFlag.addChild(coalitionFlag.merchant);

		coalitionFlag.military = CoalitionFlag.getCoalitionPortrait(militaries);
		coalitionFlag.military.x = -CoalitionFlag.verticalPad;
		coalitionFlag.military.y = (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad) * 2;
		coalitionFlag.addChild(coalitionFlag.military);
	},

	getCoalitionPortrait: function(coalitionList, callBack) {
		if (coalitionList.length != 0) {
			var minister = coalitionList[0];

			var textureString;
			switch (minister.role) {
				case Person.Bureaucrat:
					textureString = 'bureaucrat_port_' + minister.portIndex;
					break;
				case Person.Merchant:
					textureString = 'merchant_port_' + minister.portIndex;
					break;
				case Person.Military:
					textureString = 'military_port_' + minister.portIndex;
					break;
				default:
					break;
			}

			var button = MainGame.game.make.button(0, 0, textureString, function() {CoalitionFlag.showMinisterContract(minister);});
			button.anchor.x = 1;

			var toolTip = ToolTip.createNew(minister.name);
			toolTip.x = -46 - toolTip.width;
			toolTip.y = 18;
        	button.addChild(toolTip);
        	button.events.onInputOver.add(function() {toolTip.show();}, null);
        	button.events.onInputOut.add(function() {toolTip.hide();}, null);

			return button;
		} else {
			var sprite = MainGame.game.make.sprite(0, 0, 'defaultPort');
			sprite.anchor.x = 1;
			return sprite;
		}
	},

	showMinisterContract: function(minister) {
		var pView = PeopleView.createNew();
		pView.showContractView(minister);
	},
};