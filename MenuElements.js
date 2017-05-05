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
		folder.inputEnabled = true;
		folder.input.priorityID = 4;

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

		folder.tab = MainGame.game.make.sprite(0.0,'folder_tab_texture');
		folder.addChild(folder.tab);

		folder.leftPage = Page.createNew();
		folder.rightPage = Page.createNew();

		return folder;
	},
};

var Binder = {
	global: "globalStats",
	building: "buildingDetail",

	createNew: function(type) {
		var binder = MainGame.game.make.sprite(0,0,'binder_menu_texture');

		binder.tabs = [];
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

		var tempPage = Page.createNew();
		binder.page.kill();
		binder.page = tempPage;
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