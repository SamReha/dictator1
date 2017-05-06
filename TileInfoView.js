var fontDetail=[
	{font:"28px myKaiti", fill:"black", boundsAlignH:"top", boundsAlignV:"middle"},
	{font:"24px myKaiti", fill:"black", boundsAlignH:"top", boundsAlignV:"middle"}
];

var TileBriefView = {
    // fonts list
    fontBrief: [
        {font: "40px myKaiti", fill: "white", boundsAlignH: "top", boundsAlignV: "middle"},
        {font: "40px myKaiti", fill: "lightgreen", boundsAlignH: "top", boundsAlignV: "middle"}
    ],

	createNew: function(index) {
		console.assert(index || index === 0);

        var view = MainGame.game.add.sprite(0, 0, "tile_hover_backpanel");

        var tile = MainGame.board.at(index);
        var labelText = '';

        if (tile.hasBuilding()) {
            labelText = tile.getBuilding().playerLabel;
        } else {
            labelText = tile.terrainLabel;
        }

        view.label = MainGame.game.make.text(view.texture.width*0.5, view.texture.height*0.5, labelText, this.fontBrief[0]);
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
	}
};