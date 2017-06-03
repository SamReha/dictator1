var Dossier ={
	createNew: function(person){
		var dossier = MainGame.game.make.group();

		dossier.page = Page.createNew();
		//dossier.page.anchor.setTo(.5,.5);
		dossier.addChild(dossier.page);

		dossier.person = person;

		dossier.name = MainGame.game.make.text(0,-dossier.height*9/25,person.name.replace(" ","\n"),DossierController.header1);
		dossier.name.anchor.setTo(.5,.5);
		dossier.addChild(dossier.name);

		dossier.portBack = MainGame.game.make.sprite(-dossier.width*3/10,-dossier.height*7/20,(person.type===Person.Hi?'frameBorder':'photographBorder'));
		dossier.portBack.anchor.setTo(.5,.5);
		dossier.portBack.scale.setTo(1.5,1.5);
		dossier.addChild(dossier.portBack);

		if(person.type!==Person.Low){
			dossier.portFront = MainGame.game.make.sprite(0,0,person.getPortTexString());
			dossier.portFront.anchor.setTo(.5,(person.type===Person.Hi?.5:20/33));
			dossier.portBack.addChild(dossier.portFront);
		}

		dossier.minPin = MainGame.game.make.sprite(dossier.width*3/10,-dossier.height*7/20,'ministerPinLarge');
		dossier.minPin.anchor.setTo(.495,.51);
		dossier.minPin.scale.setTo(.42,.42);
		dossier.addChild(dossier.minPin);
		dossier.sePin = MainGame.game.make.sprite(dossier.width*3/10,-dossier.height*7/20,'socialElitePinLarge');
		dossier.sePin.anchor.setTo(.5,.5);
		dossier.sePin.scale.setTo(.26,.26);
		dossier.addChild(dossier.sePin);
		if(person.type===Person.Low){
			dossier.sePin.visible = false;	dossier.minPin.visible = false;
		} else if(person.type===Person.Mid){
			dossier.sePin.visible = true;	dossier.minPin.visible = false;
		} else{
			dossier.sePin.visible = false;	dossier.minPin.visible = false;
		}

		var box = MainGame.game.make.graphics();
		box.lineStyle(4,0x000000,.5);
		box.drawRoundedRect(0,0,dossier.width*3/10,dossier.width*1/5,10);
		dossier.homeBox = MainGame.game.make.sprite(-dossier.width*1/5,-dossier.height*1/9,box.generateTexture());
		dossier.homeBox.anchor.setTo(.5,.5);
		dossier.addChild(dossier.homeBox);
		box.clear();

		dossier.homeText = MainGame.game.make.text(-dossier.width*1/5,-dossier.height*1/9,"Home:",DossierController.header2);
		dossier.homeText.anchor.setTo(.5,.5);
		dossier.addChild(dossier.homeText);

		dossier.transferButton = TextButton.createNew(dossier.width*1/5, -dossier.height*1/9, 'med_generic_button', function() {
			dossier.parent.parent.transferDossier(person);
			dossier.transferButton.visible = false;
			MainGame.game.time.events.add(1500,function(){dossier.backButton.visible=true;},dossier);
		}, null, 0, 2, 1, 2, 'Minister\nContract', DossierController.buttonStyle);
		dossier.transferButton.anchor.setTo(.5,.5);
		dossier.transferButton.label.x = 0;	dossier.transferButton.label.y = 0;
		dossier.addChild(dossier.transferButton);

		dossier.backButton = TextButton.createNew(dossier.width*1/5, -dossier.height*1/9, 'med_generic_button', function() {
			dossier.parent.transferDossier(person);
			dossier.backButton.visible = false;
			MainGame.game.time.events.add(1500,function(){dossier.transferButton.visible=true;},dossier);
		}, null, 0, 2, 1, 2, 'Cancel\nContract', DossierController.buttonStyle);
		dossier.backButton.anchor.setTo(.5,.5);
		dossier.backButton.label.x = 0;	dossier.backButton.label.y = 0;
		dossier.addChild(dossier.backButton);
		dossier.backButton.visible = false;

		if(person.type!==Person.Mid){
			dossier.transferButton.visible = false;
			dossier.backButton.visible = false;
		}

		dossier.refreshPage = function(){Dossier.refreshPage(dossier)};
		dossier.inputSwitch = function(state){Dossier.inputSwitch(dossier,state)};

		return dossier;
	},

	refreshPage: function(dossier){
		if(dossier.person.type===Person.Low){
			dossier.sePin.visible = false;
			dossier.minPin.visible = false;

		} else if(dossier.person.type===Person.Mid){
			if(!dossier.sePin.visible && !dossier.minPin.visible){
				dossier.sePin.visible = true;
				var targetScaleX = view.stamp.scale.x;	var targetScaleY = view.stamp.scale.y;	var targetAlpha = view.stamp.alpha;
				dossier.sePin.scale.x = 1; dossier.sePin.scale.y = 1;	dossier.sePin.alpha = 0;
			
				MainGame.game.add.tween(dossier.sePin).to({alpha:targetAlpha},375,Phaser.Easing.Quartic.In,true);
				MainGame.game.add.tween(dossier.sePin.scale).to({x:targetScaleX,y:targetScaleY},375,Phaser.Easing.Quartic.In,true);
			}
			if(!dossier.sePin.visible &&dossier.minPin.visible){
				dossier.sePin.visible = true;
				dossier.minPin.alpha = 1;
				var tween = MainGame.game.add.tween(dossier.minPin).to({alpha:0},750,Phaser.Easing.Quadratic.Out,true);
				tween.onComplete.add(function(){dossier.minPin.visible = false;dossier.minPin.alpha=1;});
			}
		} else if(dossier.person.type===Person.Hi) {
			if(dossier.sePin.visible && !dossier.minPin.visible){
				dossier.minPin.visible = true;
				//console.log(dossier.minPin);
				var targetScaleX = dossier.minPin.scale.x;	var targetScaleY = dossier.minPin.scale.y;	var targetAlpha = dossier.minPin.alpha;
				dossier.minPin.scale.x = 0; dossier.minPin.scale.y = 0;	dossier.minPin.alpha = 0;
			
				MainGame.game.add.tween(dossier.minPin).to({alpha:targetAlpha},1000,Phaser.Easing.Sinusoidal.Out,true,375);
				var tween = MainGame.game.add.tween(dossier.minPin.scale).to({x:targetScaleX,y:targetScaleY},1000,Phaser.Easing.Sinusoidal.Out,true,375);
				tween.onComplete.add(function(){1375,dossier.sePin.visible = false;});
			}
		}
	},

	inputSwitch: function(dossier,state){
		dossier.page.inputEnabled = state;
		if(dossier.transferButton!==undefined&&dossier.transferButton!==null){
			var ID = dossier.transferButton.input.priorityID;
			dossier.transferButton.inputEnabled = state;
			dossier.transferButton.input.priorityID = ID;
		}
	},
};

var DossierController ={
    header1: { font: "32px myKaiti", fill:"black", align: 'center', shadowBlur: 1, shadowColor: "rgba(0,0,0,.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
    header2: { font: "28px myKaiti", fill:"black", shadowBlur: 0, shadowColor: "rgba(0,0,0,.55)", shadowOffsetX: 1, shadowOffsetY: 1 },
    body1:   { font: "20px myKaiti", fill:"black"},
    body2:   { font: "20px myKaiti", fill:"black", align: 'left'},
    buttonStyle: {font:"24px myKaiti", fill:"BurlyWood", shadowColor:"black", shadowOffsetX:2, shadowOffsetY:2},
};