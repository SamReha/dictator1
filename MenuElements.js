// An empty sheet of paper that can be used as a background / holder for other menus
var Page = {
    margin: {x: 20, y: 20},  // How far away do we need to be from the edges (in pixels) to avoid drawing over artistic embellishments

    createNew: function() {
        var page = MainGame.game.add.sprite(0, 0, 'page_texture');
        page.inputEnabled = true;
        page.input.priorityID = 5; // Probably a reasonable default value -Sam

        return page;
    },
};

var SingleFolder = {
	worker: "workerDetail",
	elite: "eliteDetail",

	createNew: function(type) {
		var folder = MainGame.game.make.sprite(0,0,'single_folder_texture');
		

		folder.tab = MainGame.game.make.sprite(0.0,'folder_tab_texture');
		folder.addChild(folder.tab);

		folder.page = Page.createNew();
		folder.addChild(folder.page);

		return folder;
	},
};

var DoubleFolder = {
	createNew: function() {
		var folder = MainGame.game.make.sprite(0,0,'double_folder_texture');

		MenuController.openMenu(folder);

		folder.tab = MainGame.game.make.sprite(0.0,'folder_tab_texture');
		folder.addChild(folder.tab);

		folder.leftPage = Page.createNew();
		folder.rightPage = Page.createNew();
		folder.addChild(folder.leftPage);
		folder.addChild(folder.rightPage);

		return folder;
	},
};

var Binder = {
	global: "globalStats",
	building: "buildingDetail",

	createNew: function(type,activeTab,building) {
		var binder = MainGame.game.make.sprite(0,0,'binder_menu_texture');

		MenuController.openMenu(binder);

        binder.type = type;
        if(binder.type===Binder.building)

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
		for(var i = 0; i < (type===Binder.global?5:4); ++i){
			binder.tabs.push(MainGame.game.make.button(0,0,'binder_tab_'+(i+1),function(){
				binder.changeTabs(i);},
				binder,0,1,2,2));
			binder.addChild(binder.tabs[i]);
		}
		binder.activeTab = 0;

		binder.page = Page.createNew();
		binder.addChild(binder.page);
	},

	changeTabs: function(binder,tabIndex){
		binder.activeTab = tabIndex;
		for(var i = binder.tabs.length-1; i >= 0; --i){
			if(tabIndex-i >= 0)
				binder.tabs[tabIndex-i].bringToFront();
			if(tabIndex+i < binder.tabs.length)
				binder.tabs[tabIndex+i].bringToFront();
		}

		binder.page.kill();
		switch(tabIndex){
			case 0:
				//replace TileDetailView with new building detail overview page
				binder.page = (binder.type===Binder.global?YearView.createNew():TileDetailView.createNew());
				break;
			case 1:
				//replace TileDetailView with new building detail worker page
				binder.page = (binder.type===Binder.global?FinanceView.createNew():TileDetailView.createNew());
				break;
			case 2:
				//repalce PeopleView with new population view
				//replace TileDetailView with new building detail output page
				binder.page = (binder.type===Binder.global?PeopleView.createNew():TileDetailView.createNew());
				break;
			case 3:
				//replace PeopleView with new social elite view
				//replace TileDetailView with new building detail misc page
				binder.page = (binder.type===Binder.global?PeopleView.createNew():TileDetailView.createNew());
				break;
			case 4:
				//replace PeopleView with new working class view
				binder.page = PeopleView.createNew();
				break;
			case default:
				//replace TileDetailView with new building detail overview page
				binder.page = (binder.type===Binder.global?YearView.createNew():TileDetailView.createNew());
				break;
		}
	}
};

var Clipboard = {
	worker: "workerList",
	elite: "eliteList",
	minister: "ministerList",
	building: "buildingList",

	createNew: function(type) {
		var clipboard = MainGame.game.make.sprite(0,0,'clipboard_menu_texture');

		clipboard.page = Page.createNew();
		clipboard.addChild(clipboard.page);

		clipboard.clip = MainGame.game.make.sprite(0,0,)
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
	menuOpen: false;
	menusOpen: [];
	uiMask: null;
	closeSfx: game.make.audio('message_close');

	openMenu: function(menu){
		menu.inputEnabled = true;
		menu.input.priorityID = 4;

		if(!MenuController.menuOpen){
			MenuController.uiMask = DUiMask.createNew();
			MenuController.uiMask.setController(2, function() {
				MenuController.uiMask.destroy();
				MenuController.closeSfx.play();
				MenuController.closeAllMenus();
        	});

        	MenuController.menuOpen = true;
		}

		MenuController.menusOpen.push(menu);
	},

	closeMenu: function(menu){
		var index = MenuController.menusOpen.indexOf(menu);
		MenuController.menusOpen[index].destroy();
		MenuController.menusOpen.splice(index,1);
	},

	closeAllMenus: function(){
		for(var i = 0; i < MenuController.menusOpen.length; ++i)
			MenuController.menusOpen[i].destroy();
		MenuController.menusOpen = [];
		MenuController.menuOpen = false;
	}
};