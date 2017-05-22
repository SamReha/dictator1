// An empty sheet of paper that can be used as a background / holder for other menus
var Page = {
    margin: {x: 20, y: 20},  // How far away do we need to be from the edges (in pixels) to avoid drawing over artistic embellishments

    createNew: function() {
        var page = MainGame.game.make.sprite(0, 0, 'page_texture');
        page.inputEnabled = true;
        page.input.priorityID = 5; // Probably a reasonable default value -Sam

        page.scale.setTo((Math.random()<.5?-1:1),(Math.random()<.5?-1:1));

        return page;
    },
};

var TestPage = {
	createNew: function(){
		var page = MainGame.game.make.group();

		page.paper = Page.createNew();
		page.paper.anchor.setTo(.5,.5);
		page.addChild(page.paper);
        // Menu test buttons
        page.singleFolderButton = MainGame.game.make.button(0,0,'small_generic_button',
            function(){
                SingleFolder.createNew();
            }, MainGame, 1, 0, 2, 2);
        page.singleFolderButton.input.priorityID = 100;
        page.addChild(page.singleFolderButton);

        page.doubleFolderButton = MainGame.game.make.button(0,page.singleFolderButton.y + page.singleFolderButton.height,'small_generic_button',
            function(){
                DoubleFolder.createNew();
            }, MainGame, 1, 0, 2, 2);
        page.doubleFolderButton.input.priorityID = 100;
        page.addChild(page.doubleFolderButton);

        page.globalBinderButton = MainGame.game.make.button(0,page.doubleFolderButton.y + page.doubleFolderButton.height,'small_generic_button',
            function(){
                Binder.createNew(Binder.global,0);
            }, MainGame, 1, 0, 2, 2);
        page.globalBinderButton.input.priorityID = 100;
        page.addChild(page.globalBinderButton);

        page.buildingBinderButton = MainGame.game.make.button(0,page.globalBinderButton.y + page.globalBinderButton.height,'small_generic_button',
            function(){
                Binder.createNew(Binder.building,0,MainGame.board.findBuilding("mansion",null,null,null)[0]);
            }, MainGame, 1, 0, 2, 2);
        page.buildingBinderButton.input.priorityID = 100;
        page.addChild(page.buildingBinderButton);

        page.clipboardBinderButton = MainGame.game.make.button(0,page.buildingBinderButton.y + page.buildingBinderButton.height,'small_generic_button',
            function(){
                Clipboard.createNew();
            }, MainGame, 1, 0, 2, 2);
        page.clipboardBinderButton.input.priorityID = 100;
        page.addChild(page.clipboardBinderButton);

        return page;
    }
};

var SingleFolder = {
	createNew: function(person) {
		var folder = MainGame.game.add.sprite(0,0,'single_folder_texture');
		folder.anchor.setTo(.5,.5);
		folder.x = MainGame.game.width*3/4; folder.y = MainGame.game.height/2;
		
		folder.tab = MainGame.game.make.sprite(0,0,'folder_tab_texture');
		folder.addChild(folder.tab);
		folder.tab.x = folder.width/2; folder.tab.y = -folder.height/2;
		folder.shufflingPages = [];
		for(var i = 0; i < 3; ++i){
			folder.shufflingPages.push(Page.createNew());
			folder.shufflingPages[i].anchor.setTo(.5,.5);
			folder.addChild(folder.shufflingPages[i]);
		}

		folder.page = TestPage.createNew();
		folder.addChild(folder.page);
		//folder.page.anchor.setTo(.5,.5);

		MenuController.openMenu(folder,"right");

		folder.transferDossier = function(){SingleFolder.transferDossier(folder)};

		return folder;
	},

	transferDossier: function(folder){
		var contractMenu = DoubleFolder.createNew(true);
		folder.removeChild(folder.page);
		contractMenu.rightPage = folder.page;
		contractMenu.addChild(contractMenu.rightPage);
	},
};

