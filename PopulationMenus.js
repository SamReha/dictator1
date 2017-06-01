var PopulationMenu ={
	createNew: function(){
		var popMenu = MainGame.game.make.group();

		popMenu.page = Page.createNew();
		popMenu.page.anchor.setTo(.5,.5);
		popMenu.addChild(popMenu.page);

		popMenu.title = MainGame.game.make.text(0,-popMenu.height*11/28,"Total Population",PopMenuController.header1);
		popMenu.title.anchor.setTo(.5,.5);
		popMenu.addChild(popMenu.title);

		popMenu.topBar = MainGame.game.make.sprite(0,-popMenu.height*1/3,'horizontal_border');
		popMenu.topBar.anchor.setTo(.5,.5);
		popMenu.topBar.scale.setTo(.6,.6);
		popMenu.addChild(popMenu.topBar);

		popMenu.seTitle = TextLinkButton.createNew(-popMenu.width*3/7,-popMenu.height*2/7,"Social Elite",PopMenuController.header2,function(){
			var binder = popMenu.parent.parent;
			binder.changeTabs(3);
		},popMenu,3);
		popMenu.seTitle.text.anchor.setTo(0,.5);	popMenu.seTitle.underline.anchor.setTo(0,.5);
		popMenu.addChild(popMenu.seTitle);

		popMenu.seData = MainGame.population.highList().concat(MainGame.population.midList());
		popMenu.seListView = DListView.createNew(
			{},						// don't need textures
			{l:0,t:0},				// margin inside the list view
			{w:(popMenu.width*4/5), h:(popMenu.height*1/8)},			// size of an item
			function(index){},		// forwards the callback
			false,					// not horizontal
			110						// priority ID
		);
		popMenu.seListView.y = -popMenu.height*1/4;
		popMenu.addChild(popMenu.seListView);

		popMenu.seItemCount = 2;
		var sePageCount=Math.ceil(popMenu.seData.length/(popMenu.seItemCount*2));
		popMenu.sePageIndicator = DPageIndicator.createNew((popMenu.width*1/8),{x:0,y:0});
		popMenu.sePageIndicator.setModel(0,sePageCount);
		popMenu.sePageIndicator.setController(function(index){SocialEliteMenu.setupListView(popMenu,index,popMenu.seItemCount)},111);
		popMenu.sePageIndicator.x = popMenu.width*1/5;	popMenu.sePageIndicator.y = -popMenu.height*2/7;
		popMenu.sePageIndicator.pageText.setStyle(PopMenuController.listText);
		popMenu.sePageIndicator.visible = (sePageCount > 1);
		popMenu.addChild(popMenu.sePageIndicator);

		SocialEliteMenu.setupListView(popMenu,0,popMenu.seItemCount);

		popMenu.midBar = MainGame.game.make.sprite(0,popMenu.height*1/48,'horizontal_border');
		popMenu.midBar.anchor.setTo(.5,.5);
		popMenu.midBar.scale.setTo(.6,.6);
		popMenu.addChild(popMenu.midBar);

		popMenu.wcTitle = TextLinkButton.createNew(-popMenu.width*11/28,popMenu.height*1/14,"Working Class",PopMenuController.header2,function(){
			var binder = popMenu.parent.parent;
			binder.changeTabs(4);
		},popMenu,3);
		popMenu.wcTitle.text.anchor.setTo(0,.5);	popMenu.wcTitle.underline.anchor.setTo(0,.5);
		popMenu.addChild(popMenu.wcTitle);

		popMenu.wcData = MainGame.population.people.filter(function(p){return (p.type===0);});
		popMenu.wcListView = DListView.createNew(
			{},						// don't need textures
			{l:0,t:0},				// margin inside the list view
			{w:(popMenu.width*4/5), h:(popMenu.height*1/16)},			// size of an item
			function(index){},		// forwards the callback
			false,					// not horizontal
			110						// priority ID
		);
		popMenu.wcListView.y = popMenu.height*1/8;
		popMenu.addChild(popMenu.wcListView);

		popMenu.wcItemCount = 5;
		var wcPageCount=Math.ceil(popMenu.wcData.length/(popMenu.wcItemCount*2));
		popMenu.wcPageIndicator = DPageIndicator.createNew((popMenu.width*1/8),{x:0,y:0});
		popMenu.wcPageIndicator.setModel(0,wcPageCount);
		popMenu.wcPageIndicator.setController(function(index){WorkingClassMenu.setupListView(popMenu,index,popMenu.wcItemCount)},111);
		popMenu.wcPageIndicator.x = popMenu.width*1/5;	popMenu.wcPageIndicator.y = popMenu.height*1/14;
		popMenu.wcPageIndicator.pageText.setStyle(PopMenuController.listText);
		popMenu.wcPageIndicator.visible = (wcPageCount > 1);
		popMenu.addChild(popMenu.wcPageIndicator);

		WorkingClassMenu.setupListView(popMenu,0,popMenu.wcItemCount);

		return popMenu;
	},
};

