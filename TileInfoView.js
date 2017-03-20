// fonts list
var fontBrief=[
	{font:"30px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle"},
	{font:"30px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle"},
	{font:"30px myKaiti", fill:"lightgreen", boundsAlignH:"top", boundsAlignV:"middle"}
];
var fontDetail=[
	{font:"28px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle"},
	{font:"24px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle"}
];

function _showBuildingAndPeople_(building, buildingTextView, peopleTextView){
	console.assert(building, "Building can NOT be null!");
	// now set text!
	buildingTextView.text = building.playerLabel;//building.name.toUpperCase();	
	if(building.maxPeople){
		if(building.subtype==="housing")
			peopleTextView.text="Residents:"+building.people+"/"+building.maxPeople;
		else
			peopleTextView.text="Jobs:"+building.people+"/"+building.maxPeople;
	}else{
		peopleTextView.text=" - ";
	}
	// now add color!
    // Nope!
	// var colorTable={"?":"yellow", "!":"orangered", "$":"green", "-":"white"};
	// console.assert(colorTable[building.type], "Unknown building type! Must be ?(bureau), !(mil), $(commercial) or -(no type).");
	// buildingTextView.addColor(colorTable[building.type], 0);
	// peopleTextView.addColor(colorTable[building.type], 0);
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
        t.terrain.text=tile.terrainLabel + (tile.getResType()?" ("+tile.resLabel+")":"" );

        // show building+people info
        if(tile.hasBuilding())
        	_showBuildingAndPeople_(tile.getBuilding(), t.building, t.people);
	},
	updatePos: function(t){
        /*global MainGame*/
        var board=MainGame.board;
        var tile=board.at(t.index);
        t.x=board.x+tile.x*board.currentScale;
        t.y=board.y+(tile.y+tile.height*7)*board.currentScale;
        t.scale.set(board.currentScale);
	}
};

