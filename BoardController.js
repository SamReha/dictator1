// The Controller of Board as MVC design pattern

var BoardController={	
	createNew: function(board){
		/* global MainGame */
		// create the instance
		var bc={};

		bc.modelView=board;		
		bc.enabled=true;
		bc.mouseTimer=MainGame.game.time.create(false);

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
		/* global MainGame */
		// check if bc is enabled
		if(!bc.enabled)
			return;
		// get the rel pos
		var globalPos={x:MainGame.game.input.x, y:MainGame.game.input.y};
		var localPos={x:globalPos.x-bc.modelView.x, y:globalPos.y-bc.modelView.y};
		// event processing
		if(type==="up"){
			// end the timer
			bc.mouseTimer.stop();
			// for a click: center the map with index [arg]. 
			if(!bc.mouseTimer._isDrag_){				
				bc.modelView.cameraCenterOn(arg);
				BoardController.showTileDetail(bc);
				// MainGame.mapSelector.updateBuildingDetail(arg);
			}
			bc.mouseTimer._isDrag_=false;
		}else if(type==="down"){
			// hide tile brief/detail
			BoardController.hideTileBrief(bc);
			BoardController.hideTileDetail(bc);
			// set the current mouse pos of mouseTimer!
			bc.mouseTimer._startPos_={x:globalPos.x, y:globalPos.y};
			bc.mouseTimer._boardPos_={x:bc.modelView.x, y:bc.modelView.y};
			// start the timer!
			bc.mouseTimer.loop(100, function(){
				console.log("Mousetimer running!");
				var newPos={x:MainGame.game.input.x, y:MainGame.game.input.y};
				if(Math.abs(newPos.x-bc.mouseTimer._startPos_.x)>10 || Math.abs(newPos.y-bc.mouseTimer._startPos_.y)>10){
					bc.mouseTimer._isDrag_=true;
				}
				if(bc.mouseTimer._isDrag_){
					bc.modelView.x=bc.mouseTimer._boardPos_.x+(newPos.x-bc.mouseTimer._startPos_.x);
					bc.modelView.y=bc.mouseTimer._boardPos_.y+(newPos.y-bc.mouseTimer._startPos_.y);
				}
			});
			bc.mouseTimer.start();
		}else if(type==="over"){
			BoardController.showTileBrief(bc);
			// MainGame.mapSelector.updateTileInfo(arg);
		}else if(type==="out"){
			BoardController.hideTileBrief(bc);
		}
		else{
			console.assert(false);
		}
	},

	showTileBrief: function(bc, index){
		console.log("Now showHide tile info:");
	},
	hideTileBrief: function(bc){

	},
	showTileDetail: function(bc, index){
		console.log("Now showHide tile detail:");
	},
	hideTileDetail: function(bc, index){

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
        // Mouse Input
        var inputUpCallbacks=[];
        var inputDownCallbacks=[];
        var inputOverCallbacks=[];
        var inputOutCallbacks=[];
        var tileCount=bc.modelView.tileCount();
        function createFunc(index, type){
        	return function(){BoardController.onMouseEvent(bc,type,index)};
        }
        for(var i=0;i<tileCount;i++){
        	inputUpCallbacks[i]=createFunc(i, "up");
        	inputDownCallbacks[i]=createFunc(i, "down");
        	inputOverCallbacks[i]=createFunc(i, "over");
        	inputOutCallbacks[i]=createFunc(i, "out");
        }
        for(var j=0;j<tileCount;j++){
        	var tile=bc.modelView.at(j);
        	tile.inputEnabled=true;
        	tile.events.onInputUp.add(inputUpCallbacks[j]);
        	tile.events.onInputDown.add(inputDownCallbacks[j]);
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