var SocialEliteMenu = {
	createNew: function(){
		var seMenu = MainGame.game.make.group();
		MainGame.global.ministerViewIsOpen = true;

		seMenu.page = Page.createNew();
		seMenu.page.anchor.setTo(.5,.5);
		seMenu.addChild(seMenu.page);

		seMenu.title = MainGame.game.make.text(0,-seMenu.height*11/28,"Social Elite",PopMenuController.header1);
		seMenu.title.anchor.setTo(.5,.5);
		seMenu.addChild(seMenu.title);

		seMenu.topBar = MainGame.game.make.sprite(0,-seMenu.height*1/3,'horizontal_border');
		seMenu.topBar.anchor.setTo(.5,.5);
		seMenu.topBar.scale.setTo(.6,.6);
		seMenu.addChild(seMenu.topBar);

		seMenu.ministerTitle = MainGame.game.make.text(-seMenu.width*3/7,-seMenu.height*2/7,"Ministers",PopMenuController.header2);
		seMenu.ministerTitle.anchor.setTo(0,.5);
		seMenu.addChild(seMenu.ministerTitle);

		seMenu.ministerData = MainGame.population.highList();
		seMenu.ministerListView = DListView.createNew(
			{},						// don't need textures
			{l:0,t:0},				// margin inside the list view
			{w:(seMenu.width*4/5), h:(seMenu.height*1/8)},			// size of an item
			function(index){},		// forwards the callback
			false,					// not horizontal
			110						// priority ID
		);
		seMenu.ministerListView.y = -seMenu.height*1/4;
		seMenu.addChild(seMenu.ministerListView);

		seMenu.ministerListView.removeAll();
		seMenu.ministerListView.add(SocialEliteMenu.makeEntry((seMenu.ministerData.length>=1?seMenu.ministerData[0]:""),(seMenu.ministerData.length>=2?seMenu.ministerData[1]:""),seMenu.ministerListView,));
		seMenu.ministerListView.add(SocialEliteMenu.makeEntry((seMenu.ministerData.length>=3?seMenu.ministerData[2]:""),undefined,seMenu.ministerListView,));

		seMenu.midBar = MainGame.game.make.sprite(0,seMenu.height*1/48,'horizontal_border');
		seMenu.midBar.anchor.setTo(.5,.5);
		seMenu.midBar.scale.setTo(.6,.6);
		seMenu.addChild(seMenu.midBar);

		seMenu.seTitle = MainGame.game.make.text(-seMenu.width*11/28,seMenu.height*1/14,"Others",PopMenuController.header2);
		seMenu.seTitle.anchor.setTo(0,.5);
		seMenu.addChild(seMenu.seTitle);

		seMenu.seData = MainGame.population.people.filter(function(p){return (p.type===1);});
		seMenu.seListView = DListView.createNew(
			{},						// don't need textures
			{l:0,t:0},				// margin inside the list view
			{w:(seMenu.width*4/5), h:(seMenu.height*1/8)},			// size of an item
			function(index){},		// forwards the callback
			false,					// not horizontal
			110						// priority ID
		);
		seMenu.seListView.y = seMenu.height*1/9;
		seMenu.addChild(seMenu.seListView);

		seMenu.seItemCount = 2;
		var wcPageCount=Math.ceil(seMenu.seData.length/(seMenu.seItemCount*2));
		seMenu.sePageIndicator = DPageIndicator.createNew((seMenu.width*1/8),{x:0,y:0});
		seMenu.sePageIndicator.setModel(0,wcPageCount);
		seMenu.sePageIndicator.setController(function(index){SocialEliteMenu.setupListView(seMenu,index,seMenu.seItemCount)},111);
		seMenu.sePageIndicator.x = seMenu.width*1/5;	seMenu.sePageIndicator.y = seMenu.height*1/14;
		seMenu.sePageIndicator.pageText.setStyle(PopMenuController.listText);
		seMenu.sePageIndicator.visible = (wcPageCount > 1);
		seMenu.addChild(seMenu.sePageIndicator);

		SocialEliteMenu.setupListView(seMenu,0,seMenu.seItemCount);

		return seMenu;
	},

	onPersonSelected: function(person){
		Clipboard.createNew(Clipboard.contract,{personDataRef:person});
	},

	makeEntry: function(person1,person2,listView){
		var entrySprite = MainGame.game.make.group();

		var back = MainGame.game.make.graphics();
		back.lineStyle(0);
		back.beginFill(0x000000,1);
		back.drawRect(0,0,listView.itemSize.w/2,listView.itemSize.h);
		back.endFill();
		entrySprite.back1 = MainGame.game.make.sprite(-listView.itemSize.w/2, 0, back.generateTexture());
		entrySprite.back1.alpha = 0;
		entrySprite.back1.inputEnabled = true;
		entrySprite.back1.input.priorityID=120;
		entrySprite.addChild(entrySprite.back1);
        entrySprite.back1.events.onInputUp.add(function(){entrySprite.back1.alpha = .25;});
        if(person1!=="")
        	entrySprite.back1.events.onInputUp.add(function(){SocialEliteMenu.onPersonSelected(person1)});
        entrySprite.back1.events.onInputDown.add(function(){entrySprite.back1.alpha = .5;});
        entrySprite.back1.events.onInputOver.add(function(){entrySprite.back1.alpha = .25;});
        entrySprite.back1.events.onInputOut.add(function(){entrySprite.back1.alpha = 0;});

		entrySprite.photo1 = MainGame.game.make.button(-listView.itemSize.w/2, listView.itemSize.h/2, (person1!==""?(person1.type===Person.Hi?'frameBorder':'photographBorder'):'frameBorder'),
			function(){},entrySprite.photo1,1,0,2,1);
		entrySprite.photo1.x+=entrySprite.photo1.width/2;
		entrySprite.photo1.anchor.setTo(.5,.5);
		entrySprite.photo1.inputEnabled = false;
		entrySprite.addChild(entrySprite.photo1)
		if(person1!==""){
			entrySprite.portrait1 = MainGame.game.make.sprite(0,0, person1.getPortTexString());
			entrySprite.portrait1.anchor.setTo(.5,(person1.type===Person.Hi?.5:40/66));
			entrySprite.photo1.addChild(entrySprite.portrait1);
		}
		entrySprite.photo1.scale.setTo(.8,.8);
		
		entrySprite.person1 = MainGame.game.make.text(-listView.itemSize.w*7/24, listView.itemSize.h/2, (person1!==""?person1.name.replace(' ','\n'):"<Open\nPosition>"), PopMenuController.body2);
		entrySprite.person1.anchor.setTo(0,.5);
		entrySprite.addChild(entrySprite.person1);

		if(person2!==undefined){
			entrySprite.back2 = MainGame.game.make.sprite(0, 0, back.generateTexture());
			entrySprite.back2.alpha = 0;
			entrySprite.back2.inputEnabled = true;
			entrySprite.back2.input.priorityID=120;
			entrySprite.addChild(entrySprite.back2);
	        entrySprite.back2.events.onInputUp.add(function(){entrySprite.back2.alpha = .25;});
        	if(person2!=="")
        		entrySprite.back2.events.onInputUp.add(function(){SocialEliteMenu.onPersonSelected(person2)});
	        entrySprite.back2.events.onInputDown.add(function(){entrySprite.back2.alpha = .5;});
	        entrySprite.back2.events.onInputOver.add(function(){entrySprite.back2.alpha = .25;});
	        entrySprite.back2.events.onInputOut.add(function(){entrySprite.back2.alpha = 0;});

			entrySprite.photo2 = MainGame.game.make.button(0, listView.itemSize.h/2, (person2!==""?(person2.type===Person.Hi?'frameBorder':'photographBorder'):'frameBorder'),
				function(){},entrySprite.photo2,1,0,2,1);
			entrySprite.photo2.x+=entrySprite.photo2.width/2;
			entrySprite.photo2.anchor.setTo(.5,.5);
			entrySprite.photo2.inputEnabled = false;
			entrySprite.addChild(entrySprite.photo2)
			if(person2!==""){
				entrySprite.portrait2 = MainGame.game.make.sprite(0,0, person2.getPortTexString());
				entrySprite.portrait2.anchor.setTo(.5,(person2.type===Person.Hi?.5:40/66));
				entrySprite.photo2.addChild(entrySprite.portrait2);
			}
			entrySprite.photo2.scale.setTo(.8,.8);

			entrySprite.person2 = MainGame.game.make.text(listView.itemSize.w/5, listView.itemSize.h/2, (person2!==""?person2.name.replace(' ','\n'):"<Open\nPosition>"), PopMenuController.body2);
			entrySprite.person2.anchor.setTo(0,.5);
			entrySprite.addChild(entrySprite.person2);
		}

		return entrySprite;
	},

	setupListView: function(view,pageIndex,itemCount){
		view.seListView.removeAll();
		var startIndex = pageIndex*itemCount*2;
		var endIndex = Math.min(startIndex+itemCount*2,view.seData.length);
		for(var i = startIndex; i < endIndex; i+=2)
			view.seListView.add(SocialEliteMenu.makeEntry(view.seData[i],view.seData[i+1],view.seListView));
	},
};

