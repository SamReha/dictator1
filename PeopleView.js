/* global MainGame */
var DPageIndicator={
	createNew: function(textures, maxPages){		
		var v=MainGame.game.add.group();
		// 
		return v;
	},

};

var PeopleView={
	createNew: function(){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');

		/*global DListView*/
		pv.left=DListView.createNew(
			{normal:"peopleViewLeftBg",high:"peopleViewRightBg"}, 
			{l:56,t:50}, 
			{w:200,h:50}, 
			function(prev,cur){
				console.log("Item selected: prev, cur="+prev+","+cur);
			},
			false
		);
		pv.addChild(pv.left);

		// test: create 3 texts
		var text1=MainGame.game.make.text(0,0,"Text1");
		pv.left.add(text1,0);
		var text2=MainGame.game.make.text(0,0,"Text2");
		pv.left.add(text2,1);
		var text3=MainGame.game.make.text(0,0,"Text3");
		pv.left.add(text3,2);

		// Class funcs
		pv.setVisible=function(value){pv.visible=value};

		return pv;
	},
};
