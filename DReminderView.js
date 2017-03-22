/*global MainGame*/

// contains the reminder button & reminder view

var DReminderButton={
	createNew: function(){
		var b=MainGame.game.add.button(0,300,'small_generic_button',
		function(){b.reminderView.show()},b,1,0,2,1);

		// Class func
		b.setReminderView=function(view){b.reminderView=view};
		b.suicide=function(){b.freezeFrames=true;b.destroy()};

		return b;
	},
};

var DReminderView={
	createNew: function(){
		// TODO: add texture
		var v=MainGame.game.add.sprite(0,0,"event_bg");
		// TODO: set own's geo
		v.x=200; v.y=200;
		// TODO: add 1)label of description; 2)label of startTurn; 3)label of endturn
		var labels=["descriptionLabel","startAtLabel","remainingLabel"];
		var geos={x:[0,100,150], y:[0,150,200]};
		for(var i=0;i<labels.length;i++){
			v[labels[i]]=MainGame.game.make.text(geos.x[i],geos.y[i],'');
			v.addChild(v[labels[i]]);
		}
		// add a mask
		v.uiMask=DUiMask.createNew();
		v.uiMask.setController(100,function(){v.hide()});
		// Class func
		v.setModel=function(modelJson){DReminderView.setModel(v,modelJson)};
		v.setController=function(priorityID,controllerJson){DReminderView.setController(v,priorityID,controllerJson)};
		// TODO: create your own show/hide functions with animation + callbacks
		v.show=function(){v.uiMask.visible=true;v.visible=true};
		v.hide=function(){v.uiMask.visible=false;v.visible=false};

		return v;
	},
	setModel: function(v,modelJson){
		for(var key in modelJson)
			v[key+"Label"].text=modelJson[key];		
	},
	setController: function(v,priorityID,controllerJson){
		// enable input, remove previous input settings
		v.inputEnabled=true;
		v.input.priorityID=priorityID;
		v.events.onInputUp.removeAll();
		// setup current one
		for(var key in controllerJson)
			v[key]=Function("return "+controllerJson[key]);
		if(!controllerJson.onClick) 
			return;
		v.events.onInputUp.add(function(){
			v.onClick();			
		});
	},
};