var WorkingClassMenu ={
	createNew: function(){
		var wcMenu = MainGame.game.make.group();

		wcMenu.page = Page.createNew();
		wcMenu.page.anchor.setTo(.5,.5);
		wcMenu.addChild(wcMenu.page);

		wcMenu.title = MainGame.game.make.text(0,-wcMenu.height*11/28,"Working Class",PopMenuController.header1);
		wcMenu.title.anchor.setTo(.5,.5);
		wcMenu.addChild(wcMenu.title);

		wcMenu.topBar = MainGame.game.make.sprite(0,-wcMenu.height*1/3,'horizontal_border');
		wcMenu.topBar.anchor.setTo(.5,.5);
		wcMenu.topBar.scale.setTo(.6,.6);
		wcMenu.addChild(wcMenu.topBar);

		wcMenu.wcTitle = MainGame.game.make.text(-wcMenu.width*3/7,-wcMenu.height*2/7,"Workers",PopMenuController.header2);
		wcMenu.wcTitle.anchor.setTo(0,.5);
		wcMenu.addChild(wcMenu.wcTitle);

		wcMenu.wcData = MainGame.population.people.filter(function(p){return (p.type===0);});
		wcMenu.wcListView = DListView.createNew(
			{},						// don't need textures
			{l:0,t:0},				// margin inside the list view
			{w:(wcMenu.width*4/5), h:(wcMenu.height*1/16)},			// size of an item
			function(index){},		// forwards the callback
			false,					// not horizontal
			110						// priority ID
		);
		wcMenu.wcListView.y = -wcMenu.height*1/4;
		wcMenu.addChild(wcMenu.wcListView);

		wcMenu.wcItemCount = 10;
		var wcPageCount=Math.ceil(wcMenu.wcData.length/(wcMenu.wcItemCount*2));
		wcMenu.wcPageIndicator = DPageIndicator.createNew((wcMenu.width*1/8),{x:0,y:0});
		wcMenu.wcPageIndicator.setModel(0,wcPageCount);
		wcMenu.wcPageIndicator.setController(function(index){WorkingClassMenu.setupListView(wcMenu,index,wcMenu.wcItemCount)},111);
		wcMenu.wcPageIndicator.x = wcMenu.width*1/5;	wcMenu.wcPageIndicator.y = -wcMenu.height*2/7;
		wcMenu.wcPageIndicator.pageText.setStyle(PopMenuController.listText);
		wcMenu.wcPageIndicator.visible = (wcPageCount > 1);
		wcMenu.addChild(wcMenu.wcPageIndicator);

		WorkingClassMenu.setupListView(wcMenu,0,wcMenu.wcItemCount);

		return wcMenu;
	},

	onPersonSelected: function(view,index){

	},

	makeEntry: function(person1,person2,listView){
		var entrySprite = MainGame.game.make.group();

		var back = MainGame.game.make.graphics();
		back.lineStyle(0);
		back.beginFill(0x000000,1);
		back.drawRect(0,0,listView.itemSize.w/2,listView.itemSize.h);
		back.endFill();
		entrySprite.back1 = MainGame.game.make.sprite(-listView.itemSize.w/2, 0, back.generateTexture());
		entrySprite.back1.alpha = 0;
		entrySprite.back1.inputEnabled = true;
		entrySprite.back1.input.priorityID=120;
		entrySprite.addChild(entrySprite.back1);
        entrySprite.back1.events.onInputUp.add(function(){entrySprite.back1.alpha = .25;});
        entrySprite.back1.events.onInputDown.add(function(){entrySprite.back1.alpha = .5;});
        entrySprite.back1.events.onInputOver.add(function(){entrySprite.back1.alpha = .25;});
        entrySprite.back1.events.onInputOut.add(function(){entrySprite.back1.alpha = 0;});

		entrySprite.person1 = MainGame.game.make.text(-listView.itemSize.w/4, listView.itemSize.h/2, person1.name, PopMenuController.body1);
		entrySprite.person1.anchor.setTo(.5,.5);
		entrySprite.addChild(entrySprite.person1);

		if(person2!==undefined){
			entrySprite.back2 = MainGame.game.make.sprite(0, 0, back.generateTexture());
			entrySprite.back2.alpha = 0;
			entrySprite.back2.inputEnabled = true;
			entrySprite.back2.input.priorityID=120;
			entrySprite.addChild(entrySprite.back2);
	        entrySprite.back2.events.onInputUp.add(function(){entrySprite.back2.alpha = .25;});
	        entrySprite.back2.events.onInputDown.add(function(){entrySprite.back2.alpha = .5;});
	        entrySprite.back2.events.onInputOver.add(function(){entrySprite.back2.alpha = .25;});
	        entrySprite.back2.events.onInputOut.add(function(){entrySprite.back2.alpha = 0;});

			entrySprite.person2 = MainGame.game.make.text(listView.itemSize.w/4, listView.itemSize.h/2, person2.name, PopMenuController.body1);
			entrySprite.person2.anchor.setTo(.5,.5);
			entrySprite.addChild(entrySprite.person2);
		}

		return entrySprite;
	},

	setupListView: function(view,pageIndex,itemCount){
		view.wcListView.removeAll();
		var startIndex = pageIndex*itemCount*2;
		var endIndex = Math.min(startIndex+itemCount*2,view.wcData.length);
		for(var i = startIndex; i < endIndex; i+=2)
			view.wcListView.add(WorkingClassMenu.makeEntry(view.wcData[i],view.wcData[i+1],view.wcListView));
	},
};

var PopMenuController ={
    header1: { font: "32px myKaiti", fill:"black", shadowBlur: 1, shadowColor: "rgba(0,0,0,.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
    header2: { font: "28px myKaiti", fill:"black", shadowBlur: 0, shadowColor: "rgba(0,0,0,.55)", shadowOffsetX: 1, shadowOffsetY: 1 },
    body1:   { font: "20px myKaiti", fill:"black"},
    body2:   { font: "20px myKaiti", fill:"black", boundsAlignH: 'left'},
    listText:{ font: "20px myKaiti", fill:"black", shadowBlur: 0, shadowColor: "rgba(0,0,0,.9)", shadowOffsetX: 1, shadowOffsetY: 1 },
};