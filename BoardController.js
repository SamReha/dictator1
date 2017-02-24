// The Controller of Board as MVC design pattern

var BoardController={	
	createNew: function(board){
		/* global MainGame */
		// create the instance
		var bc={};

		bc.modelView=board;
		bc.enabled=true;
		bc.mouseTimer=MainGame.game.time.create(false);
		bc.briefView=null;
		bc.detailView=null;

		bc.buildingDetail = BuildingDetail.createNew();

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
				BoardController.showTileDetail(bc, arg);
			}
			bc.mouseTimer._isDrag_=false;
			BoardController.hideTileBrief(bc);
		}else if(type==="down"){
			// hide tile brief/detail
			BoardController.hideTileBrief(bc);
			BoardController.hideTileDetail(bc);
			// set the current mouse pos of mouseTimer!
			bc.mouseTimer._startPos_={x:globalPos.x, y:globalPos.y};
			bc.mouseTimer._boardPos_={x:bc.modelView.x, y:bc.modelView.y};
			// start the timer!
			bc.mouseTimer.loop(100, function(){
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
			BoardController.showTileBrief(bc, arg);
		}else if(type==="out"){
			BoardController.hideTileBrief(bc);
		}
		else{
			console.assert(false);
		}
	},

	showTileBrief: function(bc, index){		
		console.log("Now show tile brief:"+index);
		/* global TileBriefInfoView */
		if(index===null || index===undefined)
			return;
		if(bc.briefView){
			bc.briefView.destroy();
			bc.briefView=null;
		}
		var tile=bc.modelView.at(index);
		console.assert(tile);
		bc.briefView=TileBriefInfoView.createNew();
		bc.briefView.updateInfo(tile);
		bc.briefView.x=bc.modelView.x+tile.x*bc.modelView.currentScale;
		bc.briefView.y=bc.modelView.y+tile.y*bc.modelView.currentScale;
	},
	hideTileBrief: function(bc){
		console.log("Now hide tile brief");
		if(bc.briefView){
			bc.briefView.destroy();
			bc.briefView=null;
		}
	},
	showTileDetail: function(bc, index){
		console.log("Now show tile detail:"+index);
		/* global TileDetailInfoView */
		if(index===null || index===undefined)
			return;
		if(bc.detailView){
			bc.detailView.destroy();
			bc.detailView=null;
		}
		var tile=bc.modelView.at(index);
		console.assert(tile);
		bc.detailView=BuildingDetail.createNew();
		bc.detailView.updateSelf(index);
		bc.detailView.visible=true;
		var globalPos={x:MainGame.game.input.x, y:MainGame.game.input.y};
		bc.detailView.x=bc.modelView.x+tile.x*bc.modelView.currentScale;
		bc.detailView.y=bc.modelView.y+tile.y*bc.modelView.currentScale;
	},
	hideTileDetail: function(bc, index){
		console.log("Now hide tile detail");
		if(bc.detailView){
			bc.detailView.destroy();
			bc.detailView=null;
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

var BuildingDetail = {
    createNew: function() {
		var style = { font: "20px STKaiti", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, boundsAlignH: "center", boundsAlignV: "middle" , backgroundColor: "#ffff00" };

        /*global MainGame*/
        var buildingDetail = MainGame.game.add.sprite(0, 0, 'building_detail_backpanel');
        var buildingDetailInputPriority = 2;

        // Class vars
        buildingDetail.name = "BuildingDetail";
        buildingDetail.curIndex = 0;		// Need explanation for what makes these two different
        //buildingDetail.activeIndex = null;
        // buildingDetail.loopingTimer = MainGame.game.time.events.loop(50, MapSelector.updateAll, buildingDetail, buildingDetail);

        // bg (the grad)
        var labelX = Math.floor(buildingDetail.texture.width / 2);
        var labelY = Math.floor(buildingDetail.texture.height / 2);
        buildingDetail.y -= labelY;

        // label (bld name/lv)
        buildingDetail.label = MainGame.game.make.text(labelX, -labelY+30, "", style, buildingDetail);
        buildingDetail.label.anchor.x = 0.5;
        buildingDetail.label.anchor.y = 0.5;
        buildingDetail.addChild(buildingDetail.label);

        // label2 (people)
        buildingDetail.label2 = MainGame.game.make.text(10, -labelY+60, "", style, buildingDetail);
        buildingDetail.label2.anchor.y = 0.5;
        buildingDetail.addChild(buildingDetail.label2);

        // label3 (health)
        buildingDetail.label3=MainGame.game.make.text(10,-labelY+90,"",style,buildingDetail);
        buildingDetail.label3.anchor.y = 0.5;
        buildingDetail.addChild(buildingDetail.label3);

        // label3 (health)
        buildingDetail.label4=MainGame.game.make.text(10,-labelY+120,"",style,buildingDetail);
        buildingDetail.label4.anchor.y = 0.5;
        buildingDetail.addChild(buildingDetail.label4);

        // label3 (health)
        buildingDetail.label5=MainGame.game.make.text(10,-labelY+150,"",style,buildingDetail);
        buildingDetail.label5.anchor.y = 0.5;
        buildingDetail.addChild(buildingDetail.label5);

        // Hire button
        buildingDetail.addPersonButton = MainGame.game.make.button(30, -labelY+200, "btnHire", 
            function() {
                //console.log("[MapSelector] Hire people for index: ",buildingDetail.curIndex);
                // TODO
                /*global MainGame*/
                var bld = MainGame.board.at(buildingDetail.curIndex).building;
                if (bld.people >= bld.maxPeople) {
                    return;
                }
                
                //console.log("[MapSelector] and the building's type/name is:["+bld.type+","+bld.name+"]");
                MainGame.population.hire(buildingDetail.curIndex);
                //bld.people=bld.people+actual; [this is now done in building.addPerson()]
                // update display
                buildingDetail.label2.text="People: "+bld.people+"/"+bld.maxPeople;

                for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
                    var outType = bld.effects[outIndex].type;
                    if(outType==="health"){ 
                        outType="Health";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(buildingDetail.curIndex);
                    }else if(outType==="education"){
                        outType="Edu";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(buildingDetail.curIndex);
                    }else if(outType==="freedom"){
                        outType="Extra Freedom";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(buildingDetail.curIndex);
                    }else if(outType==="unrest"){
                        outType="Extra Unrest";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(buildingDetail.curIndex);
                    }else if(outType==="money"){    outType="Money";    }

                    if(outIndex===0){
                        buildingDetail.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }else if(outIndex===1){
                        buildingDetail.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }else if(outIndex===2){
                        buildingDetail.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }
                }
                /*global updatePopulation*/
                updatePopulation(false,false);
            }, buildingDetail, 0, 1, 2, 3);
        buildingDetail.addPersonButton.input.priorityID = buildingDetailInputPriority;
        buildingDetail.addChild(buildingDetail.addPersonButton);

        // Fire button
        buildingDetail.removePersonButton = MainGame.game.make.button(100, -labelY+200, "btnFire",
            function() {
                /*global MainGame*/
                var bld=MainGame.board.at(buildingDetail.curIndex).building;
                if(bld.people<=0){
                    return;
                }
                
                MainGame.population.fire(buildingDetail.curIndex);

                // update display
                buildingDetail.label2.text="People: "+bld.people+"/"+bld.maxPeople;

                for(var outIndex = 0; outIndex < bld.effects.length; outIndex++) {
                    var outType = bld.effects[outIndex].type;
                    if(outType==="health"){ 
                        outType="Health";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(buildingDetail.curIndex);
                    }else if(outType==="education"){
                        outType="Edu";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(buildingDetail.curIndex);
                    }else if(outType==="freedom"){
                        outType="Extra Freedom";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(buildingDetail.curIndex);
                    }else if(outType==="unrest"){
                        outType="Extra Unrest";
                        /*global updateHomesNearOutput*/
                        updateHomesNearOutput(buildingDetail.curIndex);
                    }else if(outType==="money"){
                        outType="Money";
                        MainGame.global.updateMoneyPerTurn();                    }

                    if(outIndex===0){
                        buildingDetail.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }else if(outIndex===1){
                        buildingDetail.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }else if(outIndex===2){
                        buildingDetail.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
                    }
                }
                /*global updatePopulation*/
                updatePopulation(false,false);
            }, buildingDetail, 0,1,2,3);
        buildingDetail.removePersonButton.input.priorityID = buildingDetailInputPriority;
        buildingDetail.addChild(buildingDetail.removePersonButton);

        buildingDetail.visible = false;

        // Class funcs
        buildingDetail.updateSelf = function(tileIndex) { BuildingDetail.updateSelf(buildingDetail, tileIndex) };
        buildingDetail.positionBuildingDetail = function(b) { BuildingDetail.positionBuildingDetail(buildingDetail, b) };

        return buildingDetail;
    },

    updateSelf: function(buildingDetail, tileIndex) {
    	console.log("Updating buildingDetail");
        buildingDetail.curIndex = tileIndex;

        if (tileIndex === null || tileIndex === undefined) {
            buildingDetail.visible = false;
            return;
        }

        if (buildingDetail.activeIndex === tileIndex) {
            return;
        }
        buildingDetailactiveIndex = tileIndex;

        if (!MainGame.board.at(tileIndex).hasBuilding()) {
            buildingDetail.visible = false;
            return;
        }

        var b = MainGame.board;
        //var tile = b.at(buildingDetail.activeIndex);
        var tile = b.at(tileIndex);
        var bld = tile.getBuilding();

        // Let's figure out what kind of info we need to display
        var displayName = '';

        // If this tile has no building, display terrain info
        if (bld === null || bld.isEmpty()) {
            // If this terrain has a natural resource, display that, otherwise display the terrain name
            displayName = tile.getRes().key === '__default' ? tile.terrain.key : tile.getRes().key;

            buildingDetail.label2.text = ''; // Make sure this text gets cleared if it's not going to be used
        } else {
            displayName = bld.name;// + " Lv"+bld.level;

            // Most buildings can contain people, but some (like roads) cannot. Be sure to correct for that.
            if (bld.subtype === 'road' || bld.subtype === 'palace') {
                buildingDetail.label2.text = '';
            } else {
                buildingDetail.label2.text = "People: " + bld.people + "/" + bld.maxPeople;
            }

            var str3="";
            var str4="";
            var str5="";
            
            if(bld.subtype==="housing"){
                str3="Health: "+bld.health;
                str4="Education: "+bld.education;
                str5="Shelter: "+bld.shelter;
            }
            if(bld.effects[0].type!==null){
                for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
                    var outType = bld.effects[outIndex].type;
                    var outValue = bld.effects[outIndex].outputTable[bld.people];
                    if(outType==="health"){ outType="Health";   }
                    else if(outType==="education"){ outType="Edu";  }
                    else if(outType==="freedom"){   outType="Freedom";    }
                    else if(outType==="unrest"){    outType="Unrest"; }
                    else if(outType==="money"){
                        outType="Money";
                        outValue="$"+outValue+"K";
                    }
            
                    if(outIndex===0){
                        str3=outType+" Output: "+outValue;
                    }else if(outIndex===1){
                        str4=outType+" Output: "+outValue;
                    }else if(outIndex===2){
                        str5.text=outType+" Output: "+outValue;
                    }
                }
            }
            buildingDetail.label3.text=str3;
            buildingDetail.label4.text=str4;
            buildingDetail.label5.text=str5;
        }

        buildingDetail.label.text = displayName;

        // Finally, do the buttons


        buildingDetail.positionBuildingDetail(b, tileIndex);
    },

    positionBuildingDetail: function(buildingDetail, b, tileIndex){
        var rect = b.rectOf(tileIndex, b.currentScale);
        buildingDetail.x = rect.x-b._offset.x+rect.w*.85;
        buildingDetail.y = rect.y-b._offset.y+rect.h*.5;
        buildingDetail.scale.set(b.currentScale);
    },

    // clickHandler: function(buildingDetail, activePointer) {
    //     var b = MainGame.board;
    //     var index = MainGame.board.hitTest(activePointer.x, activePointer.y);

    //     if(index===null){
    //         buildingDetail.buildingDetail.visible = false;
    //         return;
    //     }
    //     if(buildingDetail.activeIndex===index){
    //         return;
    //     }
    //     buildingDetail.activeIndex = index;

    //     if (b.at(index).hasBuilding()) {
    //         var rect = b.rectOf(buildingDetail.activeIndex,b.currentScale);
    //         buildingDetail.buildingDetail.x = rect.x-b._offset.x;
    //         buildingDetail.buildingDetail.y = rect.y-b._offset.y;
    //         buildingDetail.buildingDetail.visible = true;
    //     } else {
    //         // Make sure the detail menu is hidden if the user is trying to click away
    //         buildingDetail.buildingDetail.visible = false;
    //     }
        
    // },
};
