// The Controller of Board as MVC design pattern

var BoardController={	
	createNew: function(board){
		// create the instance
		var bc={};

		// Class vars
		bc.modelView=board;

		// Class funcs

		// disable/enable all inputs from keyboard/mouse
		bc.disableInput=function(){return BoardController.disableInput(bc)};
		bc.enableInput=function(){return BoardController.enableInput(bc)};

		// the key event callback function
		bc.onKeyEvent=function(keyEvent){return BoardController.onKeyEvent(bc,keyEvent)};
		// the mouse event callback function
		bc.onMouseEvent=function(mouseEvent){return BoardController.onMouseEvent(bc,mouseEvent)};

		
		// the destruction function
		bc.deleteMe=function(){BoardController.deleteMe(bc)};

		// setup event listener
		BoardController.addInputCallbacks(bc);

		// returns the created instance
		return bc;
	},

	/* ------- Implementation ------- */
	addInputCallbacks: function(bc){
		/* global MainGame */
		
		// Mouse Click == Center on that tile
		MainGame.game.input.onDown.add(function(pos){
			bc.modelView.cameraCenterOn(bc.modelView.hitTest(pos.x,pos.y));
		});

		// E == zoom out
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.E).onUp.add(function(){
			var curLevel=bc.modelView.currentZoomLevel-1;
			if(curLevel<0) curLevel=0;
			bc.modelView.cameraZoomAt(curLevel);
		});
		// Q == zoom in
        MainGame.game.input.keyboard.addKey(Phaser.Keyboard.Q).onUp.add(function(){
            var curLevel=bc.modelView.currentZoomLevel+1;
            if(curLevel>=Board.zoomLevelList.length) curLevel=Board.zoomLevelList.length-1;
            bc.modelView.cameraZoomAt(curLevel);
        });

        // WSAD == move camera
        var keyboardW=MainGame.game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyboardW.onDown.add(function(){
            bc.modelView.cameraMoveBy(0,-100);
        });
        var keyboardS=MainGame.game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyboardS.onDown.add(function(){
            bc.modelView.cameraMoveBy(0,100);
        });
        var keyboardA=MainGame.game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyboardA.onDown.add(function(){
            bc.modelView.cameraMoveBy(-150,0);
        });
        var keyboardD=MainGame.game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyboardD.onDown.add(function(){
            bc.modelView.cameraMoveBy(150,0);
        });

	},
	removeInputCallbacks: function(bc){
	},
	disableInput: function(bc){

	},
	enableInput: function(bc){

	},
	onKeyEvent: function(bc, keyEvent){

	},
	onMouseEvent: function(bc, mouseEvent){

	},

};
