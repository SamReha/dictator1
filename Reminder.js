/*global MainGame*/
/*global Event*/

var rl=[];

var ReminderList = {
	add: function(event,type){
		var reminder = Reminder.createNew(event,type);
		rl.push(reminder);
		ReminderList.update();
		return reminder;
	},
	remove: function(name){
		rl = rl.filter(function(r){return r.event.name!==name;});
		ReminderList.update();
	},
	sortList: function(){
		for(var i=0;i<rl.length;++i){
			for(var j=i+1;j<rl.length;++j){
				if(rl[i].count*4+rl[i].type>rl[j].count*4+rl[j].type){
					var swap = rl[i];
					rl[i]=rl[j];
					rl[j]=swap;
				}
			}
		}
	},
	update: function(){
		ReminderList.sortList();

		for(var i=0;i<rl.length;++i){
			rl[i].x=(rl[i].width*5/8)+(rl[i].width*9*Math.floor(i/7)/8);
			rl[i].y=(MainGame.game.height*7/9)-(rl[i].height*9*(i%7)/8);
		}
	},
	nextTurn: function(){
		for(var i=0;i<rl.length;++i){
			rl[i].nextTurn();
		}
	}
};

var Reminder={
	Tutorial:0,
	NextTurn: 1,
	Favor: 2,
	Alert:3,

	createNew: function(event,type){
		var rem = MainGame.game.add.button(0,0,'reminder_icon_'+type,function(){
			rem.eventView=Event.createNew(!rem.event.controller);
			Reminder.newDisplay(rem);
		},rem,1,0,2,1);
		rem.eventView = null;
		rem.event = event;
		rem.count = (event.turnsToComplete!==false?event.turnsToComplete:-4);
		rem.scale.setTo(0.75,0.75); rem.anchor.setTo(0.5,0.5);
		rem.type = type;
		if(rem.count>=0){
			rem.counter=MainGame.game.make.sprite((rem.width*1/2),(rem.height*1/2),'counter_icon');
			rem.counter.anchor.setTo(0.5,0.5);
			rem.counter.frame=rem.count;
			rem.addChild(rem.counter);
		}
		Reminder.initialize(rem);
		rem.timer=null;
		if(rem.event.check){
			rem.timer=MainGame.game.time.events.loop(250, 
				function(){Reminder.loopingCheck(this)},
				rem);
		}
		rem.seen = false;

		rem.nextTurn=function(){return Reminder.nextTurn(rem)};
		rem.remove=function(){return Reminder.remove(rem)};

		return rem;
	},

	nextTurn: function(rem){
		if(rem.count >= 0){
			rem.count-=1;
			rem.counter.frame=rem.count;
		}
		if(rem.count === -1){
			rem.freezeFrames=true;
			rem.remove();
		}
	},

	newDisplay: function(rem){
		if(!rem.seen){
			rem.seen=true;
		}
		// get the model
		console.log(rem.event);
		var model=[];
		for(var i=0;i<rem.event.model.length;++i){
			model.push({
				portrait: Function("rem","return "+rem.event.model[i].portrait)(rem),
				description: Function("rem","return "+rem.event.model[i].description)(rem),
				buttonTexts: rem.event.model[i].buttonTexts
			});
		}
		rem.eventView.setModel(model);
		// if there's no controller, just return
		if(!rem.event.controller)
			return;
		// check original data
		// console.log(rem.event.controller);
		// get the controller
		var controller=[];
		// rem.event.controller is [["","",],[],...]
		if(rem.event.controller){
			for(let i=0;i<rem.event.controller.length;++i){
				controller[i]=[];
				for(let j=0;j<rem.event.controller[i].length;++j){
					var f=Function("rem",rem.event.controller[i][j]);
					controller[i][j]=function(){Function("rem",rem.event.controller[i][j])(rem)};
				}
			}
		}
		/*global Event*/
		rem.eventView.setController(controller);
	},

	remove: function(rem){
		Reminder.fail(rem);
		ReminderList.remove(rem.event.name);
		rem.eventView.suicide();
		rem.destroy();
	},

	initialize: function(rem){
		Function("rem",rem.event.init)(rem);
	},

	fail: function(rem){
		Function("rem","return "+rem.event.fail)(rem);
	},

	succeed: function(rem){
		Function("rem","return "+rem.event.succeed)(rem);
	},

	loopingCheck: function(rem){
		if(Function("rem","return "+rem.event.check)(rem)){
			Reminder.succeed(rem);
		}
	}
};
