/*global MainGame*/

// Design Pattern: M|V|C by functions
// Texture Requirement: 'small_generic_button' (use Find-Replace to change)

var DDecisionView={
	// the buttons' positions for 0~3 buttons
	buttonPos: [
		[],											// 0 button
		[{x:200,y:100}],							// 1 button
		[{x:100,y:100},{x:300,y:100}],				// 2 buttons
		[{x:0,y:100},{x:200,y:100},{x:400,y:100}],	// 3 buttons
		[{x:0,y:100},{x:150,y:100},{x:300,y:100},{x:450,y:100}]	// 4 buttons
	],

	createNew: function(){
		// create the view
		var v=MainGame.game.add.sprite(0,0);
		// add portrait
		v.portrait=MainGame.game.add.sprite(50,20);
		v.addChild(v.portrait);
		// add description text
		v.description=MainGame.game.add.text(150,20,"");
		v.addChild(v.description);
		// add buttons array
		v.buttons=[];

		// Class func
		// sets the Model(data). Every arg is nullable(==[will be unchanged])
		v.setModel=function(_portrait,_description,_buttonTexts){return DDecisionView.setModel(v,_portrait,_description,_buttonTexts)};
		// sets the Controller(callbacks). #callbacks must === #buttonTexts defined in .setModel()
		v.setController=function(callbacks,_priorityID){return DDecisionView.setController(v,callbacks,_priorityID)};

		// return the view
		return v;
	},

	// set the Model (data) of this view
	setModel: function(v, _portrait, _description, _buttonText){
		if(_portrait!==null && _portrait!==undefined)
			v.portrait.loadTexture(_portrait===""?null:_portrait);
		if(_description!==null && _description!==undefined)
			v.description.text=_description;
		if(_buttonText===null || _buttonText===undefined)
			return;
		// remove current buttons
		for(var j=v.buttons.length-1;j>=0;j--){
			v.buttons[j].destroy();	// destory the sprite
			v.buttons.splice(j,1);	// remove it from array v.buttons
		}
		// add new buttons
		for(var i=0;i<_buttonText.length;i++){
			var pos=DDecisionView.buttonPos[_buttonText.length][i];
			// console.log("Here is the pos:",pos.x,pos.y);
			v.buttons[i]=MainGame.game.make.button(pos.x, pos.y,
				"small_generic_button", null, v.buttons[i], 0, 1, 2);
			v.buttons[i].label=MainGame.game.add.text(0,0,_buttonText[i]);
			v.buttons[i].addChild(v.buttons[i].label);
			v.addChild(v.buttons[i]);
		}
	},

	// set the Controller (callbacks) of this view
	setController: function(v, callbacks, _priorityID){
		console.assert(v.buttons.length===callbacks.length);
		for(var i=0;i<v.buttons.length;i++){
			console.assert(typeof callbacks[i]==="function");
			// remove old controller
			v.buttons[i].events.onInputUp.removeAll();
			// add new controller			
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
        'bureaucrat_port_0', 
        "Hey, please buy me a TOYOTA pickup!", 
        ["Chg Text", "Chg Port", "Rm Port", "Chg Button"]
    );

    // set the callback (controller)
    deciView.setController([
        function(){deciView.setModel(null, "Text Changed."+this.index)},
        function(){deciView.setModel('bureaucrat_port_2')},
    	function(){deciView.setModel('')},
        function(){
        	deciView.setModel(null,null,["Good","Bad"]);
        	deciView.setController([
        		function(){deciView.setModel(null,"You selected:"+this.index)},
        		function(){deciView.setModel(null,"You selected:"+this.index)}
        	]);
    	}// end of function
    ]); // end of setController

}