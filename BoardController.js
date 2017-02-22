// The Controller of Board as MVC design pattern

var BoardController={	
	createNew: function(board){
		// create the instance
		var bc={};

		// Class vars
		bc.modelView=board;
		bc.enabled=true;

		// Class funcs
		//	disable/enable all inputs from keyboard/mouse
		bc.setEnabled=function(en){bc.enabled=en};

		// setup event listener
		BoardController.addInputCallbacks(bc);

		// returns the created instance
		return bc;
	},

	/* ------- Implementation ------- */
	onMouseEvent: function(bc, type, pos){
		if(!bc.enabled)
			return;
		if(type==="up"){
			bc.modelView.cameraCenterOn(bc.modelView.hitTest(pos.x,pos.y));
		}else if(type==="down"){

		}else{
			console.assert(false);
		}
	},

	onKeyboardEvent: function(bc, type, key){
		if(!bc.enabled)
			return;
		if(key==="E" && type==="up"){
			var curLevel=bc.modelView.currentZoomLevel-1;
			if(curLevel<0) curLevel=0;
			bc.modelView.cameraZoomAt(curLevel);			
		}else if(key==="Q" && type==="up"){
            var curLevel=bc.modelView.currentZoomLevel+1;
            if(curLevel>=Board.zoomLevelList.length) curLevel=Board.zoomLevelList.length-1;
            bc.modelView.cameraZoomAt(curLevel);
		}else if(key==="W" && type==="up"){
            bc.modelView.cameraMoveBy(0,-100);
		}else if(key==="S" && type==="up"){
			bc.modelView.cameraMoveBy(0,100);
		}else if(key==="A" && type==="up"){
			bc.modelView.cameraMoveBy(-150,0);
		}else if(key==="D" && type==="up"){
			bc.modelView.cameraMoveBy(150,0);
		}
		else{
			console.assert(false);
		}
	},

	addInputCallbacks: function(bc){
		/* global MainGame */
		
		// Mouse Click == Center on that tile
		MainGame.game.input.onUp.add(function(pos){BoardController.onMouseEvent(bc,"up",pos)});
		MainGame.game.input.onDown.add(function(pos){BoardController.onMouseEvent(bc,"down",pos)});

		// Keyboard
		//	E
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.E).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","E")});
		//	Q
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.Q).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","Q")});
		//	W
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.W).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","W")});
		//	S
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.S).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","S")});
		//	A
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.A).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","A")});
		//	D
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.D).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","D")});

	},
};
