/* global MainGame */

// change item per page here!
var lowPeoplePerPage=8;
// shows FirstName, LastName, Health, Edu, Shelter
var PeopleRightView={
	style: {font:"20px myKaiti", fill:"black", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.5)", shadowOffsetX: 1, shadowOffsetY: 1 },
	headerStyle: {font:"28px myKaiti", fill:"white", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.5)", shadowOffsetX: 1, shadowOffsetY: 1 },
	createNew: function(dataRef){
		var v=MainGame.game.make.sprite(0,0,"peopleViewRightBg");
		// let right view block click events
		v.inputEnabled=true;
		v.input.priorityID=101;

		// name, health, edu, shelter
		v.dataRef=dataRef;
		// ListView: [lowPeoplePerPage] items (slots)
			// createNew(textures, margin, itemSize, itemCallback, isHorizontal)
		v.labelText=MainGame.game.make.text((v.width*1/2),(v.height*3/38),"Working Class",PeopleRightView.headerStyle);
		v.labelText.anchor.setTo(0.5,0.5);
		v.addChild(v.labelText);
		v.listView=DListView.createNew(
			{},						// don't need textures
			{l:0,t:0},			// margin inside the list view
			{w:(v.width*4/5), h:(v.height*1/11)},			// size of an item
			function(index){PeopleRightView.onPersonSelected(v,index)},	// forwards the callback
			false,					// not horizontal
			110						// priority ID
		);
		v.listView.x=(v.width*1/10); v.listView.y=(v.height*1/8);
		v.addChild(v.listView);
		// DPageIndicator: N pages
		var pageCount=Math.ceil(dataRef.length/lowPeoplePerPage);
		v.pageIndicator=DPageIndicator.createNew((v.width*1/8),{x:(v.width*1/2),y:0});//width, textPos
		v.pageIndicator.setModel(0, pageCount);	// current, max
		v.pageIndicator.setController(function(index){PeopleRightView.onPageChanged(v,index)}, 111);
		v.pageIndicator.y=(v.height*43/48);
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
		// view.dataRef[globalIndex].name+="-Changed by Yi";
		// TODO: center the person's housing unit	
	},
	onPageChanged: function(view,index){
		//console.log("PeoplePageChanged: ",index);
		PeopleRightView._setupPage_(view,index);
	},
	// each entry is like "Sam Reha | Hth:50 | Edu:50 | Sht:50"
	_makeEntry_: function(view,oneEntryData){
		var entrySprite=MainGame.game.make.button(0,(view.height*1/20),'nameplate_button',function(){
			if(oneEntryData.home !== null){
				entrySprite.freezeFrames=true;
				MainGame.board.cameraCenterOn(oneEntryData.home);
				/*global BoardController*/
				BoardController.showTileDetail(MainGame.board.controller, oneEntryData.home);
				view.parent.uiMask.destroy();
				view.parent.destroy();
			}},entrySprite,1,0,2,1);
		entrySprite.input.priorityID=120;
		var home = "Homeless"; var work = "Unemployed";
		if(oneEntryData.home !== null){
			home=MainGame.board.at(oneEntryData.home).getBuilding().playerLabel;
		}
		if(oneEntryData.workplace !== null){
			work=MainGame.board.at(oneEntryData.workplace).getBuilding().playerLabel;
		}
		var entryString=oneEntryData.name+" ("+home+") ("+work+")";
		var entryText=MainGame.game.make.text((entrySprite.width*1/36),(entrySprite.height*1/2),entryString,PeopleRightView.style);
		entryText.anchor.setTo(0,0.5);
		entrySprite.addChild(entryText);
		return entrySprite;
	},
	// each page contains [lowPeoplePerPage] entries
	_setupPage_: function(view,pageIndex){
		view.listView.removeAll();
		var startIndex=pageIndex*lowPeoplePerPage;
		var endIndex=Math.min(startIndex+lowPeoplePerPage,view.dataRef.length);
		for(var i=startIndex;i<endIndex;i++)
			view.listView.add(PeopleRightView._makeEntry_(view,view.dataRef[i]));
	},
};

/************************************************************************************/

