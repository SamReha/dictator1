/* global MainGame */

// change item per page here!
var lowPeoplePerPage=10;

// shows FirstName, LastName, Health, Edu, Shelter
var PeopleRightView={
	style: {font:"30px myKaiti", fill:"black"},
	createNew: function(data){
		var v=MainGame.game.make.sprite(0,0,"peopleViewRightBg");
		// name, health, edu, shelter
		v.data=JSON.parse(JSON.stringify(data));
		// ListView: [lowPeoplePerPage] items (slots)
			// createNew(textures, margin, itemSize, itemCallback, isHorizontal)
		v.listView=DListView.createNew(
			{},
			{},
			{w:400, h:45},
			function(index){PeopleRightView.onPersonSelected(v,index)}
		);
		v.addChild(v.listView);
		// PageIndicator: N pages
		var pageCount=Math.ceil(data.length/lowPeoplePerPage);
		v.pageIndicator=DPageIndicator.createNew(
			pageCount,
			{width:400,textPos:{x:200,y:0}},
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
	_makeEntry_: function(oneEntryData){
		var entrySprite=MainGame.game.make.sprite(0,0);
		var entryString=""+oneEntryData.name+" | Hth:"+oneEntryData.health+" | Edu:"
			+oneEntryData.edu+" | Sht:"+oneEntryData.shelter;
		var entryText=MainGame.game.make.text(0,0,entryString,PeopleRightView.style);
		entrySprite.addChild(entryText);
		return entrySprite;
	},
	_setupPage_: function(view,pageIndex){
		view.listView.removeAll();
		var startIndex=pageIndex*lowPeoplePerPage;
		var endIndex=Math.min(startIndex+lowPeoplePerPage,view.data.length);
		for(var i=startIndex;i<endIndex;i++)
			view.listView.add(PeopleRightView._makeEntry_(view.data[i]));
	},
};

// shows the 3 lists(bu,mer,mil) with portraits
var PeopleLeftView={
	createNew: function(buData,merData,milData){
		var v=MainGame.game.make.sprite(0,0,"peopleViewLeftBg");
		v.buData=JSON.parse(JSON.stringify(buData));
		v.merData=JSON.parse(JSON.stringify(merData));
		v.milData=JSON.parse(JSON.stringify(milData));
		// TODO
		return v;
	},
	onPersonSelected: function(view,index){

	},
	onPageChanged: function(view,type,index){

	},
	_makeEntry_: function(oneEntryData){

	},
	_setupPage_: function(view,type,pageIndex){

	},
};

var PeopleView={
	createNew: function(lowData, buData, merData, milData){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');
		pv.x=100, pv.y=100;

		// create low people view (right)
			// create low people data
		if(!lowData){
			lowData=[		
			{name:"Sam Reha",health:50,edu:50,shelter:50},
			{name:"A Math",health:20,edu:50,shelter:50},
			{name:"B Dee",health:30,edu:50,shelter:50},
			{name:"C Eee",health:40,edu:50,shelter:50},
			{name:"D FFF",health:50,edu:50,shelter:50},
			{name:"Sam2",health:50,edu:50,shelter:50},
			{name:"A2 Math",health:20,edu:50,shelter:50},
			{name:"B2 Dee",health:30,edu:50,shelter:50},
			{name:"C2 Eee",health:40,edu:50,shelter:50},
			{name:"D2 FFF",health:50,edu:50,shelter:50},
			{name:"Sam3Reha",health:50,edu:50,shelter:50},
			{name:"A3Math",health:20,edu:50,shelter:50},
			{name:"B Dee",health:30,edu:50,shelter:50},
			{name:"C3 ee",health:40,edu:50,shelter:50},
			{name:"D3FFF",health:50,edu:50,shelter:50},
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
			];
		}
		if(!merData){
			merData=[
			];
		}
		if(!milData){
			milData=[
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
