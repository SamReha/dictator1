/* global MainGame */

// The input.priorityID of UiMask is set to 100 by default
var DUiMask={
	createNew: function(priority, callback){
		var m=MainGame.game.make.sprite(0,0,"uiMask");
		m.scale.set(MainGame.game.width/16, MainGame.game.height/16);
		m.alpha=0.75;
		m.inputEnabled=true;
		m.input.priorityID=priority;
		m.events.onInputDown.add(function(){
			callback();
		});

		// Class funcs
		m.fillScreen=function(parent){
			m.x=-parent.world.x-parent.x;
			m.y=-parent.world.y-parent.y;
		};

		return m;
	},
};