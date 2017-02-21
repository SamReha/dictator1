// The Controller of Board as MVC design pattern

var BoardController={	
	createNew: function(board){
		// create the instance
		var bc={};

		// Class vars
		bc.modelView=board;
		bc.enabled=true;

		// Class funcs

		// disable/enable all inputs from keyboard/mouse
		bc.disableInput=function(){bc.enabled=false};
		bc.enableInput=function(){bc.enabled=true};

		// setup event listener
		BoardController.addInputCallbacks(bc);

		// returns the created instance
		return bc;
	},

	/* ------- Implementation ------- */
	onMouseEvent: function(bc, type, pos){
		if(type==="up"){
			bc.modelView.cameraCenterOn(bc.modelView.hitTest(pos.x,pos.y));
		}else if(type==="down"){

		}else{
			console.assert(false);
		}
	},
	onKeyboardEvent: function(bc, type, key){
		if(type==="up"){

		}else if(type==="down"){

		}else{
			console.assert(false);
		}
	},

	addInputCallbacks: function(bc){
		/* global MainGame */
		
		// Mouse Click == Center on that tile
		MainGame.game.input.onUp.add(function(pos){BoardController.onMouseEvent(bc,"up",pos)});
		MainGame.game.input.onDown.add(function(pos){BoardController.onMouseEvent(bc,"down",pos)});

		// E == zoom out

		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.E).onUp.add(function(){
			if(!bc.enabled) return;
			var curLevel=bc.modelView.currentZoomLevel-1;
			if(curLevel<0) curLevel=0;
			bc.modelView.cameraZoomAt(curLevel);
		});
		// Q == zoom in
        MainGame.game.input.keyboard.addKey(Phaser.Keyboard.Q).onUp.add(function(){
        	if(!bc.enabled) return;
            var curLevel=bc.modelView.currentZoomLevel+1;
            if(curLevel>=Board.zoomLevelList.length) curLevel=Board.zoomLevelList.length-1;
            bc.modelView.cameraZoomAt(curLevel);
        });

        // WSAD == move camera
        var keyboardW=MainGame.game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyboardW.onDown.add(function(){
        	if(!bc.enabled) return;
            bc.modelView.cameraMoveBy(0,-100);
        });
        var keyboardS=MainGame.game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyboardS.onDown.add(function(){
        	if(!bc.enabled) return;
            bc.modelView.cameraMoveBy(0,100);
        });
        var keyboardA=MainGame.game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyboardA.onDown.add(function(){
        	if(!bc.enabled) return;
            bc.modelView.cameraMoveBy(-150,0);
        });
        var keyboardD=MainGame.game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyboardD.onDown.add(function(){
        	if(!bc.enabled) return;
            bc.modelView.cameraMoveBy(150,0);
        });

	},
	removeInputCallbacks: function(bc){
		// remove mouse
		MainGame.game.input.onDown
	},

};
