var CoalitionFlag = {
	origin: { x:1280, y:100 },
	unitWidth: 46,
	unitHeight: 46,
	verticalBorderPad: 5,
	verticalPad: 20,
	horizontalPad: 5,

	createNew: function() {
		/* global MainGame */
		var coalitionFlag = MainGame.game.make.sprite(CoalitionFlag.origin.x, CoalitionFlag.origin.y, 'coalition_backpanel');
		coalitionFlag.anchor.x = 1;
		coalitionFlag.inputEnabled = true;
		coalitionFlag.input.priorityID = 0;

		// coalitionFlag.border = MainGame.game.make.sprite(5, 0, 'coalition_border');
		// coalitionFlag.border.anchor.x = 1;
		// coalitionFlag.addChild(coalitionFlag.border);

		// Fetch the coaltion members
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat);
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant);
		var militaries = MainGame.population.typeRoleList(Person.Hi, Person.Military);

		// For each faction, decide whether we need a face or a placeholder
		coalitionFlag.bureaucrat = CoalitionFlag.getCoalitionPortrait(Person.Bureaucrat, bureaucrats, CoalitionFlag.showBureaucratContract);
		coalitionFlag.bureaucrat.x = -CoalitionFlag.horizontalPad;
		coalitionFlag.bureaucrat.y = CoalitionFlag.verticalBorderPad;
		coalitionFlag.addChild(coalitionFlag.bureaucrat);

		coalitionFlag.merchant = CoalitionFlag.getCoalitionPortrait(Person.Merchant, merchants);
		coalitionFlag.merchant.x = -CoalitionFlag.horizontalPad;
		coalitionFlag.merchant.y = coalitionFlag.bureaucrat.y + (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad);
		coalitionFlag.addChild(coalitionFlag.merchant);

		coalitionFlag.military = CoalitionFlag.getCoalitionPortrait(Person.Military, militaries);
		coalitionFlag.military.x = -CoalitionFlag.horizontalPad;
		coalitionFlag.military.y = coalitionFlag.merchant.y + (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad);
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
		coalitionFlag.bureaucrat = CoalitionFlag.getCoalitionPortrait(Person.Bureaucrat, bureaucrats);
		coalitionFlag.bureaucrat.x = -CoalitionFlag.horizontalPad;
		coalitionFlag.bureaucrat.y = CoalitionFlag.verticalBorderPad;
		coalitionFlag.addChild(coalitionFlag.bureaucrat);

		coalitionFlag.merchant = CoalitionFlag.getCoalitionPortrait(Person.Merchant, merchants);
		coalitionFlag.merchant.x = -CoalitionFlag.horizontalPad;
		coalitionFlag.merchant.y = coalitionFlag.bureaucrat.y + (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad);
		coalitionFlag.addChild(coalitionFlag.merchant);

		coalitionFlag.military = CoalitionFlag.getCoalitionPortrait(Person.Military, militaries);
		coalitionFlag.military.x = -CoalitionFlag.horizontalPad;
		coalitionFlag.military.y = coalitionFlag.merchant.y + (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad);
		coalitionFlag.addChild(coalitionFlag.military);
	},

	getCoalitionPortrait: function(coalitionType, coalitionList) {
		var textureString;
		var portraitString;

		if (coalitionList.length != 0) {
			var minister = coalitionList[0];

			switch (coalitionType) {
				case Person.Bureaucrat:
					textureString = 'portrait_border_bureau';
					portraitString = 'bureaucrat_port_' + minister.portIndex;
					break;
				case Person.Merchant:
					textureString = 'portrait_border_finance';
					portraitString = 'merchant_port_' + minister.portIndex;
					break;
				case Person.Military:
					textureString = 'portrait_border_military';
					portraitString = 'military_port_' + minister.portIndex;
					break;
				default:
					break;
			}

			var button = MainGame.game.make.button(0, 0, textureString, function() {CoalitionFlag.showMinisterContract(minister);}, 1, 0, 2, 1);
			var portrait = MainGame.game.make.sprite(-5, 5, portraitString);
			portrait.anchor.setTo(1,0);
			button.addChild(portrait);
			button.anchor.x = 1;
			button.inputEnabled = true;
			button.input.priorityID = 1;

			var toolTip = ToolTip.createNew(minister.name);
			toolTip.x = -56 - toolTip.width;
			toolTip.y = 18;
			button.addChild(toolTip);
			button.events.onInputOver.add(function() {toolTip.show();}, null);
			button.events.onInputOut.add(function() {toolTip.hide();}, null);

			return button;
		} else {
			switch (coalitionType) {
				case Person.Bureaucrat:
					textureString = 'portrait_border_bureau';
					break;
				case Person.Merchant:
					textureString = 'portrait_border_finance';
					break;
				case Person.Military:
					textureString = 'portrait_border_military';
					break;
				default:
					break;
			}

			var sprite = MainGame.game.make.button(0, 0, textureString, function() {PeopleView.createNew();}, 2, 1, 0, 2);
			sprite.anchor.x = 1;
			sprite.inputEnabled = true;
			sprite.input.priorityID = 1;

			var toolTip = ToolTip.createNew('Hire a Minister');
			toolTip.x = -56 - toolTip.width;
			toolTip.y = 18;
        	sprite.addChild(toolTip);
        	sprite.events.onInputOver.add(function() {toolTip.show();}, null);
        	sprite.events.onInputOut.add(function() {toolTip.hide();}, null);

			return sprite;
		}
	},

	showMinisterContract: function(minister) {
		var pView = PeopleView.createNew();
		pView.showContractView(minister);
	},
};