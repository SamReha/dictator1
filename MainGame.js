// singleton class for the main game
// a singleton class should use init() for initialization

var MainGame={
    // define props here
    developer: "Ludocracy III",
    
    // the game var
    game: null,
    
    // singleton func to initialize
    initialized: false,
    init: function(g){
        if(MainGame.initialized===true)
            return
            
        // now init
        MainGame.initialized=true
        
        // set game var
        MainGame.game=g;
        
        // TODO: load assets
        g.load.image("bg",'images/bg.jpg')
        g.load.image('fg','images/tmm32.png')
        g.load.spritesheet('blink','images/tmmf31.png',340,514)
        // TODO: end
        
        console.log('[MainGame] init with (w,h)=('+g.width+','+g.height+')');
    },
    
    // start the game
    start: function(){
        console.log('[MainGame] start.')
        // TODO
        MainGame.game.add.sprite(0,0,'bg')
        MainGame.game.add.sprite(200,0,'fg')
        // MainGame.game.add.sprite(375,0,'face')
        
        // play animation
        var blink=MainGame.game.add.sprite(375,0,'blink')
        blink.animations.add('blinkAnim',[0,1],2,true)
        blink.animations.play('blinkAnim')
    
        // show text
        var style = { font: "32px STKaiti", fill: "#ff0044", wordWrap: true, wordWrapWidth: 500, align: "center", backgroundColor: "#ffff00" };
        var text = MainGame.game.add.text(200, 200, "- If you can see Chinese 中文, it is good. -", style);
        text.anchor.set(0.5);
    },
    
}

