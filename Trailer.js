var TrailerScript ={
	funBarIndex: null,
	unit: null,
	rioters: 0,

	init: function(){
		MainGame.board.at(82).getBuilding().loadTexture('palace2');

		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.G).onUp.
			add(function(){TrailerScript.hudOff();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.H).onUp.
			add(function(){TrailerScript.hudOn();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.ONE).onUp.
			add(function(){TrailerScript.zoomOutFromPalace();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.TWO).onUp.
			add(function(){TrailerScript.cameraPan();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.THREE).onUp.
			add(function(){TrailerScript.focusOnFactory();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.FOUR).onUp.
			add(function(){TrailerScript.factoryHire();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.FIVE).onUp.
			add(function(){TrailerScript.funBar();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.SIX).onUp.
			add(function(){TrailerScript.generateHomelessCamp();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.SEVEN).onUp.
			add(function(){TrailerScript.generateRiot();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.EIGHT).onUp.
			add(function(){TrailerScript.generateArmy();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.NINE).onUp.
			add(function(){TrailerScript.moveRiot();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.ZERO).onUp.
			add(function(){TrailerScript.moveArmy();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.O).onUp.
			add(function(){TrailerScript.attackRiot();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.P).onUp.
			add(function(){TrailerScript.attackArmy();});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.L).onUp.
			add(function(){TrailerScript.nextYear();});
	},

	hudOff: function(){
		var hud = MainGame.hud;
		hud.moneyPanel.visible = false;
		hud.statsPanel.visible = false;
		hud.funPanel.visible = false;
		hud.coalitionFlag.visible = false;
		hud.btnNextTurn.visible = false;
		hud.buildGroup.visible = false;
	},

	hudOn: function(){
		var hud = MainGame.hud;
		hud.moneyPanel.visible = true;
		hud.statsPanel.visible = true;
		hud.funPanel.visible = true;
		hud.coalitionFlag.visible = true;
		hud.btnNextTurn.visible = true;
		hud.buildGroup.visible = true;
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
				if(time >= 1200){
					MainGame.game.time.events.remove(loop);
				}
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
				if(time >= 2900){
					MainGame.game.time.events.remove(loop);
				}
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
				if(time >= 1000){
					MainGame.game.time.events.remove(loop);
				}
			},this);
		},this);
	},

	factoryHire: function(){
		var factories = MainGame.board.findBuilding('factory',null,null,null);
		for(var i = 0; i < factories.length; ++i){
			var bld = MainGame.board.at(factories[i]).getBuilding();
			if(bld.people < bld.maxPeople){
				MainGame.population.hire(factories[i]);
				return;
			}
		}
	},

	funBar: function(){
		if(this.funBarIndex===null){
			// MainGame.hud.funPanel.visible = true;
			Global.freedom = 50;
			Global.unrest = 25;
			this.funBarIndex = 0;
		}else{
			Global.freedom += 5;
			Global.unrest += 10;
			this.funBarIndex += 1;
		}
		showThermometerUpdate(function(){});
	},

	generateHomelessCamp: function(){
        MainGame.board.at(144).setBuilding(Building.createNew({name:"shantyTown",startingTurn:MainGame.global.turn,people:0}));
        MainGame.board.at(144).updateRoadConnections();
        var neighborhood = MainGame.board.allAdjacent(144, 1);
        for (var i = 0; i < neighborhood.length; i++) {
            MainGame.board.at(neighborhood[i]).updateRoadConnections();
        }
		MainGame.board.cameraCenterOn(144);
	},

	generateRiot: function(){
		if(this.unit === null || this.rioters < 5){
			var bld = MainGame.board.at(116);
			this.unit = Unit.spawnUnitAt(Unit.Riot, 116);
			var personIndex = MainGame.population.getHouseMap()[116][0];
			MainGame.board.at(116).getBuilding().removePerson();
			// Remove them from their workplace
			var workIndex = MainGame.population.people[personIndex].workplace;
			if (workIndex !== null) {
				MainGame.board.at(workIndex).getBuilding().removePerson();
			}
			++this.rioters;
			MainGame.population.people.splice(personIndex,1);
			MainGame.board.cameraCenterOn(116);
		}
	},

	moveRiot: function(){
		if(this.unit !== null){
			if (this.unit.target === null) {
				this.unit.target = UnitAI.findTarget(this.unit);
			}

			var newMoveIndex = UnitAI.chooseMove(this.unit);
			//console.log(newMoveIndex);
			this.unit.move(newMoveIndex);
		}
	},

	attackRiot: function(){
		if (this.unit.isAttacking)
			UnitAI.attackTarget(this.unit);
	},

	generateArmy: function(){
		var bld = MainGame.board.at(111).getBuilding();
		if (bld.people > 0 && !bld.squadDeployed) {
			bld.squadDeployed = true;

			bld.squad = Unit.spawnUnitAt(Unit.Army, 111);
			bld.squad.addPeople(bld.people - 1);

			MainGame.board.cameraCenterOn(111);
        }
	},

	moveArmy: function(){
		var bld = MainGame.board.at(111).getBuilding();
		if(bld.squadDeployed){
			if (bld.squad.target === null) {
				bld.squad.target = UnitAI.findTarget(bld.squad);
			}

			var newMoveIndex = UnitAI.chooseMove(bld.squad);
			//console.log(newMoveIndex);
			bld.squad.move(newMoveIndex);
		}
	},

	attackArmy: function(){
		var bld = MainGame.board.at(111).getBuilding();
		if(bld.squadDeployed){
		if (bld.squad.isAttacking)
			UnitAI.attackTarget(bld.squad);
		}
	},

	nextYear: function(){
		++Global.turn;
		Global.money += Global.moneyPerTurn;
	}
};