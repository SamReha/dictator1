// The Controller of Board as MVC design pattern

var BoardController={	
	createNew: function(board){
		/* global MainGame */
		// create the instance
		var bc={};

		bc.modelView=board;
		bc.enabled=true;
		bc.cameraSpeed = {x:150,y:100};
		bc.cameraKey = {w:false,a:false,s:false,d:false,up:false,down:false,left:false,right:false};
		bc.cameraTimer=MainGame.game.time.create(false);
		bc.panTimer=MainGame.game.time.create(false);
		bc.mouseTimer=MainGame.game.time.create(false);
		bc.mouseOverTimer=MainGame.game.time.create(false);
		bc.briefView=null;
		bc.detailView=null;
		bc.tileRectRatio = bc.modelView.tileWidth/(bc.modelView.tileHeight*2);

/////////////////////////////////////////////////////////////
		// Class funcs
		//	disable/enable all inputs from keyboard/mouse
		bc.setEnabled=function(en){bc.enabled=en};
/////////////////////////////////////////////////////////////

		// setup event listener
		BoardController.addInputCallbacks(bc);

		// setup camera loop
		bc.cameraTimer.loop(10,BoardController.updateCameraMove,null,bc);

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
			bc.panTimer.stop(true);
			// for a click: center the map with index [arg]. 
			if(!bc.mouseTimer._isDrag_){
				bc.mouseTimer.stop(true);
				BoardController.hideTileBrief(bc);
				// BoardController.hideTileDetail(bc);
				bc.modelView.cameraCenterOn(arg);
				BoardController.showTileDetail(bc, arg);
			}
			bc.mouseTimer._isDrag_=false;
			// BoardController.hideTileBrief(bc);
		}else if(type==="down"){
			// hide tile brief/detail
			// BoardController.hideTileBrief(bc);
			// BoardController.hideTileDetail(bc);
			// set the current mouse pos of mouseTimer!
			bc.mouseTimer._startPos_={x:globalPos.x, y:globalPos.y};
			bc.mouseTimer._boardPos_={x:bc.modelView.x, y:bc.modelView.y};
			// start the timer!
			bc.panTimer.loop(50, function(){
				var newPos={x:MainGame.game.input.x, y:MainGame.game.input.y};
				if(Math.abs(newPos.x-bc.mouseTimer._startPos_.x)>10 || Math.abs(newPos.y-bc.mouseTimer._startPos_.y)>10){
					bc.mouseTimer._isDrag_=true;
				}
				if(bc.mouseTimer._isDrag_){
					var oldX=bc.modelView.x;
					var oldY=bc.modelView.y;
					bc.modelView.x=bc.mouseTimer._boardPos_.x+(newPos.x-bc.mouseTimer._startPos_.x);
					bc.modelView.y=bc.mouseTimer._boardPos_.y+(newPos.y-bc.mouseTimer._startPos_.y);
					bc.modelView._offset.x+=oldX-bc.modelView.x;
					bc.modelView._offset.y+=oldY-bc.modelView.y;
				}
			});
			bc.panTimer.start();
		}else if(type==="over"){
			BoardController.showTileBrief(bc, arg);
		}else if(type==="out"){
			bc.mouseOverTimer.stop(true);
			BoardController.hideTileBrief(bc);
		}
		else{
			console.assert(false);
		}
	},

	showTileBrief: function(bc, index) {		
		/* global TileBriefInfoView */
		if(index===null || index===undefined)
			return;
		if(bc.briefView){
			bc.mouseOverTimer.stop(true);
			BoardController.hideTileBrief(bc);
		}
		if(bc.detailView){
			if(bc.detailView.index===index)
				return;
		}

		// If the tile is empty, don't bother showing a panel (unless it is water or mountain)
		var tile = MainGame.board.at(index);
		if (!tile.hasBuilding()) {
			if ((tile.getTerrainType() !== 'water') && (tile.getTerrainType() !== 'mountain')) {
				return;
			}
		}

		bc.briefView = TileBriefView.createNew(index);
		bc.briefView.updatePos();
		bc.mouseOverTimer.loop(10,bc.briefView.updatePos);
		bc.mouseOverTimer.start();
	},

	hideTileBrief: function(bc) {
		if (bc.briefView) {
			bc.briefView.destroy();
			bc.briefView = null;
		}
	},
	
	showTileDetail: function(bc, index){
		if (index===null || index===undefined) return;

		if (bc.detailView) {
			if (bc.detailView.index === index) {
                BoardController.hideTileDetail(bc);
				return;
            } else {
				bc.mouseTimer.stop(true);
				BoardController.hideTileDetail(bc);
			}
		}
		
		var tile = bc.modelView.at(index);
		if(!tile.hasBuilding() || tile.getBuilding().name === 'road')
			return;

		bc.detailView = BuildingDetail.createNew(index);
		bc.detailView.updateInfo(tile);
	},

	hideTileDetail: function(bc){
		//console.log("Now hide tile detail");
		if(bc.detailView){
			bc.detailView.destroy();
			bc.detailView=null;
		}
	},

	onKeyboardEvent: function(bc, type, key){
		if(!bc.enabled)
			return;
		if(key==="E" && type==="up"){
			var curLevel=bc.modelView.currentZoomIndex-1;
			if(curLevel<0) curLevel=0;
			bc.modelView.cameraZoomAt(curLevel);			
		}else if(key==="Q" && type==="up"){
            var curLevel=bc.modelView.currentZoomIndex+1;
            if(curLevel>=Board.zoomLevelList.length) curLevel=Board.zoomLevelList.length-1;
            bc.modelView.cameraZoomAt(curLevel);
		}else if(key==="W" && type==="down"){
			if(!bc.cameraTimer.running){bc.cameraTimer.start();}
            bc.cameraKey.w = true;
		}else if(key==="S" && type==="down"){
			if(!bc.cameraTimer.running){bc.cameraTimer.start();}
            bc.cameraKey.s = true;
		}else if(key==="A" && type==="down"){
			if(!bc.cameraTimer.running){bc.cameraTimer.start();}
            bc.cameraKey.a = true;
		}else if(key==="D" && type==="down"){
			if(!bc.cameraTimer.running){bc.cameraTimer.start();}
            bc.cameraKey.d = true;
		}else if(key==="UpArrow" && type==="down"){
			if(!bc.cameraTimer.running){bc.cameraTimer.start();}
            bc.cameraKey.up = true;
		}else if(key==="DownArrow" && type==="down"){
			if(!bc.cameraTimer.running){bc.cameraTimer.start();}
            bc.cameraKey.down = true;
		}else if(key==="LeftArrow" && type==="down"){
			if(!bc.cameraTimer.running){bc.cameraTimer.start();}
            bc.cameraKey.left = true;
		}else if(key==="RightARrow" && type==="down"){
			if(!bc.cameraTimer.running){bc.cameraTimer.start();}
            bc.cameraKey.right = true;
		}else if(key==="W" && type==="up"){
            bc.cameraKey.w = false;
            if(!bc.cameraKey.w&&!bc.cameraKey.s&&!bc.cameraKey.a&&!bc.cameraKey.d&&
            	!bc.cameraKey.up&&!bc.cameraKey.down&&!bc.cameraKey.left&&!bc.cameraKey.right){bc.cameraTimer.stop(false);}
		}else if(key==="S" && type==="up"){
            bc.cameraKey.s = false;
            if(!bc.cameraKey.w&&!bc.cameraKey.s&&!bc.cameraKey.a&&!bc.cameraKey.d&&
            	!bc.cameraKey.up&&!bc.cameraKey.down&&!bc.cameraKey.left&&!bc.cameraKey.right){bc.cameraTimer.stop(false);}
		}else if(key==="A" && type==="up"){
            bc.cameraKey.a = false;
            if(!bc.cameraKey.w&&!bc.cameraKey.s&&!bc.cameraKey.a&&!bc.cameraKey.d&&
            	!bc.cameraKey.up&&!bc.cameraKey.down&&!bc.cameraKey.left&&!bc.cameraKey.right){bc.cameraTimer.stop(false);}
		}else if(key==="D" && type==="up"){
            bc.cameraKey.d = false;
            if(!bc.cameraKey.w&&!bc.cameraKey.s&&!bc.cameraKey.a&&!bc.cameraKey.d&&
            	!bc.cameraKey.up&&!bc.cameraKey.down&&!bc.cameraKey.left&&!bc.cameraKey.right){bc.cameraTimer.stop(false);}
		}else if(key==="UpArrow" && type==="up"){
            bc.cameraKey.up = false;
            if(!bc.cameraKey.w&&!bc.cameraKey.s&&!bc.cameraKey.a&&!bc.cameraKey.d&&
            	!bc.cameraKey.up&&!bc.cameraKey.down&&!bc.cameraKey.left&&!bc.cameraKey.right){bc.cameraTimer.stop(false);}
		}else if(key==="DownArrow" && type==="up"){
            bc.cameraKey.down = false;
            if(!bc.cameraKey.w&&!bc.cameraKey.s&&!bc.cameraKey.a&&!bc.cameraKey.d&&
            	!bc.cameraKey.up&&!bc.cameraKey.down&&!bc.cameraKey.left&&!bc.cameraKey.right){bc.cameraTimer.stop(false);}
		}else if(key==="LeftArrow" && type==="up"){
            bc.cameraKey.left = false;
            if(!bc.cameraKey.w&&!bc.cameraKey.s&&!bc.cameraKey.a&&!bc.cameraKey.d&&
            	!bc.cameraKey.up&&!bc.cameraKey.down&&!bc.cameraKey.left&&!bc.cameraKey.right){bc.cameraTimer.stop(false);}
		}else if(key==="RightARrow" && type==="up"){
            bc.cameraKey.right = false;
            if(!bc.cameraKey.w&&!bc.cameraKey.s&&!bc.cameraKey.a&&!bc.cameraKey.d&&
            	!bc.cameraKey.up&&!bc.cameraKey.down&&!bc.cameraKey.left&&!bc.cameraKey.right){bc.cameraTimer.stop(false);}
		}
		else{
			console.assert(false);
		}
	},

	updateCameraMove: function(bc){
		var xSum=0;
		var ySum=0;

		if(bc.cameraKey.w||bc.cameraKey.up){
			ySum-=bc.cameraSpeed.y;
		}
		if(bc.cameraKey.s||bc.cameraKey.down){
			ySum+=bc.cameraSpeed.y;
		}
		if(bc.cameraKey.a||bc.cameraKey.left){
			xSum-=bc.cameraSpeed.x;
		}
		if(bc.cameraKey.d||bc.cameraKey.right){
			xSum+=bc.cameraSpeed.x;
		}

		bc.modelView.cameraMoveBy(xSum*bc.cameraTimer.elapsed*.01,ySum*bc.cameraTimer.elapsed*.01);
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
        	tile.input.pixelPerfectClick=true;
        	// tile.input.pixelPerfectOver=true;
        	console.log("got here");
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
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.
			add(function(){BoardController.onKeyboardEvent(bc,"down","W")});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.W).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","W")});
		//	S
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.
			add(function(){BoardController.onKeyboardEvent(bc,"down","S")});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.S).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","S")});
		//	A
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.
			add(function(){BoardController.onKeyboardEvent(bc,"down","A")});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.A).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","A")});
		//	D
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.D).onDown.
			add(function(){BoardController.onKeyboardEvent(bc,"down","D")});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.D).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","D")});
		//	UpArrow
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.
			add(function(){BoardController.onKeyboardEvent(bc,"down","UpArrow")});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.UP).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","UpArrow")});
		//	DownArrow
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.
			add(function(){BoardController.onKeyboardEvent(bc,"down","DownArrow")});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","DownArrow")});
		//	LeftArrow
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.
			add(function(){BoardController.onKeyboardEvent(bc,"down","LeftArrow")});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","LeftArrow")});
		//	RightARrow
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.
			add(function(){BoardController.onKeyboardEvent(bc,"down","RightARrow")});
		MainGame.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onUp.
			add(function(){BoardController.onKeyboardEvent(bc,"up","RightARrow")});
	},
};
