/* global MainGame */

var DListView={
	createNew: function(texture,isVert,count,spriteCreatingFunc,argsArray,highlightTexture){
		var v=MainGame.game.add.sprite(0,0);
		var itemSize={w:0, h:0};
		for(var i=0;i<count;i++){
			// create a sprite and add it to v
			var sprite=spriteCreatingFunc(argsArray[i]);
			console.assert(sprite, "The sprite creating func should NOT return null!");
			v.addChild(sprite);
			// get each item's size
			if(i===0)
				itemSize={w:sprite.width, h:sprite.height};
			console.assert(itemSize.w>0 && itemSize.h>0, "The size of the sprite should NOT be 0!");
			// calc the sprite's position
			if(isVert)
				sprite.y=itemSize.h*i;
			else
				sprite.x=itemSize.w*i;												
		}
		// set the highlighted sprite
		var hightlightSprite=MainGame.game.make.sprite(0,0,highlightTexture);
		hightlightSprite.visible=false;
		v.addChild(hightlightSprite);
		v.selected=-1;
		// enable the input for v
		v.inputEnabled=true;

		// No class vars //

		// Class func
		// returns the item [i]
		v.at=function(i){console.assert(i>=0 && i<v.children.length-1); return v.children[i]};
		// returns the item count
		v.itemCount=function(){return v.children.length-1};
		// returns the highlight sprite
		v.highlightSprite=function(){return v.children[v.children.length-1]};
		// returns the *index* of the selected item
		v.getSelected=function(){return v.selected};
		// sets the *index* of the selected item
		v.setSelected=function(i){console.assert(i>0 && i<v.children.length-1); v.selected=i; v.highlightSprite.visible=true; v.highlightSprite.x=v.children[i].x; v.highlightSprite.y=v.children[i].y};

		return v;
	},
};

var PeopleView={
	createNew: function(){
		var pv=MainGame.game.add.sprite(0,0,'peopleViewBg');

		pv.addChild(pv.left);

		// Class funcs
		pv.setVisible=function(value){pv.visible=value};

		return pv;
	},
};