var DoubleFolder = {
	createNew: function(newMinister) {
		var folder = MainGame.game.add.sprite(0,0,'double_folder_texture');
		folder.anchor.setTo(.5,.5);
		folder.x = MainGame.game.width/2; folder.y = MainGame.game.height/2;

		folder.tab = MainGame.game.make.sprite(0,0,'folder_tab_texture');
		folder.addChild(folder.tab);
		folder.tab.x = folder.width/2; folder.tab.y = -folder.height/2;

		folder.leftPage = TestPage.createNew();
		folder.addChild(folder.leftPage);
		//folder.leftPage.anchor.setTo(.5,.5);
		folder.leftPage.x = -folder.width / 4;
		folder.rightPage = TestPage.createNew();
		folder.addChild(folder.rightPage);
		//folder.rightPage.anchor.setTo(.5,.5);
		folder.rightPage.x = folder.width / 4;

		MenuController.openMenu(folder,"mid");

		return folder;
	},
};

var Binder = {
	global: "globalStats",
	building: "buildingDetail",

	createNew: function(type,activeTab,bdIndex) {
		var binder = MainGame.game.add.sprite(0,0,(type===Binder.global?'global_binder_texture':'building_binder_texture'));
		binder.anchor.setTo(.5,.5);
		binder.x = MainGame.game.width/4; binder.y = MainGame.game.height/2;

        binder.type = type;

        binder.binderGroup = MainGame.game.make.group();
        binder.addChild(binder.binderGroup);
		binder.tabs = [];
		var tabNumber = 5;
		if(binder.type === Binder.building){
        	binder.bdIndex = bdIndex;
        	binder.bdName = MainGame.board.at(binder.bdIndex).getBuilding().name;
			if(binder.bdName === "palace")
				tabNumber = 1;
			else if(binder.bdName === "armyBase" || binder.bdName === "hospital" || binder.bdName === "prison")
				tabNumber = 4;
			else
				tabNumber = 3;
		}
		function newTab(tab){return function(){binder.changeTabs(tab);};}
		for(var i = 0; i < tabNumber; ++i){
			binder.tabs.push(MainGame.game.make.button(0,0,'binder_tab_'+(i+1),
				(newTab(i)),
				binder,1,0,2,2));
			binder.tabs[i].scale.setTo(1.25,1.25);
			binder.tabs[i].input.priorityID = 100;
			binder.binderGroup.addChild(binder.tabs[i]);
			binder.tabs[i].anchor.x = 1;
			binder.tabs[i].x = -binder.width*9/25; binder.tabs[i].y = i*binder.tabs[i].height*18/25-binder.height*2/5;

		}
		binder.activeTab = null;

		binder.page = TestPage.createNew();
		binder.binderGroup.addChild(binder.page);
		//binder.page.anchor.setTo(.5,.5);
		binder.page.x = binder.width/25;

		binder.rings = [];
		for(var i = 0; i < 3; ++i){
			binder.rings.push(MainGame.game.make.sprite(0,0,'binder_menu_ring'));
			binder.binderGroup.addChild(binder.rings[i]);
			binder.rings[i].anchor.y = .5;
			binder.rings[i].x = binder.width*39/100; binder.rings[i].y = binder.height*(i-1)/3;
		}

		binder.changeTabs = function(tabIndex){Binder.changeTabs(binder,tabIndex)};

		binder.changeTabs(activeTab);

		MenuController.openMenu(binder,"left");

		return binder;
	},

	changeTabs: function(binder,tabIndex){
		if(tabIndex === binder.activeTab)
			return;
		if(binder.activeTab !== null)
			var maxX = binder.tabs[binder.activeTab].x;
		else
			var maxX = binder.tabs[0].x;
		binder.activeTab = tabIndex;
		for(var i = binder.tabs.length-1; i >= 0; --i){
			if(tabIndex-i >= 0){
				binder.tabs[tabIndex-i].x = maxX + binder.tabs[tabIndex-i].width*i/10;
				binder.tabs[tabIndex-i].bringToTop();
				binder.tabs[tabIndex-i].input.priorityID = 100 - i;
			}
			if(tabIndex+i < binder.tabs.length){
				binder.tabs[tabIndex+i].x = maxX + binder.tabs[tabIndex+i].width*i/10;
				binder.tabs[tabIndex+i].bringToTop();
				binder.tabs[tabIndex+i].input.priorityID = 100 - i;
			}
		}

		if(binder.type === Binder.building)
			var bdInfo = binder.page.bdInfo;

		binder.page.destroy();
		//binder.page.forEach(function(e){e.kill();});
		// binder.page = TestPage.createNew();

		/* global BuildingDetail */
		switch(tabIndex){
			case 0:
				binder.page = (binder.type===Binder.global?YearView.createNew():BDOverView.createNew(binder.bdIndex,bdInfo));
				//binder.page = TestPage.createNew();
				break;
			case 1:
				binder.page = (binder.type===Binder.global?FinanceView.createNew():BDOccupants.createNew(binder.bdIndex,bdInfo));
				//binder.page = TestPage.createNew();
				break;
			case 2:
				//repalce PeopleView with new population view
				binder.page = (binder.type===Binder.global?TestPage.createNew():BDOutput.createNew(binder.bdIndex,bdInfo));
				// binder.page = TestPage.createNew();
				break;
			case 3:
				//replace PeopleView with new social elite view
				binder.page = (binder.type===Binder.global?TestPage.createNew():BDMisc.createNew(binder.bdIndex,bdInfo));
				// binder.page = TestPage.createNew();
				break;
			case 4:
				//replace PeopleView with new working class view
				//binder.page = PeopleView.createNew();
				binder.page = TestPage.createNew();
				break;
			default:
				binder.page = (binder.type===Binder.global?YearView.createNew():BDOverView.createNew(binder.bdIndex,bdInfo));
				break;
		}
		binder.binderGroup.addChild(binder.page);
		//binder.page.anchor.setTo(.5,.5);
		binder.page.x = binder.width/25;

		for(var i = 0; i < 3; ++i){
			binder.rings[i].bringToTop();
		}
	}
};

