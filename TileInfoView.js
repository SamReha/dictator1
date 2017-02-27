var fontBrief=[
	{font:"30px myKaiti", fill:"yellow", boundsAlignH:"top", boundsAlignV:"middle"},
	{font:"30px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle"},
	{font:"30px myKaiti", fill:"lightgreen", boundsAlignH:"top", boundsAlignV:"middle"}
];

var TileBriefInfoView={
    style:{font: "30px myKaiti", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, boundsAlignH: "center", boundsAlignV: "middle" , backgroundColor: "#ffff00" },
	createNew: function(index){
		/* global MainGame */
		var game=MainGame.game;
		// bg
		var view=game.add.sprite(0,0,"tile_hover_backpanel");
		// label position
		var centerPos={x:view.texture.width*0.5, y:view.texture.height*0.5-30};
		// tile index
		view.index=index;

		// creates 3 lines
		var lines=["terrain", "building", "people"];
		for(var i=0;i<lines.length;i++){
			var oneLine=game.make.text(centerPos.x, centerPos.y+35*i,"",fontBrief[i]);
			oneLine.anchor.x=0.5;
			oneLine.anchor.y=0.5;
			view.addChild(oneLine);
			view[lines[i]]=oneLine;
		}
		// Class members
		// You can use:
		// view.terrain, view.building, view.people

		// Class func
		view.updateInfo=function(tile){return TileBriefInfoView.updateInfo(view,tile)};
		view.updatePos=function(){return TileBriefInfoView.updatePos(view)};
		return view;
	},
	updateInfo: function(t, tile){
		console.assert(tile);
        // Let's figure out what kind of info we need to display
        t.terrain.text=tile.terrain.key+ (tile.getResType()?" ("+tile.getResType()+")":"" );

        if(tile.hasBuilding()){
        	var bld=tile.getBuilding();
        	var bldStr=bld.name.toUpperCase();
        	t.building.text=bldStr;
        	t.people.text="with people:"+bld.people+"/"+bld.maxPeople;
        }
	},
	updatePos: function(t){
        /*global MainGame*/
        var board=MainGame.board;
        var tile=board.at(t.index);
        t.x=board.x+tile.x*board.currentScale;
        t.y=board.y+tile.y*board.currentScale;
        t.scale.set(board.currentScale);
	}
};

