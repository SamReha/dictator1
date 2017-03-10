/* global MainGame */

// change item per page here!
var lowPeoplePerPage=10;

// shows FirstName, LastName, Health, Edu, Shelter
var PeopleRightView={
	style: {font:"25px myKaiti", fill:"black"},
	createNew: function(data){
		var v=MainGame.game.make.sprite(0,0,"peopleViewRightBg");
		// name, health, edu, shelter
		v.data=JSON.parse(JSON.stringify(data));
		// ListView: [lowPeoplePerPage] items (slots)
			// createNew(textures, margin, itemSize, itemCallback, isHorizontal)
		v.listView=DListView.createNew(
			{},				// don't need textures
			{l:15,t:40},	// margin inside the list view
			{w:400, h:40},	// size of an item
			function(index){PeopleRightView.onPersonSelected(v,index)}	// forwards the callback
		);
		v.addChild(v.listView);
		// PageIndicator: N pages
		var pageCount=Math.ceil(data.length/lowPeoplePerPage);
		v.pageIndicator=DPageIndicator.createNew(
			pageCount,
			{width:400,textPos:{x:180,y:5}},	// width of the pi & pos of "4/7"
			function(index){PeopleRightView.onPageChanged(v,index)}
		);
		v.pageIndicator.y=440;
		v.addChild(v.pageIndicator);
		// setup the init page
		PeopleRightView._setupPage_(v,0);
		return v;
	},
	onPersonSelected: function(view,index){
		var globalIndex=view.pageIndicator.getCurPage()*lowPeoplePerPage+index;
		console.log("PeopleRightView: person selected:",globalIndex);
		// TODO: center the person's housing unit		
	},
	onPageChanged: function(view,index){
		console.log("PeoplePageChanged: ",index);
		PeopleRightView._setupPage_(view,index);
	},
	// each entry is like "Sam Reha | Hth:50 | Edu:50 | Sht:50"
	_makeEntry_: function(oneEntryData){
		var entrySprite=MainGame.game.make.sprite(0,0);
		var entryString=""+oneEntryData.name+" | Hth:"+oneEntryData.health+" | Edu:"
			+oneEntryData.edu+" | Sht:"+oneEntryData.shelter;
		var entryText=MainGame.game.make.text(0,0,entryString,PeopleRightView.style);
		entrySprite.addChild(entryText);
		return entrySprite;
	},
	// each page contains [lowPeoplePerPage] entries
	_setupPage_: function(view,pageIndex){
		view.listView.removeAll();
		var startIndex=pageIndex*lowPeoplePerPage;
		var endIndex=Math.min(startIndex+lowPeoplePerPage,view.data.length);
		for(var i=startIndex;i<endIndex;i++)
			view.listView.add(PeopleRightView._makeEntry_(view.data[i]));
	},
};

// shows the 3 lists(bu,mer,mil) with portraits
var midHiPeoplePerPage=5;
var PeopleLeftView={
	BuType: 0,
	MerType: 1,
	MilType: 2,
	createNew: function(buData,merData,milData){
		var v=MainGame.game.make.sprite(0,0,"peopleViewLeftBg");
		// copies the data
		v.data3=[
			JSON.parse(JSON.stringify(buData)),
			JSON.parse(JSON.stringify(merData)),
			JSON.parse(JSON.stringify(milData))
		];
		v.listViews=[null,null,null];
		v.pageIndicators=[null,null,null];
		// create the 3 list views
		function createCallback(type,isPersonFunc){
			if(isPersonFunc)
				return function(index){PeopleLeftView.onPersonSelected(v,type,index)};
			else
				return function(index){PeopleLeftView.onPageChanged(v,type,index)};
		}
		for(var i=0;i<3;i++){
			v.listViews[i]=DListView.createNew(
				{},
				{l:5,t:5},				// margin - TODO: adjust it!
				{w:80,h:64},			// each item's size
				createCallback(i,true),	// callback func
				true 					// is horizontal
			);
			v.listViews[i].x=10;		// TODO: adjust it!
			v.listViews[i].y=50+150*i;	// TODO: adjust it!
			v.addChild(v.listViews[i]);
			v.pageIndicators[i]=DPageIndicator.createNew(
				Math.ceil(v.data3[i].length/midHiPeoplePerPage),	// items per page
				{width:400,textPos:{x:180,y:5}},	// width & pos of "4/6"
				createCallback(i,false)				// callback func
			);
			v.pageIndicators[i].x=10;			// TODO: adjust it!
			v.pageIndicators[i].y=140+150*i;	// TODO: adjust it!
			v.addChild(v.pageIndicators[i]);
		}
		// now setup the 3 pages!
		for(var j=0;j<3;j++)
			PeopleLeftView._setupPage_(v,j,0);
		return v;
	},
	onPersonSelected: function(view,type,index){
		var globalIndex=view.pageIndicators[type].getCurPage()*midHiPeoplePerPage+index;
		console.log("Person selected! type,index=",type,globalIndex);
		// TODO: show the detail info of that mid-hi person
	},
	onPageChanged: function(view,type,index){
		console.log("Page changed! type,index=",type,index);
		PeopleLeftView._setupPage_(view,type,index);
	},
	// makes the portrait + name. TODO: re-arrange the visual elements
	_makeEntry_: function(oneEntryData){
		var entrySprite=MainGame.game.make.sprite(0,0,oneEntryData.port);
		var entryText=MainGame.game.make.text(0,50,oneEntryData.name);
		entrySprite.addChild(entryText);
		return entrySprite;
	},
	_setupPage_: function(view,type,pageIndex){
		view.listViews[type].removeAll();
		var startIndex=pageIndex*midHiPeoplePerPage;
		var endIndex=Math.min(startIndex+midHiPeoplePerPage,view.data3[type].length);
		for(var i=startIndex;i<endIndex;i++)
			view.listViews[type].add(PeopleLeftView._makeEntry_(view.data3[type][i]));
	},
};

