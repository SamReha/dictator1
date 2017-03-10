/* global MainGame */
var DPageIndicator={
	// TODO: set font style here
	style: {font:"30px myKaiti", fill:"black"},
	// ****************** Attention ****************** //	
	// pageCount
	// layOut: {width,textPos}
	// *pageChangedCallback: function(pageIndex)
	// (* === optional)
	createNew: function(pageCount, layout, pageChangedCallback){
		var v=MainGame.game.add.group();
		v.pageCount=pageCount;
		v.curPage=0;
		v.pageChangedCallback=pageChangedCallback;
		// add two buttons as sprites
		v.prevPage=MainGame.game.make.sprite(0,0,"pi_prevPage");
		v.prevPage.inputEnabled=true;
		v.prevPage.input.priorityID=5;
		v.prevPage.events.onInputDown.add(DPageIndicator.onPrevPage,v);
		v.prevPage.visible=false;
		v.addChild(v.prevPage);
		v.nextPage=MainGame.game.make.sprite(0,0,"pi_nextPage");
		v.nextPage.x=layout.width-v.nextPage.width;
		v.nextPage.inputEnabled=true;
		v.nextPage.input.priorityID=5;
		v.nextPage.events.onInputDown.add(DPageIndicator.onNextPage,v);
		v.addChild(v.nextPage);
		// add & update page text 4/7
		v.pageText=MainGame.game.make.text(0,0,"", DPageIndicator.style);
		v.addChild(v.pageText);
		DPageIndicator._setPageText_(v);
		v.pageText.x=layout.textPos.x, v.pageText.y=layout.textPos.y;
		return v;
	},
	onPrevPage: function(){
		// console.log("PageIndicator: onPrevPage");
		this.curPage--;
		if(this.curPage===0)
			this.prevPage.visible=false;
		this.nextPage.visible=true;
		DPageIndicator._setPageText_(this);
		if(this.pageChangedCallback)
			this.pageChangedCallback(this.curPage);
	},
	onNextPage: function(){
		// console.log("PageIndicator: onNextPage");
		this.curPage++;
		if(this.curPage===this.pageCount-1)
			this.nextPage.visible=false;
		this.prevPage.visible=true;
		DPageIndicator._setPageText_(this);
		if(this.pageChangedCallback)
			this.pageChangedCallback(this.curPage);
	},
	_setPageText_: function(view){
		view.pageText.text=""+(view.curPage+1)+" / "+view.pageCount;
	},
};
