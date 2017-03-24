/*global MainGame*/
/*global Event*/
/*global Global*/

// singleton

var CQ={};	// stores the CQ on-going data

var CoalitionQuest={
	inited: false,
	quests: [],	
	runningQuests: [],
	// generate the quest if there is one
	generate: function(_curTurn, _hiPeopleRef){
		// for testing
		if(!_curTurn)
			_curTurn=0;
		if(!_hiPeopleRef){
			_hiPeopleRef=[];
		}
		// if there is a running one, finish it without triggering anything
		console.assert(this.runningQuests.length<=1);
		if(this.runningQuests.length===1){
			this.check(this.runningQuests);
			return;
		}
		// lazy init
		if(!this.inited){
			this.quests=MainGame.game.cache.getJSON('CoalitionQuest');
			console.assert(this.quests.length);
			console.log("Parsed CoalitionQuest, total:",this.quests.length);
			this.inited=true;
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
		var quests=this.runningQuests.filter(function(qu){return qu.name==name});
		console.assert(quests.length===1);
		var q=quests[0];
		console.log("So selected q is:",q);
		// create reminder view		
		var view=DReminderView.createNew();
		view.setModel(q.reminder.model);
		view.setController(101, q.reminder.controller);
		view.hide();
		// create reminder button
		var button=DReminderButton.createNew(DReminderButton.Favor);
		button.setReminderView(view);
		// now update the start turn for view
		view.setModel({startAt:q.startAt})
		// let q store reminderButton
		q.reminderButton=button;
	},

	// check every quest to see it 1)fails; or 2)succeeds
	check: function(runningQuestsRef){
		console.log("Checking running quest");
		console.assert(runningQuestsRef.length===1);
		var q=runningQuestsRef[0];
		var r=q.reminder;
		var shouldRemove=false;
		// check suc
		console.log("Global money and test m is:",Global.money,CQ.TestQuest);
		var f=Function("return "+r.controller.check);
		console.log("f is:",f.toString());
		if(f()){
			shouldRemove=true;
			this.questSuc(q);
		}
		// check fail
		r.model.remaining--;
		if(r.model.remaining<0){
			shouldRemove=true;
			var f=Function("ppl",r.controller.fail);
			f(q.peopleRef);
			this.questFail(q);
		}
		// remove when necessary
		if(shouldRemove){
			q.reminderButton.reminderView.suicide();
			q.reminderButton.suicide();
			this.runningQuests.pop();
		}
	},
	questFail: function(q){		
		console.log("Quest failed for:",q);
		// create a new 1-page info "quest fail"
		var e=Event.createNew();
		e.position.set(300,200);
		e.setModel([
			{
				portrait:q.peopleRef[0].portTexture(), 
				description:q.peopleRef[0].name+" You failed!",
				buttonTexts:["OK"]
			}
		]);
		e.setController([
			[function(){e.suicide()}]
		]);
	},
	questSuc: function(q){
		console.log("Quest suc for:",q);
		// create a 1-page info "quest suc"
		var e=Event.createNew();
		e.position.set(300,200);
		e.setModel([
			{
				portrait:q.peopleRef[0].portTexture(), 
				description:q.peopleRef[0].name+" Thank you!",
				buttonTexts:["OK"]
			}
		]);
		e.setController([
			[function(){e.suicide()}]
		]);
	}
};




// test case code
function test_coalition_quest(){
	CoalitionQuest.generate(1, hiPeople);
};

var hiPeople=[
	{name:"Yi", role:"?", portTexture:function(){return "military_port_0"}},
	{name:"MJ", role:"!", portTexture:function(){return "military_port_1"}}
];



// function test_Event(){
// 	var e=Event.createNew();
// 	e.position.set(50,50);
// 	e.setModel([
// 		{portrait:'bureaucrat_port_0',description:"Yi: please select a test.",buttonTexts:["Choice","Info"]}
// 	]);
// 	e.setController([
// 		[function(){
// 			e.suicide();
// 			_test_Event_choice();
// 		}, function(){
// 			e.suicide();
// 			_test_Event_info();
// 		}]
// 	]);

// }
