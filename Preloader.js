var Preloader={
    preload: function(g){
        // load building
        g.load.image('apartments', 'images/buildings/apartments.png');
        g.load.image('factory', 'images/buildings/factory.png');
        g.load.image('hospital', 'images/buildings/hospital.png');
        g.load.image('palace', 'images/buildings/palace.png');
        g.load.image('shanties', 'images/buildings/shanties.png');

        // load resources
        g.load.image('forest', 'images/resources/forest.png');
        g.load.image('oil', 'images/resources/oil.png');


        // load terrain
        g.load.image('coast', 'images/terrains/coast_tile.png');
        g.load.image('desert', 'images/terrains/desert_tile.png');
        g.load.image('grass', 'images/terrains/grass_tile.png');
        g.load.image('mountain', 'images/terrains/mountain_tile.png');
        g.load.image('water', 'images/terrains/water_tile.png');

        // load ui assets
        g.load.image('buttonUp', 'images/ui/button_up.png');
        g.load.image('buttonDown', 'images/ui/button_down.png');
        g.load.image('buttonOver', 'images/ui/button_over.png');
    }
}