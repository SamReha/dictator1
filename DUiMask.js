/* global MainGame */

// The input.priorityID of UiMask is set to 100 by default
var DUiMask={
	createNew: function(_isAbove){
		var m=MainGame.game.add.sprite(0,0,"uiMask");
		if(!_isAbove)
			MainGame.game.world.moveDown(m);
		m.scale.set(MainGame.game.width/16, MainGame.game.height/16);
		m.alpha=0.75;

		// Class func
		m.setController=function(priorityID,callback){DUiMask.setController(m,priorityID,callback)};

		return m;
	},
	setController: function(m, priorityID, callback){
		m.inputEnabled=true;
		m.input.priorityID=priorityID;
		m.events.onInputDown.removeAll();
		m.events.onInputDown.add(function(){
			callback();
		});
	}
};