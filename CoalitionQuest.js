/*global MainGame*/
/*global Event*/
/*global Global*/

// singleton

var CQ={};	// stores the CQ on-going data

var CoalitionQuest={
	quests: [],	// lazy init
	runningQuests: [],
	// generate the quest if there is one
	generate: function(_curTurn, _hiPeopleRef){
		// for testing
		if(!_curTurn)
			_curTurn=0;
		if(!_hiPeopleRef){
			_hiPeopleRef=[];
		}

		// lazy init
		if(this.quests.length===0){
			this.quests=MainGame.game.cache.getJSON('CoalitionQuest');
			console.assert(this.quests.length);
			console.log("Parsed CoalitionQuest, [0] is:",this.quests[0]);
		}
		// now this.quests is good.
		for(var i=this.quests.length-1;i>=0;i--){
			// q is the last one
			var q=this.quests[i];
			// check q.cond
			if(!this._checkCond_(q.cond))
				continue;
			// get "people"
			q.peopleRef=this._getPeople_(_hiPeopleRef, q.people);
			if(!q.peopleRef)
				continue;
			// now let's execute the q
			// init
			this._executeInit_(q.init);
			// set startAt
			q.startAt=_curTurn;
			// quests -> runningQuests
			this.runningQuests.push(this.quests.pop());
			// run quest			
			this.runEvent(q.peopleRef, q.event, q.handler);
		}
	},
	_checkCond_: function(condString){
		var fn=Function("return "+condString);
		return fn();
	},
	_getPeople_: function(hiPeopleRef, roles){
		var peopleRef=hiPeopleRef.filter(function(p){
			for(var i=0;i<roles.length;i++)
				if(p.role===roles[i])
					return true;
		});
		if(peopleRef.length===roles.length)
			return peopleRef;
		return null;
	},
	_executeInit_: function(init){
		Function(init)();
	},

	runEvent: function(peopleRef, event, handler){
		console.assert(event.length===handler.length);
		// console.log("Now run quest:",peopleRef,event,handler);
		var e=Event.createNew();
		// TODO: adjust the geo
		e.position.set(300,100);
		// generate model & controller
		var model=[];		// an array of tables
		var controller=[];	// an array of arrays of functions
		var fn=[];			// a temp array to store arrays of functions
		for(var i=0;i<event.length;i++){
			let currentPerson=peopleRef[event[i].person];
			model.push({
				portrait:currentPerson.portTexture(),
				description:event[i].description,
				buttonTexts:event[i].buttonTexts
			});
			// test function
			controller[i]=[];
			for(var j=0;j<handler[i].length;j++){
				let f=Function("e","p",handler[i][j]);
				controller[i][j]=function(){f(e,currentPerson)};
			}
		}
		// now set model & controller
		e.setModel(model);
		e.setController(controller);
	},

	reminder: function(name){
		var q=this.runningQuests.filter(function(qu){return qu.name==name})[0];
		console.log("So selected q is:",q);
		console.log("q's reminder is:",q.reminder);
		// create reminder view		
		var view=DReminderView.createNew();
		view.setModel(q.reminder.model);
		view.setController(101, q.reminder.controller);
		view.hide();
		// create reminder button
		var button=DReminderButton.createNew();
		button.setReminderView(view);
		// now update the start turn for view
		view.setModel({startAt:q.startAt})
	},

	// check every quest to see it 1)fails; or 2)succeeds
	check: function(){
		for(var i=this.runningQuests.length-1;i>=0;i--){
			var q=this.runningQuests[i];
			if(this._checkSuc_(q)){
				// TODO: generate a suc event
			}else if(this._checkFail_(q)){
				// TODO: generate a fail event
			}else{
				q.reminder.remaining--;
				// TODO: update relative reminder by .setModel({remaining=q.reminder.remaining})

			}
		}
	},
	_checkSuc_: function(){

	},
	_checkFail_: function(){
		
	}
};




// test case code
function test_coalition_quest(){
	CoalitionQuest.generate(1, hiPeople);
	console.assert(CQ.TestQuest===5);
};

var hiPeople=[
	{name:"Yi", role:"?", portTexture:function(){return "military_port_0"}},
	{name:"MJ", role:"!", portTexture:function(){return "military_port_1"}}
];
