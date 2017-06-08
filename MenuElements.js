// An empty sheet of paper that can be used as a background / holder for other menus
var Page = {
    margin: {x: 20, y: 20},  // How far away do we need to be from the edges (in pixels) to avoid drawing over artistic embellishments

    createNew: function() {
    	var page = MainGame.game.make.group();

        page.paper = MainGame.game.make.sprite(0, 0, 'page_texture');
        page.paper.anchor.setTo(.5,.5);
        page.paper.inputEnabled = true;
        page.paper.input.priorityID = 10; // Probably a reasonable default value -Sam
        page.addChild(page.paper);

        page.paper.scale.setTo((Math.random()<.5?-1:1),(Math.random()<.5?-1:1));

        return page;
    },
};

var SingleFolder = {
	createNew: function(person,transfer) {
		var folder = MainGame.game.add.sprite(0,0,'single_folder_texture');
		folder.anchor.setTo(.5,.5);
		folder.inputEnabled = true;	folder.input.priorityID = 5;
		folder.x = MainGame.game.width*3/4; folder.y = MainGame.game.height/2;
		
		folder.tab = MainGame.game.make.sprite(0,0,'folder_tab_texture');
		folder.addChild(folder.tab);
		folder.tab.x = folder.width/2; folder.tab.y = -folder.height/2;

		folder.folderGroup = MainGame.game.make.group();
		folder.addChild(folder.folderGroup);

		folder.shufflingPages = [];
		for(var i = 0; i < 3; ++i){
			folder.shufflingPages.push(Page.createNew());
			//folder.shufflingPages[i].anchor.setTo(.5,.5);
			folder.folderGroup.addChild(folder.shufflingPages[i]);
		}
		MenuController.scatterPages(folder);

		if(!transfer){
			folder.page = Dossier.createNew(person);
			folder.folderGroup.addChild(folder.page);
			//folder.page.anchor.setTo(.5,.5);
		}

		folder.person = person;

		if(transfer)
			MenuController.openMenu(folder,"transferBack");
		else
			MenuController.openMenu(folder,"right");

		folder.transferDossier = function(p){SingleFolder.transferDossier(folder,p)};
		folder.swapPages = function(p){SingleFolder.swapPages(folder,p)}

		return folder;
	},

	transferDossier: function(folder,person){
		var contractMenu = DoubleFolder.createNew(person,true);
		folder.folderGroup.removeChild(folder.page,false);
		contractMenu.addChild(folder.page);
		contractMenu.rightPage = folder.page;
		folder.page = null;

		var targetX = contractMenu.width/4;
		contractMenu.rightPage.x+=MainGame.game.width*53/36;

		MenuController.shiftLiftAndLower(contractMenu.rightPage);
		var tween = MainGame.game.add.tween(contractMenu.rightPage).to({x:targetX},1500,Phaser.Easing.Quadratic.InOut,true);
	},

	swapPages: function(folder,person){
		var oldPage = folder.page;
		oldPage.inputSwitch(false);
		folder.folderGroup.removeChild(folder.page,false);
		folder.page = null;
		folder.folderGroup.addChild(oldPage);

		folder.page = Dossier.createNew(person);
		folder.page.inputSwitch(false);
		folder.folderGroup.addChild(folder.page);
		folder.folderGroup.sendToBack(folder.page);

		folder.person = person;

		MenuController.shuffleHalfAndBack(folder.page,'right');
		MenuController.shuffleHalfAndBack(oldPage,'left');
	},
};

