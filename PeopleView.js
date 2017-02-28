var PeopleView={
	createNew: function(){
		/* global MainGame */
		var pv=MainGame.game.add.sprite(0,0);
		// init stats
		pv.visible=false;

		// for debug: create a button that shows PeopleView
		var debugButton=MainGame.game.add.button(500, 100, 'med_generic_button', function(){
				DicSignalCenter.signal("PopButtonPressed");
			}, pv, 0, 1, 2, 2);

		// Class vars

		// Class funcs
		pv.setVisible=function(value){pv.visible=value};

		pv.testObserver=function(name,args){PeopleView.testObserver(pv,name,args)};

		DicSignalCenter.observe("PopButtonPressed", pv.testObserver);

		return pv;
	},

	testObserver: function(pv, name, args){
		console.log("Signaled: name:"+name,",args:"+args);
	}
};
