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
		// PageIndicator: N pages
		var pageCount=Math.ceil(dataRef.length/lowPeoplePerPage);
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
		//console.log("Person selected! type,index=",type,globalIndex);
		// show the detail info of that mid-hi person
		if(view.lastSelected===globalIndex){
			view.parent.hideContractView();
			view.lastSelected=null;
		}else{
			var personDataRef=view.data3[type][index];
			view.parent.showContractView(personDataRef);
			view.lastSelected=globalIndex;
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

var PeopleContractView={
	pays: [1,2,3,5,7,10,15,20,30,40,50,75,100,150,200,300,500],
	contractStyle: {font:"20px myKaiti", fill:"black"},
	styleButton: {font:"32px myKaiti", fill:"#ffffff"},
	createNew: function(personDataRef){
		var v=MainGame.game.make.sprite(0,0,'peopleViewContractBg');
		v.dataRef=personDataRef;
		v.inputEnabled=true;
		v.input.priorityID=120;

		// TODO: adjust layout!!
		// setup its elements
			// port & name
		var textureString;
		switch (personDataRef.role) {
			case Person.Bureaucrat:
				textureString = 'bureaucrat_port_' + personDataRef.portIndex;
				break;
			case Person.Merchant:
				textureString = 'merchant_port_' + personDataRef.portIndex;
				break;
			case Person.Military:
				textureString = 'military_port_' + personDataRef.portIndex;
				break;
			default:
				break;
		}

		v.port = MainGame.game.make.sprite(10, 10, textureString);
		v.addChild(v.port);
		v.nameLabel=MainGame.game.make.text(100,10,personDataRef.name,PeopleContractView.contractStyle);
		v.addChild(v.nameLabel);
		// "-" payment "+"
		v.currentPayLabel=MainGame.game.make.text(25, 75, "",PeopleContractView.contractStyle);
		v.currentPay=MainGame.game.make.text(100, 73, "",PeopleContractView.contractStyle);
		if(v.dataRef.type===Person.Hi){
			v.currentPayLabel.text="This person's current annual salary is _____";
			v.currentPay=PeopleContractView.pays[personDataRef.payLevel];
		}else{
			console.log("Infulential");
			v.currentPayLabel.text="This person has not been hired."
			v.currentPay.text="";
		}
		v.addChild(v.currentPayLabel);
		v.addChild(v.currentPay);
		v.decButton=MainGame.game.make.button(10,150,'bracketArrowButton',function(){
			PeopleContractView.onPaymentChanged(v,false)},v,1,0,2,1);
		v.decButton.anchor.x=1;
		v.decButton.scale.x*=-1;
		v.decButton.input.priorityID=121;
		v.addChild(v.decButton);
		v.incButton=MainGame.game.make.button(100,150,'bracketArrowButton',function(){
			PeopleContractView.onPaymentChanged(v,true)},v,1,0,2,1);
		v.incButton.input.priorityID=121;
		v.addChild(v.incButton);
		v.payLabel=MainGame.game.make.text(50,150,""+PeopleContractView.pays[personDataRef.payLevel],PeopleContractView.contractStyle);
		v.addChild(v.payLabel);
		if(personDataRef.payLevel===0)
			v.decButton.visible=false;
		if(personDataRef.payLevel===PeopleContractView.pays.length-1)
			v.incButton.visible=false;
			// "fire" workStatus "hire"
		v.workLabel=MainGame.game.make.text(150,300,personDataRef.type===1?"Elite":"Minister",PeopleContractView.contractStyle);
		v.addChild(v.workLabel);
		v.fireButton=MainGame.game.make.button(50,300,'small_generic_button',function(){
			PeopleContractView.onWorkChanged(v,true)},0,1,0,2);
		v.fireButton.anchor.setTo(0.5,1);
		v.fireButton.input.priorityID=121;
		v.addChild(v.fireButton);
		v.fireText=MainGame.game.make.text(0,0,"Fire",PeopleContractView.styleButton);
		v.fireText.anchor.x=0.5;
		v.fireText.anchor.y=0.5;
		v.fireText.y=-v.fireButton.height/2;
		v.fireButton.addChild(v.fireText);
		v.hireButton=MainGame.game.make.button(300,300,'small_generic_button',function(){
			PeopleContractView.onWorkChanged(v,false)},0,1,0,2);
		v.hireButton.anchor.setTo(0.5,1);
		v.hireButton.input.priorityID=121;
		v.addChild(v.hireButton);
		v.hireText=MainGame.game.make.text(0,0,"Hire",PeopleContractView.styleButton);
		v.hireText.anchor.x=0.5;
		v.hireText.anchor.y=0.5;
		v.hireText.y=-v.hireButton.height/2;
		v.hireButton.addChild(v.hireText);

		return v;
	},
	onPaymentChanged: function(view, isInc){
		view.dataRef.payLevel+=(isInc?1:-1);
		view["decButton"].visible=(view.dataRef.payLevel>0);
		view["incButton"].visible=(view.dataRef.payLevel<PeopleContractView.pays.length-1);
		view["payLabel"].text=""+PeopleContractView.pays[view.dataRef.payLevel];
		console.log("After Payment change:",MainGame.population);
	},
	onWorkChanged: function(view, isFire){
		// unSetHiClass removes their salary from their home and sets them to mid
		if(isFire)
			view.dataRef.unSetHiClass();
		else{
			view.dataRef.payLevel
			view.dataRef.setHiClass();
		}
		view.workLabel.text=(view.dataRef.type===Person.Mid?"Infulence":"Coalition");

		// Update the UI
		MainGame.hud.coalitionFlag.updateSelf();
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
		pv.uiMask=DUiMask.createNew(100,function(){
			pv.destroy();
		});
		pv.addChild(pv.uiMask);
		pv.uiMask.fillScreen(pv);

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
			view.contract.destroy();
			view.contract=null;
		}
		view.contract=PeopleContractView.createNew(personDataRef);
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
