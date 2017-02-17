// singleton class for the main game
// a singleton class should use init() for initialization

var MainGame={
    // define props here
    developer: "Ludocracy III",
    
    // the game var
    game: null,
    
    // the board var
    board: null,
    
    // the Map Selector
    mapSelector: null,

    // The HUD
    hud: null,

    // the people var
    population: null,
    
    // singleton func to initialize
    initialized: false,
    init: function(g){
        if(MainGame.initialized===true)
            return;

        // now init
        MainGame.initialized=true;
        
        // set game var
        MainGame.game=g;
        
        // Prevent default right click behavior
        MainGame.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        // set population var
        MainGame.population=null;

        // set global var
        /*global Global*/
        MainGame.global=Global;

        console.log('[MainGame] init with (w,h)=('+g.width+','+g.height+')');
    },
    
    // start the game
    start: function(){
        console.assert(MainGame.initialized);
        console.log('[MainGame] start...');
        
        // create board
        var stage1=MainGame.game.cache.getJSON('stage1');

        /*global Board*/
        MainGame.board=Board.fromJSON(JSON.stringify(stage1));

        /*global Population*/
        MainGame.population=Population.createNew(stage1.population);

        /*global MapSelector*/
        MainGame.mapSelector=MapSelector.createNew();

        /*global Hud*/
        MainGame.hud = Hud.createNew();
    },
    
    nextTurn: function(){
        MainGame.board.nextTurn();

        MainGame.population.nextTurn();
        
        MainGame.global.nextTurn();
        // TODO
    },
};
