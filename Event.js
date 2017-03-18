/*global MainGame*/
/*global DDecisionView*/
/*global DPageIndicator*/

//Texture requirement - event_bg, 

// the M (model) & V (view) of event system
var Event={
	createNew: function(events){
		var v=MainGame.game.add.sprite(0,0,"event_bg");
		v.decisionView=DDecisionView.createNew();
		v.addChild(v.decisionPage);
		// v.pageIndicator=DPageIndicator.createNew(events.count, {width:,textPos:});
		v.addChild(v.pageIndicator);
		return v;
	}
};
//pageCount, layout, pageChangedCallback, priorityID
var EventController={
	createNew: function(event){
		var ec={};
		ec.modelView=event;
		// setup event listener

		return ec;
	},
	onButton1Pressed: function(){

	},
	onButton2Pressed: function(){

	},
	
};