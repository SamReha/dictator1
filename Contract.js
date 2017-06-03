var ContractClipboard={
	createNew: function(cbInfo){
		var contract = MainGame.game.make.group();

		contract.page = Page.createNew();
		//contract.page.anchor.setTo(.5,.5);
		contract.addChild(contract.page);

		contract.contract = PeopleContractView.createNew(cbInfo.personDataRef);
		contract.contract.anchor.setTo(.5,.5);
		contract.addChild(contract.contract);
		
		return contract;
	},
};

var Contract ={
	createNew: function(person){
		var contract = MainGame.game.make.group();

		contract.page = Page.createNew();
		contract.addChild(contract.page);
		contract.person = person;
		contract.newPayLevel=(person.payLevel?person.payLevel:0);

		contract.waterMark = MainGame.game.make.sprite(0,0,'full_symbol');
		contract.waterMark.anchor.setTo(.5,.5);
		contract.waterMark.scale.setTo(1.6,1.6);
		contract.waterMark.alpha = .15;
		contract.addChild(contract.waterMark);

		contract.leftBar = MainGame.game.make.sprite(-contract.width*3/7,0,'vertical_border');
		contract.leftBar.anchor.setTo(.5,.5);
		contract.leftBar.scale.setTo(1.2,1.2);
		contract.leftBar.alpha = .5;
		contract.addChild(contract.leftBar);

		contract.rightBar = MainGame.game.make.sprite(contract.width*3/7,0,'vertical_border');
		contract.rightBar.anchor.setTo(.5,.5);
		contract.rightBar.scale.setTo(1.2,1.2);
		contract.rightBar.alpha = .5;
		contract.addChild(contract.rightBar);

		var box = MainGame.game.make.graphics();
		box.lineStyle(4,0x000000,.5);
		box.drawRoundedRect(0,0,contract.width*1/5,contract.width*1/5,20);
		contract.statusBox = MainGame.game.make.sprite(contract.width*4/15,-contract.height*11/30,box.generateTexture());
		contract.statusBox.anchor.setTo(.5,.5);
		contract.addChild(contract.statusBox);
		box.clear();

		contract.stamp = MainGame.game.make.sprite(0,0,'full_symbol');
		contract.stamp.anchor.setTo(.5,.5);
		contract.statusBox.addChild(contract.stamp);
		contract.stamp.scale.setTo(.5,.5);
		contract.stamp.alpha = .75;
		if(person.type!==Person.Hi)
			contract.stamp.visible = false;

		contract.nameLabel=MainGame.game.make.text((-contract.width*3/8),(-contract.height*2/5),person.name,ContractController.header2);
		contract.nameLabel.anchor.setTo(0,0.5);
		contract.addChild(contract.nameLabel);

		contract.roleLabel=MainGame.game.make.text((-contract.width*3/8),(-contract.height*1/3),"",ContractController.header3);
		// set in updateSelf
		contract.roleLabel.anchor.setTo(0,0.5);
		contract.addChild(contract.roleLabel);

		// ----Current Payment----
		contract.jobLabel=MainGame.game.make.text((-contract.width*13/32), (-contract.height*1/5), "",ContractController.body3);
		contract.jobLabel.anchor.setTo(0,0.5);
		contract.currentPayName=MainGame.game.make.text(0, 0, "",ContractController.body3);
		contract.currentPayName.anchor.setTo(0.5,0.5);
		// set in updateSelf
		contract.addChild(contract.jobLabel);
		contract.jobLabel.addChild(contract.currentPayName);

		// ----Expected Payment----
		contract.expectedPayLabel=MainGame.game.make.text((-contract.width*13/32), (-contract.height*1/20), "Ministers with a similar amount of Influence\n  are expected to be paid ________ annually.",ContractController.body3);
		contract.expectedPayLabel.anchor.setTo(0,0.5);
		contract.addChild(contract.expectedPayLabel);
		contract.expectedPay=MainGame.game.make.text((contract.expectedPayLabel.width*2/3), (contract.expectedPayLabel.height*5/24), "",ContractController.body3);
		// set in updateSelf
		contract.expectedPay.anchor.setTo(0.5,0.5);
		contract.expectedPayLabel.addChild(contract.expectedPay);

		// ----Set New Payment----
		box.lineStyle(4,0x000000,.75);
		box.drawRect(0,0,contract.width*1/4,contract.width*1/8);
		contract.payBox = MainGame.game.make.sprite(contract.width*1/4,contract.height*3/32,box.generateTexture());
		contract.payBox.anchor.setTo(.5,.5);
		contract.addChild(contract.payBox);
		box.clear();

		contract.newPayLabel=MainGame.game.make.text((-contract.width*13/32),(contract.height*7/64),"Set their annual salary:",ContractController.body1);
		contract.newPayLabel.anchor.setTo(0,.5);
		contract.addChild(contract.newPayLabel);

		contract.decButton=MainGame.game.make.button((-contract.width*1/16),(contract.height*1/12),'redMinusButton',function(){
			ContractController.onPaymentChanged(contract,false)},contract,1,0,2,1);
		contract.decButton.anchor.setTo(0.5,0.5);
		contract.decButton.scale.setTo(0.5,0.5);
		contract.decButton.input.priorityID=121;
		contract.payBox.addChild(contract.decButton);

		contract.incButton=MainGame.game.make.button((contract.width*1/16),(contract.height*1/12),'redPlusButton',function(){
			ContractController.onPaymentChanged(contract,true)},contract,1,0,2,1);
		contract.incButton.anchor.setTo(0.5,0.5);
		contract.incButton.scale.setTo(0.5,0.5);
		contract.incButton.input.priorityID=121;
		contract.payBox.addChild(contract.incButton);

		contract.newPay=MainGame.game.make.text(0,0,"",ContractController.header2);
		// set in updateSelf
		contract.newPay.anchor.setTo(0.5,0.5);
		contract.payBox.addChild(contract.newPay);

		if(contract.newPayLevel===0)
			contract.decButton.visible=false;
		if(contract.newPayLevel===ContractController.pays.length-1)
			contract.incButton.visible=false;

		// ----Text Alerting Player to Important Information----
		contract.playerAlertLabel=MainGame.game.make.text((-contract.width*13/32),(contract.height*17/64),"",ContractController.body3);
		contract.playerAlertLabel.anchor.setTo(0,0.5);
		contract.playerAlert1=MainGame.game.make.text(0,0,"",ContractController.body3);
		contract.playerAlert1.anchor.setTo(0.5,0.5);
		contract.playerAlert2=MainGame.game.make.text(0,0,"",ContractController.body3);
		contract.playerAlert2.anchor.setTo(0.5,0.5);
		// set in updateSelf
		contract.addChild(contract.playerAlertLabel);
		contract.playerAlertLabel.addChild(contract.playerAlert1);
		contract.playerAlertLabel.addChild(contract.playerAlert2);

		// ----Hire/Renew, Fire, and Cancel Buttons
		contract.fireButton=TextButton.createNew((-contract.width*1/5),(contract.height*7/18),'small_generic_button',function(){
			ContractController.onWorkChanged(contract,true);
		},contract.fireButton,0,2,1,2,"Fire",ContractController.buttonStyle);
		contract.fireButton.anchor.setTo(0.5,0.5);
		contract.fireButton.label.x = 0;	contract.fireButton.label.y = 0;
		contract.fireButton.input.priorityID=121;
		contract.addChild(contract.fireButton);
		// set visible in updateSelf

		contract.hireButton=TextButton.createNew((contract.width*1/5),(contract.height*7/18),'small_generic_button',function(){
			ContractController.onWorkChanged(contract,false);
		},contract.hireButton,0,2,1,2,"",ContractController.buttonStyle);
		contract.hireButton.anchor.setTo(0.5,0.5);
		contract.hireButton.label.x = 0;	contract.hireButton.label.y = 0;
		contract.hireButton.input.priorityID=121;
		contract.addChild(contract.hireButton);
		contract.hireText=MainGame.game.make.text(0,0,"",ContractController.buttonStyle);
		// set in updateSelf

		// Audio
        contract.openSfx = game.make.audio('message_open');
        contract.openSfx.play();
        contract.workChangeSfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        contract.paymentChangeSfx = game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds

		// Class func
		contract.refreshPage=function(){Contract.refreshPage(contract)};

		contract.refreshPage();

		return contract;
	},

	refreshPage: function(view){
		var title = "";
		var job = "";
		switch (view.person.role) {
			case Person.Bureaucrat:
				title = view.person.type===1?"Bureaucrat":"Minister of Bureaucracy";
				job = "Minister of Bureaucracy";
				break;
			case Person.Merchant:
				title = view.person.type===1?"Financier":"Minister of Finance";
				job = "Minister of Finance";
				break;
			case Person.Military:
				title = view.person.type===1?"Military Officer":"Minister of the Military";
				job = "Minister of the Military";
				break;
			default:
				break;
		}

		if(!view.stamp.visible&&view.person.type===Person.Hi){
			view.stamp.visible = true;
			var targetScaleX = view.stamp.scale.x;	var targetScaleY = view.stamp.scale.y;	var targetAlpha = view.stamp.alpha;
			view.stamp.scale.x = 1; view.stamp.scale.y = 1;	view.stamp.alpha = 0;
			view.stamp.x = 0;	view.stamp.y = 0;	view.stamp.angle = 0;
			var targetX = view.stamp.x+MenuController.sqrtEaseFunction(Math.random())*10;	var targetY = view.stamp.y+MenuController.sqrtEaseFunction(Math.random())*10;	var targetRot = view.stamp.angle+MenuController.sqrtEaseFunction(Math.random())*15;

			MainGame.game.add.tween(view.stamp).to({alpha:targetAlpha},375,Phaser.Easing.Quartic.In,true);
			MainGame.game.add.tween(view.stamp.scale).to({x:targetScaleX,y:targetScaleY},375,Phaser.Easing.Quartic.In,true);
			MainGame.game.add.tween(view.stamp).to({x:targetX,y:targetY,angle:targetRot},375,Phaser.Easing.Quadratic.Out,true);
		} else if(view.stamp.visible&&view.person.type===Person.Mid)
			view.stamp.visible = false;

		// ----Portrait, Name, and Title----
		view.roleLabel.text=title;

		// ----Current Payment----
		if(view.person.type===Person.Hi){
			view.jobLabel.text="___________________ is currently working\n  as the "+title+" of Tian.";
			view.currentPayName.text=view.person.name;
			view.currentPayName.x=(view.width*2/9); view.currentPayName.y=(view.jobLabel.height*-7/24);
		}else{
			console.log("Infulential");
			view.jobLabel.text="___________________ is available to be\n  hired as a new "+job+" of Tian."
			view.currentPayName.text=view.person.name;
			view.currentPayName.x=(view.width*2/9); view.currentPayName.y=(view.jobLabel.height*-7/24);
		}

		// ----Expected Payment----
		var payGrade = Math.floor(Math.max(view.person.baseInfluence+view.person.accruedInfluence-5,0)/5);
		view.expectedPay.text="₸ "+PeopleContractView.pays[payGrade];

		// ----Set New Payment----
		view.newPay.text="₸ "+PeopleContractView.pays[view.newPayLevel];

		view.decButton.visible=(view.newPayLevel!==0);
		view.incButton.visible=(view.newPayLevel!==PeopleContractView.pays.length-1);

		// ----Text Alerting Player to Important Information----
		if(view.person.type===2){
			// ----Contract Renewal Deadline----
			view.playerAlertLabel.text="This contract expires at the end of ________\n unless it is renewed before then.";
			view.playerAlert1.text=(1950+MainGame.global.turn-1)+view.person.renewCount;
			view.playerAlert1.x=(view.playerAlertLabel.width*7/8); view.playerAlert1.y=(-view.playerAlertLabel.height*7/24);
		}else{
			// ----Current Minister of This Role----
			var minister = MainGame.population.typeRoleList(Person.Hi,view.person.role);
			if(minister.length>0){
				view.playerAlertLabel.text="Hiring ___________________ as the new minister\n  will replace ___________________.";
				view.playerAlert1.text=view.person.name;
				view.playerAlert1.x=(view.playerAlertLabel.width*13/36); view.playerAlert1.y=(view.playerAlertLabel.height*-7/24);
				view.playerAlert2.text=minister[0].name;
				view.playerAlert2.x=(view.playerAlertLabel.width*1/2); view.playerAlert2.y=(view.playerAlertLabel.height*5/24);
			}else{
				view.playerAlertLabel.text="Hiring ___________________ will not replace\n  any of the current ministers.";
				view.playerAlert1.text=view.person.name;
				view.playerAlert1.x=(view.playerAlertLabel.width*2/5); view.playerAlert1.y=(view.playerAlertLabel.height*-7/24);
				view.playerAlert2.text="";
			}
		}

		// ----Hire/Renew, Fire, and Cancel Buttons
		view.fireButton.visible=(view.person.type===2);
		view.hireButton.label.text=view.person.type===1?"Hire":"Renew";
	},
};

