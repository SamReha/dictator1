var UiTest={
	init: function(game){
		console.log("UiTest: init");

		// layer 1: tile-like things
		var board=game.add.sprite(0,0);
		board.inputEnabled=true;		
		var tile1=game.make.sprite(0,0,'mountain');
		tile1.inputEnabled=true;
		// tile1.input.priorityID=1;
		var tile2=game.make.sprite(100,100,"water");
		tile2.inputEnabled=true;
		board.addChild(tile1);
		board.addChild(tile2);
		console.log("board size is:",board.width,board.height);

		// add event listeners to tile1
		tile1.events.onInputOver.add(function(){console.log("Tile1: on Over")});
		board.events.onInputUp.add(function(){console.log("Board: on Up")});

		// layer 2: button on top
		var buttonSprite=game.add.sprite(0,0);
		var button1=game.make.button(0,0,'med_generic_button', function(){console.log("Button1: pressed")});
		var button2=game.make.button(200,150,'med_generic_button', function(){console.log("Button2: pressed");console.log("ButtonSprite size is:",buttonSprite.width, buttonSprite.height);});
		buttonSprite.addChild(button1);
		buttonSprite.addChild(button2);
	},
};