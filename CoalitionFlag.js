var CoalitionFlag = {
	origin: { x:0, y:317 },
	unitWidth: 66,
	unitHeight: 66,
	verticalBorderPad: 4,
	verticalPad: 24,
	horizontalPad: 24,
	scale: 1.2,
	textStyle: { font: '24px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },

	createNew: function() {
		/* global MainGame */
		var coalitionFlag = MainGame.game.make.sprite(this.origin.x, this.origin.y, 'coalition_backpanel');
		coalitionFlag.inputEnabled = true;
		coalitionFlag.input.priorityID = 0;

		// coalitionFlag.border = MainGame.game.make.sprite(5, 0, 'coalition_border');
		// coalitionFlag.border.anchor.x = 1;
		// coalitionFlag.addChild(coalitionFlag.border);

		coalitionFlag.label = MainGame.game.make.text(0, this.verticalBorderPad*2, 'Ministry', this.textStyle);
		coalitionFlag.label.x = (coalitionFlag.width-coalitionFlag.label.width)/2;
		coalitionFlag.addChild(coalitionFlag.label);

		// Fetch the coaltion members
		var bureaucrats = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat);
		var merchants = MainGame.population.typeRoleList(Person.Hi, Person.Merchant);
		var militaries = MainGame.population.typeRoleList(Person.Hi, Person.Military);

		// For each faction, decide whether we need a face or a placeholder
		coalitionFlag.bureaucrat = this.getCoalitionPortrait(Person.Bureaucrat, bureaucrats);
		coalitionFlag.bureaucrat.x = (coalitionFlag.width)/2;
		coalitionFlag.bureaucrat.y = coalitionFlag.label.y + coalitionFlag.label.height + this.unitHeight*this.scale/2 + this.verticalBorderPad;
		coalitionFlag.bureaucrat.toolTip.y = (coalitionFlag.y + coalitionFlag.bureaucrat.y);
		coalitionFlag.addChild(coalitionFlag.bureaucrat);

		coalitionFlag.merchant = this.getCoalitionPortrait(Person.Merchant, merchants);
		coalitionFlag.merchant.x = (coalitionFlag.width)/2;
		coalitionFlag.merchant.y = coalitionFlag.bureaucrat.y + (this.unitHeight + this.verticalPad);
		coalitionFlag.merchant.toolTip.y = (coalitionFlag.y + coalitionFlag.merchant.y);
		coalitionFlag.addChild(coalitionFlag.merchant);

		coalitionFlag.military = this.getCoalitionPortrait(Person.Military, militaries);
		coalitionFlag.military.x = (coalitionFlag.width)/2;
		coalitionFlag.military.y = coalitionFlag.merchant.y + (this.unitHeight + this.verticalPad);
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
		coalitionFlag.bureaucrat = this.getCoalitionPortrait(Person.Bureaucrat, bureaucrats);
		coalitionFlag.bureaucrat.x = (coalitionFlag.width)/2;
		coalitionFlag.bureaucrat.y = coalitionFlag.label.y + coalitionFlag.label.height + this.unitHeight/2 + this.verticalBorderPad;
		coalitionFlag.bureaucrat.toolTip.y = (coalitionFlag.y + coalitionFlag.bureaucrat.y);
		coalitionFlag.addChild(coalitionFlag.bureaucrat);

		coalitionFlag.merchant = this.getCoalitionPortrait(Person.Merchant, merchants);
		coalitionFlag.merchant.x = (coalitionFlag.width)/2;
		coalitionFlag.merchant.y = coalitionFlag.bureaucrat.y + (this.unitHeight + this.verticalPad);
		coalitionFlag.merchant.toolTip.y = (coalitionFlag.y + coalitionFlag.merchant.y);
		coalitionFlag.addChild(coalitionFlag.merchant);

		coalitionFlag.military = this.getCoalitionPortrait(Person.Military, militaries);
		coalitionFlag.military.x = (coalitionFlag.width)/2;
		coalitionFlag.military.y = coalitionFlag.merchant.y + (this.unitHeight + this.verticalPad);
		coalitionFlag.military.toolTip.y = (coalitionFlag.y + coalitionFlag.military.y);
		coalitionFlag.addChild(coalitionFlag.military);
	},

	getCoalitionPortrait: function(coalitionType, coalitionList) {
		var portraitString;

		if (coalitionList.length != 0) {
			var minister = coalitionList[0];

			var button = MainGame.game.make.button(0, 0, 'frameBorder', function() {CoalitionFlag.showMinisterContract(minister);}, 2, 1, 0, 2);
			button.anchor.setTo(.5,.5);
			button.picture = MainGame.game.make.sprite(0, 0, minister.getPortTexString());
			button.picture.anchor.setTo(.5,.5);
			button.addChild(button.picture);
			button.scale.setTo(this.scale);

			ToolTip.addTipTo(button, 1, minister.name, (button.x + button.width)*this.scale, 0);
			return button;
		} else {
			var sprite = MainGame.game.make.button(0, 0, 'frameBorder', function() {
				Clipboard.createNew(Clipboard.minister);
			}, 2, 1, 0, 2);
			sprite.anchor.setTo(.5,.5);
			sprite.scale.setTo(this.scale);
			
			ToolTip.addTipTo(sprite, 1, 'Hire a Minister', (sprite.x + sprite.width)*this.scale, 0);
			return sprite;
		}
	},

	showMinisterContract: function(minister) {
		DoubleFolder.createNew(minister,false);
	},
};

