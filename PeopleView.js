/* global MainGame */

// change item per page here!
var lowPeoplePerPage=10;
// shows FirstName, LastName, Health, Edu, Shelter
var PeopleRightView={
	style: {font:"25px myKaiti", fill:"black"},
	createNew: function(data){
		var v=MainGame.game.make.sprite(0,0,"peopleViewRightBg");
		// let right view block click events
		v.inputEnabled=true;
		v.input.priorityID=101;

		// name, health, edu, shelter
		v.data=JSON.parse(JSON.stringify(data));
		// ListView: [lowPeoplePerPage] items (slots)
			// createNew(textures, margin, itemSize, itemCallback, isHorizontal)
		v.listView=DListView.createNew(
			{},				// don't need textures
			{l:15,t:40},	// margin inside the list view
			{w:400, h:40},	// size of an item
			function(index){PeopleRightView.onPersonSelected(v,index)},	// forwards the callback
			false,			// not horizontal
			110				// priority ID
		);
		v.addChild(v.listView);
		// PageIndicator: N pages
		var pageCount=Math.ceil(data.length/lowPeoplePerPage);
		v.pageIndicator=DPageIndicator.createNew(
			pageCount,
			{width:400,textPos:{x:180,y:5}},	// width of the pi & pos of "4/7"
			function(index){PeopleRightView.onPageChanged(v,index)},
			111				// priority ID
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
		console.log("  and the person's data is:",view.data[globalIndex]);
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
			+oneEntryData.education+" | Sht:"+oneEntryData.shelter;
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

/************************************************************************************/

// change item per page here!
var midHiPeoplePerPage=5;
// shows the 3 lists(bu,mer,mil) with portraits
var PeopleLeftView={
	style: {font:"20px myKaiti", fill:"black"},
	BuType: 0,	// for us to remember, not actually in use, may be removed ITF.
	MerType: 1,	// ditto.
	MilType: 2,	// ditto.
	createNew: function(buData,merData,milData){
		var v=MainGame.game.make.sprite(0,0,"peopleViewLeftBg");
		// let left view block click events
		v.inputEnabled=true;
		v.input.priorityID=101;
		// setup last selected
		v.lastSelected=null;

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
				true, 					// is horizontal
				110						// priorityID
			);
			v.listViews[i].x=10;		// TODO: adjust it!
			v.listViews[i].y=50+150*i;	// TODO: adjust it!
			v.addChild(v.listViews[i]);
			v.pageIndicators[i]=DPageIndicator.createNew(
				Math.ceil(v.data3[i].length/midHiPeoplePerPage),// items per page
				{width:400,textPos:{x:180,y:5}},	// width & pos of "4/6"
				createCallback(i,false),			// callback func
				111									// priorityID
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
		// show the detail info of that mid-hi person
		if(view.lastSelected===globalIndex){
			view.parent.hideContractView();
			view.lastSelected=null;
		}else{
			var personData=view.data3[type][index];
			view.parent.showContractView(personData);
			view.lastSelected=globalIndex;
		}
	},
	onPageChanged: function(view,type,index){
		console.log("Page changed! type,index=",type,index);
		PeopleLeftView._setupPage_(view,type,index);
	},
	// makes the portrait + name. TODO: re-arrange the visual elements
	_makeEntry_: function(oneEntryData){
		var entrySprite=MainGame.game.make.sprite(0,0,"smallPort"+oneEntryData.portIndex);
		var entryText=MainGame.game.make.text(0,50,oneEntryData.name,PeopleLeftView.style);
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

var PeopleContractView={
	pays: [1,2,3,5,7,10,15,20,30,40,50,75,100,150,200,300,500],
	createNew: function(personData){
		var v=MainGame.game.make.sprite(0,0,'peopleViewContractBg');
		if(!personData){
			personData={
				name: "Tobe Hired",
				port: "smallPort0",
				payLevel: 0,
				hired: false
			};
		}
		v.data=JSON.parse(JSON.stringify(personData));
		v.inputEnabled=true;
		v.input.priorityID=120;

		// TODO: adjust layout!!
		// setup its elements
			// port & name
		v.port=MainGame.game.make.sprite(10,10,"smallPort"+personData.portIndex);
		v.addChild(v.port);
		v.nameLabel=MainGame.game.make.text(100,10,personData.name);
		v.addChild(v.nameLabel);
			// "-" payment "+"
		v.decButton=MainGame.game.make.sprite(10,150,"decButton");
		v.decButton.inputEnabled=true;
		v.decButton.input.priorityID=121;
		v.addChild(v.decButton);
		v.incButton=MainGame.game.make.sprite(100,150,"incButton");
		v.incButton.inputEnabled=true;
		v.incButton.input.priorityID=121;
		v.addChild(v.incButton);
		v.payLabel=MainGame.game.make.text(50,150,""+PeopleContractView.pays[personData.payLevel]);
		v.addChild(v.payLabel);
		v.decButton.events.onInputUp.add(function(){PeopleContractView.onPaymentChanged(v,false)});
		v.incButton.events.onInputUp.add(function(){PeopleContractView.onPaymentChanged(v,true)});
		if(personData.payLevel===0)
			v.decButton.visible=false;
		if(personData.payLevel===PeopleContractView.pays.length-1)
			v.incButton.visible=false;
			// "fire" workStatus "hire"
		v.workLabel=MainGame.game.make.text(150,300,personData.hired?"Hired":"Not Hired");
		v.addChild(v.workLabel);
		v.fireButton=MainGame.game.make.sprite(50,300,"btnFire");
		v.fireButton.inputEnabled=true;
		v.fireButton.input.priorityID=121;
		v.fireButton.events.onInputUp.add(function(){PeopleContractView.onWorkChanged(v,true)});
		v.addChild(v.fireButton);
		v.hireButton=MainGame.game.make.sprite(300,300,"btnHire");
		v.hireButton.inputEnabled=true;
		v.hireButton.input.priorityID=121;
		v.hireButton.events.onInputUp.add(function(){PeopleContractView.onWorkChanged(v,false)});
		v.addChild(v.hireButton);

		return v;
	},
	onPaymentChanged: function(view, isInc){
		view.data.payLevel+=(isInc?1:-1);
		view["decButton"].visible=(view.data.payLevel>0);
		view["incButton"].visible=(view.data.payLevel<PeopleContractView.pays.length-1);
		view["payLabel"].text=""+PeopleContractView.pays[view.data.payLevel];
	},
	onWorkChanged: function(view, isFire){
		view.data.hired=(!isFire);
		view.workLabel.text=(view.data.hired?"Hired":"Not Hired");
	},
};

var PeopleView={
	// TODO: please see the required format of lowData, buData, etc.
	createNew: function(lowData, buData, merData, milData){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');

		// TODO: setup the actual position
		pv.x=100, pv.y=100;

		// setup the mask
		/* global DUiMask */
		pv.uiMask=DUiMask.createNew(100,function(){
			pv.destroy();
		});
		pv.addChild(pv.uiMask);
		pv.uiMask.fillScreen(pv);

		// create low people view (right)
		//	for debug: if there's no data input
		if(!lowData)
			lowData=MainGame.population.lowList();
		if(!buData)
			buData=MainGame.population.roleList("?");
		if(!merData)
			merData=MainGame.population.roleList("$");
		if(!milData)
			milData=MainGame.population.roleList("!");
		console.log("Now bu,mer and mil is:", buData, merData, milData);

		// People Right View
		pv.right=PeopleRightView.createNew(lowData);
		pv.right.x=450;
		pv.addChild(pv.right);
		// People Left View
		pv.left=PeopleLeftView.createNew(buData,merData,milData);
		pv.addChild(pv.left);

		// // Class funcs
		pv.setVisible=function(value){pv.visible=value};
		pv.showContractView=function(personData){PeopleView.showContractView(pv,personData)};
		pv.hideContractView=function(){PeopleView.hideContractView(pv)};

		return pv;
	},
	showContractView: function(view,personData){
		if(view.contract){
			view.contract.destroy();
			view.contract=null;
		}
		view.contract=PeopleContractView.createNew(personData);
		view.contract.x=view.right.x;
		view.addChild(view.contract);
	},
	hideContractView: function(view){
		if(view.contract){
			view.contract.destroy();
			view.contract=null;
		}
	}
};
