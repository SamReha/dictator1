/* global MainGame */
var PeopleView={
	createNew: function(){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');

		// /*global DListView*/
		pv.left=DListView.createNew(
			{normal:"peopleViewLeftBg",high:"peopleViewRightBg"}, 
			{l:56,t:50}, 			// margin
			{w:200,h:50}, 			// item size
			function(prev,cur){		// item callback
				console.log("Item selected: prev, cur="+prev+","+cur);
			},
			false					// is horizontal
		);
		pv.addChild(pv.left);

		// test: create 3 texts
		var text1=MainGame.game.make.text(0,0,"Text1");
		pv.left.add(text1,0);
		var text2=MainGame.game.make.text(0,0,"Text2");
		pv.left.add(text2,1);
		var text3=MainGame.game.make.text(0,0,"Text3");
		pv.left.add(text3,2);

		pv.pageInd=DPageIndicator.createNew(7,{
			width:300,
			textPos:{x:200,y:50}
		},function(index){
			console.log("PageIndicator: page changed to:",index);
		});
		pv.pageInd.x=50, pv.pageInd.y=300;
		pv.addChild(pv.pageInd);

		// Class funcs
		pv.setVisible=function(value){pv.visible=value};

		return pv;
	},
};
