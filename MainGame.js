// singleton class for the main game
// a singleton class should use init() for initialization

var MainGame={
    // define props here
    developer: "Ludocracy III",
    
    // the game var
    game: null,
    
    // the board var
    board: null,
    
    // The HUD
    hud: null,
    
    // singleton func to initialize
    initialized: false,
    init: function(g){
        if(MainGame.initialized===true)
            return;

        // now init
        MainGame.initialized=true;
        
        // set game var
        MainGame.game=g;

        console.log('[MainGame] init with (w,h)=('+g.width+','+g.height+')');
    },
    
    // start the game
    start: function(){
        console.log('[MainGame] start...');
        
        // create board
        /*global Board*/
        MainGame.board=Board.createNew(MainGame.game, 5, 3, 256, '151512424231313', '12   22    1111', '  121  543     ');
        
        /*global Hud*/
        MainGame.hud = Hud.createNew(MainGame.game);
    },
};