var TileDetailInfoView={
    createNew: function(index) {
    	console.assert(index);
		var style = { font: "20px STKaiti", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, boundsAlignH: "center", boundsAlignV: "middle" , backgroundColor: "#ffff00" };

        /*global MainGame*/
        var board = MainGame.board;

        var bdiView = MainGame.game.add.sprite(0, 0, 'building_detail_backpanel');
        var bdInputPriority = 2;

        // Class vars
        bdiView.name = "BuildingDetail";
        bdiView.index = index;		// Need explanation for what makes these two different
        //bdiView.activeIndex = null;
        // bdiView.loopingTimer = MainGame.game.time.events.loop(50, MapSelector.updateAll, buildingDetail, buildingDetail);

        // bg (the grad)
        var labelX = Math.floor(bdiView.texture.width / 2);
        var labelY = Math.floor(bdiView.texture.height);
        bdiView.y -= labelY;

        // label (bld name/lv)
        bdiView.label = MainGame.game.make.text(labelX, 20, "", style, bdiView);
        bdiView.label.anchor.x = 0.5;
        bdiView.label.anchor.y = 0.5;
        bdiView.addChild(bdiView.label);

        // label2 (people)
        bdiView.label2 = MainGame.game.make.text(10, 60, "", style, bdiView);
        bdiView.label2.anchor.y = 0.5;
        bdiView.addChild(bdiView.label2);

        // label3 (health)
        bdiView.label3=MainGame.game.make.text(10, 90,"",style,bdiView);
        bdiView.label3.anchor.y = 0.5;
        bdiView.addChild(bdiView.label3);

        // label3 (health)
        bdiView.label4=MainGame.game.make.text(10, 120,"",style,bdiView);
        bdiView.label4.anchor.y = 0.5;
        bdiView.addChild(bdiView.label4);

        // label3 (health)
        bdiView.label5=MainGame.game.make.text(10, 150,"",style,bdiView);
        bdiView.label5.anchor.y = 0.5;
        bdiView.addChild(bdiView.label5);

        // Hire button
        if(board.at(index).hasBuilding()){
	        bdiView.addPersonButton = MainGame.game.make.button(30, labelY-50, "btnHire", 
	            function() {
	                //console.log("[MapSelector] Hire people for index: ",bdiView.curIndex);
	                // TODO

	                /*global MainGame*/
	                var bld = MainGame.board.at(bdiView.index).building;
	                if (bld.people >= bld.maxPeople)
	                    return;
	                
	                //console.log("[MapSelector] and the building's type/name is:["+bld.type+","+bld.name+"]");
	                MainGame.population.hire(bdiView.index);
	                //bld.people=bld.people+actual; [this is now done in building.addPerson()]
	                // update display
	                bdiView.label2.text="People: "+bld.people+"/"+bld.maxPeople;

	                for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
	                    var outType = bld.effects[outIndex].type;
	                    if(outType==="health"){ 
	                        outType="Health";
	                        /*global updateHomesNearOutput*/
	                        updateHomesNearOutput(bdiView.index);
	                    }else if(outType==="education"){
	                        outType="Edu";
	                        /*global updateHomesNearOutput*/
	                        updateHomesNearOutput(bdiView.index);
	                    }else if(outType==="freedom"){
	                        outType="Extra Freedom";
	                        /*global updateHomesNearOutput*/
	                        updateHomesNearOutput(bdiView.index);
	                    }else if(outType==="unrest"){
	                        outType="Extra Unrest";
	                        /*global updateHomesNearOutput*/
	                        updateHomesNearOutput(bdiView.index);
	                    }else if(outType==="money"){    outType="Money";    }

	                    if(outIndex===0){
	                        bdiView.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
	                    }else if(outIndex===1){
	                        bdiView.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
	                    }else if(outIndex===2){
	                        bdiView.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
	                    }
	                }
	                /*global updatePopulation*/
	                updatePopulation(false,false);
	            }, bdiView, 0, 1, 2, 3);
	        bdiView.addPersonButton.input.priorityID = bdInputPriority;
	        bdiView.addChild(bdiView.addPersonButton);

	        // Fire button
	        bdiView.removePersonButton = MainGame.game.make.button(100, labelY-50, "btnFire",
	            function() {
	                /*global MainGame*/
	                var bld=MainGame.board.at(bdiView.index).building;
	                if(bld.people<=0)
	                    return;
	                
	                MainGame.population.fire(bdiView.index);

	                // update display
	                bdiView.label2.text="People: "+bld.people+"/"+bld.maxPeople;

	                for(var outIndex = 0; outIndex < bld.effects.length; outIndex++) {
	                    var outType = bld.effects[outIndex].type;
	                    if(outType==="health"){ 
	                        outType="Health";
	                        /*global updateHomesNearOutput*/
	                        updateHomesNearOutput(bdiView.index);
	                    }else if(outType==="education"){
	                        outType="Edu";
	                        /*global updateHomesNearOutput*/
	                        updateHomesNearOutput(bdiView.index);
	                    }else if(outType==="freedom"){
	                        outType="Extra Freedom";
	                        /*global updateHomesNearOutput*/
	                        updateHomesNearOutput(bdiView.index);
	                    }else if(outType==="unrest"){
	                        outType="Extra Unrest";
	                        /*global updateHomesNearOutput*/
	                        updateHomesNearOutput(bdiView.index);
	                    }else if(outType==="money"){
	                        outType="Money";
	                        MainGame.global.updateMoneyPerTurn();                    }

	                    if(outIndex===0){
	                        bdiView.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
	                    }else if(outIndex===1){
	                        bdiView.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
	                    }else if(outIndex===2){
	                        bdiView.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
	                    }
	                }
	                /*global updatePopulation*/
	                updatePopulation(false,false);
	            }, bdiView, 0,1,2,3);
	        bdiView.removePersonButton.input.priorityID = bdInputPriority;
	        bdiView.addChild(bdiView.removePersonButton);
    	}
		// Class func
		bdiView.updateInfo=function(tile){return TileDetailInfoView.updateInfo(bdiView,tile)};
		bdiView.updatePos=function(){return TileDetailInfoView.updatePos(bdiView)};

        return bdiView;
	},
	updateInfo: function(bdiView, tile){
        if(!tile.hasBuilding())
            return;

        var b = MainGame.board;
        var bld = tile.getBuilding();

        // Let's figure out what kind of info we need to display
        var displayName = '';

        // If this tile has no building, display terrain info
        if (bld === null || bld.isEmpty()) {
            // If this terrain has a natural resource, display that, otherwise display the terrain name
            displayName = tile.getRes().key === '__default' ? tile.terrain.key : tile.getRes().key;

            bdiView.label2.text = ''; // Make sure this text gets cleared if it's not going to be used
        } else {
            displayName = bld.name;// + " Lv"+bld.level;

            // Most buildings can contain people, but some (like roads) cannot. Be sure to correct for that.
            if (bld.subtype === 'road') {
                bdiView.label2.text = '';
            } else {
                bdiView.label2.text = "People: " + bld.people + "/" + bld.maxPeople;
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
            bdiView.label3.text=str3;
            bdiView.label4.text=str4;
            bdiView.label5.text=str5;
        }

        bdiView.label.text = displayName;
	},
	updatePos: function(bdiView){
		/*global MainGame*/
		var board=MainGame.board;
		var rect=board.rectOf(bdiView.index,board.currentScale);

        bdiView.x=rect.x-board._offset.x+rect.w*.85;
        bdiView.y=rect.y-board._offset.y;
        bdiView.scale.set(board.currentScale);
	}
};