var Event={
	createNew: function(){
		var v=MainGame.game.add.sprite(0,0);
		return v;
	}
};

var EventController={
	createNew: function(event){
		var ec={};
		ec.modelView=event;
		return ec;
	}
};