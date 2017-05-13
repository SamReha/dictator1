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
                Binder.createNew(Binder.building,0);
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

	createNew: function(type,activeTab,building) {
		var binder = MainGame.game.add.sprite(0,0,(type===Binder.global?'global_binder_texture':'building_binder_texture'));
		binder.anchor.setTo(.5,.5);
		binder.x = MainGame.game.width/4; binder.y = MainGame.game.height/2;

        binder.type = type;

        binder.binderGroup = MainGame.game.make.group();
        binder.addChild(binder.binderGroup);
		binder.tabs = [];
		var tabNumber = 5;
		if(binder.type === Binder.building){
        	binder.building = building;
			if(binder.building === "palace")
				tabNumber = 1;
			else if(binder.building === "armyBase" || binder.building === "hospital" || binder.building === "prison")
				tabNumber = 4;
			else
				tabNumber = 3;
		}
		function newTab(tab){return function(){binder.changeTabs(tab);};}
		for(var i = 0; i < tabNumber; ++i){
			binder.tabs.push(MainGame.game.make.button(0,0,'binder_tab_'+(i+1),
				(newTab(i)),
				binder,1,0,2,2));
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
		binder.activeTab = tabIndex;
		for(var i = binder.tabs.length-1; i >= 0; --i){
			if(tabIndex-i >= 0){
				binder.tabs[tabIndex-i].bringToTop();
				binder.tabs[tabIndex-i].input.priorityID = 100 - i;
			}
			if(tabIndex+i < binder.tabs.length){
				binder.tabs[tabIndex+i].bringToTop();
				binder.tabs[tabIndex+i].input.priorityID = 100 - i;
			}
		}

		binder.page.destroy();
		//binder.page.forEach(function(e){e.kill();});
		// binder.page = TestPage.createNew();

		/* global BuildingDetail */
		switch(tabIndex){
			case 0:
				binder.page = (binder.type===Binder.global?YearView.createNew():BuildingDetail.createNew());
				//binder.page = TestPage.createNew();
				break;
			case 1:
				binder.page = (binder.type===Binder.global?FinanceView.createNew():BuildingDetail.createNew());
				//binder.page = TestPage.createNew();
				break;
			case 2:
				//repalce PeopleView with new population view
				//binder.page = (binder.type===Binder.global?PeopleView.createNew():BuildingDetail.createNew());
				binder.page = TestPage.createNew();
				break;
			case 3:
				//replace PeopleView with new social elite view
				//binder.page = (binder.type===Binder.global?PeopleView.createNew():BuildingDetail.createNew());
				binder.page = TestPage.createNew();
				break;
			case 4:
				//replace PeopleView with new working class view
				//binder.page = PeopleView.createNew();
				binder.page = TestPage.createNew();
				break;
			default:
				binder.page = (binder.type===Binder.global?YearView.createNew():BuildingDetail.createNew());
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
	worker: "workerList",
	elite: "eliteList",
	minister: "ministerList",
	building: "buildingList",
	account: "privateAccount", 

	createNew: function(type) {
		var clipboard = MainGame.game.add.sprite(0,0,'clipboard_menu_texture');
		clipboard.anchor.setTo(.5,.5);
		clipboard.x = MainGame.game.width*3/4; clipboard.y = MainGame.game.height/2;

		clipboard.page = TestPage.createNew();
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

		if(!MenuController.menuOpen){
        	/* global DUiMask */
			MenuController.uiMask = DUiMask.createNew();
			MenuController.uiMask.setController(2, function() {
				MenuController.uiMask.destroy();
				MenuController.closeSfx.play();
				MenuController.closeAllMenus();
        	});

        	MenuController.closeSfx = game.make.audio('message_close');

        	MenuController.menuOpen = true;

		} else {
			var curMenuType = MenuController.currentMenu.pop();
			var curMenu = null;

			if(curMenuType === "mid"){
				MenuController.currentMenu.push(curMenuType);

				curMenu = MenuController.midMenusOpen.pop();
				MenuController.exitSlideTopOrBot(curMenu,1);
				MenuController.midMenusOpen.push(curMenu);
			}
			if(curMenuType.includes("left")){
				MenuController.currentMenu.push(curMenuType);

				curMenu = MenuController.leftMenusOpen.pop();
				if(side === "right")
					MenuController.shiftSlideToSide(curMenu,-1);
				else
					MenuController.exitSlideToSide(curMenu,-1);
				MenuController.leftMenusOpen.push(curMenu);
			}
			if(curMenuType.includes("right")){
				MenuController.currentMenu.push(curMenuType);

				curMenu = MenuController.rightMenusOpen.pop();
				if(side === "left")
					MenuController.shiftSlideToSide(curMenu,1);
				else
					MenuController.exitSlideToSide(curMenu,1);
				MenuController.rightMenusOpen.push(curMenu);
			}
		}

		if(side === "left"){
			if(curMenuType === "right" || curMenuType === "leftright"){
				MenuController.enterFallFromAbove(menu,-1);
				MenuController.currentMenu.pop();
				MenuController.currentMenu.push("leftright");
			}else{
				MenuController.enterFallFromAbove(menu,0);
				MenuController.currentMenu.push("left");
			}
			MenuController.leftMenusOpen.push(menu);
		} else if(side === "right"){
			if(curMenuType === "left" || curMenuType === "leftright"){
				MenuController.enterFallFromAbove(menu,1);
				MenuController.currentMenu.pop();
				MenuController.currentMenu.push("leftright");
			}else{
				MenuController.enterFallFromAbove(menu,0);
				MenuController.currentMenu.push("right");
			}
			MenuController.rightMenusOpen.push(menu);
		} else{
			MenuController.currentMenu.push("mid");
			MenuController.enterFallFromAbove(menu,0);
			MenuController.midMenusOpen.push(menu);
		}
	},

	// side - string {left, right, leftright}
	closeCurMenu: function(side){
		var curMenuType = MenuController.currentMenu.pop();
		var curMenu = null;

		if(curMenuType === "leftright"){
			if(side.includes("left"))
				MenuController.exitSlideTopOrBot(MenuController.leftMenusOpen.pop(),-1);
			if(side.includes("right"))
				MenuController.exitSlideTopOrBot(MenuController.rightMenusOpen.pop(),-1);
		}else{
			if(side === "left")
				MenuController.exitSlideToSide(MenuController.leftMenusOpen.pop(),-1);
			else if(side === "right")
				MenuController.exitSlideToSide(MenuController.rightMenusOpen.pop(),1);
			else
				MenuController.exitSlideTopOrBot(MenuController.midMenusOpen.pop(),-1);
		}

		if(currentMenu.length > 0){
			curMenuType = MenuController.currentMenu.pop();
			MenuController.currentMenu.push(curMenuType);

			if(curMenuType === "mid"){
				curMenu = MenuController.midMenusOpen.pop();
				MenuController.enterFallFromAbove(curMenu, 0);
				MenuController.midMenusOpen.push(curMenu);
			}else{
				if(curMenuType.includes("left")){
					curMenu = MenuController.leftMenusOpen.pop();
					MenuController.enterFallFromAbove(curMenu, (curMenuType.includes("right")?-1:0));
					MenuController.leftMenusOpen.push(curMenu);
				}
				if(curMenuType.includes("right")){
					curMenu = MenuController.rightMenusOpen.pop();
					MenuController.enterFallFromAbove(curMenu, (curMenuType.includes("left")?1:0));
					MenuController.rightMenusOpen.push(curMenu);
				}
			}
		}else{
			MenuController.uiMask.destroy();
			MenuController.closeSfx.play();
		}
	},

	closeAllMenus: function(){
		for(var i = 0; i < MenuController.leftMenusOpen.length; ++i)
			MenuController.leftMenusOpen[i].destroy();
		for(var i = 0; i < MenuController.rightMenusOpen.length; ++i)
			MenuController.rightMenusOpen[i].destroy();
		for(var i = 0; i < MenuController.midMenusOpen.length; ++i)
			MenuController.midMenusOpen[i].destroy();
		
		MenuController.leftMenusOpen = [];
		MenuController.rightMenusOpen = [];
		MenuController.midMenusOpen = [];
		MenuController.currentMenu = [];
		MenuController.menuOpen = false;
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

	sqrtEaseFunction: function(num){return (Math.sqrt(Math.abs(2*num[2]-1))*((2*num[2]-1)/Math.abs(2*num[2]-1)));}
};