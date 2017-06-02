/*global MainGame*/
/*global Event*/
/*global Global*/

// singleton

var Tut = {};	// stores the Tut on-going data

var Tutorial = {
	initialized: false,
	tuts: [],	
	activeTut: null,
	activeIndex: 0,

	// generate the tutorials
	generate: function() {
		// if there is an active, finish it without triggering anything;
		if (this.activeTut !== null) {
			this.check(this.activeTut);
			return;
		}

		// lazy init
		if (!this.initialized) {
			Tut.numHouses = MainGame.board.findBuilding(null, null, 'housing', null).length;
			this.tuts = MainGame.game.cache.getJSON('Tutorial');
			console.assert(this.tuts.length);
			//console.log("Parsed Tutorials, total: ", this.tuts.length);

			this.checkTimer = MainGame.game.time.create(false);
			this.checkTimer.loop(50, this.loopingCheck, this);
			this.checkTimer.start();

			this.initialized = true;
		}

		var tut = this.tuts[this.activeIndex];
		// now let's execute the tut
		// init
		this._executeInit_(tut.init);

		// tuts -> runningTuts
		this.activeTut = tut;

		// run tutorial			
		this.runEvent(tut.event, tut.handler);
	},

	_checkCond_: function(condString) {
		var fn = Function("return " + condString);
		return fn();
	},

	_executeInit_: function(init) {
		Function(init)();
	},

	loopingCheck: function() {
		if (this.activeTut && this._checkCond_(this.activeTut.cond)) {
			// Update active tutorial
			this.activeIndex++;
			this.activeTut = this.tuts[this.activeIndex];

			// init
			this._executeInit_(this.activeTut.init);

			// run tutorial			
			this.runEvent(this.activeTut.event, this.activeTut.handler);
		}
	},

	runEvent: function(event, handler) {
		console.assert(event.length === handler.length);
		if (event.length === 0) return;

		var e = Event.createNew();

		// generate model & controller
		var model = [];		 // an array of tables
		var controller = []; // an array of arrays of functions
		var fn = [];         // a temp array to store arrays of functions

		for (var i = 0; i < event.length; i++) {
			model.push({
				description:event[i].description,
				buttonTexts:event[i].buttonTexts
			});

			// test function
			controller[i] = [];
			for (var j = 0; j < handler[i].length; j++) {
				var handlerArray = handler[i];
				let f = Function('e', handlerArray[j]);
				controller[i][j] = function() { f(e); };
			}
		}

		// now set model & controller
		e.setModel(model);
		e.setController(controller);
	},

	reminder: function(name) {
		var quests = this.runningQuests.filter(function(qu) { return qu.name == name; });
		console.assert(quests.length === 1);
		var q = quests[0];
		//console.log("So selected tut is: ", q);
		
		// create reminder view		
		var view = DReminderView.createNew();
		view.setModel(q.reminder.model);
		view.setController(101, q.reminder.controller);
		view.hide();
		
		// create reminder button
		var button = DReminderButton.createNew();
		button.setReminderView(view);
		
		// now update the start turn for view
		view.setModel({startAt:q.startAt});
		
		// let q store reminderButton
		q.reminderButton = button;
	},

	// check every tutorial to see if it is complete
	check: function(tut) {
		//console.log("Checking running tut", tut);
		var r = tut.reminder;
		var shouldRemove = false;

		// check completeness
		var f = Function("return " + r.controller.check);
		//console.log("f is:", f.toString());
		if (f()) {
			//tut.reminderButton.reminderView.suicide(); TODO: get this working
			//tut.reminderButton.suicide();
			// this.activeTut = null;
			// Tutorial.generate();
		}
	},

	//// Special Functions
	setPointerOnBuild: function(bool) {
		if (bool) {
			Tut.buildButtonPointer = UIPointer.createNew(72, MainGame.game.height-80, UIPointer.DOWN, -1, null, true);
		} else if (Tut.buildButtonPointer) {
			Tut.buildButtonPointer.stop();
		}
	},

	setPointerOnBuyRoad: function(bool) {
		if (bool) {
			Tut.buyRoadPointer = UIPointer.createNew(1020, 175, UIPointer.DOWN, -1, null, true);
		} else if (Tut.buyRoadPointer) {
			Tut.buyRoadPointer.stop();
		}
	},

	setPointerOnRoadPlacement: function(bool) {
		if (bool) {
			Tut.roadPlacementPointer = UIPointer.createNew(128, 60, UIPointer.DOWN, -1, null, true);
			MainGame.board.at(158).addChild(Tut.roadPlacementPointer);
		} else if (Tut.roadPlacementPointer) {
			Tut.roadPlacementPointer.stop();
		}
	},

	setPointerOnSchool: function(bool) {
		if (bool) {
			Tut.schoolPointer = UIPointer.createNew(128, 20, UIPointer.DOWN, -1, null, true);
			MainGame.board.at(128).addChild(Tut.schoolPointer);
		} else if (Tut.schoolPointer) {
			Tut.schoolPointer.stop();
		}
	},

	setPointerOnFactory: function(bool) {
		if (bool) {
			Tut.factoryPointer = UIPointer.createNew(128, 20, UIPointer.DOWN, -1, null, true);
			MainGame.board.at(159).addChild(Tut.factoryPointer);
		} else if (Tut.factoryPointer) {
			Tut.factoryPointer.stop();
		}
	},

	setPointerOnResidences: function(bool) {
		if (bool) {
			Tut.buySuburbPointer = UIPointer.createNew(725, 175, UIPointer.DOWN, -1, null, true);
		} else if (Tut.buySuburbPointer) {
			Tut.buySuburbPointer.stop();
		}
	},

	setPointerOnMinistryPanel: function(bool) {
		if (bool) {
			Tut.ministryPanelPointer = UIPointer.createNew(175, 475, UIPointer.LEFT, -1, null, true);
		} else if (Tut.ministryPanelPointer) {
			Tut.ministryPanelPointer.stop();
		}
	},

	setPointerOnStatsPanel: function(bool) {
		if (bool) {
			Tut.statsPanelPointer = UIPointer.createNew(MainGame.game.width - 175, 475, UIPointer.RIGHT, -1, null, true);
		} else if (Tut.statsPanelPointer) {
			Tut.statsPanelPointer.stop();
		}
	},

	showFunPanel: function() {
		UIPointer.createNew(MainGame.game.width/2, 64, UIPointer.UP, 2000, function() { Tut.shownFunPanel = true; }, true);
	},

	showMoneyPanel: function() {
		UIPointer.createNew(144, 64, UIPointer.UP, 2000, function() { Tut.readAboutMoney = true; }, true);
	},

	showStatsPanel: function() {
		UIPointer.createNew(MainGame.game.width - 175, 475, UIPointer.RIGHT, 2000, function() { Tut.sawStatsPanel = true; }, true);
	},

	//// Sequence checks!
	// Checks to see if the build menu has been opened
	hasOpenedBuildMenu: function() {
		return MainGame.global.buildMenuOpened;
	},

	boughtRoad: function() {
		return Tutorial.activeTut.name === 'Roads' && MainGame.global.boughtRoad;
	},

	// Checks to see whether the player has built a road between any home and any lumberyard
	roadsBuilt: function() {
		var homes = MainGame.board.findBuilding(null, null, 'housing', null);
		var lumberyards = MainGame.board.findBuilding(null, 'Commerce', null, null);

		for (var i = 0; i < homes.length; i++) {
			for (var k = 0; k < lumberyards.length; k++) {
				if (MainGame.board.hasRoadConnect(homes[i], lumberyards[k])) {
					return true;
				}
			}
		}
		
		return false;
	},

	openedSchoolBuildingDetail: function() {
		//console.log('openSchoolBuildingDetail');
		if (!MenuController.menuOpen) return false;
		if (MenuController.leftMenusOpen.length !== 1) return false;

		//console.log(MenuController);

		if (MenuController.leftMenusOpen[0].bdIndex === 128) {
			return true;
		} else return false;
	},

	openedGreenTab: function() {
		if (!MenuController.menuOpen) return false;

		if (MenuController.leftMenusOpen[0].bdIndex === 128 && MenuController.leftMenusOpen[0].activeTab === 1) {
			return true;
		} else return false;
	},

	// Checks to see whether the player has fired the teacher
	firedTeacher: function() {
		var school = MainGame.board.at(128).getBuilding();
		
		return school.people === 0;
	},

	// Checks to see whether the player has put staff into their factory
	lumberYardHasWorkers: function() {
		var lumberyards = MainGame.board.findBuilding(null, 'Commerce', null, null);

		for (var i = 0; i < lumberyards.length; i++) {
			var lumberyard = MainGame.board.at(lumberyards[i]).building;

			if (lumberyard.people > 0) return true;
		}
		
		return false;
	},

	// Checks to see if the build menu has been opened
	buildMenuIsOpen: function() {
		return MainGame.global.buildMenuIsOpen;
	},

	builtNewHouse: function() {
		var numHouses = MainGame.board.findBuilding(null, null, 'housing', null).length;

		return Tut.numHouses < numHouses;
	},

	ministerViewIsOpen: function() {
		return MainGame.global.ministerViewIsOpen;
	},

	contractIsOpen: function() {
		return MainGame.global.contractIsOpen;
	},

	hasMinister: function() {
		return MainGame.population.highList().length > 0;
	},
};
