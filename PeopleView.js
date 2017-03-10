/* global MainGame */

// shows FirstName, LastName, Health, Edu, Shelter
var PeopleRightView{
	style: {font:"30px myKaiti", fill:"black"},
	createNew: function(data){
		var v=MainGame.game.add.sprite(0,0,"peopleViewRightBg");
		// name, health, edu, shelter
		v.data=JSON.parse(JSON.stringify(data));
		// ListView: 10 items (slots)
			// createNew(textures, margin, itemSize, itemCallback, isHorizontal)
		v.listView=DListView:createNew(
			{normal:"peopleViewRightBg"},
			{},
			{w:400, h:50},
			function(index){PeopleRightView.onPersonSelected(v,index)}
		);
		// PageIndicator: N pages
		var pageCount=Math.ceil(data.length/10);
		v.pageIndicator=DPageIndicator:createNew(
			pageCount,
			{width:400,textPos:{x:200,y:500}},
			function(index){PeopleRightView.onPageChanged(v,index)}
		);
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
		for(var i=startIndex;i<startIndex+10;i++){
			view.listView.add(PeopleRightView._makeEntry_(view.data[i]));
		}
	},
};

var PeopleView={
	createNew: function(){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');
		
		// create low people view (right)
		pv.right=PeopleRightView.createNew();

		// Class funcs
		pv.setVisible=function(value){pv.visible=value};

		return pv;
	},
};
