var TrailerScript ={
	init: function(){
		var hud = MainGame.hud;
		hud.moneyPanel.visible = false;
		hud.statsPanel.visible = false;
		hud.funPanel.visible = false;
		hud.coalitionFlag.visible = false;

		MainGame.board.at(82).getBuilding().loadTexture('palace2');

		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.ONE).onUp.
			add(function(){TrailerScript.zoomOutFromPalace();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.TWO).onUp.
			add(function(){TrailerScript.cameraPan();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.THREE).onUp.
			add(function(){TrailerScript.focusOnFactory();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.FOUR).onUp.
			add(function(){TrailerScript.funBar();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.FIVE).onUp.
			add(function(){TrailerScript.generateHomelessCamp();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.SIX).onUp.
			add(function(){TrailerScript.generateRiot();});

		funBarIndex = null;
	},

	zoomOutFromPalace:function(){
		var board = MainGame.board;
		board.cameraZoomAt(Board.zoomLevelList.length-1);
		board.cameraZoomBy(1.1);
		board.cameraCenterOn(82);
		var time = 0;
		MainGame.game.time.events.add(1000,function(){
			var loop = MainGame.game.time.events.loop(5,function(){
				board.cameraZoomBy(-.005);
				time += 5;
				if(time >= 1200){	MainGame.game.time.events.remove(loop);	}
			},this);
		},this);
	},

	cameraPan: function(){
		var board = MainGame.board;
		board.disableAllInteraction();
		board.cameraZoomAt(Board.zoomLevelList.length-1);
		board.cameraCenterOn(46);
		var time = 0;
		MainGame.game.time.events.add(1000,function(){
			var loop = MainGame.game.time.events.loop(10,function(){
				board.cameraMoveBy(7,4);
				time += 10;
				if(time >= 2900){	MainGame.game.time.events.remove(loop);	}
			},this);
		},this);
	},

	focusOnFactory: function(){
		var board = MainGame.board;
		board.cameraZoomAt(2);
		board.cameraCenterOn(113);
		var time = 0;
		MainGame.game.time.events.add(1000,function(){
			var loop = MainGame.game.time.events.loop(5,function(){
				board.cameraZoomBy(.004);
				time += 5;
				if(time >= 1000){	MainGame.game.time.events.remove(loop);	}
			},this);
		},this);
	},

	funBar: function(){
		if(funBarIndex===null){
			MainGame.hud.funPanel.visible = true;
			Global.freedom = 50;
			Global.unrest = 25;
			funBarIndex = 0;
		}else{
			Global.freedom += 5;
			Global.unrest += 10;
			funBarIndex += 1;
		}
		showThermometerUpdate(function(){});
	},

	generateHomelessCamp: function(){

	},

	generateRiot: function(){

	},
};