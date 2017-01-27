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
        // load building+res+terrain
        g.load.image('apartments', 'images/buildings/apartments.png')
        g.load.image('factory', 'images/buildings/factory.png')
        g.load.image('hospital', 'images/buildings/hospital.png')
        g.load.image('palace', 'images/buildings/palace.png')
        g.load.image('shanties', 'images/buildings/shanties.png')
        g.load.image('forest', 'images/resources/forest.png')
        g.load.image('oil', 'images/resources/oil.png')
        g.load.image('coast', 'images/terrains/coast_tile.png')
        g.load.image('desert', 'images/terrains/desert_tile.png')
        g.load.image('grass', 'images/terrains/grass_tile.png')
        g.load.image('mountain', 'images/terrains/mountain_tile.png')
        g.load.image('water', 'images/terrains/water_tile.png')
        
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
        
        // TODO: create map
        var mapGroup=MainGame.createMap(MainGame.game, 5, 3, 256, '151512424231313', '12   22    1111', '  121  543     ')
        console.log("[MainGame] map created with "+mapGroup.children.length+" children.")
    },
    
    // returns a group
    createMap: function(game, w, h, pw, terrain, res, building){
        // setup groups
        /*global Phaser*/
        var map=MainGame.game.add.group()
        var N=w*h
        
        var ph=pw*(1.732/2.0)
        
        for(var i=0;i<N;i++){
            var ix=i%w
            var iy=Math.floor(i/w)
            var x=pw*0.75*ix
            var y=ph*iy
            if(ix%2===1){
                y+=ph*0.5
            }

            // create the tile group
            var oneTile=MainGame.game.add.group(map)
            oneTile.x=x
            oneTile.y=y
            
            // create map table
            var terrainTable=['undefined', 'coast', 'desert', 'grass', 'mountain', 'water']
            var resTable=['undefined', 'forest', 'oil']
            var buildingTable=['undefined', 'apartments', 'factory', 'hospital', 'palace', 'shanties']
            
            // create terrain, res and building
            var terrainIndex=parseInt(terrain[i])
            oneTile.create(0,0,terrainTable[terrainIndex])
            
            var resIndex=parseInt(res[i])
            if(resIndex>=1){
                oneTile.create(0,0,resTable[resIndex])
            }
            
            var buildingIndex=parseInt(building[i])
            if(buildingIndex>=1){
                oneTile.create(0,0,buildingTable[buildingIndex])
            }
        }
        return map
    },
    
}

