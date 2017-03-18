/*global MainGame*/
/*global DDecisionView*/
/*global DPageIndicator*/

// Design Pattern: 
// Texture requirement: 'event_bg'

// TODO: split DPageIndicator as M|V|C
var Event={
	createNew: function(){
		var v=MainGame.game.add.sprite(0,0,"event_bg");

		v.decisionView=DDecisionView.createNew();
		v.addChild(v.decisionView);
		v.pageIndicator=DPageIndicator.createNew(5, {width: 400,textPos:{x:200,y:0}});
		v.addChild(v.pageIndicator);
		v.pageIndicator.position.set(0,200);
		v.pageIndicator.setController(function(curPage){Event._onPageChanged_(v,curPage)});

		// Class funcs
		v.setModel=function(events,_curPage){Event.setModel(v,events,_curPage)};
		v.setController=function(callbacks){Event.setController(v,callbacks)};
		v.nextPage=function(){Event.nextPage(v)};

		return v;
	},

	setModel: function(v, events, _curPage){
		v.myModel=events;
		// set page indicator's pageCount & curPage
		_curPage=(_curPage?_curPage:0);
		v.pageIndicator.pageCount=events.length;
		v.pageIndicator.curPage=_curPage;
		// set model of decision view
		var mod=v.myModel[_curPage];
		v.decisionView.setModel(mod.portrait, mod.description, mod.buttonTexts);
	},

	setController: function(v,callbacks){
		v.myController=callbacks;
		// set the callback for current page
		var curPage=v.pageIndicator.curPage;
		v.decisionView.setController(v.myController[curPage]);
	},

	nextPage: function(v){
		if(v.pageIndicator.curPage>=v.pageIndicator.pageCount-1)
			return;
		v.pageIndicator.curPage++;
		Event._onPageChanged_(v,v.pageIndicator.curPage);
	},

	_onPageChanged_: function(v,curPage){
		console.log("Event: page changed:",curPage);
		// reset decision view
		var mod=v.myModel[curPage];
		var cb=v.myController[curPage];
		v.decisionView.setModel(mod.portrait,mod.description,mod.buttonTexts);
		v.decisionView.setController(cb);
	},
};

function test_Event(){
	var e=Event.createNew();
	e.position.set(300,100);
	e.setModel([
		{portrait:'smallPort0',description:'This is event 1.',buttonTexts:["Ok"]},
		{portrait:'smallPort1',description:'Are you a dumbass?',buttonTexts:["Yes"]},
		{portrait:'smallPort2',description:'Last event!',buttonTexts:["Close"]}
	]);
	e.setController([
		[function(){e.nextPage()}],
		[function(){e.nextPage()}],
		[function(){e.destroy()}]
	]);
}