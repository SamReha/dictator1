var DragableSprite = {
	createNew: function(x,y,dragSpriteName,emptySpriteName,pickupFunction,dropFunction,dropTag){
		var spriteBack = MainGame.game.make.sprite(x,y,emptySpriteName);
		spriteBack.anchor.setTo(.5,.5);
		spriteBack.inputEnabled = true;
		spriteBack.input.priorityID = 150;
		spriteBack.tag = dropTag;

		spriteBack.spriteFront = MainGame.game.make.sprite(0,0,dragSpriteName);
		spriteBack.spriteFront.anchor.setTo(.5,.5);
		spriteBack.addChild(spriteBack.spriteFront);
		spriteBack.spriteFront.tag = dropTag;

		spriteBack.spriteFront.inputEnabled = true;
		spriteBack.spriteFront.input.priorityID = 160;
		spriteBack.spriteFront.input.enableDrag();
		spriteBack.spriteFront.events.onInputDown.add((DragableSprite.onDragStart(spriteBack,pickupFunction,dropFunction)), spriteBack.spriteFront);

		return spriteBack;
	},

	updateSelf: function(self){
		self.x = MainGame.game.input.x;
		self.y = MainGame.game.input.y;

		var target = MainGame.game.input.activePointer.targetObject;
		if(target){
			if(target.sprite.tag === self.tag){
				self.dropable = true;
				self.target = target.sprite;
				self.tint = 0x30a030;
			} else {
				self.dropable = false;
				self.target = null;
				self.tint = 0xffffff;
			}
		} else {
			self.dropable = false;
			self.target = null;
			self.tint = 0xffffff;
		}
	},

	onDragStart: function(back, pickupFunction, dropFunction){
		return function(){
			back.spriteFront.visible = false;
			MainGame.game.input.onUp.add((DragableSprite.onDragStop(back,dropFunction)), back.spriteFront);

			back.dragSprite = MainGame.game.add.sprite(back.world.x,back.world.y,back.spriteFront.key);
			back.dragSprite.anchor.setTo(.5,.5);
			back.dragSprite.deltaTime = 10;
			back.dragSprite.timer = MainGame.game.time.create(false);
			back.dragSprite.timer.loop(back.dragSprite.deltaTime, function(){DragableSprite.updateSelf(back.dragSprite);}, back.dragSprite);
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
			back.dragSprite.timer.stop(false);
			MainGame.game.input.onUp.removeAll();

			if(back.dragSprite.dropable && back.dragSprite.target!==null){
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