var DListView={
	// ****************** Attention ****************** //	
	// textures: {normal, *high, *disabled}
	// margin: {*l, *r, *t, *b}
	// itemSize: {w, h}
	// *itemCallback: function(index, *prevIndex)
	// *isHorizontal: true or false
	// (* === optional)
	createNew: function(textures, margin, itemSize, itemCallback, isHorizontal){
		console.log("DListView: creating a list view requires:");
		console.log("textures:{normal:,*high:,*disabled}, itemSize:{size,count}, *margin:{*l,*r,*t,*b} and *isHorizontal");
		// set the normal texture
		var v=MainGame.game.add.sprite(0,0,textures.normal);
		v.state="normal";
		// store the vars
		v.textures=JSON.parse(JSON.stringify(textures));
		v.margin=JSON.parse(JSON.stringify(margin));
		v.itemSize=JSON.parse(JSON.stringify(itemSize));
		v.itemCallback=itemCallback;
		v.isHorizontal=isHorizontal;
		// create the children group that contains all children
		v.childrenGroup=MainGame.game.make.group();
		v.childrenGroup.x=margin.l?margin.l:0;
		v.childrenGroup.y=margin.t?margin.t:0;
		v.addChild(v.childrenGroup);

		// enable the input for v
		v.prevSelected=null;
		v.selected=null;
		v.inputEnabled=true;
        v.events.onInputUp.add(DListView.onClicked,v);

		// Class func
		// returns the [i]th item
		v.at=function(i){return v.childrenGroup[i]};
		// adds an item [itemSprite] at [i]
		v.add=function(itemSprite){return DListView.add(v,itemSprite)};
		// removes an item at [i]
		v.removeAt=function(index){return v.childrenGroup.removeChildAt(index).destroy()};
		// remvoes all items
		v.removeAll=function(){return v.childrenGroup.removeAll(true)};
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
	add: function(view, itemSprite){
		var index=view.childrenGroup.length;
		view.childrenGroup.addChild(itemSprite);
		if(!view.isHorizontal){
			itemSprite.y=index*view.itemSize.h;
		}else{
			itemSprite.x=index*view.itemSize.w;
		}
	},
	setState: function(view, state){
		console.assert(state==="normal" || state==="high" || state==="disabled");
		if(view.state===state)
			return;
		view.state=state;
		if(view.textures[state])
			view.loadTexture(view.textures[state]);
		else
			view.loadTexture(view.textures.normal);
	},
	hitTest: function(view, px, py, isLocal){
		var pos={x:px, y:py};
		if(!isLocal)
			pos={x:pos.x-view.x-view.childrenGroup.x, y:pos.y-view.y-view.childrenGroup.y};
		// now pos is the local position relative to view.childrenGroup
		var itemSize=view.itemSize;
		var index=0;
		if(!view.isHorizontal)
			index=Math.floor(pos.y/itemSize.h);			
		else
			index=Math.floor(pos.x/itemSize.w);
		if(index<0 || index>=view.childrenGroup.length)
			return null;
		else
			return index;
	},
	onClicked: function(){
		// get index
		var sel=DListView.hitTest(this, this.game.input.x, this.game.input.y, false);
		// call the callback func with index
		if(sel===0 || sel){
			this.prevSelected=this.selected;
			this.selected=sel;
			this.itemCallback(this.selected, this.prevSelected);
		}
	},
};
