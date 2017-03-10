/* global MainGame */

// shows FirstName, LastName, Health, Edu, Shelter
var PeopleRightView={
	style: {font:"30px myKaiti", fill:"black"},
	createNew: function(data){
		var v=MainGame.game.make.sprite(0,0,"peopleViewRightBg");
		// name, health, edu, shelter
		v.data=JSON.parse(JSON.stringify(data));
		// ListView: 10 items (slots)
			// createNew(textures, margin, itemSize, itemCallback, isHorizontal)
		v.listView=DListView.createNew(
			{normal:"peopleViewRightBg"},
			{},
			{w:400, h:50},
			function(index){PeopleRightView.onPersonSelected(v,index)}
		);
		v.addChild(v.listView);
		// PageIndicator: N pages
		var pageCount=Math.ceil(data.length/10);
		v.pageIndicator=DPageIndicator.createNew(
			pageCount,
			{width:400,textPos:{x:200,y:500}},
			function(index){PeopleRightView.onPageChanged(v,index)}
		);
		v.addChild(v.pageIndicator);
		// setup the init page
		PeopleRightView._setupPage_(v,0);
		return v;
	},
	onPersonSelected: function(view,index){
		console.log("PeopleRightView: person selected:",index);
		// TODO: center the person's housing unit		
	},
	onPageChanged: function(view,index){
		console.log("PeoplePageChanged: ",index);
		PeopleRightView._setupPage_(view,index);
	},
	_makeEntry_: function(oneEntryData){
		var entrySprite=MainGame.game.make.sprite(0,0);
		var entryString=""+oneEntryData.name+" | "+oneEntryData.health+" | "
			+oneEntryData.edu+" | "+oneEntryData.shelter;
		var entryText=MainGame.game.make.text(0,0,entryString,PeopleRightView.style);
		entrySprite.addChild(entryText);
		return entrySprite;
	},
	_setupPage_: function(view,pageIndex){
		view.listView.removeAll();
		var startIndex=pageIndex*10;
		var endIndex=Math.min(startIndex+10,view.data.length);
		for(var i=startIndex;i<endIndex;i++)
			view.listView.add(PeopleRightView._makeEntry_(view.data[i]));
	},
};

var PeopleView={
	createNew: function(){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');
		pv.x=100, pv.y=100;

		// create low people view (right)
			// create low people data
		var lowData=[{name:"Sam",health:50,edu:50,shelter:50}];
		pv.right=PeopleRightView.createNew(lowData);
		pv.right.x=100, pv.right.y=150;
		// TBD: set a precise x
		pv.addChild(pv.right);

		// Class funcs
		pv.setVisible=function(value){pv.visible=value};

		return pv;
	},
};
