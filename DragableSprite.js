var DragableSprite = {
	createNew: function(x,y,dragSpriteName,emptySpriteName,pickupFunction,dropFunction,tintFunction,dropTag){
		var spriteBack = MainGame.game.make.sprite(x,y,emptySpriteName);
		spriteBack.anchor.setTo(.5,.5);
		spriteBack.inputEnabled = true;
		spriteBack.input.priorityID = 150;
		spriteBack.tag = dropTag;
		spriteBack.tintFunction = tintFunction;

		spriteBack.spriteFront = MainGame.game.make.sprite(0,0,dragSpriteName);
		spriteBack.spriteFront.anchor.setTo(.5,.5);
		spriteBack.addChild(spriteBack.spriteFront);

		spriteBack.spriteFront.inputEnabled = true;
		spriteBack.spriteFront.input.priorityID = 160;
		spriteBack.spriteFront.input.enableDrag();
		spriteBack.spriteFront.events.onInputDown.add((DragableSprite.onDragStart(spriteBack,pickupFunction,dropFunction)), spriteBack.spriteFront);

		return spriteBack;
	},

	updateSelf: function(back){
		back.dragSprite.x = MainGame.game.input.x;
		back.dragSprite.y = MainGame.game.input.y;

		var target = MainGame.game.input.activePointer.targetObject;
		if(target){
			if(target.sprite.tag === back.dragSprite.tag){
				back.dragSprite.dropable = true;
				if(back.dragSprite.target!==null)
					back.tintFunction(back,back.dragSprite.target,false);
				back.dragSprite.target = target.sprite;
				back.tintFunction(back,back.dragSprite.target,true);
			} else {
				back.dragSprite.dropable = false;
				if(back.dragSprite.target!==null){
					if(back.dragSprite.target.tag === back.dragSprite.tag)
						back.tintFunction(back,back.dragSprite.target,false);
				}
				back.dragSprite.target = null;
			}
		} else {
			back.dragSprite.dropable = false;
			if(back.dragSprite.target!==null){
				if(back.dragSprite.target.tag === back.dragSprite.tag)
					back.tintFunction(back,back.dragSprite.target,false);
			}
			back.dragSprite.target = null;
		}
	},

	onDragStart: function(back, pickupFunction, dropFunction){
		return function(){
			back.spriteFront.visible = false;
			MainGame.game.input.onUp.addOnce((DragableSprite.onDragStop(back, dropFunction)), back.spriteFront);

			back.dragSprite = MainGame.game.add.sprite(back.world.x,back.world.y,back.spriteFront.key);
			back.dragSprite.anchor.setTo(.5,.5);
			back.dragSprite.deltaTime = 10;
			back.dragSprite.timer = MainGame.game.time.create(false);
			back.dragSprite.timer.loop(back.dragSprite.deltaTime, function(){DragableSprite.updateSelf(back);}, back.dragSprite);
			back.dragSprite.timer.start();

			back.dragSprite.tag = back.tag;
			back.dragSprite.dropable = false;
			back.dragSprite.target = null;

			pickupFunction(back);

			back.dragSprite.bringToTop();
		};
	},

	onDragStop: function(back, dropFunction){
		return function(){
			if(back.dragSprite.target!==null)
				back.tintFunction(back,back.dragSprite.target,false);
			back.dragSprite.timer.stop(false);
			//console.log(back.dragSprite.target);
			//MainGame.game.input.onUp.remove((DragableSprite.onDragStop(back, dropFunction)), back.spriteFront);
			//MainGame.game.input.onUp.add(function() { console.log(MainGame.game.input.activePointer.targetObject); });
			if(back.dragSprite.dropable && back.dragSprite.target!==null && back.dragSprite.target !== back){
				dropFunction(back,back.dragSprite.target);
			}
			else{
				back.dragSprite.tween = MainGame.game.make.tween(back.dragSprite).to({x:back.world.x,y:back.world.y},150,Phaser.Easing.Quadratic.InOut,true);
				back.dragSprite.tween.onComplete.add(function(){
					back.spriteFront.visible = true;
					back.dragSprite.destroy();
				},back.dragSprite);
			}
		};
	},
};