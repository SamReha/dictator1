var Preloader={
    preload: function(g) {
        var imageDir = 'images/';

        // Builings
        var buildingDir = imageDir + 'buildings/';
        // Placeholder assets
        g.load.image('hospital1',   buildingDir + 'hospital.png');
        // g.load.image('shanty1',     buildingDir + 'shanties.png');
        // Vertical Slice assets
        g.load.image('apartment1',  buildingDir + 'apartment.png');
        //g.load.image('arableFarm1', buildingDir + 'arableFarm.png');
        g.load.image('armyBase1',   buildingDir + 'armyBase.png');
        g.load.image('fertileFarm1',buildingDir + 'fertileFarm.png');
        g.load.image('armyBase1',   buildingDir + "armyBase.png");
        g.load.image('factory1',    buildingDir + 'factory.png');
        g.load.image('lumberYard1', buildingDir + 'factory.png');
        g.load.image('mansion1',    buildingDir + 'mansion.png');                
        g.load.image('palace1',     buildingDir + 'palace.png');
        g.load.image('park1',       buildingDir + 'park.png');
        g.load.image('police1',     buildingDir + 'police.png');
        g.load.image('road1',       buildingDir + 'road.png');
        g.load.image('school1',     buildingDir + 'school.png');
        g.load.image('shantyTown1', buildingDir + 'shantyTown.png');
        g.load.image('suburb1',     buildingDir + 'suburb.png');
        g.load.image('weakFarm1',   buildingDir + 'weakFarm.png');

        // Building Detail Icons
        var detailIconDir = buildingDir + 'detail_icons/';
        g.load.image('apartment_detail',   detailIconDir + 'apartment.png');
        g.load.image('fertileFarm_detail', detailIconDir + 'farm.jpg');
        g.load.image('weakFarm_detail',    detailIconDir + 'farm.jpg');
        g.load.image('armyBase_detail',    detailIconDir + 'armyBase.jpg');
        g.load.image('factory_detail',     detailIconDir + 'factory.jpg');
        g.load.image('lumberYard_detail',  detailIconDir + 'factory.jpg');
        g.load.image('mansion_detail',     detailIconDir + 'mansion.png');
        g.load.image('palace_detail',      detailIconDir + 'palace.png');
        g.load.image('road_detail',        detailIconDir + 'road.jpg');
        g.load.image('school_detail',      detailIconDir + 'school.png');
        g.load.image('shantyTown_detail',  detailIconDir + 'shantyTown.png');
        g.load.image('suburb_detail',      detailIconDir + 'suburb.png');
        g.load.image('park_detail',        detailIconDir + 'park.png');
        g.load.image('detail_icon_frame',  detailIconDir + 'detail_icon_frame.png');

        // Resources
        var resourceDir = imageDir + 'resources/';
        // Placeholder assets
        g.load.image('oil',    resourceDir + 'oil.png');
        // Vertical Slice assets
        g.load.image('forest1',   resourceDir + 'forest1.png');
        g.load.image('forest2',   resourceDir + 'forest2.png');
        g.load.image('soy',      resourceDir + 'soy.png');

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

        // load minister port assets
        var portDir = imageDir + 'ports/';
        for (var port = 0; port < 10; port++) {
            g.load.image('bureaucrat_port_' + port, portDir + 'bureaucrat_port_' + port + '.png');
            g.load.image('military_port_' + port,   portDir + 'military_port_' + port + '.png');
            g.load.image('merchant_port_' + port,   portDir + 'merchant_port_' + port + '.jpg');
        }

        // load ui assets
        var uiDir = imageDir + 'ui/';
        g.load.image('tile_hover_backpanel',      uiDir + 'tile_hover_backpanel.png');
        g.load.image('building_detail_backpanel', uiDir + 'building_detail_backpanel.png');
        g.load.image('buildMenuBg',               uiDir + 'buildMenuBg.png');
        g.load.image('buildMenuCover1',           uiDir + 'buildMenuCover1.png');
        g.load.image('buildMenuCover2',           uiDir + 'buildMenuCover2.png');
        g.load.image('coalition_backpanel',       uiDir + 'coalition_backpanel.png');
        g.load.image('coalition_border',          uiDir + 'coalition_outer_edge.png');
        g.load.image('stats_panel_backpanel',     uiDir + 'stats_panel_backpanel.png');
        g.load.image('peopleViewBg',              uiDir + 'peopleViewBg.jpg');
        g.load.image('peopleViewLeftBg',          uiDir + 'peopleViewLeftBg.png');
        g.load.image('peopleViewRightBg',         uiDir + 'peopleViewRightBg.png');
        g.load.image('peopleViewContractBg',      uiDir + 'peopleViewContractBg.png');
        g.load.image('incButton',                 uiDir + 'incButton.png');
        g.load.image('decButton',                 uiDir + 'decButton.png');
        g.load.image("pi_prevPage",               uiDir + "pi_prevPage.png");
        g.load.image("pi_nextPage",               uiDir + "pi_nextPage.png");
        g.load.image("uiMask",                    uiDir + "uiMask.png");
        g.load.image("event_bg",                  uiDir + "event_bg.png");
        g.load.image('freedomUnrestMeter',        uiDir + "freedomUnrestMeter.png");
        g.load.image('fun_panel_backpanel',       uiDir + 'fun_panel_backpanel.png');
        g.load.image('thermometer_bulb',          uiDir + 'thermometer_bulb.png');
        g.load.image('thermometer_tube',          uiDir + 'thermometer_tube.png');

        //// load button spritesheets
        var buttonDir = uiDir + 'buttons/';
        g.load.spritesheet('btnHire',                   buttonDir + 'btnHire.png', 64, 20, 4);
        g.load.spritesheet('btnFire',                   buttonDir + 'btnFire.png', 64, 20, 4);
        g.load.spritesheet('build_button',              buttonDir + 'build_button.png', 144, 80, 3);
        g.load.spritesheet('endturn_button',            buttonDir + 'endturn_button.png', 144, 80, 3);
        g.load.spritesheet('buttonSprite',              buttonDir + 'button_spritesheet.png', 128, 48, 4);
        g.load.spritesheet('closeButton',               buttonDir + 'close_button.png', 48, 48, 3);
        g.load.spritesheet('buy_button',                buttonDir + 'buy_button.png', 120, 48, 3);
        g.load.spritesheet('small_generic_button',      buttonDir + 'small_generic_button.png', 120, 48, 3);
        g.load.spritesheet('med_generic_button',        buttonDir + 'med_generic_button.png', 144, 80, 3);
        g.load.spritesheet('large_generic_button',      buttonDir + 'large_generic_button.png', 240, 96, 3);
        g.load.spritesheet('nameplate_button',          buttonDir + 'nameplate_button.png', 360, 40, 3);
        g.load.spritesheet('portrait_border_bureau',    buttonDir + 'portrait_border_bureau.png', 56, 56, 3);
        g.load.spritesheet('portrait_border_finance',   buttonDir + 'portrait_border_finance.png', 56, 56, 3);
        g.load.spritesheet('portrait_border_military',  buttonDir + 'portrait_border_military.png', 56, 56, 3);
        g.load.spritesheet('bracketArrowButton',        buttonDir + 'bracket_arrow.png', 48, 48, 3);
        g.load.spritesheet('triangleArrowButton',       buttonDir + 'triangle_arrow.png', 48, 48, 3);
        g.load.spritesheet('redMinusButton',            buttonDir + 'red_minus_button.png', 48, 48, 3);
        g.load.spritesheet('redPlusButton',             buttonDir + 'red_plus_button.png', 48, 48, 3);
        g.load.spritesheet('yellowMinusButton',         buttonDir + 'yellow_minus_button.png', 48, 48, 3);
        g.load.spritesheet('yellowPlusButton',          buttonDir + 'yellow_plus_button.png', 48, 48, 3);


        //// load icons
        var iconDir = uiDir + 'icons/';
        g.load.spritesheet('freedom_icon',      iconDir + 'freedom_icon.png');
        g.load.spritesheet('money_icon',        iconDir + 'money_icon.png');
        g.load.spritesheet('population_icon',   iconDir + 'population_icon.png', 46, 46, 3);
        g.load.spritesheet('homeless_icon',     iconDir + 'homeless_icon.png');
        g.load.spritesheet('unemployed_icon',   iconDir + 'unemployed_icon.png');
        g.load.spritesheet('unrest_icon',       iconDir + 'unrest_icon.png');
        g.load.spritesheet('year_icon',         iconDir + 'year_icon.png');
        g.load.spritesheet('swiss_icon',        iconDir + 'swiss_account_icon.png');
        g.load.spritesheet('construction_icon', iconDir + 'construction_icon.png');
        for(var i = 1; i <= 4; ++i){
            g.load.spritesheet('counter_icon'+i,iconDir + 'counter_icon'+i+'.png');
        }

        //// load unit spritesheets
        var unitDir = imageDir + 'units/';
        g.load.image('army_idle',   unitDir + 'army_idle.png');
        g.load.image('army_moving', unitDir + 'army_moving.png');
        g.load.image('riot_idle',   unitDir + 'riot_idle.png');
        g.load.image('riot_moving', unitDir + 'riot_moving.png');

        // load json files
        g.load.json('stage1','stage1.json');
        g.load.json('stage2','stage2.json');
        g.load.json('stageMain','stageMain.json');
        g.load.json('buildingData','buildingData.json');
        g.load.json('names','Names.json');
        g.load.json('CoalitionQuest', 'CoalitionQuest.json');
        g.load.json('Tutorial', 'Tutorial.json');
        g.load.json('unitData', 'unitData.json');

        // Load audio assets (should probably be using FMOD for this)
        var audioDir = 'sounds/';

        //// load music
        var musicDir = audioDir + 'music/';
        g.load.audio('game_loop', musicDir + 'Game_Loop_Rough.wav');

        //// load sfx
        var sfxDir = audioDir + 'sfx/';
        g.load.audio('message_open', sfxDir + 'messages/message_open_SFX.wav');
        g.load.audio('message_close', sfxDir + 'messages/message_close_SFX.wav');

        for (var i = 1; i <= 14; i++) {
            g.load.audio('cloth_click_' + i, sfxDir + 'clicks/cloth_click/cloth_click_' + i + '_SFX.wav');
        }

        for (var i = 1; i <= 8; i++) {
            g.load.audio('paper_click_' + i, sfxDir + 'clicks/paper_click/paper_click_0' + i + '_SFX.wav');
        }

        for (var i = 1; i <= 5; i++) {
            g.load.audio('building_placement_' + i, sfxDir + 'buildings/building_placement_0' + i + '_SFX.wav');
        }

        for (var i = 1; i <= 5; ++i) {
            g.load.audio('empty_click_' + i, sfxDir + 'clicks/empty_click/empty_click_' + i + '_SFX.wav');
        }
    }
};