var Clipboard = {
	transfer: "transfer",
	worker: "workerList",
	elite: "eliteList",
	minister: "ministerList",
	building: "buildingList",
	account: "privateAccount", 

	createNew: function(type) {
		var clipboard = MainGame.game.add.sprite(0,0,'clipboard_menu_texture');
		clipboard.anchor.setTo(.5,.5);
		clipboard.x = MainGame.game.width*3/4; clipboard.y = MainGame.game.height/2;

		switch(type){
			case Clipboard.transfer:
				clipboard.page = transferClipboard.createNew();
				break;
			case Clipboard.worker:
				clipboard.page = TestPage.createNew();
				break;
			case Clipboard.elite:
				clipboard.page = TestPage.createNew();
				break;
			case Clipboard.minister:
				clipboard.page = TestPage.createNew();
				break;
			case Clipboard.building:
				clipboard.page = TestPage.createNew();
				break;
			case Clipboard.account:
				clipboard.page = PrivateAccountView.createNew();
				break;
			default:
				clipboard.page = TestPage.createNew();
				break;
		}
		clipboard.addChild(clipboard.page);
		//clipboard.page.anchor.setTo(.5,.5);

		clipboard.clip = MainGame.game.make.sprite(0,0,'clipboard_menu_clip');
		clipboard.addChild(clipboard.clip);
		clipboard.clip.anchor.setTo(.5,.5);
		clipboard.clip.y = -clipboard.height*7/15;

		MenuController.openMenu(clipboard,"right");

		return clipboard;
	}
};