var TileDetailView={
    createNew: function(index) {
    	console.assert(index || index===0);

        /*global MainGame*/
        var game = MainGame.game;
        var board = MainGame.board;

        var view = game.add.sprite(0, 0, 'building_detail_backpanel');
        view.anchor.x = 0.5;

        // bg (the grad)
        // Top left corners of the three data columns
        var leftColPos   = {x:-200, y:30};
        var centerColPos = {x:0, y:30};
        var rightColPos  = {x:200, y:40};

        // creating 5 lines
        var leftLines = ["building", "people"];
        var centerLines = ["health", "education", "shelter"];

        for (var i = 0; i < leftLines.length; i++) {
        	var oneLine = game.make.text(leftColPos.x, 20 + leftColPos.y*i, "", fontDetail[i?1:0]);
            oneLine.anchor.x = 0.5;
        	view.addChild(oneLine);
        	view[leftLines[i]] = oneLine;
        }

        for (var j = 0; j < centerLines.length; j++) {
            var oneLine = game.make.text(centerColPos.x, 5 + centerColPos.y*j, "", fontDetail[1]);
            oneLine.anchor.x = 0.5;
            view.addChild(oneLine);
            view[centerLines[j]] = oneLine;
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

        if (building.subtype !== "road" && building.type !== "palace" && building.startingTurn<=MainGame.global.turn) {
    		// Hire button
	        view.addPersonButton = game.make.button(rightColPos.x, rightColPos.y, "btnHire", 
	            function() {TileDetailView._onHireButtonPressed_(view)}, view, 0, 1, 2, 3);

            view.addPersonButton.anchor.x = 0.5;
            view.addPersonButton.anchor.y = 0.5;

	        view.addChild(view.addPersonButton);
            if(building.people>=building.maxPeople){view.addPersonButton.visible=false;}
	        
            // Fire button
	        view.removePersonButton = game.make.button(rightColPos.x, rightColPos.y+20, "btnFire",
	            function() {TileDetailView._onFireButtonPressed_(view)}, view, 0, 1, 2, 3);

            view.removePersonButton.anchor.x = 0.5;
            view.removePersonButton.anchor.y = 0.5;

	        view.addChild(view.removePersonButton);
            if(building.people<=0){view.removePersonButton.visible=false;}
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
        if(bld.people>=bld.maxPeople){view.addPersonButton.visible=false;}
        view.removePersonButton.visible=true;

        // update display
        _showBuildingAndPeople_(bld, view.building, view.people);

        for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
            var outType = bld.effects[outIndex].type;
            var outValue = bld.effects[outIndex].outputTable[bld.people];
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
                outValue="$"+outValue+"K";
                MainGame.global.updateMoneyPerTurn();
            }

            // fix the apartment firing people bug
            if(bld.effects[outIndex].type===null)
                break;

            if(outIndex===0){
                view.health.text=outType+" Output: "+outValue;
            }else if(outIndex===1){
                view.education.text=outType+" Output: "+outValue;
            }else if(outIndex===2){
                view.shelter.text=outType+" Output: "+outValue;
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
        if(bld.people<=0){view.removePersonButton.visible=false;}
        view.addPersonButton.visible=true;

        // update display
        _showBuildingAndPeople_(bld, view.building, view.people);

        for(var outIndex = 0; outIndex < bld.effects.length; outIndex++) {
            var outType = bld.effects[outIndex].type;
            var outValue = bld.effects[outIndex].outputTable[bld.people];
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
                outValue="$"+outValue+"K";
                MainGame.global.updateMoneyPerTurn();
            }

            // fix the apartment firing people bug
            if(bld.effects[outIndex].type===null)
                break;

            if(outIndex===0){
                view.health.text=outType+" Output: "+outValue;
            }else if(outIndex===1){
                view.education.text=outType+" Output: "+outValue;
            }else if(outIndex===2){
                view.shelter.text=outType+" Output: "+outValue;
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
        
        if (bld.subtype === "housing") {
            var sentenceStart = "Residents of this building ";
            var healthDescription = "are starving";
            var eduDescription = "are illiterate";
            var shelterDescription = "are unsheltered";

            if (bld.health > 0 && bld.health < 25) {
                healthDescription = "have little food";
            } else if (bld.health >= 25 && bld.health < 50) {
                healthDescription = "have some food";
            } else if (bld.health >= 50 && bld.health < 75) {
                healthDescription = "have plenty food";
            } else healthDescription = "have abundant food";

            if (bld.education > 0 && bld.education < 25) {
                eduDescription = "have little education";
            } else if (bld.education >= 25 && bld.education < 50) {
                eduDescription = "have some education";
            } else if (bld.education >= 50 && bld.education < 75) {
                eduDescription = "are very well educated";
            } else eduDescription = "are extremely well educated";

            if (bld.shelter > 0 && bld.shelter < 25) {
                shelterDescription = "have poor shelter";
            } else if (bld.shelter >= 25 && bld.shelter < 50) {
                shelterDescription = "have decent shelter";
            } else if (bld.shelter >= 50 && bld.shelter < 75) {
                shelterDescription = "are very comfortable";
            } else shelterDescription = "are extremely comfortable";

            str3 = sentenceStart + healthDescription;
            str4 = sentenceStart + eduDescription;
            str5 = sentenceStart + shelterDescription;
        }

        if (bld.effects[0].type !== null) {
            for (var outIndex=0; outIndex < bld.effects.length; ++outIndex) {
                var outType = bld.effects[outIndex].type;
                var outValue = bld.effects[outIndex].outputTable[bld.people];
                var sentenceStart = 'This building ';
                var outDescription = '';

                if (outType === "health") {
                    if (outValue === 0) {
                        outDescription = 'provides no food';
                    } else if (outValue > 0 && outValue < 25) {
                        outDescription = "provides little food";
                    } else if (outValue >= 25 && outValue < 50) {
                        outDescription = "provides some food";
                    } else if (outValue >= 50 && outValue < 75) {
                        outDescription = "provides plenty food";
                    } else outDescription = "provides abundant food";
                } else if (outType === "education") {
                    if (outValue === 0) {
                        outDescription = 'provides no education';
                    } else if (outValue > 0 && outValue < 25) {
                        outDescription = "provides little education";
                    } else if (outValue >= 25 && outValue < 50) {
                        outDescription = "provides some education";
                    } else if (outValue >= 50 && outValue < 75) {
                        outDescription = "provides very good education";
                    } else outDescription = "provides extremely good education";
                } else if (outType === "freedom") {
                    outDescription = 'generates '  + outValue + ' Freedom';
                } else if (outType === "unrest") {
                    outDescription = 'generates '  + outValue + ' Unrest';
                } else if (outType === "money") {
                    outDescription = 'generates $'  + outValue + 'k each turn';
                }
        
                if (outIndex === 0) {
                    str3 = sentenceStart + outDescription;
                } else if(outIndex === 1) {
                    str4 = sentenceStart + outDescription;
                } else if(outIndex === 2) {
                    str5 = sentenceStart + outDescription;
                }
            }
        }
        view.health.text=str3;
        view.education.text=str4;
        view.shelter.text=str5;        
	},
	updatePos: function(view){
		view.x = MainGame.game.width/2;
		view.y = MainGame.game.height - 100;
	}
};

