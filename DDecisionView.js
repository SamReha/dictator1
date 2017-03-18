/*global MainGame*/
//Texture Requirement: small_generic_button

var DDecisionView={
	// the buttons' positions for 0~3 buttons
	buttonPos: [
		[],											// 0 button
		[{x:200,y:100}],							// 1 button
		[{x:100,y:100},{x:300,y:100}],				// 2 buttons
		[{x:0,y:100},{x:200,y:100},{x:400,y:100}]	// 3 buttons
	],

	createNew: function(){
		// create the view
		var v=MainGame.game.add.sprite(0,0);
		// add portrait.portrait
		v.portrait=MainGame.game.add.sprite(50,20);
		v.addChild(v.portrait);
		// add description text
		v.description=MainGame.game.add.text(150,20,"");
		v.addChild(v.description);
		// add buttons array
		v.buttons=[];

		// Class func
		v.setModel=function(portrait,description,buttonTexts){return DDecisionView.setModel(v,portrait,description,buttonTexts)};
		v.setCallbacks=function(callbacks,_priorityID){return DDecisionView.setCallbacks(v,callbacks,_priorityID)};

		// return the view
		return v;
	},

	setModel: function(v, portrait, description, buttonTexts){
		v.portrait.loadTexture(portrait);
		v.description.text=description;
		// remove current buttons
		for(var j=v.buttons.length-1;j>=0;j--){
			v.buttons[j].destroy();	// destory the sprite
			v.buttons.splice(j,1);	// remove it from array v.buttons
		}
		// add new buttons
		for(var i=0;i<buttonTexts.length;i++){
			var pos=DDecisionView.buttonPos[buttonTexts.length][i];
			// console.log("Here is the pos:",pos.x,pos.y);
			v.buttons[i]=MainGame.game.make.button(pos.x, pos.y,
				"small_generic_button", null, v.buttons[i], 0, 1, 2);
			v.buttons[i].label=MainGame.game.add.text(0,0,buttonTexts[i]);
			v.buttons[i].addChild(v.buttons[i].label);
			v.addChild(v.buttons[i]);
		}
	},

	setCallbacks: function(v, callbacks, _priorityID){
		console.assert(v.buttons.length===callbacks.length);
		for(var i=0;i<v.buttons.length;i++){
			console.assert(typeof callbacks[i]==="function");
			v.buttons[i].index=i;			
			v.buttons[i].inputEnabled=true;
			v.buttons[i].input.priorityID=(_priorityID?_priorityID:20);
			v.buttons[i].events.onInputUp.add(callbacks[i], v.buttons[i]);
		}
	},
};


// The test case function
function test_DDecisionView(){
	var deciView=DDecisionView.createNew();
    deciView.x=200;
    deciView.y=200;
    
    // set the model (data)
    deciView.setModel(
        'smallPort0', 
        "Hey, please buy me a TOYOTA pickup!", 
        ["YES","No Way", "Change Model"]
    );

    // set the callback (controller)
    deciView.setCallbacks([
        function(){console.log("You chose:",this.index)},
        function(){console.log("You chose:",this.index)},
        function(){
        	deciView.setModel(
        		'smallPort1', 
        		"Model changed!",
        		["Good","Bad"]
        	);
        	deciView.setCallbacks([
        		function(){console.log("You selected:",this.index)},
        		function(){console.log("You selected:",this.index)}
        	]);
    	} // end of function
    ]); // end of setCallbacks

}