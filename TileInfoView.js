var TileBriefView = {
    // fonts list
    fontBrief: [
        {font: "40px myKaiti", fill: "white", boundsAlignH: "top", boundsAlignV: "middle"},
        {font: "30px myKaiti", fill: "orange", boundsAlignH: "top", boundsAlignV: "middle"}
    ],

	createNew: function(index) {
		console.assert(index || index === 0);

        var view = MainGame.game.add.sprite(0, 0, "tile_hover_backpanel");

        var tile = MainGame.board.at(index);
        var labelText = '';
        var textPosition;

        if (tile.hasBuilding()) {
            labelText = tile.getBuilding().playerLabel;
            textPosition = view.height/4;

            // If the building is under construction
            if (tile.getBuilding().startingTurn > MainGame.global.turn) {
                view.underConst = MainGame.game.make.text(0, 0, 'Under Construction', this.fontBrief[1]);
                view.underConst.x = view.width/2 - view.underConst.width/2
                view.underConst.y = view.height/2;
                view.addChild(view.underConst);
            } else {
                // Do some setup before we go
                TileBriefView.setUpOccupancyDisplay(view, tile.getBuilding().people, tile.getBuilding().maxPeople);
            }
        } else {
            labelText = tile.terrainLabel;
            textPosition = view.height/2;
        }

        view.label = MainGame.game.make.text(view.width/2, textPosition, labelText, this.fontBrief[0]);
        view.label.anchor.set(0.5);
        view.addChild(view.label);

		// Class vars
		view.index = index;

		// Class func
		view.updatePos = function() { return TileBriefView.updatePos(view) };

		return view;
	},

	updatePos: function(view) {
        /*global MainGame*/
        var board = MainGame.board;
        var tile = board.at(view.index);
        view.x = board.x + tile.x*board.currentScale;
        view.y = board.y + (tile.y + tile.height*7)*board.currentScale;
        view.scale.set(board.currentScale);
	},

    setUpOccupancyDisplay: function(view, occupantCount, maxSize) {
        var occupancyDisplay = MainGame.game.make.sprite(0, view.height/2);
        var occupantWidth = MainGame.game.make.sprite(0, 0, 'person_icon').width;

        for (var i = 0; i < maxSize; i++) {
            occupant = MainGame.game.make.sprite(0, 0, 'person_icon');
            occupant.x = occupant.width*0.5*i;

            // Tint it to show occupancy
            if (i < occupantCount) {
                occupant.tint = 0x00ff00;
            }

            occupancyDisplay.addChild(occupant);
        }

        // Center the bar
        occupancyDisplay.x = -occupantWidth/4 + (view.width/2) - ((occupantWidth*maxSize*0.5)/2);

        view.addChild(occupancyDisplay);
    },
};