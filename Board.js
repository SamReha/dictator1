// Terrain, Resource and Building
var Terrain={
    Plain:0, Mountain:1, Sea:2,
    //TODO
}
var Resource={
    None:0, Forest:0, Oil:1,
    //TODO
}
var Building={
    None:0, Farm:0, Factory:1,
    //TODO
}
// Tile
var Tile={
    createNew: function(){
        // class members
        var tile={
            terrain: Terrain.Plain,
            resource: Resource.None,
            building: Building.None,
        }
        return tile;
    },
}

// Board
var Board={
    createNew: function(){
        // class members
        var board={
            width: 16,
            height: 16,
        }
        return board;
    },
    
    // static class members
}