/*global MainGame*/
/*global DDecisionView*/
/*global DPageIndicator*/
/*global DUiMask*/

// Design Pattern: 
// Texture requirement: 'event_bg'

var Event={
	createNew: function(isInformation){
		var v=MainGame.game.add.sprite(0,0,"event_bg");

		// Center by default
		v.position.set(MainGame.game.width/2 - v.width/2, MainGame.game.height/2 - v.height/2);

		// add bg
		v.bg=MainGame.game.add.sprite(0,0,"event_bg");
		v.addChild(v.bg);

		// add decision view
		v.decisionView=DDecisionView.createNew();
		v.addChild(v.decisionView);

		// add page inidcator if necessary
		v.pageIndicator=DPageIndicator.createNew(400, {x:200,y:0});
		v.addChild(v.pageIndicator);
		v.pageIndicator.position.set(0,200);
		v.pageIndicator.setController(function(curPage){Event._onPageChanged_(v,curPage)}, 110);
		if(!isInformation)
			v.pageIndicator.visible=false;
		v.isInformation=isInformation;

		// setup priority
		v.inputEnabled=true;
		v.input.priorityID=101;

		// setup a mask (not child)
		v.uiMask=DUiMask.createNew();
		v.uiMask.setController(100, function(){
			if(isInformation){
				v.uiMask.destroy();
				v.destroy();
			}			
		});

		// Class funcs
		/* set the model (data) of this event view. The model is an array of:
		 {portrait:"myTextureKey", 
		 description:"Yi: How are you?", 
		 buttonTexts:["Good!","Not well."]} */
		v.setModel=function(events,_curPage){Event.setModel(v,events,_curPage)};

		/* sets the controller of this event view. The controller is an array of:
		[function(){ev.gotoPage(1)}, function(){ev.gotoPage(2)}]
		The count in each element should equal to the count of the relative buttonTexts*/
		v.setController=function(callbacks){Event.setController(v,callbacks)};

		// goes to page [index]
		v.gotoPage=function(index){Event.gotoPage(v,index)};

		// removes this event view
		v.suicide=function(){v.uiMask.destroy();v.destroy()};

		return v;
	},

	setModel: function(v, events, _curPage){
		v.myModel=events;
		// set page indicator's pageCount & curPage
		_curPage=(_curPage?_curPage:0);
		v.pageIndicator.setModel(_curPage, events.length);
		// set model of decision view
		var mod=v.myModel[_curPage];
		v.decisionView.setModel(mod.portrait, mod.description, mod.buttonTexts);
	},

	setController: function(v, callbacks){		
		v.myController=callbacks;
		// set the callback for current page
		var curPage=v.pageIndicator.curPage;
		v.decisionView.setController(120, v.myController[curPage]);
	},

	gotoPage: function(v, index){
		console.assert(index>=0 && index<v.myModel.length);
		// reset decision view
		var mod=v.myModel[index];
		v.decisionView.setModel(mod.portrait,mod.description,mod.buttonTexts);
		if(!v.isInformation){
			var cb=v.myController[index];
			v.decisionView.setController(120, cb);			
		}
		// reset page indicator
		v.pageIndicator.curPage=index;
	},

	_onPageChanged_: function(v, curPage){
		console.log("Event: page changed:",curPage);
		// reset decision view
		Event.gotoPage(v, curPage);
	},
};

function test_Event(){
	var e=Event.createNew();
	e.position.set(50,50);
	e.setModel([
		{portrait:'bureaucrat_port_0',description:"Yi: please select a test.",buttonTexts:["Choice","Info"]}
	]);
	e.setController([
		[function(){
			e.suicide();
			_test_Event_choice();
		}, function(){
			e.suicide();
			_test_Event_info();
		}]
	]);

}

// Private test functions //
function _test_Event_choice(){
	var eChoice=Event.createNew();
	eChoice.position.set(300,100);
	eChoice.setModel([
		{portrait:'bureaucrat_port_0',description:'Yi: Hey, MJ has a \nquestion.',buttonTexts:["Go ahead"]},
		{portrait:'bureaucrat_port_2',description:'MJ: Are you a dumbass?',buttonTexts:["Yes","NO"]},
		{portrait:'bureaucrat_port_2',description:'MJ: Of course you are!',buttonTexts:["Close"]},
		{portrait:'bureaucrat_port_2',description:'MJ: What? You are not?',buttonTexts:["Close"]}
	]);
	eChoice.setController([
		[function(){eChoice.gotoPage(1)}],
		[function(){eChoice.gotoPage(2)}, function(){eChoice.gotoPage(3)}],
		[function(){eChoice.suicide()}],
		[function(){eChoice.suicide()}]
	]);			
}

function _test_Event_info(){
	var eInfo=Event.createNew(true);
	eInfo.position.set(250,150);
	eInfo.setModel([
		{portrait:'bureaucrat_port_0',description:"Yi: Your people are \nangrier.",buttonTexts:[]},
		{portrait:'bureaucrat_port_2',description:"MJ: Your people are \nfreer.",buttonTexts:[]},
		{portrait:'bureaucrat_port_0',description:"Yi: ...and you are \nbroke",buttonTexts:[]}
	]);
}
