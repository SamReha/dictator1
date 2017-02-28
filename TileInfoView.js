// fonts list
var fontBrief=[
	{font:"30px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle"},
	{font:"30px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle"},
	{font:"30px myKaiti", fill:"lightgreen", boundsAlignH:"top", boundsAlignV:"middle"}
];
var fontDetail=[
	{font:"30px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle"},
	{font:"24px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle"}
];

function _showBuildingAndPeople_(building, buildingTextView, peopleTextView){
	console.assert(building, "Building can NOT be null!");
	// now set text!
	buildingTextView.text=building.name.toUpperCase();	
	if(building.maxPeople){
		if(building.subtype==="housing")
			peopleTextView.text="Residents:"+building.people+"/"+building.maxPeople;
		else
			peopleTextView.text="Jobs:"+building.people+"/"+building.maxPeople;
	}else{
		peopleTextView.text=" - ";
	}
	// now add color!
	var colorTable={"?":"yellow", "!":"orangered", "$":"lawngreen", "-":"white"};
	console.assert(colorTable[building.type], "Unknown building type! Must be ?(bureau), !(mil), $(commercial) or -(no type).");
	buildingTextView.addColor(colorTable[building.type], 0);
	peopleTextView.addColor(colorTable[building.type], 0);
}

var TileBriefView={
    style:{font: "30px myKaiti", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, boundsAlignH: "center", boundsAlignV: "middle" , backgroundColor: "#ffff00" },
	createNew: function(index){
		console.assert(index || index===0);
		/* global MainGame */
		var game=MainGame.game;
		// bg
		var view=game.add.sprite(0,0,"tile_hover_backpanel");
		// label position
		var startPos={x:view.texture.width*0.5, y:view.texture.height*0.5-30};

		// creates 3 lines
		var lines=["terrain", "building", "people"];
		for(var i=0;i<lines.length;i++){
			var oneLine=game.make.text(startPos.x, startPos.y+35*i,"",fontBrief[i]);
			oneLine.anchor.set(0.5);
			view.addChild(oneLine);
			view[lines[i]]=oneLine;
		}

		// Class vars
		view.index=index;
		// view.terrain
		// view.building
		// view.people
		// --- the above class vars can be accessed now ---

		// Class func
		view.updateInfo=function(tile){return TileBriefView.updateInfo(view,tile)};
		view.updatePos=function(){return TileBriefView.updatePos(view)};
		return view;
	},
	updateInfo: function(t, tile){
		console.assert(tile);
        // show terrain+res info
        t.terrain.text=tile.terrain.key+ (tile.getResType()?" ("+tile.getResType()+")":"" );

        // show building+people info
        if(tile.hasBuilding())
        	_showBuildingAndPeople_(tile.getBuilding(), t.building, t.people);
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

var TileDetailView={
    createNew: function(index) {
    	console.assert(index || index===0);

        /*global MainGame*/
        var game=MainGame.game;
        var board = MainGame.board;

        var view = game.add.sprite(0, 0, 'building_detail_backpanel');

        // bg (the grad)
        var startPos={x:10, y:30};

        // creating 5 lines
        var lines=["building","people","health","education","shelter"];
        for(var i=0;i<lines.length;i++){
        	var oneLine=game.make.text(startPos.x, startPos.y+30*i, "", fontDetail[i?1:0]);
        	if(i===0){
        		oneLine.x=100;
        		oneLine.anchor.set(0.5);
        	}
        	view.addChild(oneLine);
        	view[lines[i]]=oneLine;
        }

        // Class vars
        view.index = index;
        // view.building
        // view.people
        // view.health
        // view.education
        // view.shelter
		// --- the above class vars can be accessed now ---

        var building=board.at(index).getBuilding();
        // console.log(building.startingTurn+" "+MainGame.global.turn);

        if(building.subtype!=="road" && building.type!=="palace" && building.startingTurn<=MainGame.global.turn){
        	if(building.people<building.maxPeople){
        		// Hire button
		        view.addPersonButton = game.make.button(30, 200, "btnHire", 
		            function() {TileDetailView._onHireButtonPressed_(view)}, view, 0, 1, 2, 3);

		        view.addChild(view.addPersonButton);
        	}
        	if(building.people>0){
		        // Fire button
		        view.removePersonButton = game.make.button(100, 200, "btnFire",
		            function() {TileDetailView._onFireButtonPressed_(view)}, view, 0, 1, 2, 3);

		        view.addChild(view.removePersonButton);
        	}
    	}
		// Class func
		view.updateInfo=function(tile){return TileDetailView.updateInfo(view,tile)};
		view.updatePos=function(){return TileDetailView.updatePos(view)};

        return view;
	},

	// event process
	_onHireButtonPressed_: function(view){
        /*global MainGame*/
        var bld = MainGame.board.at(view.index).building;
        console.assert(bld, "Building can NOT be null!");

        if (bld.people >= bld.maxPeople)
            return;
        MainGame.population.hire(view.index);

        // update display
        _showBuildingAndPeople_(bld, view.building, view.people);

        for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
            var outType = bld.effects[outIndex].type;
            if(outType==="health"){ 
                outType="Health";
                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="education"){
                outType="Edu";
                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="freedom"){
                outType="Extra Freedom";
                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="unrest"){
                outType="Extra Unrest";
                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="money"){    outType="Money";    }

            // fix the apartment firing people bug
            if(bld.effects[outIndex].type===null)
                break;

            if(outIndex===0){
                view.health.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
            }else if(outIndex===1){
                view.education.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
            }else if(outIndex===2){
                view.shelter.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
            }
        }
        /*global updatePopulation*/
        updatePopulation(false,false);
	},
	_onFireButtonPressed_: function(view){
        /*global MainGame*/
        var bld=MainGame.board.at(view.index).building;
        console.assert(bld, "Building can NOT be null!");
        if(bld.people<=0)
            return;
        
        MainGame.population.fire(view.index);

        // update display
        _showBuildingAndPeople_(bld, view.building, view.people);

        for(var outIndex = 0; outIndex < bld.effects.length; outIndex++) {
            var outType = bld.effects[outIndex].type;
            if(outType==="health"){ 
                outType="Health";
                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="education"){
                outType="Edu";
                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="freedom"){
                outType="Extra Freedom";
                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="unrest"){
                outType="Extra Unrest";
                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="money"){
                outType="Money";
                MainGame.global.updateMoneyPerTurn();                    }

            // fix the apartment firing people bug
            if(bld.effects[outIndex].type===null)
                break;

            if(outIndex===0){
                view.health.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
            }else if(outIndex===1){
                view.education.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
            }else if(outIndex===2){
                view.shelter.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
            }
        }
        /*global updatePopulation*/
        updatePopulation(false,false);
	},
	updateInfo: function(view, tile){
        if(!tile.hasBuilding())
            return;

        _showBuildingAndPeople_(tile.getBuilding(), view.building, view.people);

     	var b = MainGame.board;
     	var bld = tile.getBuilding();

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
        view.health.text=str3;
        view.education.text=str4;
        view.shelter.text=str5;        
	},
	updatePos: function(view){
		view.x=5;
		view.y=100;
	}
};