var DoubleFolder = {
	createNew: function(person,transfer) {
		var folder = MainGame.game.add.sprite(0,0,'double_folder_texture');
		folder.anchor.setTo(.5,.5);
		folder.inputEnabled = true;	folder.input.priorityID = 5;
		folder.x = MainGame.game.width/2; folder.y = MainGame.game.height/2;

		folder.tab = MainGame.game.make.sprite(0,0,'folder_tab_texture');
		folder.addChild(folder.tab);
		folder.tab.x = folder.width/2; folder.tab.y = -folder.height/2;

		folder.leftPage = Contract.createNew(person);
		folder.addChild(folder.leftPage);
		//folder.leftPage.anchor.setTo(.5,.5);
		folder.leftPage.x = -folder.width / 4;
		if(!transfer){
			folder.rightPage = Dossier.createNew(person);
			folder.addChild(folder.rightPage);
			//folder.rightPage.anchor.setTo(.5,.5);
			folder.rightPage.x = folder.width / 4;
		}

		if(transfer)
			MenuController.openMenu(folder,"transferForward");
		else
			MenuController.openMenu(folder,"mid");

		folder.transferDossier = function(p){DoubleFolder.transferDossier(folder,p)};

		return folder;
	},

	transferDossier: function(folder,person){
		var dossierMenu = SingleFolder.createNew(person,true);
		folder.removeChild(folder.rightPage,false);
		dossierMenu.folderGroup.addChild(folder.rightPage);
		dossierMenu.page = folder.rightPage;
		folder.rightPage = null;

		var targetX = 0;
		dossierMenu.page.x -= MainGame.game.width*45/36;

		MenuController.shiftLiftAndLower(dossierMenu.page);
		var tween = MainGame.game.add.tween(dossierMenu.page).to({x:targetX},1500,Phaser.Easing.Quadratic.InOut,true);
	},
};

