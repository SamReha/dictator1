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
        if(tile.hasBuilding()) {
        	_showBuildingAndPeople_(tile.getBuilding(), t.building, t.people);
        }
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

var TileDetailView = {
    verticalBorderWidth: 25,
    horizontalBorderWidth: 25,
    nameStyle: { font:"20px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle" },
    buttonStyle: { font:"20px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle" },
    descriptionStyle: { font:"20px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle", wordWrap: true, wordWrapWidth: 353 },

    createNew: function(buildingIndex) {
        console.assert(buildingIndex || buildingIndex === 0);

        /*global MainGame*/
        var game = MainGame.game;
        var board = MainGame.board;
        var building = board.at(buildingIndex).getBuilding();

        if (building.subtype === 'housing') {
            var availableNoun = 'bed';
            var addPersonString = 'Add Resident';
            var removePersonString = 'Evict Resident';
        } else {
            var availableNoun = 'job';
            var addPersonString = 'Hire Worker';
            var removePersonString = 'Fire Worker';
        }

        var view = game.add.sprite(0, 0, 'building_detail_backpanel');
        view.inputEnabled = true;
        view.input.priorityID = 101;
        view.anchor.set(0.5, 0.5);
        view.x = game.width / 2;
        view.y = game.height / 2;

        // setup the mask
        /* global DUiMask */
        view.uiMask = DUiMask.createNew();
        view.uiMask.setController(100, function() {
            view.uiMask.destroy();
            view.destroy();
            board.controller.detailView = null;
        });

        // Class variables
        view.index = buildingIndex;
        view.icon = game.make.sprite(0, 0, building.detailIconTexture);
        view.icon.x = (-view.width / 2) + TileDetailView.horizontalBorderWidth;
        view.icon.y = (-view.height / 2) + TileDetailView.verticalBorderWidth;
        view.addChild(view.icon);

        view.buildingName = game.make.text(0, 0, building.playerLabel, TileDetailView.nameStyle);
        view.buildingName.x = view.icon.x;
        view.buildingName.y = view.icon.y + view.icon.height;
        view.addChild(view.buildingName);

        view.textDescription = game.make.text(0, 0, '', TileDetailView.descriptionStyle);
        view.textDescription.x = view.icon.x + view.icon.width + TileDetailView.horizontalBorderWidth/2;
        view.textDescription.y = -view.height/2 + TileDetailView.verticalBorderWidth;
        view.addChild(view.textDescription);

        // ListView
        var peoplePerPage = 5;
        view.occupantListView = DListView.createNew(
            {},                  // don't need textures
            {l:15, t:40},        // margin inside the list view
            {w:400, h:40},       // size of an item
            function(index){  }, // forwards the callback
            false,               // not horizontal
            110                  // priority ID
        );
        view.addChild(view.occupantListView);

        // DPageIndicator: N pages
        var pageCount = Math.ceil(building.people / peoplePerPage);
        view.pageIndicator = DPageIndicator.createNew(400, {x:180, y:5}); //width, textPos
        view.pageIndicator.setModel(0, pageCount); // current, max
        view.pageIndicator.setController(function(index){ PeopleRightView.onPageChanged(view,index); }, 111);
        view.pageIndicator.y=440;
        view.addChild(view.pageIndicator);

        var availibilityString = (building.maxPeople - building.people) + ' ' + availableNoun + 's available';

        if (building.subtype !== "road" && building.type !== "palace" && building.startingTurn <= MainGame.global.turn) {
            // Hire button
            view.addPersonButton = game.make.button(0, 0, 'small_generic_button', 
                function() {TileDetailView._onHireButtonPressed_(view)}, view, 0, 2, 1, 2);

            view.addPersonButton.anchor.x = 0.5;
            view.addPersonButton.inputEnabled = true;
            view.addPersonButton.input.priorityID = 102;
            view.addPersonButton.x = -view.width/4;
            view.addPersonButton.y = view.height/2 - view.addPersonButton.height - TileDetailView.verticalBorderWidth;
            view.addChild(view.addPersonButton);

            var addPersonText = game.make.text(0, 0, addPersonString, TileDetailView.buttonStyle);
            addPersonText.x = -addPersonText.width/2;
            addPersonText.y = addPersonText.height/2;
            view.addPersonButton.addChild(addPersonText);

            if (building.people >= building.maxPeople) {
                view.addPersonButton.visible = false;
            }

            // Fire button
            view.removePersonButton = game.make.button(0, 0, 'small_generic_button',
                function() {TileDetailView._onFireButtonPressed_(view)}, view, 0, 2, 1, 2);

            view.removePersonButton.anchor.x = 0.5;
            view.removePersonButton.inputEnabled = true;
            view.removePersonButton.input.priorityID = 102;
            view.removePersonButton.x = view.width/4;
            view.removePersonButton.y = view.height/2 - view.removePersonButton.height - TileDetailView.verticalBorderWidth;
            view.addChild(view.removePersonButton);

            var removePersonText = game.make.text(0, 0, removePersonString, TileDetailView.buttonStyle);
            removePersonText.x = -removePersonText.width/2;
            removePersonText.y = removePersonText.height/2;
            view.removePersonButton.addChild(removePersonText);

            if (building.people <= 0) {
                view.removePersonButton.visible = false;
            }

            view.availabilityText = game.make.text(0, 0, availibilityString, TileDetailView.descriptionStyle); // Example: 3 jobs available, or No beds available
            view.availabilityText.anchor.set(0.5, 0.5);
            view.availabilityText.y = view.removePersonButton.y - 15;
            view.addChild(view.availabilityText);
        }

        // Class func
        view.updateInfo = function(tile) { return TileDetailView.updateInfo(view,tile); };

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
        if (bld.people >= bld.maxPeople) {
            view.addPersonButton.visible = false;
        }
        view.removePersonButton.visible = true;

        var str3 = '';
        var str4 = '';
        var str5 = '';

        // update display
        TileDetailView._updateAvailabilityText(view, bld);

        if (bld.subtype !== "housing") {
            TileDetailView._updateState(view, bld);
        }  

        /*global updatePopulation*/
        updatePopulation(false,false);
    },

    _onFireButtonPressed_: function(view) {
        /*global MainGame*/
        var bld = MainGame.board.at(view.index).building;
        console.assert(bld, "Building can NOT be null!");
        if (bld.people <= 0)
            return;
        
        MainGame.population.fire(view.index);
        if (bld.people <= 0) {
            view.removePersonButton.visible = false;
        }
        view.addPersonButton.visible = true;

        // update display
        TileDetailView._updateAvailabilityText(view, bld);

        if (bld.subtype !== "housing") {
            TileDetailView._updateState(view, bld);
        }

        /*global updatePopulation*/
        updatePopulation(false,false);
    },

    _updateAvailabilityText: function(view, building) {
        if (building.subtype === 'housing') {
            var availableNoun = 'bed';
            var occupantNoun = 'resident';
        } else {
            var availableNoun = 'job';
            var occupantNoun = 'worker';
        }

        var availability = building.maxPeople - building.people;

        // Pluralize!
        if (availability !== 1) availableNoun += 's';
        if (building.people !== 1) occupantNoun += 's';

        view.availabilityText.text = building.people + ' ' + occupantNoun + ' | ' + availability + ' ' + availableNoun + ' available';
    },

    // When a non-housing building gets a worker added or removed, some states need to get updated
    _updateState: function(view, building) {
        var sentenceStart = 'This building ';
        var outDescription = '';

        var str3 = '';
        var str4 = '';
        var str5 = '';

        for(var outIndex = 0; outIndex < building.effects.length; outIndex++) {
            var outType = building.effects[outIndex].type;
            var outValue = building.effects[outIndex].outputTable[building.people];

            if (outType === "health") { 
                if (outValue === 0) {
                    outDescription = 'provides no food.';
                } else if (outValue > 0 && outValue < 25) {
                    outDescription = "provides little food.";
                } else if (outValue >= 25 && outValue < 50) {
                    outDescription = "provides some food.";
                } else if (outValue >= 50 && outValue < 75) {
                    outDescription = "provides plenty food.";
                } else outDescription = "provides abundant food.";

                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="education"){
                if (outValue === 0) {
                    outDescription = 'provides no education.';
                } else if (outValue > 0 && outValue < 25) {
                    outDescription = "provides little education.";
                } else if (outValue >= 25 && outValue < 50) {
                    outDescription = "provides some education.";
                } else if (outValue >= 50 && outValue < 75) {
                    outDescription = "provides very good education.";
                } else outDescription = "provides extremely good education.";

                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="freedom"){
                outDescription = 'generates ' + outValue + ' Freedom.';

                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="unrest"){
                outDescription = 'generates ' + outValue + ' Unrest.';

                /*global updateHomesNearOutput*/
                updateHomesNearOutput(view.index);
            }else if(outType==="money"){
                outDescription = 'generates $' + outValue + 'k each turn.';

                MainGame.global.updateMoneyPerTurn();
            }

            // fix the apartment firing people bug
            if (building.effects[outIndex].type === null)
                break;

            if (outIndex === 0) {
                str3 = sentenceStart + outDescription;
            } else if(outIndex === 1) {
                str4 = sentenceStart + outDescription;
            } else if(outIndex === 2) {
                str5 = sentenceStart + outDescription;
            }
        }

        view.textDescription.text = str3;
        view.textDescription.text = view.textDescription.text + '\n' + str4;
        view.textDescription.text = view.textDescription.text + '\n' + str5;
    },

    updateInfo: function(view, tile){
        if(!tile.hasBuilding())
            return;

        TileDetailView._updateAvailabilityText(view, tile.getBuilding());

        var b = MainGame.board;
        var bld = tile.getBuilding();

        var str3="";
        var str4="";
        var str5="";
        
        if (bld.subtype === "housing") {
            var sentenceStart = "Residents ";
            var healthDescription = "are starving.";
            var eduDescription = "are illiterate.";
            var shelterDescription = "are unsheltered.";

            if (bld.health > 0 && bld.health < 25) {
                healthDescription = "have little food.";
            } else if (bld.health >= 25 && bld.health < 50) {
                healthDescription = "have some food.";
            } else if (bld.health >= 50 && bld.health < 75) {
                healthDescription = "have plenty food.";
            } else healthDescription = "have abundant food.";

            if (bld.education > 0 && bld.education < 25) {
                eduDescription = "have little education.";
            } else if (bld.education >= 25 && bld.education < 50) {
                eduDescription = "have some education.";
            } else if (bld.education >= 50 && bld.education < 75) {
                eduDescription = "are very well educated.";
            } else eduDescription = "are extremely well educated.";

            if (bld.shelter > 0 && bld.shelter < 25) {
                shelterDescription = "have poor shelter.";
            } else if (bld.shelter >= 25 && bld.shelter < 50) {
                shelterDescription = "have decent shelter.";
            } else if (bld.shelter >= 50 && bld.shelter < 75) {
                shelterDescription = "are very comfortable.";
            } else shelterDescription = "are extremely comfortable.";

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
                        outDescription = 'provides no food.';
                    } else if (outValue > 0 && outValue < 25) {
                        outDescription = "provides little food.";
                    } else if (outValue >= 25 && outValue < 50) {
                        outDescription = "provides some food.";
                    } else if (outValue >= 50 && outValue < 75) {
                        outDescription = "provides plenty food.";
                    } else outDescription = "provides abundant food.";
                } else if (outType === "education") {
                    if (outValue === 0) {
                        outDescription = 'provides no education.';
                    } else if (outValue > 0 && outValue < 25) {
                        outDescription = "provides little education.";
                    } else if (outValue >= 25 && outValue < 50) {
                        outDescription = "provides some education.";
                    } else if (outValue >= 50 && outValue < 75) {
                        outDescription = "provides very good education.";
                    } else outDescription = "provides extremely good education.";
                } else if (outType === "freedom") {
                    outDescription = 'generates ' + outValue + ' Freedom.';
                } else if (outType === "unrest") {
                    outDescription = 'generates ' + outValue + ' Unrest.';
                } else if (outType === "money") {
                    outDescription = 'generates $' + outValue + 'k each turn.';
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

        view.textDescription.text = str3;
        view.textDescription.text = view.textDescription.text + '\n' + str4;
        view.textDescription.text = view.textDescription.text + '\n' + str5;        
    },
};