var MenuController = {
	menuOpen: false,	// bool
	currentMenu: [],	// stack of strings {left, right, leftright, mid}
	leftMenusOpen: [],	// stack of menus
	rightMenusOpen: [],	// stack of menus
	midMenusOpen: [],	// stack of menus
	uiMask: null,		// single UI mask for entire menu system
	closeSfx: null,		// sound effect for UI mask

	openMenu: function(menu, side){
		menu.inputEnabled = true;
		menu.input.priorityID = 4;

		if(!this.menuOpen){
        	/* global DUiMask */
			this.uiMask = DUiMask.createNew();
			this.uiMask.setController(2, function() {
				MenuController.closeSfx.play();
				MenuController.closeAllMenus();
        	});

        	this.closeSfx = game.make.audio('message_close');

        	this.menuOpen = true;

		} else {
			var curMenuType = this.currentMenu.pop();
			var curMenu = null;

			if(curMenuType === "mid"){
				this.currentMenu.push(curMenuType);

				curMenu = this.midMenusOpen.pop();
				this.exitSlideTopOrBot(curMenu,1);
				this.midMenusOpen.push(curMenu);
			}
			if(curMenuType.includes("left")){
				this.currentMenu.push(curMenuType);

				curMenu = this.leftMenusOpen.pop();
				if(side === "right")
					this.shiftSlideToSide(curMenu,-1);
				else
					this.exitSlideToSide(curMenu,-1);
				this.leftMenusOpen.push(curMenu);
			}
			if(curMenuType.includes("right")){
				this.currentMenu.push(curMenuType);

				curMenu = this.rightMenusOpen.pop();
				if(side === "left")
					this.shiftSlideToSide(curMenu,1);
				else
					this.exitSlideToSide(curMenu,1);
				this.rightMenusOpen.push(curMenu);
			}
		}

		if(side === "left"){
			if(curMenuType === "right" || curMenuType === "leftright"){
				this.enterFallFromAbove(menu,-1);
				this.currentMenu.pop();
				this.currentMenu.push("leftright");
			}else{
				this.enterFallFromAbove(menu,0);
				this.currentMenu.push("left");
			}
			this.leftMenusOpen.push(menu);
		} else if(side === "right"){
			if(curMenuType === "left" || curMenuType === "leftright"){
				this.enterFallFromAbove(menu,1);
				this.currentMenu.pop();
				this.currentMenu.push("leftright");
			}else{
				this.enterFallFromAbove(menu,0);
				this.currentMenu.push("right");
			}
			this.rightMenusOpen.push(menu);
		} else{
			this.currentMenu.push("mid");
			this.enterFallFromAbove(menu,0);
			this.midMenusOpen.push(menu);
		}
	},

	// side - string {left, right, leftright}
	closeCurMenu: function(side){
		var curMenuType = this.currentMenu.pop();
		var curMenu = null;

		if(curMenuType === "leftright"){
			if(side.includes("left"))
				this.exitSlideTopOrBot(this.leftMenusOpen.pop(),-1);
			if(side.includes("right"))
				this.exitSlideTopOrBot(this.rightMenusOpen.pop(),-1);
		}else{
			if(side === "left")
				this.exitSlideToSide(this.leftMenusOpen.pop(),-1);
			else if(side === "right")
				this.exitSlideToSide(this.rightMenusOpen.pop(),1);
			else
				this.exitSlideTopOrBot(this.midMenusOpen.pop(),-1);
		}

		if(currentMenu.length > 0){
			curMenuType = this.currentMenu.pop();
			this.currentMenu.push(curMenuType);

			if(curMenuType === "mid"){
				curMenu = this.midMenusOpen.pop();
				this.enterFallFromAbove(curMenu, 0);
				this.midMenusOpen.push(curMenu);
			}else{
				if(curMenuType.includes("left")){
					curMenu = this.leftMenusOpen.pop();
					this.enterFallFromAbove(curMenu, (curMenuType.includes("right")?-1:0));
					this.leftMenusOpen.push(curMenu);
				}
				if(curMenuType.includes("right")){
					curMenu = this.rightMenusOpen.pop();
					this.enterFallFromAbove(curMenu, (curMenuType.includes("left")?1:0));
					this.rightMenusOpen.push(curMenu);
				}
			}
		}else{
			this.uiMask.destroy();
			this.closeSfx.play();
		}
	},

	closeAllMenus: function(){
		MenuController.uiMask.destroy();
		
		for(var i = 0; i < this.leftMenusOpen.length; ++i)
			this.leftMenusOpen[i].destroy();
		for(var i = 0; i < this.rightMenusOpen.length; ++i)
			this.rightMenusOpen[i].destroy();
		for(var i = 0; i < this.midMenusOpen.length; ++i)
			this.midMenusOpen[i].destroy();
		
		this.leftMenusOpen = [];
		this.rightMenusOpen = [];
		this.midMenusOpen = [];
		this.currentMenu = [];
		this.menuOpen = false;
	},

	enterFallFromAbove: function(menu, side){
		var targetAlpha = menu.alpha; menu.alpha = 0;
		var targetY = menu.y; menu.y = MainGame.game.height / 4; menu.x = MainGame.game.width*(side+2)/4;
		var targetScale = {x:menu.scale.x,y:menu.scale.y}; menu.scale.setTo(2,2);

		var entrance1 = MainGame.game.add.tween(menu).to({alpha:targetAlpha},250,Phaser.Easing.Cubic.In,true);
		var entrance2 = MainGame.game.add.tween(menu).to({y:targetY},400,Phaser.Easing.Back.Out,true);
		var entrance3 = MainGame.game.add.tween(menu.scale).to({x:targetScale.x,y:targetScale.y},250,Phaser.Easing.Quadratic.In,true);
	},

	enterSlideFromSide: function(menu, side){
		var targetX = MainGame.game.width*side/4; menu.x = MainGame.game.width*side;

		var entrance = MainGame.game.add.tween(menu).to({x:targetX},250,Phaser.Easing.Quadratic.Out,true);
	},

	exitSlideTopOrBot: function(menu, side){
		var targetY = MainGame.game.height*1.5*side;

		var exit = MainGame.game.add.tween(menu).to({y:targetY},250,Phaser.Easing.Quadratic.In,true);
	},

	exitSlideToSide: function(menu, side){
		var targetX = MainGame.game.width*1.5*side;

		var exit = MainGame.game.add.tween(menu).to({x:targetX},250,Phaser.Easing.Quadratic.In,true);
	},

	shiftSlideToSide: function(menu, side){
		var targetX = MainGame.game.width*(side+2)/4;

		var shift = MainGame.game.add.tween(menu).to({x:targetX},500,Phaser.Easing.Quadratic.InOut,true);
	},

	shiftLiftAndLower: function(menu){
		console.log(menu);
		var targetY1 = MainGame.game.height/4; var targetY2 = menu.y;
		var targetScale1 = 2; var targetScale2 = menu.scale;

		var shifty1 = MainGame.game.add.tween(menu).to({y:targetY1},250,Phaser.Easing.Quadratic.InOut,true);
		var shifty2 = MainGame.game.add.tween(menu).to({y:targetY2},250,Phaser.Easing.Quadratic.InOut,false);
		var shiftscale1 = MainGame.game.add.tween(menu.scale).to({x:targetScale1,y:targetScale1},250,Phaser.Easing.Quadratic.InOut,true);
		var shiftscale2 = MainGame.game.add.tween(menu.scale).to({x:targetScale2,y:targetScale2},250,Phaser.Easing.Quadratic.InOut,false);

		shifty1.chain(shifty2);
		shiftscale1.chain(shiftscale2);
	},

	sqrtEaseFunction: function(num){return (Math.sqrt(Math.abs(2*num[2]-1))*((2*num[2]-1)/Math.abs(2*num[2]-1)));},
};