var Binder = {
	global: "globalStats",
	building: "buildingDetail",

	createNew: function(type,activeTab,bdIndex) {
		if (type === Binder.global) {
			MainGame.global.statsBinderIsOpen = true;
		}

		var binder = MainGame.game.add.sprite(0,0,(type===Binder.global?'global_binder_texture':'building_binder_texture'));
		binder.anchor.setTo(.5,.5);
		binder.inputEnabled = true;	binder.input.priorityID = 5;
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

		binder.shiftingPages = [];
		for(var i = 0; i < 3; ++i){
			binder.shiftingPages.push(Page.createNew());
			//binder.shiftingPages[i].anchor.setTo(.5,.5);
			binder.binderGroup.addChild(binder.shiftingPages[i]);
			binder.shiftingPages[i].x = binder.width/25;
		}
		MenuController.shiftBinderPages(binder);

		binder.page = Page.createNew();
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
		for(var i = 0; i < binder.shiftingPages.length; ++i)
			binder.binderGroup.bringToTop(binder.shiftingPages[i]);
		if(binder.page.rightSide!==null&&binder.page.rightSide!==undefined){
			MenuController.closeCurMenu('right');
			binder.page.rightSide = null;
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
				binder.page = (binder.type===Binder.global?PopulationMenu.createNew():BDOutput.createNew(binder.bdIndex,bdInfo,null));
				// binder.page = TestPage.createNew();
				break;
			case 3:
				//replace PeopleView with new social elite view
				binder.page = (binder.type===Binder.global?SocialEliteMenu.createNew():BDMisc.createNew(binder.bdIndex,bdInfo));
				// binder.page = TestPage.createNew();
				break;
			case 4:
				//replace PeopleView with new working class view
				//binder.page = PeopleView.createNew();
				binder.page = WorkingClassMenu.createNew();
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
	contract: "contractView",
	account: "privateAccount", 

	createNew: function(type,cbInfo) {
		var clipboard = MainGame.game.add.sprite(0,0,'clipboard_menu_texture');
		clipboard.anchor.setTo(.5,.5);
		clipboard.inputEnabled = true;	clipboard.input.priorityID = 5;
		clipboard.x = MainGame.game.width*3/4; clipboard.y = MainGame.game.height/2;

        clipboard.clipboardGroup = MainGame.game.make.group();
        clipboard.addChild(clipboard.clipboardGroup);

        clipboard.swingingPages = [];
		for(var i = 0; i < 3; ++i){
			clipboard.swingingPages.push(Page.createNew());
			//clipboard.swingingPages[i].anchor.setTo(.5,.5);
			clipboard.swingingPages[i].y = -clipboard.swingingPages[i].height*3/7;
			clipboard.swingingPages[i].pivot.y = -clipboard.swingingPages[i].height*3/7;
			clipboard.clipboardGroup.addChild(clipboard.swingingPages[i]);
		}
		MenuController.swingClippedPages(clipboard);
        
        var openOn = 'right';
		switch(type){
			case Clipboard.transfer:
				clipboard.page = TransferClipboard.createNew(cbInfo.bdInfo,cbInfo.person,cbInfo.tag);
				openOn = cbInfo.side;
				break;
			case Clipboard.worker:
				clipboard.page = TestPage.createNew();
				break;
			case Clipboard.elite:
				clipboard.page = TestPage.createNew();
				break;
			case Clipboard.minister:
				clipboard.page = HireMinisterClipboard.createNew();
				openOn = 'left';
				break;
			case Clipboard.contract:
				clipboard.page = ContractClipboard.createNew(cbInfo);
				break;
			case Clipboard.account:
				clipboard.page = PrivateAccountView.createNew();
				break;
			default:
				clipboard.page = TestPage.createNew();
				break;
		}
		clipboard.clipboardGroup.addChild(clipboard.page);
		//clipboard.page.anchor.setTo(.5,.5);

		clipboard.clip = MainGame.game.make.sprite(0,0,'clipboard_menu_clip');
		clipboard.addChild(clipboard.clip);
		clipboard.clip.anchor.setTo(.5,.5);
		clipboard.clip.y = -clipboard.height*7/15;

		MenuController.openMenu(clipboard,openOn);

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
		menu.input.priorityID = 5;

		if(!this.menuOpen){
        	/* global DUiMask */
			this.uiMask = DUiMask.createNew();
			this.uiMask.setController(2, function() {
				MenuController.closeSfx.play();
				MenuController.closeAllMenus();
        	});

        	this.closeSfx = game.make.audio('message_close');
			this.currentMenu.push(null);

        	this.menuOpen = true;

		} else if(side === "transferForward"){
			var curMenuType = "leftright";
			var curMenu = this.rightMenusOpen.pop();
			this.transferExitFromRight(curMenu);

			curMenu = this.leftMenusOpen.pop();
			this.transferExitFromLeft(curMenu);
			this.leftMenusOpen.push(curMenu);
		} else if(side === "transferBack"){
			var curMenuType = "mid";
			var curMenu = this.midMenusOpen.pop();
			this.transferExitFromMid(curMenu);
		} else {
			var curMenuType = this.currentMenu.pop();
			var curMenu = null;

			if(curMenuType === "mid"){
				this.currentMenu.push(curMenuType);

				curMenu = this.midMenusOpen.pop();
				this.exitSlideTopOrBot(curMenu,1);
				this.midMenusOpen.push(curMenu);
				curMenu.active = false;
			}
			if(curMenuType.includes("left")){
				this.currentMenu.push(curMenuType);

				curMenu = this.leftMenusOpen.pop();
				if(side === "right")
					this.shiftSlideToSide(curMenu,-1);
				else{
					this.exitSlideToSide(curMenu,-1);
					curMenu.active = false;
				}
				this.leftMenusOpen.push(curMenu);
			}
			if(curMenuType.includes("right")){
				this.currentMenu.push(curMenuType);

				curMenu = this.rightMenusOpen.pop();
				if(side === "left")
					this.shiftSlideToSide(curMenu,1);
				else{
					this.exitSlideToSide(curMenu,1);
					curMenu.active = false;
				}
				this.rightMenusOpen.push(curMenu);
			}
		}
		curMenuType = this.currentMenu.pop();
		if(side === "left"){
			if(curMenuType === "right" || curMenuType === "leftright"){
				this.enterFallFromAbove(menu,-1);
				// this.currentMenu.pop();
				this.currentMenu.push("leftright");
			}else{
				this.enterFallFromAbove(menu,0);
				this.currentMenu.push("left");
			}
			this.leftMenusOpen.push(menu);
			menu.active = true;
		} else if(side === "right"){
			if(curMenuType === "left" || curMenuType === "leftright"){
				this.enterFallFromAbove(menu,1);
				// this.currentMenu.pop();
				this.currentMenu.push("leftright");
			}else{
				this.enterFallFromAbove(menu,0);
				this.currentMenu.push("right");
			}
			this.rightMenusOpen.push(menu);
			menu.active = true;
		} else if(side === "mid"){
			this.currentMenu.push("mid");
			this.enterFallFromAbove(menu,0);
			this.midMenusOpen.push(menu);
			menu.active = true;
		} else if(side === "transferForward"){
			this.currentMenu.push("mid");
			this.transferEnterToMid(menu);
			this.midMenusOpen.push(menu);
		} else if(side === "transferBack"){
			this.currentMenu.push("leftright");
			curMenu = this.leftMenusOpen.pop();
			this.transferEnterToLeft(curMenu);
			this.leftMenusOpen.push(curMenu);
			this.transferEnterToRight(menu);
			this.rightMenusOpen.push(menu);
		}
	},

	// side - string {left, right, leftright}
	closeCurMenu: function(side){
		var curMenuType = this.currentMenu.pop();
		var curMenu = null;

		if(curMenuType === "leftright"){
			if(side.includes("left")){
				this.exitSlideToSide(this.leftMenusOpen.pop(),-1);
				curMenuType = curMenuType.replace("left","");
			}
			if(side.includes("right")){
				this.exitSlideToSide(this.rightMenusOpen.pop(),1);
				curMenuType = curMenuType.replace("right","");
			}
			if(curMenuType==="left"){
				this.currentMenu.push(curMenuType);
				curMenu = this.leftMenusOpen.pop();
				this.shiftSlideToSide(curMenu,0);
				this.leftMenusOpen.push(curMenu);
				return;
			}else if(curMenuType==="right"){
				this.currentMenu.push(curMenuType);
				curMenu = this.rightMenusOpen.pop();
				this.shiftSlideToSide(curMenu,0);
				this.rightMenusOpen.push(curMenu);
				return;
			}
		}else{
			if(side === "left")
				this.exitSlideToSide(this.leftMenusOpen.pop(),-1);
			else if(side === "right")
				this.exitSlideToSide(this.rightMenusOpen.pop(),1);
			else
				this.exitSlideTopOrBot(this.midMenusOpen.pop(),-1);
		}

		if(this.currentMenu.length > 0){
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
			this.menuOpen = false;
			this.uiMask.destroy();
			this.closeSfx.play();
		}
	},

	closeAllMenus: function(){
		MenuController.uiMask.destroy();

		if (MainGame.global.statsBinderIsOpen === true) {
			MainGame.global.statsBinderIsOpen = false;
		}
		
		for(var i = 0; i < this.leftMenusOpen.length; ++i) {
			//console.log(this.leftMenusOpen[i]);
			if (this.leftMenusOpen[i].page.ministerData) MainGame.global.ministerViewIsOpen = false;
			this.leftMenusOpen[i].destroy();
		}
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
		var targetY = menu.y; menu.y = MainGame.game.height / 4; menu.x = MainGame.game.width*(side<0?5:(side>0?13:9))/18;
		var targetScale = {x:menu.scale.x,y:menu.scale.y}; menu.scale.setTo(2,2);

		var entrance1 = MainGame.game.add.tween(menu).to({alpha:targetAlpha},250,Phaser.Easing.Cubic.In,true);
		var entrance2 = MainGame.game.add.tween(menu).to({y:targetY},400,Phaser.Easing.Back.Out,true);
		var entrance3 = MainGame.game.add.tween(menu.scale).to({x:targetScale.x,y:targetScale.y},250,Phaser.Easing.Quadratic.In,true);
	},

	scatterPages: function(menu){
		for(var i = 0; i < menu.shufflingPages.length; ++i){
			var targetX = menu.shufflingPages[i].x+MenuController.sqrtEaseFunction(Math.random())*15;
			var targetY = menu.shufflingPages[i].y+MenuController.sqrtEaseFunction(Math.random())*15;
			var targetRot = menu.shufflingPages[i].angle+MenuController.sqrtEaseFunction(Math.random())*7;
			MainGame.game.add.tween(menu.shufflingPages[i]).to({x:targetX,y:targetY,angle:targetRot},500,Phaser.Easing.Back.Out,true,300);
		}
	},

	shiftBinderPages: function(menu){
		for(var i = 0; i < menu.shiftingPages.length; ++i){
			var targetX = menu.shiftingPages[i].x+Math.abs(MenuController.sqrtEaseFunction(Math.random())*10);
			var targetY = menu.shiftingPages[i].y+MenuController.sqrtEaseFunction(Math.random())*7;
			MainGame.game.add.tween(menu.shiftingPages[i]).to({x:targetX,y:targetY},500,Phaser.Easing.Back.Out,true,300);
		}
	},

	swingClippedPages: function(menu){
		for(var i = 0; i < menu.swingingPages.length; ++i){
			var targetRot = menu.swingingPages[i].angle+MenuController.sqrtEaseFunction(Math.random())*5;
			MainGame.game.add.tween(menu.swingingPages[i]).to({angle:targetRot},500,Phaser.Easing.Back.Out,true,300);
		}
	},

	enterSlideFromSide: function(menu, side){
		var targetX = MainGame.game.width*side/4; menu.x = MainGame.game.width*side;

		var entrance = MainGame.game.add.tween(menu).to({x:targetX},250,Phaser.Easing.Quadratic.Out,true);
	},

	transferEnterToRight: function(menu){
		var targetX = MainGame.game.width*13/18;	menu.x = MainGame.game.width*63/36;
		MainGame.game.add.tween(menu).to({x:targetX},1500,Phaser.Easing.Quadratic.InOut,true);
	},

	transferEnterToLeft: function(menu){
		var targetX = MainGame.game.width*5/18;		menu.x = MainGame.game.width*47/36;
		MainGame.game.add.tween(menu).to({x:targetX},1500,Phaser.Easing.Quadratic.InOut,true);
	},

	transferEnterToMid: function(menu){
		var targetX = MainGame.game.width*1/2;	menu.x = -MainGame.game.width*3/4;
		MainGame.game.add.tween(menu).to({x:targetX},1500,Phaser.Easing.Quadratic.InOut,true);
	},

	transferExitFromRight: function(menu){
		var targetX = menu.x + MainGame.game.width*5/4;
		var tween = MainGame.game.add.tween(menu).to({x:targetX},1500,Phaser.Easing.Quadratic.InOut,true);
		tween.onComplete.add(function(){menu.destroy();});
	},

	transferExitFromLeft: function(menu){
		var targetX1 = menu.x + MainGame.game.width*5/8;
		var targetX2 = menu.x + MainGame.game.width*5/4;
		var tween1 = MainGame.game.add.tween(menu).to({x:targetX1},750,Phaser.Easing.Quadratic.In,true);
		var tween2 = MainGame.game.add.tween(menu).to({x:targetX2},750,Phaser.Easing.Quadratic.Out,false);
		tween1.chain(tween2);
	},

	transferExitFromMid: function(menu){
		var targetX = menu.x - MainGame.game.width*5/4;
		var tween = MainGame.game.add.tween(menu).to({x:targetX},1500,Phaser.Easing.Quadratic.InOut,true);
		tween.onComplete.add(function(){menu.destroy();});
	},

	exitSlideTopOrBot: function(menu, side){
		var targetY = MainGame.game.height*1.5*side;

		var exit = MainGame.game.add.tween(menu).to({y:targetY},500,Phaser.Easing.Quadratic.In,true);
	},

	exitSlideToSide: function(menu, side){
		var targetX = MainGame.game.width*1.5*side;

		var exit = MainGame.game.add.tween(menu).to({x:targetX},500,Phaser.Easing.Quadratic.In,true);
	},

	shiftSlideToSide: function(menu, side){
		var targetX = MainGame.game.width*(side<0?5:(side>0?13:9))/18;

		var shift = MainGame.game.add.tween(menu).to({x:targetX},500,Phaser.Easing.Quadratic.InOut,true);
	},

	shiftLiftAndLower: function(menu){
		var targetY1 = MainGame.game.height/8; var targetY2 = 0;
		var targetScale1 = 1.4; var targetScale2 = 1;

		var shifty1 = MainGame.game.add.tween(menu).to({y:targetY1},750,Phaser.Easing.Quadratic.In,true);
		var shifty2 = MainGame.game.add.tween(menu).to({y:targetY2},750,Phaser.Easing.Quadratic.Out,false);
		var shiftscale1 = MainGame.game.add.tween(menu.scale).to({x:targetScale1,y:targetScale1},750,Phaser.Easing.Quadratic.In,true);
		var shiftscale2 = MainGame.game.add.tween(menu.scale).to({x:targetScale2,y:targetScale2},750,Phaser.Easing.Quadratic.Out,false);

		shifty1.chain(shifty2);
		shiftscale1.chain(shiftscale2);
	},

	shuffleHalfAndBack: function(page, side){
		var targetX1 = page.width*(side==="left"?-1:1); var targetX2 = 0;

		if(page.tween!==undefined&&page.tween!==null){
			var shift1 = MainGame.game.add.tween(page).to({x:targetX1},200,Phaser.Easing.Quadratic.In,false);
			var shift2 = MainGame.game.add.tween(page).to({x:targetX2},200,Phaser.Easing.Quadratic.Out,false);
			page.tween[page.tween.length-1].chain(shift1);
			shift1.chain(shift2);

			if(side==="right"){
				shift1.onComplete.add(function(){
					page.parent.parent.folderGroup.bringToTop(folder.page);
				},page);
				shift2.onComplete.add(function(){
					page.tween = null;
					page.inputSwitch(true);
				},page);
			}else{
				shift1.onComplete.add(function(){
					page.parent.parent.folderGroup.sendToBack(page);
				},page);
				shift2.onComplete.add(function(){
					page.destroy();
				},page);
			}
			page.tween.push(shift1);
			page.tween.push(shift2);
		}else{
			page.tween = [];
			var shift1 = MainGame.game.add.tween(page).to({x:targetX1},200,Phaser.Easing.Quadratic.In,true);
			var shift2 = MainGame.game.add.tween(page).to({x:targetX2},200,Phaser.Easing.Quadratic.Out,false);
			shift1.chain(shift2);

			if(side==="right"){
				shift1.onComplete.add(function(){
					page.parent.parent.folderGroup.bringToTop(page);
				},page);
				shift2.onComplete.add(function(){
					if(page.tween[page.tween.length-1]===shift2){
						page.tween = null;
						page.inputSwitch(true);
					}
				},page);
			}else{
				shift1.onComplete.add(function(){
					page.parent.parent.folderGroup.sendToBack(page);
				},page);
				shift2.onComplete.add(function(){
					page.destroy();
				},page);
			}
			page.tween.push(shift1);
			page.tween.push(shift2);
		}
	},

	sqrtEaseFunction: function(num){return (Math.sqrt(Math.abs(2*(num)-1))*(Math.sign(2*(num)-1)));},
};

var TextButton = {
    createNew: function(x, y, sprite_sheet, callback, callback_context, up, down, over, out, text, textStyle) {
        var button = game.make.button(x, y, sprite_sheet, callback, callback_context, up, down, over, out);
        button.inputEnabled = true;
        button.input.priorityID = 100;
        button.events.onInputOver.add(function(){button.tint = 0xdddddd;});
        button.events.onInputOut.add(function(){button.tint = 0xffffff;});

        button.label = game.make.text(button.width/2, button.height/2, text, textStyle);
        button.label.anchor.set(0.5, 0.5);
        button.addChild(button.label);

        return button;
    }
};

var TextLinkButton = {
	createNew: function(x, y, text, textStyle, callback, callbackContext, lineSize){
		var button = MainGame.game.make.group();
		button.x = x; button.y = y;

		button.text = MainGame.game.make.text(0, 0, text, textStyle);
		button.text.anchor.setTo(.5,.5);
		button.addChild(button.text);

		var underline = MainGame.game.make.graphics(0,0);
		underline.lineStyle((lineSize!==null?lineSize:2),0xffffff,1);
		underline.moveTo(0,0);
		underline.lineTo(button.text.width,0);

		button.underline = MainGame.game.make.sprite(0,0,underline.generateTexture());
		button.underline.anchor.setTo(.5,.5);
		button.addChild(button.underline);
		button.underline.y = button.text.height*7/20;
		button.underline.tint = 0x000000;
		button.underline.alpha = .5;

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
		button.back.events.onInputOver.add(function(){button.underline.alpha=1});
		button.back.events.onInputOut.add(function(){button.underline.alpha=.5});

		return button;
	}
};

var TextButtonList = {
	createNew: function(){

	}
};