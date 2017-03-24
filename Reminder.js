/*global MainGame*/
/*global Event*/

var ReminderList = {
	rl:[],

	add: function(reminder){
		ReminderList.rl.push(reminder);
	},
	remove: function(name){
		ReminderList.rl = ReminderList.rl.filter(function(r){return r.name!==name;});
	},
	sortList: function(){
		for(var i=0;i<ReminderList.rl.length;++i){
			for(var j=i+1;j<ReminderList.rl.length;++j){
				if(ReminderList.rl[i].count*4+ReminderList.rl[i].type>ReminderList.rl[j].count*4+ReminderList.rl[j].type){
					var swap = ReminderList.rl[i];
					ReminderList.rl[i]=ReminderList.rl[j];
					ReminderList.rl[j]=swap;
				}
			}
		}
	},
	update: function(){
		ReminderList.sortList();

		for(var i=0;i<ReminderList.rl.length;++i){
			ReminderList.rl[i].x=(ReminderList.rl[i].width*5/8)+(ReminderList.rl[i].width*9*Math.floor(i/7)/8);
			ReminderList.rl[i].y=(MainGame.game.height*7/9)-(ReminderList.rl[i].height*9*(i%7)/8);
		}
	},
};

var Reminder={
	Tutorial:0,
	NextTurn: 1,
	Favor: 2,
	Alert:3,

	createNew: function(event,type,count){
		var rem = MainGame.game.add.button(0,0,'reminder_icon_'+type,function(){
			/*global Event*/
			// rem.eventView=Event.createNew(event);
			rem.nextTurn();
			ReminderList.update();
		},rem,1,0,2,1);
		rem.name = event.name;
		rem.scale.setTo(0.75,0.75); rem.anchor.setTo(0.5,0.5);
		rem.type = type;
		rem.count = (count!==undefined?count:-4);
		if(count>=0){
			rem.counter=MainGame.game.make.sprite((rem.width*1/2),(rem.height*1/2),'counter_icon');
			rem.counter.anchor.setTo(0.5,0.5);
			rem.counter.frame=count;
			rem.addChild(rem.counter);
		}
		rem.seen = false;
		rem.eventView = null;

		rem.nextTurn=function(){return Reminder.nextTurn(rem)};

		return rem;
	},

	nextTurn: function(rem){
		if(rem.count >= 0){
			rem.count-=1;
			rem.counter.frame=rem.count;
		}
		if(rem.count === -1){
			ReminderList.remove(rem.name);
			rem.freezeFrames=true;
			rem.destroy();
		}
	},
};
