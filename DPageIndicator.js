/* global MainGame */

var DPageIndicator={
	// TODO: set font style here
	style: {font:"20px myKaiti", fill:"#ffffff", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
	// ****************** Attention ****************** //	
	// pageCount
	// layOut: {width,textPos}
	// *pageChangedCallback: function(pageIndex)
	// (* === optional)
	//createNew: function(pageCount, layout, pageChangedCallback, priorityID){
	createNew: function(width, textPosition){
		var v=MainGame.game.add.group();
		// add two buttons as sprites
		v.prevPage=MainGame.game.make.button(0,0,"triangleArrowButton",function(){
			DPageIndicator.onPrevPage,v},1,0,2,1);
		v.prevPage.anchor.x=1;
		v.prevPage.scale.x*=-1;
		v.prevPage.visible=false;
		v.addChild(v.prevPage);
		v.nextPage=MainGame.game.make.button(0,0,"triangleArrowButton",function(){
			DPageIndicator.onNextPage,v},1,0,2,1);
		v.nextPage.x=width-v.nextPage.width;
		v.nextPage.visible=false;
		v.addChild(v.nextPage);
		// add & update page text 4/7
		v.pageText=MainGame.game.make.text(0,0,"", DPageIndicator.style);
		v.addChild(v.pageText);
		DPageIndicator._setPageText_(v);
		v.pageText.x=textPosition.x, v.pageText.y=textPosition.y;

		// Class funcs
		v.setModel=function(cur,max){DPageIndicator.setModel(v,cur,max)};
		// sets the callback: function pageChange(curPage){}
		v.setController=function(callback,_priorityID){return DPageIndicator.setController(v,callback,_priorityID)};
		// returns the current page index (starting 0)
		v.getCurPage=function(){return v.curPage};
		// sets the callback func of PageChanged
		v.setPageChangedCallback=function(callback){v.pageChangedCallback=callback};

		return v;
	},
	setModel: function(v, curPage, pageCount){
		console.assert(curPage>=0 && curPage<pageCount
			|| curPage===0 && pageCount===0);
		v.curPage=curPage;
		v.pageCount=pageCount;
		DPageIndicator._setPageText_(v);
		DPageIndicator._setButtonVisibility_(v);
	},
	setController: function(v, callback, _priorityID){
		var pageNames=["prevPage","nextPage"];
		var pageCb=[DPageIndicator.onPrevPage, DPageIndicator.onNextPage];
		for(var i=0;i<pageNames.length;i++){
			v[pageNames[i]].inputEnabled=true;
			v[pageNames[i]].input.priorityID=(_priorityID?_priorityID:20);
			v[pageNames[i]].events.onInputDown.removeAll();
			v[pageNames[i]].events.onInputDown.add(pageCb[i],v);
		}
		v.pageChangedCallback=callback;
	},
	onPrevPage: function(){
		// console.log("DPageIndicator: onPrevPage");
		this.curPage--;
		DPageIndicator._setPageText_(this);
		DPageIndicator._setButtonVisibility_(this);
		if(this.pageChangedCallback)
			this.pageChangedCallback(this.curPage);
	},
	onNextPage: function(){
		// console.log("DPageIndicator: onNextPage");
		this.curPage++;		
		DPageIndicator._setPageText_(this);
		DPageIndicator._setButtonVisibility_(this);
		if(this.pageChangedCallback)
			this.pageChangedCallback(this.curPage);
	},
	_setPageText_: function(v){
		if(v.curPage===0 && v.pageCount===0){
			v.pageText.text="<Empty>";
			return;
		}
		v.pageText.text=""+(v.curPage+1)+" / "+v.pageCount;
	},
	_setButtonVisibility_: function(v){
		v.prevPage.visible=(v.curPage>0);
		v.nextPage.visible=(v.curPage<v.pageCount-1);
	}
};