// change item per page here!
var midHiPeoplePerPage=5;
// shows the 3 lists(bu,mer,mil) with portraits
var PeopleLeftView={
	style: {font:"24px myKaiti", fill:"white", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
    verticalBorderWidth: 30,
    horizontalBorderWidth: 20,
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
		v.backgrounds=[null,null,null];
		v.labels=[null,null,null];
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
			v.backgrounds[i]= MainGame.game.make.graphics();
	        var backgroundX = (v.width*3/48);
	        var backgroundY = (v.height*i/3) + (v.height*1/27);
	        var backgroundWitdh = v.width - ((v.width*3/48) * 2);
	        var backgroundHeight = (v.height*7/27);
	        v.backgrounds[i].lineStyle(0);
	        v.backgrounds[i].beginFill(0x000000, 0.33);
	        v.backgrounds[i].drawRect(backgroundX, backgroundY, backgroundWitdh, backgroundHeight);
	        v.backgrounds[i].endFill();
	        v.addChild(v.backgrounds[i]);

	        v.labels[i] = MainGame.game.make.text((v.width*1/2),(v.height*i/3)+(v.height*2/27),"",PeopleLeftView.style);
	        v.labels[i].anchor.setTo(0.5,0.5);
	        switch (i){
	        	case 0:
	        		v.labels[i].text = "Bureaucrats";
	        		break;
	        	case 1:
	        		v.labels[i].text = "Financiers";
	        		break;
	        	case 2:
	        		v.labels[i].text = "Military Officers";
	        		break;
	        }
	        v.addChild(v.labels[i]);


			v.listViews[i]=DListView.createNew(
				{},
				{l:0,t:0},			// margin inside the list view
				{w:(v.width*1/(midHiPeoplePerPage+1)),h:(v.height*1/3)},	// divided width of view and view height
				createCallback(i,true),	// callback func
				true, 					// is horizontal
				110						// priorityID
			);
			v.listViews[i].x=(v.width/((midHiPeoplePerPage+1)*2));		// TODO: adjust it!
			v.listViews[i].y=(v.height*1/3)*i;	// TODO: adjust it!
			// v.listViews[i].anchor.setTo(0.5,0.5);
			v.addChild(v.listViews[i]);

			v.pageIndicators[i]=DPageIndicator.createNew((v.width*1/8),{x:(v.width*1/2),y:0});
			v.pageIndicators[i].setModel(0, Math.ceil(v.data3[i].length/midHiPeoplePerPage));
			v.pageIndicators[i].setController(createCallback(i,false), 111);
			v.pageIndicators[i].x=0;			// TODO: adjust it!
			v.pageIndicators[i].y=(v.height*i/3) + (v.height*22/81);	// TODO: adjust it!
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
	_makeEntry_: function(oneEntryData,view,index) {
		var buttonString;
		var portraitString;
		var roleNumber;
		switch (oneEntryData.role) {
			case Person.Bureaucrat:
				roleNumber = 0;
				buttonString = 'portrait_border_bureau';
				portraitString = 'bureaucrat_port_' + oneEntryData.portIndex;
				break;
			case Person.Merchant:
				roleNumber = 1;
				buttonString = 'portrait_border_finance';
				portraitString = 'merchant_port_' + oneEntryData.portIndex;
				break;
			case Person.Military:
				roleNumber = 2;
				buttonString = 'portrait_border_military';
				portraitString = 'military_port_' + oneEntryData.portIndex;
				break;
			default:
				break;
		}

		var entrySprite = MainGame.game.make.button(0, 0, buttonString, function(){
			PeopleLeftView.onPersonSelected(view,roleNumber,index);},entrySprite,1,0,2,1);
		entrySprite.input.priorityID=120;
		var portrait = MainGame.game.make.sprite(0, 0, portraitString);
		portrait.anchor.setTo(0.5,0.5);
		entrySprite.addChild(portrait);
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
			view.listViews[type].add(PeopleLeftView._makeEntry_(view.data3[type][i],view,i));
	},
};


var PeopleView={
	// TODO: please see the required format of lowData, buDataRef, etc.
	createNew: function(lowData, buDataRef, merDataRef, milDataRef){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');

		// TODO: setup the actual position
		pv.x=190, pv.y=100;

		// audio
		pv.sfx = game.make.audio('message_close');

		// setup the mask
		/* global DUiMask */
		pv.uiMask=DUiMask.createNew();
		pv.uiMask.setController(100, function(){
			pv.uiMask.destroy();
			pv.sfx.play();
			pv.destroy();
		});

		// create low people view (right)
		//	for debug: if there's no dataRef input
		if(!lowData)
			lowData=MainGame.population.lowList();
		if(!buDataRef){
			console.log("bureaucracy: "+MainGame.population.typeRoleList(Person.Mid,Person.Bureaucrat));
			buDataRef=MainGame.population.typeRoleList(Person.Hi,Person.Bureaucrat);
			buDataRef=buDataRef.concat(MainGame.population.typeRoleList(Person.Mid,Person.Bureaucrat));
		}
		if(!merDataRef){
			merDataRef=MainGame.population.typeRoleList(Person.Hi,Person.Merchant);
			merDataRef=merDataRef.concat(MainGame.population.typeRoleList(Person.Mid,Person.Merchant));
		}
		if(!milDataRef){
			milDataRef=MainGame.population.typeRoleList(Person.Hi,Person.Military);
			milDataRef=milDataRef.concat(MainGame.population.typeRoleList(Person.Mid,Person.Military));
		}
		//console.log("Now bu,mer and mil is:", buDataRef, merDataRef, milDataRef);

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
