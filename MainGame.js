// singleton class for the main game
// a singleton class should use init() for initialization

var MainGame={
    // define props here
    developer: "Ludocracy III",
    
    // the game var
    game: null,
    
    // the board var
    board: null,
    
    // the people var
    people: null,
    
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
        console.assert(MainGame.initialized);
        console.log('[MainGame] start...');
        
        // create board
        /*global Board*/
        MainGame.board=Board.createNew(5, 3, 256, '151512424231313', '12   22    1111', '  121  543     ');
        
        //MainGame.nextTurn();
    },
    
    nextTurn: function(){
        MainGame.board.nextTurn();
        // MainGame.people.nextTurn();
        // TODO
    },
};
