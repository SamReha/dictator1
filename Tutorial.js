/*global MainGame*/
/*global Event*/
/*global Global*/
/*global ReminderList*/

// singleton

var Tut = {};	// stores the Tut on-going data

var Tutorial = {
	initialized: false,
	tuts: [],	
	activeTut: null,
	timer: null,

	// generate the tutorials
	generate: function() {
		// if there is an active, finish it without triggering anything;
		if (this.activeTut !== null) {
			this.check(this.activeTut);
			return;
		}

		// lazy init
		if (!this.initialized) {
			this.tuts = MainGame.game.cache.getJSON('Tutorial');
			console.assert(this.tuts.length);
			//console.log("Parsed Tutorials, total: ", this.tuts.length);

			// this.timer = MainGame.game.time.events.loop(50, this.nextTut, this);

			this.initialized = true;
		}

		// now this.tuts is good.
		for (var i = 0; i < this.tuts.length; i++) {
			// tut is the last one
			var tut = this.tuts[i];
			//console.log(tut);

			// check tut.cond
			if (!this._checkCond_(tut.cond)) {
				// now let's execute the tut
				// init
				// this._executeInit_(tut.init);

				// tuts -> runningTuts
				this.activeTut = tut;

				// run tutorial			
				// this.runEvent(tut.event, tut.handler);
				ReminderList.add(tut.event,Reminder.Tutorial);

				// Only run the very first incomplete tutorial
				break;
			}
		}
	},

	_checkCond_: function(condString) {
		var fn = Function("return " + condString);
		return fn();
	},

	_executeInit_: function(init) {
		Function(init)();
	},

	nextTut: function() {
		if (this.activeTut) {
			//console.log(this._checkCond_(this.activeTut.cond));
			this.activeTut = null;

			// Find the next tut
			for (var i = 0; i < this.tuts.length; i++) {
				// tut is the last one
				var tut = this.tuts[i];
				//console.log(tut);

				// check tut.cond
				if (!this._checkCond_(tut.cond)) {
					// now let's execute the tut
					// init
					// this._executeInit_(tut.init);

					// tuts -> runningTuts
					this.activeTut = tut;

					// run tutorial			
					// this.runEvent(tut.event, tut.handler);
					ReminderList.add(tut,Reminder.Tutorial);

					// Only run the very first incomplete tutorial
					break;
				}
			}
		}
	},

	runEvent: function(event, handler) {
		console.assert(event.length === handler.length);
		// var e = Event.createNew();
		
		// TODO: adjust the geo
		// e.position.set(300,100);

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
		/*global ReminderList*/
		ReminderList.add(event,model,controller,Reminder.Tutorial,0);
		// e.setModel(model);
		// e.setController(controller);
	},

	reminder: function(name) {
		var quests = this.runningQuests.filter(function(qu) { return qu.name == name; });
		console.assert(quests.length === 1);
		var q = quests[0];
		var reminder = ReminderList.add(q,Reminder.Tutorial);
		reminder.seen = true;
		//console.log("So selected tut is: ", q);
		
		// create reminder view		
		// var view = DReminderView.createNew();
		// view.setModel(q.reminder.model);
		// view.setController(101, q.reminder.controller);
		// view.hide();
		
		// // create reminder button
		// var button = DReminderButton.createNew();
		// button.setReminderView(view);
		
		// // now update the start turn for view
		// view.setModel({startAt:q.startAt});
		
		// // let q store reminderButton
		// q.reminderButton = button;
	},

	// check every tutorial to see if it is complete
	check: function(tut) {
		//console.log("Checking running tut", tut);
		var r = tut.reminder;
		var shouldRemove = false;

		// check completeness
		var f = Function("return " + tut.event.vars[0]);
		//console.log("f is:", f.toString());
		if (f()) {
			//tut.reminderButton.reminderView.suicide(); TODO: get this working
			//tut.reminderButton.suicide();
			this.activeTut = null;
			Tutorial.generate();
		}
	},

	//// Sequence checks!

	// Checks to see whether the player has built a road between any home and any lumberyard
	roadsBuilt: function() {
		//console.log('ROADS BUILT CHECK');
		var board = MainGame.board;
		var homes = board.findBuilding(null, 'housing', null);
		var lumberyards = board.findBuilding(null, 'production', null);

		for (var i = 0; i < homes.length; i++) {
			for (var k = 0; k < lumberyards.length; k++) {
				if (board.hasRoadConnect(homes[i], lumberyards[k])) {
					return true;
				}
			}
		}
		
		return false;
	},

	// Checks to see whether the player has put staff into their factory
	lumberYardHasWorkers: function() {
		//console.log('ROADS BUILT CHECK');
		var board = MainGame.board;
		var lumberyards = board.findBuilding(null, 'production', null);

		for (var i = 0; i < lumberyards.length; i++) {
			var lumberyard = board.at(lumberyards[i]).building;

			if (lumberyard.people > 0) return true;
		}
		
		return false;
	},

	builtNewHouse: function() {
		var numHouses = MainGame.board.findBuilding(null, 'housing', null).length;

		return Tut.numHouses < numHouses;
	},

	hasMinister: function() {
		return MainGame.population.highList().length > 0;
	},

	disableNextTurn: function() {
		MainGame.hud.btnNextTurn.visible = false;
	},

	enableNextTurn: function() {
		MainGame.hud.btnNextTurn.visible = true;
	}
};
