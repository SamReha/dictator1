/* global MainGame */

var DListView={
	// ****************** Attention ****************** //	
	// textureInfo: {normal, *high, *disabled};
	// itemInfo: {size:{w,h}, *clickedCallback, *change};
	// *marginInfo: {*l, *r, *t, *b};
	// *isVertical
	// * === optional
	createNew: function(textureInfo, marginInfo, itemInfo, isVertical){
		console.log("DListView: creating a list view requires:");
		console.log("textureInfo:{normal:,*high:,*disabled}, itemInfo:{size,count}, *marginInfo:{*l,*r,*t,*b} and *isVertical");
		// set the normal texture
		var v=MainGame.game.add.sprite(0,0,textureInfo.normal);
		// store the vars
		v.textureInfo=JSON.parse(JSON.stringify(textureInfo));
		v.itemInfo=JSON.parse(JSON.stringify(itemInfo));
		v.marginInfo=JSON.parse(JSON.stringify(itemInfo));
		v.isVertical=isVertical;
		v.itemSelectedCallback=itemSelectedCallback;
		// set the state to "normal"
		v.state="normal";
		// create the children group that contains all children
		v.childrenGroup=MainGame.game.make.group();
		v.childrenGroup.x=marginInfo.l?marginInfo.l:0;
		v.childrenGroup.y=marginInfo.t?marginInfo.t:0;
		v.addChild(v.childrenGroup);

		// enable the input for v
		v.prevSelected=null;
		v.selected=null;
		v.inputEnabled=true;
        v.events.onInputUp.add(DListView.onItemSelected,v);

		// Class func
		// returns the [i]th item
		v.at=function(i){return v.childrenGroup[i]};
		// adds an item [itemSprite] at [i]
		v.addItem=function(itemSprite){return DListView.addItem(v,itemSprite)};
		// removes an item at [i]
		v.removeItemAt=function(index){return v.childrenGroup.removeChildAt(index)};
		// returns the item count
		v.itemCount=function(){return v.childrenGroup.length};
		// returns the *index* of the selected item
		v.getSelected=function(){return v.selected};
		// sets the *index* of the selected item WITHOUT changing v.prevSelected
		v.setSelected=function(i){console.assert(i>=0 && i<childrenGroup.length); v.selected=i};
		// sets the current state of this list view
		v.setState=function(state){return DListView.setState(v,state)};
		// returns the (nullable) *index* of (x,y). Set isLocal true to use my local coorinate system.
		v.hitTest=function(px,py,isLocal){return DListView.hitTest(v,px,py,isLocal)};

		return v;
	},
	addItem: function(view, itemSprite){
		var index=view.childrenGroup.length;
		view.childrenGroup.addChild(itemSprite);
		if(view.isVertical){
			itemSprite.y=index*view.itemInfo.size.h;
		}else{
			itemSprite.x=index*view.itemInfo.size.w;
		}
	},
	setState: function(view, state){
		console.assert(state==="normal" || state==="high" || state==="disabled");
		if(view.state===state)
			return;
		view.state=state;
		if(view.textureInfo[state])
			view.loadTexture(view.textureInfo[state]);
	},
	hitTest: function(view, px, py, isLocal){
		var pos={x:px, y:py};
		if(!isLocal)
			pos={x:pos.x-view.x-view.childrenGroup.x, y:pos.y-view.y-view.childrenGroup.y};
		// now pos is the local position relative to view.childrenGroup
		var itemSize=view.itemInfo.size;
		var itemCount=view.itemInfo.count;
		var index=0;
		if(view.isVertical)
			index=Math.floor(pos.y/itemSize.h);			
		else
			index=Math.floor(pos.x/itemSize.w);
		if(index<0 || index>=view.childrenGroup.length)
			return null;
		else
			return index;
	},
	onItemSelected: function(){
		// get index
		this.prevSelected=this.selected;
		this.selected=DListView.hitTest(this, this.game.input.x, this.game.input.y, false);
		// call the callback func with index
		if(this.selected)
			this.itemSelectedCallback(this.prevSelected,this.selected);
	},
};

var PeopleView={
	createNew: function(){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');

		pv.left=DListView.createNew(
			{normal:"peopleViewLeftBg"}, 
			{l:56,t:50}, 
			{size:{w:200,h:100}}, 
			true, 
			function(prev,cur){
				console.log("Item selected: prev, cur="+prev+","+cur);
			}
		);
		pv.addChild(pv.left);

		// test: create 3 texts
		var text1=MainGame.game.make.text(0,0,"Text1");
		pv.left.addItem(text1,0);
		var text2=MainGame.game.make.text(0,0,"Text2");
		pv.left.addItem(text2,1);
		var text3=MainGame.game.make.text(0,0,"Text3");
		pv.left.addItem(text3,2);

		// Class funcs
		pv.setVisible=function(value){pv.visible=value};

		return pv;
	},
};
