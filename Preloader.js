var Preloader={
    preload: function(g){
        
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
    }
}