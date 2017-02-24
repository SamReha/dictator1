// The Controller of Board as MVC design pattern

var BoardController={	
	createNew: function(board){
		// create the instance
		var bc={};

		bc.modelView=board;		
		bc.enabled=true;

/////////////////////////////////////////////////////////////
		// Class funcs
		//	disable/enable all inputs from keyboard/mouse
		bc.setEnabled=function(en){bc.enabled=en};
/////////////////////////////////////////////////////////////

		// setup event listener
		BoardController.addInputCallbacks(bc);

		// returns the created instance
		return bc;
	},

	/* ------- Implementation ------- */
	onMouseEvent: function(bc, type, arg){
		// check if bc is enabled
		if(!bc.enabled)
			return;
		// get the rel pos
		var globalPos={x:MainGame.game.input.x, y:MainGame.game.input.y};
		var localPos={x:globalPos.x-bc.modelView.x, y:globalPos.y-bc.modelView.y};
		// event processing
		if(type==="up"){
			// call hitTest() and set isLocal to true
			var i=Board.hitTest(bc.modelView, localPos.x, localPos.y, true);
			bc.modelView.cameraCenterOn(i);
		}else if(type==="down"){

		}else if(type==="over"){
			console.log("Input Over:",arg);
		}else if(type==="out"){
			console.log("Input Out:",arg);
		}
		else{
			console.assert(false);
		}
	},
	updateTileInfo: function(bc){
		var globalPos={x:MainGame.game.input.x, y:MainGame.game.input.y};
		var localPos={x:globalPos.x-bc.modelView.x, y:globalPos.y-bc.modelView.y};

		console.log("Now update tile info:", globalPos, localPos);
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
		bc.modelView.inputEnabled=true;
        bc.modelView.input.priorityID = 0;

        // Mouse Input
        bc.modelView.events.onInputUp.add(function(){BoardController.onMouseEvent(bc,"up")});
        // bc.modelView.events.onInputOver.add(function(){BoardController.onMouseEvent(bc,"over")});
        // bc.modelView.events.onInputOut.add(function(){BoardController.onMouseEvent(bc,"out")});
        function createFunc(index, isInputOver){
        	return function(){BoardController.onMouseEvent(bc,isInputOver?"over":"out",index)};
        }
        var tileCount=bc.modelView.tileCount();
        var inputOverCallbacks=[];
        var inputOutCallbacks=[];
        for(var i=0;i<tileCount;i++){
        	inputOverCallbacks[i]=createFunc(i, true);
        	inputOutCallbacks[i]=createFunc(i, false);
        }
        for(var j=0;j<tileCount;j++){
        	var tile=bc.modelView.at(j);
        	tile.inputEnabled=true;
        	tile.input.priorityID=0;
        	tile.events.onInputOver.add(inputOverCallbacks[j]);
        	tile.events.onInputOut.add(inputOutCallbacks[j]);
        }


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
