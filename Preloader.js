var Preloader={
    preload: function(g){
        // Builings
        g.load.image('apartment1', 'images/buildings/apartments.png');
        g.load.image('arableFarm1', 'images/buildings/arableFarm.png');
        g.load.image('armyBase1', 'images/buildings/armyBase.png');
        g.load.image('factory1', 'images/buildings/factory.png');
        g.load.image('hospital1', 'images/buildings/hospital.png');
        g.load.image('lumberYard1', 'images/buildings/lumberYard.png');
        g.load.image('mansion1', 'images/buildings/mansion.png');                
        g.load.image('palace1', 'images/buildings/palace.png');
        g.load.image('road1', 'images/buildings/road.png');
        g.load.image('school1','images/buildings/school.png');
        g.load.image('shanty1', 'images/buildings/shanties.png');
        g.load.image('weakFarm1', 'images/buildings/weakFarm.png');

        // Resources
        g.load.image('forest', 'images/resources/forest.png');
        g.load.image('oil', 'images/resources/oil.png');
        
        // Terrain
        g.load.image('coast', 'images/terrains/coast_tile.png');
        g.load.image('desert', 'images/terrains/desert_tile.png');
        g.load.image('grass', 'images/terrains/grass_tile.png');
        g.load.image('mountain', 'images/terrains/mountain_tile.png');
        g.load.image('water', 'images/terrains/water_tile.png');

        // load ui assets
        g.load.spritesheet('buttonSprite', 'images/ui/button_spritesheet.png', 128, 48, 4);
        g.load.image('grpBldInfo', 'images/ui/grpBldInfo.png');
        g.load.spritesheet('btnHire', 'images/ui/btnHire.png', 64, 20, 4);
        g.load.spritesheet('btnFire', 'images/ui/btnFire.png', 64, 20, 4);
        g.load.spritesheet('btnNextTurn', 'images/ui/btnNextTurn.png', 64, 20, 4);
        
        // load json files
        g.load.json('stage1','stage1.json');
        g.load.json('buildingData','buildingData.json');
    }
};