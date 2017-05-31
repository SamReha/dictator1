var CoalitionFlag = {
	origin: { x:0, y:317 },
	unitWidth: 56,
	unitHeight: 56,
	verticalBorderPad: 5,
	verticalPad: 20,
	horizontalPad: 30,
	scale: 1.25,
	textStyle: { font: '24px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },

	createNew: function() {
		/* global MainGame */
		var coalitionFlag = MainGame.game.make.sprite(CoalitionFlag.origin.x, CoalitionFlag.origin.y, 'coalition_backpanel');
		coalitionFlag.inputEnabled = true;
		coalitionFlag.input.priorityID = 0;

		// coalitionFlag.border = MainGame.game.make.sprite(5, 0, 'coalition_border');
		// coalitionFlag.border.anchor.x = 1;
		// coalitionFlag.addChild(coalitionFlag.border);

		coalitionFlag.label = MainGame.game.make.text(25, this.verticalBorderPad*2, 'Ministry', this.textStyle);
		coalitionFlag.addChild(coalitionFlag.label);

		// Fetch the coaltion members
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat);
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant);
		var militaries = MainGame.population.typeRoleList(Person.Hi, Person.Military);

		// For each faction, decide whether we need a face or a placeholder
		coalitionFlag.bureaucrat = CoalitionFlag.getCoalitionPortrait(Person.Bureaucrat, bureaucrats, CoalitionFlag.showBureaucratContract);
		coalitionFlag.bureaucrat.x = CoalitionFlag.horizontalPad;
		coalitionFlag.bureaucrat.y = coalitionFlag.label.y + coalitionFlag.label.height + CoalitionFlag.verticalBorderPad;
		coalitionFlag.bureaucrat.toolTip.y = (coalitionFlag.y + coalitionFlag.bureaucrat.y);
		coalitionFlag.addChild(coalitionFlag.bureaucrat);

		coalitionFlag.merchant = CoalitionFlag.getCoalitionPortrait(Person.Merchant, merchants);
		coalitionFlag.merchant.x = CoalitionFlag.horizontalPad;
		coalitionFlag.merchant.y = coalitionFlag.bureaucrat.y + (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad);
		coalitionFlag.merchant.toolTip.y = (coalitionFlag.y + coalitionFlag.merchant.y);
		coalitionFlag.addChild(coalitionFlag.merchant);

		coalitionFlag.military = CoalitionFlag.getCoalitionPortrait(Person.Military, militaries);
		coalitionFlag.military.x = CoalitionFlag.horizontalPad;
		coalitionFlag.military.y = coalitionFlag.merchant.y + (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad);
		coalitionFlag.military.toolTip.y = (coalitionFlag.y + coalitionFlag.military.y);
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

		// Hide all tooltips
		coalitionFlag.bureaucrat.toolTip.hide();
		coalitionFlag.merchant.toolTip.hide();
		coalitionFlag.military.toolTip.hide();

		// Remove old buttons
		coalitionFlag.removeChild(coalitionFlag.bureaucrat);
		coalitionFlag.removeChild(coalitionFlag.merchant);
		coalitionFlag.removeChild(coalitionFlag.military);

		// Get new buttons
		coalitionFlag.bureaucrat = CoalitionFlag.getCoalitionPortrait(Person.Bureaucrat, bureaucrats);
		coalitionFlag.bureaucrat.x = CoalitionFlag.horizontalPad;
		coalitionFlag.bureaucrat.y = coalitionFlag.label.y + coalitionFlag.label.height + CoalitionFlag.verticalBorderPad;
		coalitionFlag.bureaucrat.toolTip.y = (coalitionFlag.y + coalitionFlag.bureaucrat.y);
		coalitionFlag.addChild(coalitionFlag.bureaucrat);

		coalitionFlag.merchant = CoalitionFlag.getCoalitionPortrait(Person.Merchant, merchants);
		coalitionFlag.merchant.x = CoalitionFlag.horizontalPad;
		coalitionFlag.merchant.y = coalitionFlag.bureaucrat.y + (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad);
		coalitionFlag.merchant.toolTip.y = (coalitionFlag.y + coalitionFlag.merchant.y);
		coalitionFlag.addChild(coalitionFlag.merchant);

		coalitionFlag.military = CoalitionFlag.getCoalitionPortrait(Person.Military, militaries);
		coalitionFlag.military.x = CoalitionFlag.horizontalPad;
		coalitionFlag.military.y = coalitionFlag.merchant.y + (CoalitionFlag.unitHeight + CoalitionFlag.verticalPad);
		coalitionFlag.military.toolTip.y = (coalitionFlag.y + coalitionFlag.military.y);
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

			var button = MainGame.game.make.button(0, 0, textureString, function() {CoalitionFlag.showMinisterContract(minister);}, 2, 1, 0, 2);
			button.addChild(MainGame.game.make.sprite(5, 5, minister.getPortTexString()));
			button.scale.setTo(this.scale);

			ToolTip.addTipTo(button, 1, minister.name, (button.x + button.width)*this.scale, 0);
			return button;
		} else {
			var toolTipText = 'Hire a Minister of ';
			switch (coalitionType) {
				case Person.Bureaucrat:
					textureString = 'portrait_border_bureau';
					toolTipText += 'Bureaucracy';
					break;
				case Person.Merchant:
					textureString = 'portrait_border_finance';
					toolTipText += 'Finance';
					break;
				case Person.Military:
					textureString = 'portrait_border_military';
					toolTipText += 'The Military';
					break;
				default:
					break;
			}

			var sprite = MainGame.game.make.button(0, 0, textureString, function() {
				Binder.createNew(Binder.global,3);
			}, 2, 1, 0, 2);
			sprite.scale.setTo(this.scale);
			
			ToolTip.addTipTo(sprite, 1, toolTipText, (sprite.x + sprite.width)*this.scale, 0);
			return sprite;
		}
	},

	showMinisterContract: function(minister) {
		Clipboard.createNew(Clipboard.contract,{personDataRef:minister});
	},
};