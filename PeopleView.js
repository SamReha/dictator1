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
		console.log(view.lastSelected+" "+globalIndex);
		if(view.lastSelected===globalIndex){
			view.parent.hideContractView();
			view.lastSelected=null;
		}else{
			var personDataRef=view.data3[type][index];
			view.parent.showContractView(personDataRef);
			view.lastSelected=globalIndex;
		}
		console.log(view.lastSelected);
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
	// formula for pay levels: 1.073^(5(x+1)+4)
	// to calculate expected pay: math.floor(Influence/5)
	pays: [1,2,3,5,7,10,15,22,31,44,63,90,129,183,261,371,528,752,1073],
	contractStyle: {font:"20px myKaiti", fill:"black", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
	styleButton: {font:"32px myKaiti", fill:"#ffffff", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
	createNew: function(personDataRef){
		var v=MainGame.game.make.sprite(0,0,'peopleViewContractBg');
		v.dataRef=personDataRef;
		v.inputEnabled=true;
		v.input.priorityID=120;
		v.newPayLevel=(personDataRef.payLevel?personDataRef.payLevel:0);
		var title = "";
		var job = "";
		// TODO: adjust layout!!
		// setup its elements
			// port & name

			// use a table
		var textureString;
		switch (personDataRef.role) {
			case Person.Bureaucrat:
				title = personDataRef.type===1?"Bureaucrat":"Minister of Bureaucracy";
				job = "Minister of Bureaucracy";
				textureString = 'bureaucrat_port_' + personDataRef.portIndex;
				break;
			case Person.Merchant:
				title = personDataRef.type===1?"Financier":"Minister of Finance";
				job = "Minister of Finance";
				textureString = 'merchant_port_' + personDataRef.portIndex;
				break;
			case Person.Military:
				title = personDataRef.type===1?"Military Officer":"Minister of the Military";
				job = "Minister of the Military";
				textureString = 'military_port_' + personDataRef.portIndex;
				break;
			default:
				break;
		}

		// // ----Portrait, Name, and Title----
		v.port = MainGame.game.make.sprite((v.width/8), (v.height/9), textureString);
		v.port.anchor.setTo(0.5,0.5);
		v.port.scale.setTo(1.5,1.5);
		v.addChild(v.port);

		v.nameLabel=MainGame.game.make.text((v.width/4),(v.height/10),personDataRef.name,PeopleContractView.contractStyle);
		v.nameLabel.anchor.setTo(0,0.5);
		v.addChild(v.nameLabel);

		v.workLabel=MainGame.game.make.text((v.width/4),(v.height/7),title,PeopleContractView.contractStyle);
		v.workLabel.anchor.setTo(0,0.5);
		v.addChild(v.workLabel);

		// ----Current Payment----
		v.currentPayLabel=MainGame.game.make.text((v.width*1/16), (v.height*13/48), "",PeopleContractView.contractStyle);
		v.currentPayLabel.anchor.setTo(0,0.5);
		v.currentPay=MainGame.game.make.text(0, 0, "",PeopleContractView.contractStyle);
		v.currentPay.anchor.setTo(0.5,0.5);
		if(v.dataRef.type===Person.Hi){
			v.currentPayLabel.text=personDataRef.name+"'s current annual salary is ________.";
			v.currentPay=PeopleContractView.pays[personDataRef.payLevel];
			v.currentPay.x=(v.currentPayLabel.width*7/8);
		}else{
			console.log("Infulential");
			v.currentPayLabel.text="___________________ is available to be hired\n  as a new "+job+"."
			v.currentPay.text=personDataRef.name;
			v.currentPay.x=(v.currentPayLabel.width*3/12); v.currentPay.y=(v.currentPayLabel.height*-7/24);
		}
		v.addChild(v.currentPayLabel);
		v.currentPayLabel.addChild(v.currentPay);

		// // ----Expected Payment----
		v.expectedPayLabel=MainGame.game.make.text((v.width*1/16), (v.height*13/30), "Ministers with a similar amount of Influence\n  are expected to be paid ________ annually.",PeopleContractView.contractStyle);
		v.expectedPayLabel.anchor.setTo(0,0.5);
		v.addChild(v.expectedPayLabel);
		v.expectedPay=MainGame.game.make.text((v.expectedPayLabel.width*2/3), (v.expectedPayLabel.height*5/24), "$"+2+"K",PeopleContractView.contractStyle);
		v.expectedPay.anchor.setTo(0.5,0.5);
		v.expectedPayLabel.addChild(v.expectedPay);

		// ----Set New Payment----
		v.newPayLabel=MainGame.game.make.text((v.width*1/16),(v.height*27/48),"Set their new salary:       ________",PeopleContractView.contractStyle);
		v.addChild(v.newPayLabel);

		v.decButton=MainGame.game.make.button((v.newPayLabel.width*13/20),(v.newPayLabel.height*3/8),'redMinusButton',function(){
			PeopleContractView.onPaymentChanged(v,false)},v,1,0,2,1);
		v.decButton.anchor.setTo(0.5,0.5);
		v.decButton.scale.setTo(0.5,0.5);
		v.decButton.input.priorityID=121;
		v.newPayLabel.addChild(v.decButton);

		v.incButton=MainGame.game.make.button((v.newPayLabel.width*21/20),(v.newPayLabel.height*3/8),'redPlusButton',function(){
			PeopleContractView.onPaymentChanged(v,true)},v,1,0,2,1);
		v.incButton.anchor.setTo(0.5,0.5);
		v.incButton.scale.setTo(0.5,0.5);
		v.incButton.input.priorityID=121;
		v.newPayLabel.addChild(v.incButton);

		v.newPay=MainGame.game.make.text((v.newPayLabel.width*17/20),(v.newPayLabel.height*3/8),"$"+PeopleContractView.pays[v.newPayLevel]+"K",PeopleContractView.contractStyle);
		v.newPay.anchor.setTo(0.5,0.5);
		v.newPayLabel.addChild(v.newPay);

		if(v.newPayLevel===0)
			v.decButton.visible=false;
		if(v.newPayLevel===PeopleContractView.pays.length-1)
			v.incButton.visible=false;

		// ----Text Alerting Player to Important Information----
		/*global MainGame*/
		v.playerAlertLabel=MainGame.game.make.text((v.width*1/16),(v.height*3/4),"",PeopleContractView.contractStyle);
		v.playerAlertLabel.anchor.setTo(0,0.5);
		v.playerAlert1=MainGame.game.make.text(0,0,"",PeopleContractView.contractStyle);
		v.playerAlert1.anchor.setTo(0.5,0.5);
		v.playerAlert2=MainGame.game.make.text(0,0,"",PeopleContractView.contractStyle);
		v.playerAlert2.anchor.setTo(0.5,0.5);

		if(personDataRef.type===2){
			// ----Contract Renewal Deadline----
			v.playerAlertLabel.text="Renewing this contract will extend\n  the renwal deadline from ________ to ________.";
			v.playerAlert1.text=(1950+MainGame.global.turn-1)+personDataRef.renewCount;
			v.playerAlert1.x=(v.playerAlertLabel.width*1/2); v.playerAlert1.y=(v.playerAlertLabel.height*1/2);
			v.playerAlert2.text=(1950+MainGame.global.turn-1)+4;
			v.playerAlert2.x=(v.playerAlertLabel.width*3/4); v.playerAlert2.y=(v.playerAlertLabel.height*1/2);
		}else{
			// ----Current Minister of This Role----
			var minister = MainGame.population.typeRoleList(Person.Hi,personDataRef.role);
			if(minister.length>0){
				v.playerAlertLabel.text="Hiring ___________________ as the new minister\n  will replace ___________________.";
				v.playerAlert1.text=personDataRef.name;
				v.playerAlert1.x=(v.playerAlertLabel.width*1/8); v.playerAlert1.y=(v.playerAlertLabel.height*1/4);
				v.playerAlert2.text=minister[0].name;
				v.playerAlert2.x=(v.playerAlertLabel.width*2/5); v.playerAlert2.y=(v.playerAlertLabel.height*3/4);
			}else{
				v.playerAlertLabel.text="Hiring ___________________ will not replace\n  any of the current ministers.";
				v.playerAlert1.text=personDataRef.name;
				v.playerAlert1.x=(v.playerAlertLabel.width*2/5); v.playerAlert1.y=(v.playerAlertLabel.height*-7/24);
			}
		}
		v.addChild(v.playerAlertLabel);
		v.playerAlertLabel.addChild(v.playerAlert1);
		v.playerAlertLabel.addChild(v.playerAlert2);

		// ----Hire/Renew, Fire, and Cancel Buttons
		if(personDataRef.type===2){
			v.fireButton=MainGame.game.make.button((v.width*1/5),(v.height*8/9),'small_generic_button',function(){
				v.fireButton.freezeFrames=true;
				PeopleContractView.onWorkChanged(v,true);
			},v.fireButton,0,1,0,0);
			v.fireButton.anchor.setTo(0.5,0.5);
			v.fireButton.input.priorityID=121;
			v.addChild(v.fireButton);
			v.fireText=MainGame.game.make.text(0,0,"Fire",PeopleContractView.styleButton);
			v.fireText.anchor.x=0.5;
			v.fireText.anchor.y=0.5;
			v.fireButton.addChild(v.fireText);
		}

		v.cancelButton=MainGame.game.add.button((v.width*1/2),(v.height*8/9),'small_generic_button',function(){
			v.cancelButton.freezeFrames=true;
			v.parent.hideContractView();
		},v,0,1,0,2);
		v.cancelButton.anchor.setTo(0.5,0.5);
		v.cancelButton.input.priorityID=121;
		v.cancelButton.name="This is a cancle butto";
		v.addChild(v.cancelButton);

		v.cancelText=MainGame.game.make.text(0,0,"Cancel",PeopleContractView.styleButton);
		v.cancelText.anchor.x=0.5;
		v.cancelText.anchor.y=0.5;
		v.cancelButton.addChild(v.cancelText);

		v.hireButton=MainGame.game.make.button((v.width*4/5),(v.height*8/9),'small_generic_button',function(){
			v.hireButton.freezeFrames=true;
			PeopleContractView.onWorkChanged(v,false);
		},v.hireButton,0,1,0,0);
		v.hireButton.anchor.setTo(0.5,0.5);
		v.hireButton.input.priorityID=121;
		v.addChild(v.hireButton);
		v.hireText=MainGame.game.make.text(0,0,personDataRef.type===1?"Hire":"Renew",PeopleContractView.styleButton);
		v.hireText.anchor.x=0.5;
		v.hireText.anchor.y=0.5;
		v.hireButton.addChild(v.hireText);

		return v;
	},
	onPaymentChanged: function(view, isInc){
		view.newPayLevel+=(isInc?1:-1);
		view["decButton"].visible=(view.newPayLevel>0);
		view["incButton"].visible=(view.newPayLevel<PeopleContractView.pays.length-1);
		view["newPay"].text="$"+PeopleContractView.pays[view.newPayLevel]+"K";
	},
	onWorkChanged: function(view, isFire){
		// unSetHiClass removes their salary from their home and sets them to mid
		if(isFire){
			view.dataRef.payLevel=0;
			view.dataRef.unSetHighClass();
		}
		else{
			view.dataRef.payLevel=view.newPayLevel;
			view.dataRef.setHighClass(PeopleContractView.pays[view.dataRef.payLevel]);
		}
		// Update the UI
		MainGame.hud.coalitionFlag.updateSelf();

		// Remake the contract view
		view.parent.showContractView(view.dataRef);
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
			view.contract.destroy();
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
			view.contract.destroy();
			view.contract=null;
			view.left.lastSelected=null;
		}
	}
};
