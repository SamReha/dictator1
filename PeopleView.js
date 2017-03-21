/* global MainGame */

// change item per page here!
var lowPeoplePerPage=10;
// shows FirstName, LastName, Health, Edu, Shelter
var PeopleRightView={
	style: {font:"25px myKaiti", fill:"white", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
	createNew: function(dataRef){
		var v=MainGame.game.make.sprite(0,0,"peopleViewRightBg");
		// let right view block click events
		v.inputEnabled=true;
		v.input.priorityID=101;

		// name, health, edu, shelter
		v.dataRef=dataRef;
		// ListView: [lowPeoplePerPage] items (slots)
			// createNew(textures, margin, itemSize, itemCallback, isHorizontal)
		v.listView=DListView.createNew(
			{},						// don't need textures
			{l:15,t:40},			// margin inside the list view
			{w:400, h:40},			// size of an item
			function(index){PeopleRightView.onPersonSelected(v,index)},	// forwards the callback
			false,					// not horizontal
			110						// priority ID
		);
		v.addChild(v.listView);
		// DPageIndicator: N pages
		var pageCount=Math.ceil(dataRef.length/lowPeoplePerPage);
		v.pageIndicator=DPageIndicator.createNew(400, {x:180, y:5});//width, textPos
		v.pageIndicator.setModel(0, pageCount);	// current, max
		v.pageIndicator.setController(function(index){PeopleRightView.onPageChanged(v,index)}, 111);
		v.pageIndicator.y=440;
		v.addChild(v.pageIndicator);
		// setup the init page
		PeopleRightView._setupPage_(v,0);
		return v;
	},
	onPersonSelected: function(view,index){
		var globalIndex=view.pageIndicator.getCurPage()*lowPeoplePerPage+index;
		//console.log("PeopleRightView: person selected:",globalIndex);
		//console.log("  and the person's dataRef is:",view.dataRef[globalIndex]);
		// TODO: you can change this low person's dataRef if necessary like this:
		view.dataRef[globalIndex].name+="-Changed by Yi";
		// TODO: center the person's housing unit	
	},
	onPageChanged: function(view,index){
		//console.log("PeoplePageChanged: ",index);
		PeopleRightView._setupPage_(view,index);
	},
	// each entry is like "Sam Reha | Hth:50 | Edu:50 | Sht:50"
	_makeEntry_: function(oneEntryData){
		var entrySprite=MainGame.game.make.sprite(0,0);
		var entryString=""+oneEntryData.name+" | Hth:"+oneEntryData.health+" | Edu:"
			+oneEntryData.education+" | Sht:"+oneEntryData.shelter;
		var entryText=MainGame.game.make.text(0,0,entryString,PeopleRightView.style);
		entrySprite.addChild(entryText);
		return entrySprite;
	},
	// each page contains [lowPeoplePerPage] entries
	_setupPage_: function(view,pageIndex){
		view.listView.removeAll();
		var startIndex=pageIndex*lowPeoplePerPage;
		var endIndex=Math.min(startIndex+lowPeoplePerPage,view.dataRef.length);
		for(var i=startIndex;i<endIndex;i++)
			view.listView.add(PeopleRightView._makeEntry_(view.dataRef[i]));
	},
};

/************************************************************************************/

// change item per page here!
var midHiPeoplePerPage=5;
// shows the 3 lists(bu,mer,mil) with portraits
var PeopleLeftView={
	style: {font:"20px myKaiti", fill:"white", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
	BuType: 0,	// for us to remember, not actually in use, may be removed ITF.
	MerType: 1,	// ditto.
	MilType: 2,	// ditto.
	createNew: function(buDataRef,merDataRef,milDataRef){
		var v=MainGame.game.make.sprite(0,0,"peopleViewLeftBg");
		// let left view block click events
		v.inputEnabled=true;
		v.input.priorityID=101;
		// setup last selected
		v.lastSelected=null;

		// copies the dataRef
		v.data3=[buDataRef, merDataRef, milDataRef];
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
				{l:10,t:10},			// margin inside the list view
				{w:80,h:64},			// each item's size
				createCallback(i,true),	// callback func
				true, 					// is horizontal
				110						// priorityID
			);
			v.listViews[i].x=10;		// TODO: adjust it!
			v.listViews[i].y=50+150*i;	// TODO: adjust it!
			v.addChild(v.listViews[i]);
			v.pageIndicators[i]=DPageIndicator.createNew(400,{x:180,y:5});
			v.pageIndicators[i].setModel(0, Math.ceil(v.data3[i].length/midHiPeoplePerPage));
			v.pageIndicators[i].setController(createCallback(i,false), 111);
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
		//console.log("Person selected! type,index=",type,globalIndex);
		// show the detail info of that mid-hi person
		if(view.lastSelected===type*1000+globalIndex){
			view.parent.hideContractView();
			view.lastSelected=null;
		}else{
			var personDataRef=view.data3[type][index];
			view.parent.showContractView(personDataRef);
			view.lastSelected=type*1000+globalIndex;
		}
	},
	onPageChanged: function(view,type,index){
		console.log("Page changed! type,index=",type,index);
		PeopleLeftView._setupPage_(view,type,index);
	},
	// makes the portrait + name. TODO: re-arrange the visual elements
	_makeEntry_: function(oneEntryData) {
		var textureString;
		switch (oneEntryData.role) {
			case Person.Bureaucrat:
				textureString = 'bureaucrat_port_' + oneEntryData.portIndex;
				break;
			case Person.Merchant:
				textureString = 'merchant_port_' + oneEntryData.portIndex;
				break;
			case Person.Military:
				textureString = 'military_port_' + oneEntryData.portIndex;
				break;
			default:
				break;
		}

		var entrySprite=MainGame.game.make.sprite(0, 0, textureString);
		// var name = oneEntryData.name.split(" ");
		// var entryText=MainGame.game.make.text(0,50,name[0]+"\n"+name[1],PeopleLeftView.style);
		// entrySprite.addChild(entryText);
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
	// TODO: please see the required format of lowData, buDataRef, etc.
	createNew: function(lowData, buDataRef, merDataRef, milDataRef){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');

		// TODO: setup the actual position
		pv.x=190, pv.y=100;

		// setup the mask
		/* global DUiMask */
		pv.uiMask=DUiMask.createNew();
		pv.uiMask.setController(100, function(){pv.uiMask.destroy();pv.destroy()});

		// create low people view (right)
		//	for debug: if there's no dataRef input
		if(!lowData)
			lowData=MainGame.population.lowList();
		if(!buDataRef)
			buDataRef=MainGame.population.roleList("?");
		if(!merDataRef)
			merDataRef=MainGame.population.roleList("$");
		if(!milDataRef)
			milDataRef=MainGame.population.roleList("!");
		console.log("Now bu,mer and mil is:", buDataRef, merDataRef, milDataRef);

		// People Right View
		pv.right=PeopleRightView.createNew(lowData);
		pv.right.x=450;
		pv.addChild(pv.right);
		// People Left View
		pv.left=PeopleLeftView.createNew(buDataRef,merDataRef,milDataRef);
		pv.addChild(pv.left);

		// // Class funcs
		pv.setVisible=function(value){pv.visible=value};
		pv.showContractView=function(personDataRef){PeopleView.showContractView(pv,personDataRef)};
		pv.hideContractView=function(){PeopleView.hideContractView(pv)};

		return pv;
	},
	showContractView: function(view,personDataRef){
		if(view.contract){
			view.contract.suicide();
			view.contract=null;
		}
		console.assert(view);
		console.assert(personDataRef);
		view.contract=PeopleContractView.createNew(personDataRef);
		console.log(view.contract);
		view.contract.x=view.right.x;
		view.addChild(view.contract);
	},
	hideContractView: function(view){
		if(view.contract){
			view.contract.suicide();
			view.contract=null;
			view.left.lastSelected=null;
		}
	}
};