var ContractController ={
	pays: [1,2,3,5,7,10,15,22,31,44,63,90,129,183,261,371,528,752,1073],
    header1:	{ font: "32px myKaiti", fill:"black", shadowBlur: 1, shadowColor: "rgba(0,0,0,.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
    header2:	{ font: "28px myKaiti", fill:"black", shadowBlur: 1, shadowColor: "rgba(0,0,0,.55)", shadowOffsetX: 1, shadowOffsetY: 1 },
    header3:	{ font: "22px myKaiti", fill:"black", shadowBlur: 0, shadowColor: "rgba(0,0,0,.55)", shadowOffsetX: 1, shadowOffsetY: 1 },
    body1:		{ font: "20px myKaiti", fill:"black", shadowBlur: 1, shadowColor: "rgba(0,0,0,.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
    body2:		{ font: "18px myKaiti", fill:"black", boundsAlignH: 'left'},
	body3:		{ font: "18px myKaiti", fill:"black", shadowBlur: 1, shadowColor: "rgba(0,0,0,.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
	nameStyle:	{ font: "32px myKaiti", fill:"black", shadowBlur: 2, shadowColor: "rgba(0,0,0,1)", shadowOffsetX: 1, shadowOffsetY: 1 },
    buttonStyle: {font: "28px myKaiti", fill:"BurlyWood", shadowColor:"black", shadowOffsetX:2, shadowOffsetY:2},

    onPaymentChanged: function(view, isInc){
		view.newPayLevel+=(isInc?1:-1);
		view["decButton"].visible=(view.newPayLevel>0);
		view["incButton"].visible=(view.newPayLevel<PeopleContractView.pays.length-1);
		view["newPay"].text="₸ "+PeopleContractView.pays[view.newPayLevel];

		// Play sfx
		view.paymentChangeSfx.play();
		view.paymentChangeSfx = game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds

		Global.updateMoneyPerTurn();
	},

	onWorkChanged: function(view, isFire){
		// unSetHiClass removes their salary from their home and sets them to mid
		if(isFire){
			view.person.payLevel=0;
			view.person.salary=0;
			view.person.unSetHighClass();
			view.person.renewCount=null;
		}
		else{
			view.person.payLevel=view.newPayLevel;
			view.person.salary=PeopleContractView.pays[view.person.payLevel];
			view.person.setHighClass();
			view.person.renewCount=5;
		}
		// Update the UI
		MainGame.hud.coalitionFlag.updateSelf();

		// MAKE SUM NOOOIIIEZZZ
		view.workChangeSfx.play();
        view.workChangeSfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds

		// update view
		view.refreshPage();
		//console.log("got here");
		view.parent.rightPage.refreshPage();

		Global.updateMoneyPerTurn();
	},

};
