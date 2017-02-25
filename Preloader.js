var Preloader={
    preload: function(g) {
        var imageDir = 'images/';

        // Builings
        var buildingDir = imageDir + 'buildings/';
        // Placeholder assets
        // g.load.image('apartment1',  buildingDir + 'apartments.png');
        // g.load.image('armyBase1',   buildingDir + 'armyBase_old.png');
        g.load.image('hospital1',   buildingDir + 'hospital.png');
        // g.load.image('mansion1',    buildingDir + 'mansion.png');                
        g.load.image('shanty1',     buildingDir + 'shanties.png');
        // g.load.image('weakFarm1',   buildingDir + 'weakFarm_old.png');
        // Vertical Slice assets
        g.load.image('apartment1',  buildingDir + 'apartment.png');
        g.load.image('arableFarm1', buildingDir + 'arableFarm.png');
        g.load.image('armyBase1',   buildingDir + "armyBase.png");
        g.load.image('factory1',    buildingDir + 'factory.png');
        g.load.image('lumberYard1', buildingDir + 'factory.png');
        g.load.image('mansion1',    buildingDir + 'mansion.png');                
        g.load.image('palace1',     buildingDir + 'palace.png');
        g.load.image('road1',       buildingDir + 'road.png');
        g.load.image('school1',     buildingDir + 'school.png');
        g.load.image('suburb1',     buildingDir + 'suburb.png');
        g.load.image('weakFarm1',   buildingDir + 'weakFarm.png');

        // Resources
        var resourceDir = imageDir + 'resources/';
        // Placeholder assets
        g.load.image('oil',    resourceDir + 'oil.png');
        // Vertical Slice assets
        g.load.image('forest1',   resourceDir + 'forest1.png');
        g.load.image('forest2',   resourceDir + 'forest2.png');
        g.load.image('wheat',      resourceDir + 'wheat.png');

        // Terrain
        var resourceDir = imageDir + 'terrains/';
        // Placeholder assets
        g.load.image('coast',    resourceDir + 'coast_tile.png');
        g.load.image('desert',   resourceDir + 'desert_tile.png');
        g.load.image('grass',    resourceDir + 'grass_tile.png');
        g.load.image('mountain', resourceDir + 'mountain_tile.png');
        g.load.image('water',    resourceDir + 'water_tile.png');
        // Vertical Slice assets
        g.load.image('grass1',    resourceDir + 'grass1.png');
        g.load.image('grass2',    resourceDir + 'grass2.png');
        g.load.image('grass3',    resourceDir + 'grass3.png');
        g.load.image('mountain1', resourceDir + 'mountain1.png');
        g.load.image('mountain2', resourceDir + 'mountain2.png');
        g.load.image('mountain3', resourceDir + 'mountain3.png');
        g.load.image('water1',    resourceDir + 'water1.png');
        g.load.image('water2',    resourceDir + 'water2.png');
        g.load.image('water3',    resourceDir + 'water3.png');

        // load ui assets
        var uiDir = imageDir + 'ui/';
        g.load.image('grpBldInfo',           uiDir + 'grpBldInfo.png');
        g.load.image('grpBuildMenu',         uiDir + 'grpBuildMenu.png');
        g.load.image('grpStatsMenu',         uiDir + 'grpStatsMenu.png');
        g.load.image('topBar',               uiDir + 'topBar.png');
        g.load.image('tile_hover_backpanel', uiDir + 'tile_hover_backpanel.png');
        g.load.image('building_detail_backpanel',   uiDir + 'building_detail_backpanel.png')
        g.load.image('flag_background',      uiDir + 'flag_background.png');

        //// load button spritesheets
        var buttonDir = uiDir + 'buttons/';
        g.load.spritesheet('btnHire',              buttonDir + 'btnHire.png', 64, 20, 4);
        g.load.spritesheet('btnFire',              buttonDir + 'btnFire.png', 64, 20, 4);
        g.load.spritesheet('btnNextTurn',          buttonDir + 'btnNextTurn.png', 64, 20, 4);
        g.load.spritesheet('buttonSprite',         buttonDir + 'button_spritesheet.png', 128, 48, 4);
        g.load.spritesheet('small_generic_button', buttonDir + 'small_generic_button.png', 120, 48, 3);
        g.load.spritesheet('med_generic_button',   buttonDir + 'med_generic_button.png', 144, 80, 3);
        g.load.spritesheet('large_generic_button', buttonDir + 'large_generic_button.png', 240, 96, 3);
        
        // load json files
        g.load.json('stage1','stage1.json');
        g.load.json('stage2','stage2.json');
        g.load.json('stageMain','stageMain.json');
        g.load.json('buildingData','buildingData.json');
    }
};