        // // TODO
        // MainGame.game.add.sprite(0,0,'bg');
        // MainGame.game.add.sprite(200,0,'fg');
        // // MainGame.game.add.sprite(375,0,'face')
        
        // // play animation
        // var blink=MainGame.game.add.sprite(375,0,'blink');
        // blink.animations.add('blinkAnim',[0,1],2,true);
        // blink.animations.play('blinkAnim');
    
        // // show text
        // var style = { font: "32px STKaiti", fill: "#ff0044", wordWrap: true, wordWrapWidth: 500, align: "center", backgroundColor: "#ffff00" };
        // var text = MainGame.game.add.text(200, 200, "- If you can see Chinese 中文, it is good. -", style);
        // text.anchor.set(0.5);


var Board={
    createNew: function(n){
        var b={};
        b.name=n;
        b.print=function(msg){Board.print(b,msg)}
        return b;
    },
    print: function(b,msg){
        console.log(b.name+" -- "+msg)
    },
}

var b1=Board.createNew('b1111')
b1.print('asdf')
var b2=Board.createNew('b2222')
b2.print('adddddddfs')