var PeopleView={
	// TODO: please see the required format of lowData, buData, etc.
	createNew: function(lowData, buData, merData, milData){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');

		// TODO: setup the actual position
		pv.x=100, pv.y=100;

		// create low people view (right)
		//	for debug: if there's no data input
		if(!lowData){
			lowData=[		
				{name:"Sam Reha",health:50,edu:50,shelter:50},
				{name:"A Math",health:20,edu:50,shelter:30},
				{name:"B Dee",health:30,edu:50,shelter:55},
				{name:"C Eee",health:40,edu:32,shelter:10},
				{name:"D FFF",health:50,edu:50,shelter:52},
				{name:"Sam2",health:50,edu:50,shelter:50},
				{name:"A2 Math",health:20,edu:5,shelter:50},
				{name:"B2 Dee",health:30,edu:10,shelter:50},
				{name:"C2 Eee",health:40,edu:5,shelter:50},
				{name:"D2 FFF",health:50,edu:50,shelter:50},
				{name:"Sam3Reha",health:50,edu:50,shelter:50},
				{name:"A3Math",health:20,edu:50,shelter:50},
				{name:"B Dee",health:30,edu:11,shelter:50},
				{name:"C3 ee",health:40,edu:22,shelter:50},
				{name:"D3FFF",health:50,edu:50,shelter:44},
				{name:"Sa4 Reha",health:50,edu:50,shelter:50},
				{name:"A4Math",health:20,edu:50,shelter:50},
				{name:"B4Dee",health:30,edu:50,shelter:50},
				{name:"C4Eee",health:40,edu:50,shelter:50},
				{name:"D4FFF",health:50,edu:50,shelter:50},
				{name:"Json File",health:50,edu:50,shelter:10},
			];
		}
		if(!buData){
			buData=[
				{name:"Yi",port:"smallPort0"},
				{name:"Yi2",port:"smallPort0"},
				{name:"Yi3",port:"smallPort0"},
				{name:"Yi4",port:"smallPort0"},
				{name:"Yi5",port:"smallPort0"},
				{name:"Yi6",port:"smallPort0"},
				{name:"Yi7",port:"smallPort0"},
				{name:"Yi8",port:"smallPort0"},
			];
		}
		if(!merData){
			merData=[
				{name:"MJ",port:"smallPort1"},
			];
		}
		if(!milData){
			milData=[
				{name:"Erin",port:"smallPort2"},
				{name:"Erin2",port:"smallPort2"},
			];
		}

		// People Right View
		pv.right=PeopleRightView.createNew(lowData);
		pv.right.x=450;
		pv.addChild(pv.right);
		// People Left View
		pv.left=PeopleLeftView.createNew(buData,merData,milData);
		pv.addChild(pv.left);

		// Class funcs
		pv.setVisible=function(value){pv.visible=value};

		return pv;
	},
};