var TextButton = {
    createNew: function(x, y, sprite_sheet, callback, callback_context, up, down, over, out, text, textStyle) {
        var button = game.make.button(x, y, sprite_sheet, callback, callback_context, up, down, over, out);
        button.inputEnabled = true;
        button.input.priorityID = 10;

        button.label = game.make.text(button.width/2, button.height/2, text, textStyle);
        button.label.anchor.set(0.5, 0.5);
        button.addChild(button.label);

        return button;
    }
};

var TextLinkButton = {
	createNew: function(x, y, text, textStyle, callback, callbackContext){
		var button = MainGame.game.make.group();
		button.x = x; button.y = y;

		button.text = MainGame.game.make.text(0, 0, text, textStyle);
		button.text.anchor.setTo(.5,.5);
		button.addChild(button.text);

		var underline = MainGame.game.make.graphics(0,0);
		underline.lineStyle(2,0xffffff,1);
		underline.moveTo(0,0);
		underline.lineTo(button.text.width,0);

		button.underline = MainGame.game.make.sprite(0,0,underline.generateTexture());
		button.underline.anchor.setTo(.5,.5);
		button.addChild(button.underline);
		button.underline.y = button.text.height*7/20;
		button.underline.tint = 0x000000;

		var back = MainGame.game.make.graphics(0,0);
		back.beginFill(0x000000,0);
		back.drawRect(0,0,button.text.width,button.text.height);
		back.endFill();

		button.back = MainGame.game.make.sprite(0,0,back.generateTexture());
		button.back.anchor.setTo(.5,.5);
		button.addChild(button.back);
		button.back.inputEnabled = true;
		button.back.input.priorityID = 30;
		button.back.events.onInputUp.add(function(){button.underline.tint=0x000000;});
		button.back.events.onInputUp.add(callback);
		button.back.events.onInputDown.add(function(){button.underline.tint=0xffffff});
		button.back.events.onInputOver.add(function(){button.underline.tint=0x999999});
		button.back.events.onInputOut.add(function(){button.underline.tint=0x000000});

		return button;
	}
};

var TextButtonList = {
	createNew: function(){

	}
};