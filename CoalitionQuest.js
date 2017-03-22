/*global MainGame*/
/*global Event*/
/*global Global*/

// singleton
var CoalitionQuest={
	quests: [],	// lazy init
	runningQuests: [],
	// generate the quest if there is one
	generate: function(){
		if(this.quests.length===0){
			this.quests=MainGame.game.cache.getJSON('CoalitionQuest');
			console.assert(this.quests.length);
			console.log("Parsed CoalitionQuest:",this.quests);
		}
		// now this.quests is good.
		for(var i=this.quests.length-1;i>=0;i--){
			// q is the last one
			var q=this.quests[i];
			// check q.cond
			if(!this._checkCond_(q.cond))
				continue;
			// get "people"
			q.peopleRef=this._getPeople_(MainGame.population, q.people);
			if(!q.peopleRef)
				continue;
			// add "peopleRef" to q
			q.peopleRef=peopleRef;
			// quests -> runningQuests
			this.runningQuests.push(this.quests.pop());
			// run quest
			this.runEvent(q.peopleRef, q.event, q.handler);
		}
	},
	_checkCond_: function(condString){
		var fn=Function("return ("+condString+")");
		return fn();
	},
	_getPeople_: function(popRef, roles){
		var peopleRef=[];
		for(var i=0;i<roles.length;i++){
			var list=popRef.typeRoleList(2,roles[i]);
			console.assert(list.length<=1);
			if(list.length===0)
				return null;
			peopleRef.push(list[0]);
		}
		return peopleRef;
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
			var currentPerson=peopleRef[event[i].person];
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

	// check if the on-going quests are completed/expired
	check: function(){
		//TODO
	}
};

function test_coalition_quest(){
	var cq=CoalitionQuest;
	// test _checkCond_() - PASSED
	console.assert(cq._checkCond_("1+1===2"));
	console.assert(!cq._checkCond_("1+1===3"));
	console.assert(cq._checkCond_("Global.turn===1"));
	console.assert(cq._checkCond_("_testTable_.name==='Yi' && _testTable_.major==='G+PM'"));
	// test _getPeople_() - PASSED
	console.assert(cq._getPeople_(_testPop_,['?','!'])[1].name==="MJ");
	console.assert(cq._getPeople_(_testPop_,['?'])[0].name==="Yi");
	console.assert(null===cq._getPeople_(_testPop_,['?','$']));
	// test runEvent()
	var peopleRef=cq._getPeople_(_testPop_,['?','!']);
	var event=[
		{	
			"person":0, 
			"description":"Bu. Minister: \nHello, this is the Mil Minister.", 
			"buttonTexts":["Ok?"]
		},
		{
			"person":1, 
			"description":"Mi. Minister: \nCan you build a \nmil building at this place in 3 turns?", 
			"buttonTexts":["Yes","No"]
		},
		{
			"person":1,
			"description":"Mi. Minister: \nThanks!",
			"buttonTexts":["You're welcome"]
		},
		{
			"person":1,
			"description":"Mi. Minister: \nWhat???",
			"buttonTexts":["See you"]
		}
	];
	var handler=[
		["console.log('han1');e.gotoPage(1)"],
		["console.log('han2');e.gotoPage(2)", "e.gotoPage(3)"],
		["console.log('han3');e.suicide();p.loyalty+=2;e.willCheck=true"],
		["console.log('han4');e.suicide();p.loyalty-=1"]
	];
	cq.runEvent(peopleRef,event,handler);
};

// private
var _testTable_={name:"Yi", major:"G+PM"};
var _testPop_={
	typeRoleList: function(type,role){
		if(type===2 && role==='?')
			return [{name:"Yi",loyalty:50,portTexture:function(){return "bureaucrat_port_0"}}];
		else if(type===2 && role==='!')
			return [{name:"MJ",loyalty:99,portTexture:function(){return "military_port_0"}}];
		else
			return [];
	}
};

// // Private test functions //
// function _test_Event_choice(){
// 	var eChoice=Event.createNew();
// 	eChoice.position.set(300,100);
// 	eChoice.setModel([
// 		{portrait:'bureaucrat_port_0',description:'Yi: Hey, MJ has a \nquestion.',buttonTexts:["Go ahead"]},
// 		{portrait:'bureaucrat_port_2',description:'MJ: Are you a dumbass?',buttonTexts:["Yes","NO"]},
// 		{portrait:'bureaucrat_port_2',description:'MJ: Of course you are!',buttonTexts:["Close"]},
// 		{portrait:'bureaucrat_port_2',description:'MJ: What? You are not?',buttonTexts:["Close"]}
// 	]);
// 	eChoice.setController([
// 		[function(){eChoice.gotoPage(1)}],
// 		[function(){eChoice.gotoPage(2)}, function(){eChoice.gotoPage(3)}],
// 		[function(){eChoice.suicide()}],
// 		[function(){eChoice.suicide()}]
// 	]);			
// }



	// {
	// 	"cond":"(Global.turn>=1)",
	// 	"people":["!","?"],
	// 	"event":[
	// 		{	
	// 			"person":0, 
	// 			"description":"Bur Minister: Hello, this is the Mil Minister.", 
	// 			"buttonTexts":["Ok?"]
	// 		},
	// 		{
	// 			"person":1, 
	// 			"description":"Mil Minister: Can you build a mil building at this place in 3 turns?", 
	// 			"buttonTexts":["Yes","No"]
	// 		},
	// 		{
	// 			"person":1,
	// 			"description":"Mil Minister: Thanks!",
	// 			"buttonTexts":["You're welcome"]
	// 		},
	// 		{
	// 			"person":1,
	// 			"description":"Mil Minister: What???",
	// 			"buttonTexts":["See you"]
	// 		}
	// 	],
	// 	"handler":[
	// 		["e.gotoPage(1)"],
	// 		["e.gotoPage(2)", "e.gotoPage(3)"],
	// 		["e.suicide();p.loyalty+=2;e.willCheck=true"],
	// 		["e.suicide();p.loyalty-=1"]
	// 	],
	// 	"starting":-1,
	// 	"timeLimit":3,
	// 	"check":"(MainGame.board.at(0).getBuilding().type==='!')"
	// }