var HireMinisterClipboard ={
    header1:	{ font: "32px myKaiti", fill:"black", shadowBlur: 1, shadowColor: "rgba(0,0,0,.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
    header2:	{ font: "28px myKaiti", fill:"black", shadowBlur: 0, shadowColor: "rgba(0,0,0,.55)", shadowOffsetX: 1, shadowOffsetY: 1 },
    header3:	{ font: "22px myKaiti", fill:"black", shadowBlur: 0, shadowColor: "rgba(0,0,0,.55)", shadowOffsetX: 1, shadowOffsetY: 1 },
    body1:		{ font: "18px myKaiti", fill:"black", align: 'left'},
    body2:		{ font: "18px myKaiti", fill:"black", align: 'center'},
    listText:	{ font: "20px myKaiti", fill:"black", shadowBlur: 0, shadowColor: "rgba(0,0,0,.9)", shadowOffsetX: 1, shadowOffsetY: 1 },
	
	createNew: function(){
		var clipboard = MainGame.game.make.group();

		clipboard.page = Page.createNew();
		clipboard.addChild(clipboard.page);

        clipboard.title = MainGame.game.make.text(0,-clipboard.height*11/30,'Hiring Minister',this.header1);
        clipboard.title.anchor.setTo(.5,.5);
        clipboard.addChild(clipboard.title);

        var lists = 0;

        if(MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat).length===0){
	        clipboard.burLabel = MainGame.game.make.text(-clipboard.width*2/5,-clipboard.height*(24-21*lists)/80,'Bureaucrats:',this.header3);
	        clipboard.burLabel.anchor.setTo(0,.5);
	        clipboard.addChild(clipboard.burLabel);
	        clipboard.burListView = DListView.createNew(
	            {},                  // don't need textures
	            {l:15, t:20},        // margin inside the list view
	            {w:clipboard.width*1/5, h:clipboard.height*1/5},       // size of an item
	            function(index){  }, // forwards the callback
	            true,               // not horizontal
	            110                  // priority ID
	        );
			clipboard.burItemCount = 4;
			var burPageCount=Math.ceil(MainGame.population.typeRoleList(Person.Mid,Person.Bureaucrat).length/clipboard.burItemCount);
			clipboard.burPageIndicator = DPageIndicator.createNew((clipboard.width*1/8),{x:0,y:0});
			clipboard.burPageIndicator.setModel(0,burPageCount);
			clipboard.burPageIndicator.setController(function(index){HireMinisterClipboard.setUpListView(clipboard.burListView,Person.Merchant,index,clipboard.burItemCount)},111);
			clipboard.burPageIndicator.x = clipboard.width*1/5;	clipboard.burPageIndicator.y = -clipboard.height*(24-21*lists)/80;
			clipboard.burPageIndicator.pageText.setStyle(this.listText);
			clipboard.burPageIndicator.visible = (burPageCount > 1);
			clipboard.addChild(clipboard.burPageIndicator);

	        this.setUpListView(clipboard.burListView,Person.Bureaucrat,0,clipboard.burItemCount);
	        clipboard.burListView.x = -clipboard.width*15/40;
	        clipboard.burListView.y = -clipboard.height*(24-21*lists)/80;
	        clipboard.addChild(clipboard.burListView);

	        ++lists;
        }

        if(MainGame.population.typeRoleList(Person.Hi, Person.Merchant).length===0){
	        clipboard.comLabel = MainGame.game.make.text(-clipboard.width*2/5,-clipboard.height*(24-21*lists)/80,'Financiers:',this.header3);
	        clipboard.comLabel.anchor.setTo(0,.5);
	        clipboard.addChild(clipboard.comLabel);

	        clipboard.comListView = DListView.createNew(
	            {},                  // don't need textures
	            {l:15, t:20},        // margin inside the list view
	            {w:clipboard.width*1/5, h:clipboard.height*1/5},       // size of an item
	            function(index){  }, // forwards the callback
	            true,               // not horizontal
	            110                  // priority ID
	        );
			clipboard.comItemCount = 4;
			var comPageCount=Math.ceil(MainGame.population.typeRoleList(Person.Mid,Person.Merchant).length/clipboard.comItemCount);
			clipboard.comPageIndicator = DPageIndicator.createNew((clipboard.width*1/8),{x:0,y:0});
			clipboard.comPageIndicator.setModel(0,comPageCount);
			clipboard.comPageIndicator.setController(function(index){HireMinisterClipboard.setUpListView(clipboard.comListView,Person.Merchant,index,clipboard.comItemCount)},111);
			clipboard.comPageIndicator.x = clipboard.width*1/5;	clipboard.comPageIndicator.y = -clipboard.height*(24-21*lists)/80;
			clipboard.comPageIndicator.pageText.setStyle(this.listText);
			clipboard.comPageIndicator.visible = (comPageCount > 1);
			clipboard.addChild(clipboard.comPageIndicator);

	        this.setUpListView(clipboard.comListView,Person.Merchant,0,clipboard.comItemCount);
	        clipboard.comListView.x = -clipboard.width*15/40;
	        clipboard.comListView.y = -clipboard.height*(24-21*lists)/80;
	        clipboard.addChild(clipboard.comListView);

	        ++lists;
    	}

        if(MainGame.population.typeRoleList(Person.Hi, Person.Military).length===0){
	        clipboard.milLabel = MainGame.game.make.text(-clipboard.width*2/5,-clipboard.height*(24-21*lists)/80,'Military Officers:',this.header3);
	        clipboard.milLabel.anchor.setTo(0,.5);
	        clipboard.addChild(clipboard.milLabel);

	        clipboard.milListView = DListView.createNew(
	            {},                  // don't need textures
	            {l:15, t:20},        // margin inside the list view
	            {w:clipboard.width*1/5, h:clipboard.height*1/5},       // size of an item
	            function(index){  }, // forwards the callback
	            true,               // not horizontal
	            110                  // priority ID
	        );
			clipboard.milItemCount = 4;
			var milPageCount=Math.ceil(MainGame.population.typeRoleList(Person.Mid,Person.Military).length/clipboard.milItemCount);
			clipboard.milPageIndicator = DPageIndicator.createNew((clipboard.width*1/8),{x:0,y:0});
			clipboard.milPageIndicator.setModel(0,milPageCount);
			clipboard.milPageIndicator.setController(function(index){HireMinisterClipboard.setUpListView(clipboard.milListView,Person.Military,index,clipboard.milItemCount)},111);
			clipboard.milPageIndicator.x = clipboard.width*1/5;	clipboard.milPageIndicator.y = -clipboard.height*(24-21*lists)/80;
			clipboard.milPageIndicator.pageText.setStyle(this.listText);
			clipboard.milPageIndicator.visible = (milPageCount > 1);
			clipboard.addChild(clipboard.milPageIndicator);

	        this.setUpListView(clipboard.milListView,Person.Military,0,clipboard.milItemCount);

	        clipboard.milListView.x = -clipboard.width*15/40;
	        clipboard.milListView.y = -clipboard.height*(24-21*lists)/80;
	        clipboard.addChild(clipboard.milListView);
	    }

        clipboard.rightSide = null;

		return clipboard;
	},

	makeEntry: function(listView, person){
		var entrySprite = MainGame.game.make.sprite(0,0);

		var back = MainGame.game.make.graphics();
		back.lineStyle(0);
		back.beginFill(0x000000,1);
		back.drawRect(0,0,listView.itemSize.w,listView.itemSize.h);
		back.endFill();
		entrySprite.back = MainGame.game.make.sprite(-listView.itemSize.w, 0, back.generateTexture());
		entrySprite.back.alpha = 0;
		entrySprite.back.inputEnabled = true;
		entrySprite.back.input.priorityID=120;
		entrySprite.addChild(entrySprite.back);
		entrySprite.back.events.onInputUp.add(function(){HireMinisterClipboard.openDossier(listView.parent,person);})
        entrySprite.back.events.onInputUp.add(function(){entrySprite.back.alpha = .25;});
        entrySprite.back.events.onInputDown.add(function(){entrySprite.back.alpha = .5;});
        entrySprite.back.events.onInputOver.add(function(){entrySprite.back.alpha = .25;});
        entrySprite.back.events.onInputOut.add(function(){entrySprite.back.alpha = 0;});

		entrySprite.photo = MainGame.game.make.button(-listView.itemSize.w/2, listView.itemSize.h*11/40, 'photographBorder',
			function(){},entrySprite.photo,1,0,2,1);
		entrySprite.photo.anchor.setTo(.5,.5);
		entrySprite.photo.inputEnabled = false;
		entrySprite.addChild(entrySprite.photo);

		entrySprite.portrait = MainGame.game.make.sprite(0,0, person.getPortTexString());
		entrySprite.portrait.anchor.setTo(.5,(40/66));
		entrySprite.photo.addChild(entrySprite.portrait);
		entrySprite.photo.scale.setTo(.8,.8);
		
		entrySprite.person = MainGame.game.make.text(-listView.itemSize.w/2, listView.itemSize.h*31/40, person.name.replace(' ','\n'), this.body2);
		entrySprite.person.anchor.setTo(.5,.5);
		entrySprite.addChild(entrySprite.person);

		return entrySprite;
	},

	setUpListView: function(listView, role, pageIndex, itemCount){
		listView.removeAll();

		var socialElite = MainGame.population.typeRoleList(Person.Mid,role);
		var startIndex = pageIndex*itemCount;
		var endIndex = Math.min(startIndex+itemCount,socialElite.length);
		for(var i = startIndex; i < endIndex; ++i)
			listView.add(HireMinisterClipboard.makeEntry(listView,socialElite[i]));
	},

    openDossier: function(menu,person){
    	if(menu.rightSide===null)
    		menu.rightSide = SingleFolder.createNew(person,false);
    	else if(menu.rightSide.person !== person)
    		menu.rightSide.swapPages(person);
	},
};