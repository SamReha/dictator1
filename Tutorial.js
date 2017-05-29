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

	//// Sequence checks!
	// Checks to see if the build menu has been opened
	hasOpenedBuildMenu: function() {
		return MainGame.global.buildMenuOpened;
	},

	// Checks to see whether the player has built a road between any home and any lumberyard
	roadsBuilt: function() {
		var homes = MainGame.board.findBuilding(null, null, 'housing', null);
		var lumberyards = MainGame.board.findBuilding(null, null, 'production', null);

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
		console.log('openSchoolBuildingDetail');
		if (!MenuController.menuOpen) return false;
		if (MenuController.leftMenusOpen.length !== 1) return false;

		if (MenuController.leftMenusOpen[0].page.index === 128) {
			return true;
		} else return false;
	},

	openedGreenTab: function() {
		if (!MenuController.menuOpen) return false;

		// console.log(MenuController.leftMenusOpen[0]);

		if (MenuController.leftMenusOpen[0].page.index === 128 && MenuController.leftMenusOpen[0].activeTab === 1) {
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
		var lumberyards = MainGame.board.findBuilding(null, null, 'production', null);

		for (var i = 0; i < lumberyards.length; i++) {
			var lumberyard = MainGame.board.at(lumberyards[i]).building;

			if (lumberyard.people > 0) return true;
		}
		
		return false;
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

	// Hacky, but it'll make sure the people view is closed until we can put it in a folder menu
	closePeopleView: function() {
		MainGame.global.pv.closeSelf();
	},
};
