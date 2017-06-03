// require: MainGame.game !== null
var Tile = {
    // create from JSON. json MUST be a string to prevent the ref issue.
    fromJSON: function(json, index) {
        // create the tile
        /*global MainGame*/
        var tile = MainGame.game.make.sprite(0,0);
        tile.tileGroup = MainGame.game.make.group();
        tile.addChild(tile.tileGroup);
        // decode json
        var data = JSON.parse(json);

        // Class members
        var tempTerrain = data.terrain;
        data.terrain += MainGame.game.rnd.integerInRange(1, 3);
        tile.terrain = MainGame.game.make.sprite(0,0,data.terrain);
        tile.terrain.key = tempTerrain;
        tile.tileGroup.addChild(tile.terrain);

        switch (tile.terrain.key) {
            case 'grass':
                tile.terrainLabel = 'Grass';
                break;
            case 'mountain':
                tile.terrainLabel = 'Mountains';
                break;
            case 'water':
                tile.terrainLabel = 'Water';
                break;
            default:
                break;
        }

        tile.unit = null;
        tile.index = index; // For convenience

        // Flag that checks if a tile should be able to be interacted with
        tile.interactable = true;

        // Dirt roads!
        tile.roads = [];
        tile.roads[0] = MainGame.game.make.sprite(tile.terrain.width/2, tile.terrain.height/2, 'road_dirt_horiz');
        tile.roads[0].anchor.set(0.5, 0.5);
        tile.roads[0].visible = false;
        tile.tileGroup.addChild(tile.roads[0]);

        tile.roads[1] = MainGame.game.make.sprite(tile.terrain.width/2, tile.terrain.height/2, 'road_dirt_diag');
        tile.roads[1].anchor.set(0.5, 0.5);
        tile.roads[1].visible = false;
        tile.tileGroup.addChild(tile.roads[1]);

        tile.roads[2] = MainGame.game.make.sprite(tile.terrain.width/2, tile.terrain.height/2, 'road_dirt_diag');
        tile.roads[2].anchor.set(0.5, 0.5);
        tile.roads[2].scale.set(1, -1);
        tile.roads[2].visible = false;
        tile.tileGroup.addChild(tile.roads[2]);

        tile.roads[3] = MainGame.game.make.sprite(tile.terrain.width/2, tile.terrain.height/2, 'road_dirt_horiz');
        tile.roads[3].anchor.set(0.5, 0.5);
        tile.roads[3].scale.set(1, -1);
        tile.roads[3].visible = false;
        tile.tileGroup.addChild(tile.roads[3]);

        tile.roads[4] = MainGame.game.make.sprite(tile.terrain.width/2, tile.terrain.height/2, 'road_dirt_diag');
        tile.roads[4].anchor.set(0.5, 0.5);
        tile.roads[4].scale.set(-1, -1);
        tile.roads[4].visible = false;
        tile.tileGroup.addChild(tile.roads[4]);

        tile.roads[5] = MainGame.game.make.sprite(tile.terrain.width/2, tile.terrain.height/2, 'road_dirt_diag');
        tile.roads[5].anchor.set(0.5, 0.5);
        tile.roads[5].scale.set(-1, 1);
        tile.roads[5].visible = false;
        tile.tileGroup.addChild(tile.roads[5]);

        /* global Building*/
        tile.building = Building.createNew(data.building);
        tile.building.position.set(tile.terrain.width/2, tile.terrain.height/2);
        tile.tileGroup.addChild(tile.building);

        // Use alert if something is going wrong in a tile
        tile.alert = MainGame.game.make.sprite(0, 0, 'exclamation_01');
        tile.alert.inputEnabled = true;
        tile.alert.input.priorityID = 10;
        tile.alert.toolTip = ToolTip.createNew('A Minister will be\ndemoted next turn!');
        tile.alert.toolTip.x = 10;
        tile.alert.toolTip.y = 35;
        tile.alert.toolTip.scale.set(1.5, 1.5);
        tile.alert.events.onInputOver.add(function() {tile.alert.toolTip.show();}, null);
        tile.alert.events.onInputOut.add(function() {tile.alert.toolTip.hide();}, null);
        tile.alert.addChild(tile.alert.toolTip);
        tile.tileGroup.addChild(tile.alert);
        tile.tileGroup.bringToTop(tile.alert);
        tile.alert.visible = false;

        // tile.debugText = MainGame.game.make.text(50, 50, tile.index);
        // tile.addChild(tile.debugText);

        // Class funcs
        //// Alert Layer
        tile.setAlert = function(bool) { tile.alert.visible = bool; };

        //// Terrain Layer
        tile.getTerrain = function() { return tile.terrain; };
        tile.getTerrainType = function() { return tile.terrain.key; };
        
        //// Building Layer
        // Returns true iff this tile has a building on it
        tile.hasBuilding = function() { return (tile.building !== null && !tile.building.isEmpty()); };
        tile.getBuilding = function() { return tile.building; };
        tile.setBuilding = function(building) { Tile.setBuilding(tile,building); };
        tile.removeBuilding = function() { Tile.removeBuilding(tile); };
        tile.damageBuilding = function(damage) { Tile.damageBuilding(tile, damage); };

        //// Unit Layer
        // Returns true iff this tile has a unit stationed on it
        tile.hasUnit = function() { return tile.unit !== null; };
        // Returns the unit stationed on this tile (or null, if no unit exists)
        tile.getUnit = function() { return tile.unit; };
        // Assigns a unit to this tile. Remove a unit by passing null.
        tile.setUnit = function(newUnit) { Tile.setUnit(tile, newUnit); };

        tile.getRoadCode = function() { return Tile.getRoadCode(tile); };
        tile.getRoadCodeTypeRestricted = function() { return Tile.getRoadCodeTypeRestricted(tile); };
        tile.updateRoadConnections = function() { Tile.updateRoadConnections(tile); };

        return tile;
    },

    toJSON: function(t){
        var data = {terrain:t.terrain.key, res:t.res.key, building:JSON.parse(t.building.toJSON())};
        return JSON.stringify(data);
    },

    //// Building Layer
    setBuilding: function(tile, building) {
        // If this building already exists on this tile, do nothing
        if (tile.building === building) {
            return;
        }

        // If we already have a building, remove it before the new building this placed.
        if (tile.building) {
            tile.tileGroup.removeChild(tile.building);
            tile.building = null;
        }

        // Apply the new building to the tile
        tile.building = building;
        tile.building.position.set(tile.terrain.width/2, tile.terrain.height/2);
        tile.tileGroup.addChild(building);
        tile.tileGroup.bringToTop(tile.alert);
    },

    removeBuilding: function(tile) {
        console.assert(tile.hasBuilding(), "[Tile] Can't remove a building from a tile with no building!");

        if (tile.getBuilding().subtype === 'housing') {
            var occupants = MainGame.population.getHouseMap()[tile.index];
        } else {
            var occupants = MainGame.population.getWorkMap()[tile.index];
        }

        // Evict all residents
        for (var i in occupants) {
            MainGame.population.fire(tile.index);
        }

        MainGame.population.update(false);

        tile.tileGroup.removeChild(tile.building);
        tile.building = Building.createNew(null);
    },

    damageBuilding: function(tile, damage) {
        if (tile.hasBuilding()) {
            tile.building.integrity -= damage;
            
            if (tile.building.integrity <= 0) {
                tile.removeBuilding();

                console.log("[Tile] building destroyed");

                // Make a rubble
                var newBuilding = Building.createNew({name:'rubble', startingTurn:-1, people:0});
                tile.setBuilding(newBuilding);

                // Play a demolished sound
                MainGame.game.make.audio('building_placement_5').play();

                // If we have a unit, make sure it gets sorted on top
                if (tile.hasUnit()) {
                    tile.tileGroup.bringToTop(tile.unit);
                }
            }
        }
    },

    //// Unit Layer
    setUnit: function(tile, newUnit) {
        if (tile.unit !== null) {
            tile.tileGroup.removeChild(tile.unit);
        }

        tile.unit = newUnit;

        if (newUnit !== null) {
            tile.tileGroup.addChild(tile.unit);
        }
    },

    getRoadCode: function(tile) {
        var neighbors = [
            MainGame.board.adjacent(tile.index, 0),
            MainGame.board.adjacent(tile.index, 2),
            MainGame.board.adjacent(tile.index, 4),
            MainGame.board.adjacent(tile.index, 6),
            MainGame.board.adjacent(tile.index, 8),
            MainGame.board.adjacent(tile.index, 10),
        ];

        var roadCode = '';
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i] === null) {
                roadCode += '0';
            } else {
                roadCode += (MainGame.board.at(neighbors[i]).hasBuilding() ? '1' : '0');
            }
        }

        return roadCode;
    },

    getRoadCodeTypeRestricted: function(tile) {
        if (tile.getBuilding().name === 'palace') return '000000';
        var neighbors = [
            MainGame.board.adjacent(tile.index, 0),
            MainGame.board.adjacent(tile.index, 2),
            MainGame.board.adjacent(tile.index, 4),
            MainGame.board.adjacent(tile.index, 6),
            MainGame.board.adjacent(tile.index, 8),
            MainGame.board.adjacent(tile.index, 10),
        ];

        var roadCode = '';
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i] === null) {
                roadCode += '0';
            } else {
                var neighor = MainGame.board.at(neighbors[i]);

                if (tile.getBuilding().subtype === 'housing') {
                    if (neighor.getBuilding().subtype !== 'housing' && neighor.getBuilding().name !== 'palace') {
                        roadCode += (neighor.hasBuilding() ? '1' : '0');
                    } else roadCode += '0';
                } else {
                    if (neighor.getBuilding().subtype === 'housing' || neighor.getBuilding().name === 'road') {
                        roadCode += (neighor.hasBuilding() ? '1' : '0');
                    } else roadCode += '0';
                }
            }
        }

        return roadCode;
    },

    updateRoadConnections: function(tile) {
        if (!tile.hasBuilding()) return;

        if (tile.building.name === 'road') {
            var roadCode = tile.getRoadCode();
            var vertFlip = false;
            var horizFlip = false;

            //console.log(tile.index, roadCode);

            // Manually figure out which strings requires flips...
            switch (roadCode) {
                // 000001 flips
                case '010000':
                    roadCode = '000001';
                    vertFlip = true;
                    break;
                case '001000':
                    roadCode = '000001';
                    vertFlip = true;
                    horizFlip = true;
                    break;
                case '000010':
                    roadCode = '000001';
                    horizFlip = true;
                    break;
                // 010001 flips
                case '001010':
                    roadCode = '010001';
                    horizFlip = true;
                    break;
                // 010010 flips
                case '001001':
                    roadCode = '010010';
                    horizFlip = true;
                    break;
                // 011000 flips
                case '000011':
                    roadCode = '011000';
                    vertFlip = true;
                    break;
                // 011010 flips
                case '001011':
                    roadCode = '011010';
                    vertFlip = true;
                    break;
                case '011001':
                    roadCode = '011010';
                    horizFlip = true;
                    break;
                case '010011':
                    roadCode = '011010';
                    horizFlip = true;
                    vertFlip = true;
                    break;
                // 100000 flips
                case '000100':
                    roadCode = '100000';
                    horizFlip = true;
                    break;
                // 101000 flips
                case '010100':
                    roadCode = '101000';
                    horizFlip = true;
                    break;
                case '100010':
                    roadCode = '101000';
                    vertFlip = true;
                    break;
                case '000101':
                    roadCode = '101000';
                    vertFlip = true;
                    horizFlip = true;
                    break;
                // 101010 flips
                case '010101':
                    roadCode = '101010';
                    horizFlip = true;
                    break;
                // 110000 flips
                case '001100':
                    roadCode = '110000';
                    horizFlip = true;
                    break;
                case '100001':
                    roadCode = '110000';
                    vertFlip = true;
                    break;
                case '000110':
                    roadCode = '110000';
                    horizFlip = true;
                    vertFlip = true;
                    break;
                // 110001 flips
                case '001110':
                    roadCode = '110001';
                    horizFlip = true;
                    break;
                // 110010 flips
                case '001101':
                    roadCode = '110010';
                    horizFlip = true;
                    break;
                case '101001':
                    roadCode = '110010';
                    vertFlip = true;
                    break;
                case '010110':
                    roadCode = '110010';
                    vertFlip = true;
                    horizFlip = true;
                    break;
                // 110100 flips
                case '101100':
                    roadCode = '110100';
                    horizFlip = true;
                    break;
                case '100101':
                    roadCode = '110100';
                    vertFlip = true;
                    break;
                case '100110':
                    roadCode = '110100';
                    vertFlip = true;
                    horizFlip = true;
                    break;
                // 110101 flips
                case '101110':
                    roadCode = '110101';
                    horizFlip = true;
                    break;
                // 110110 flips
                case '101101':
                    roadCode = '110110';
                    vertFlip = true;
                    break;
                // 110111 flips
                case '101111':
                    roadCode = '110111';
                    horizFlip = true;
                    break;
                case '111101':
                    roadCode = '110111';
                    vertFlip = true;
                    break;
                case '111110':
                    roadCode = '110111';
                    vertFlip = true;
                    horizFlip = true;
                    break;
                // 111000 flips
                case '011100':
                    roadCode = '111000';
                    horizFlip = true;
                    break;
                case '100011':
                    roadCode = '111000';
                    vertFlip = true;
                    break;
                case '000111':
                    roadCode = '111000';
                    vertFlip = true;
                    horizFlip = true;
                    break;
                // 111001 flips
                case '110011':
                    roadCode = '111001';
                    vertFlip = true;
                    break;
                case '011110':
                    roadCode = '111001';
                    horizFlip = true;
                    break;
                case '001111':
                    roadCode = '111001';
                    horizFlip = true;
                    vertFlip = true;
                    break;
                // 111010 flips
                case '011101':
                    roadCode = '111010';
                    horizFlip = true;
                    break;
                case '101011':
                    roadCode = '111010';
                    vertFlip = true;
                    break;
                case '010111':
                    roadCode = '111010';
                    vertFlip = true;
                    horizFlip = true;
                    break;
                // 111011 flips
                case '011111':
                    roadCode = '111011';
                    horizFlip = true;
                    break;
                // 111100 flips
                case '100111':
                    roadCode = '111100';
                    vertFlip = true;
                    break;
                default:
                    break;
            }

            //console.log(tile.index, roadCode);

            // Update texture
            tile.getBuilding().loadTexture('road_' + roadCode, 0);

            // Apply rotation (if any)
            if (vertFlip) {
                tile.getBuilding().scale.x = -1;
            } else tile.getBuilding().scale.x = 1;
            if (horizFlip) {
                tile.getBuilding().scale.y = -1;
            } else tile.getBuilding().scale.y = 1;
        } else {
            var roadCode = tile.getRoadCodeTypeRestricted();
            for (var i = 0; i < roadCode.length; i++) {
                if (roadCode[i] === '1') {
                    tile.roads[i].visible = true;
                } else {
                    tile.roads[i].visible = false;
                }
            }
        }
    }
};

// Board as turnSystem
var Board = {
    zoomLevelList: [0.33, 0.5, 0.66, 1.0],
    defaultZoomIndex: 2,

    // create from JSON. json MUST be a string to prevent the ref issue.
    fromJSON: function(json){
        // create the board
        var board = MainGame.game.add.sprite(0, 0);
        // decode JSON
        var data=JSON.parse(json);

        // Class vars
        board.gridWidth=data.gridWidth;
        board.gridHeight=data.gridHeight;
        board.tileWidth=data.tileWidth;
        board.tileHeight=data.tileHeight;
        board.currentScale = Board.zoomLevelList[Board.defaultZoomIndex];
        board.currentZoomIndex = Board.defaultZoomIndex;
        // maybe removed in the future
        board._offset={x:0,y:0};

        //console.log(board.currentScale, board.currentZoomIndex);

        // Class funcs
        // returns the JSON string representation
        board.toJSON=function(){return Board.toJSON(board)};
        // returns the tile sprite at [i]
        board.at=function(i){return Board.at(board,i)};
        // returns the adjacent index at clock direction [cd] of tile [i]
        board.adjacent=function(i,cd,warning){return Board.adjacent(board,i,cd,warning)};
        // returns all adjacent indice within [N] steps of tile [i]
        board.allAdjacent=function(i,N){return Board.allAdjacent(board,i,N)};
        // returns the tile count
        board.tileCount=function(){return board.gridWidth*board.gridHeight};
        // returns the (gx,gy) of i
        board.xyOf=function(i){return Board.xyOf(board,i)};
        // Returns the index of the tile present at the given x,y pair
        board.iOfxy = function(x, y) { return 0; };
        // returns the *relative* rect of i (relative==assuming the left-top of board is {0,0})
        board.rectOf=function(i,scale){return Board.rectOf(board,i,scale)};
        // returns the (nullable) *index* of (x,y). Set isLocal true to use my local coorinate system.
        board.hitTest=function(px,py,isLocal){return Board.hitTest(board,px,py,isLocal)};
        // returns the step distance between i and j
        board.distanceOf=function(i,j){return Board.distanceOf(board,i,j)};
        // returns whether i is connected with j
        board.hasRoadConnect=function(i,j){return Board.hasRoadConnect(board,i,j)};
        // returns all the *indice* of the terrain type
        board.findTerrain=function(type){return Board.findTerrain(board,type)};
        // Returns the INDEXES of all the buildings matching type(nullable)/subtype(nullable)
        board.findBuilding=function(name,faction,subtype,effect){return Board.findBuilding(board,name,faction,subtype,effect)};
        // Returns the tile indexes of all units currently on the board, filtered by type (set type === null if you just want all units)
        board.findUnits = function(type) { return Board.findUnits(board, type); };
        // build new shanty town next to a random road tile and return index
        board.buildShanty=function(){return Board.buildShanty(board)};
        // go to next turn
        board.nextTurn=function(turn){return Board.nextTurn(board,turn)};
        // let camera center itself on i
        board.cameraCenterOn=function(i){return Board.cameraCenterOn(board,i)};
        // let camera zoom itself as zoom
        board.cameraZoomAt=function(zoom){return Board.cameraZoomAt(board,zoom)};
        // let camera move by (x,y)
        board.cameraMoveBy=function(x,y){return Board.cameraMoveBy(board,x,y)};

        // Disable interaction on a single tile
        board.disableInteraction = function(i) { return Board.disableInteraction(board, i); };

        // Disable interaction on all tiles except for the given index
        board.limitInteractionTo = function(i) { return Board.limitInteractionTo(board, i); };

        // Enable interaction for the given index
        board.enableInteractionOn = function(i) { return Board.enableInteractionOn(board, i); };

        // Disable interaction on all tiles
        board.disableAllInteraction = function() { return Board.disableAllInteraction(board); };

        // Enable interaction on all tiles
        board.enableInteraction = function() { return Board.enableInteraction(board); };

        // init tiles
        var tileData=data.tiles;
        var N=board.gridWidth*board.gridHeight;
        for(var i=0;i<N;i++){
            // create the tile group from JSON. json MUST be a string!
            var oneTile=Tile.fromJSON(JSON.stringify(tileData[i]), i);
            oneTile.name="tile"+i;
            var rect=board.rectOf(i, 1.0);
            oneTile.x=rect.x;
            oneTile.y=rect.y;
            board.addChild(oneTile);
        }

        // create the Controller
        board.controller=BoardController.createNew(board);

        return board;
    },
    // save to JSON
    toJSON: function(b){
        var tiles=[];
        var data={gridWidth:b.gridWidth, gridHeight:b.gridHeight, tileWidth:b.tileWidth, tileHeight:b.tileHeight, tiles:tiles};
        var N=b.gridWidth*b.gridHeight;
        for(var i=0;i<N;i++){
            tiles[i]=JSON.parse(b.at(i).toJSON());
        }
        return JSON.stringify(data);
    },

    // returns the tile sprite at [i]
    at: function(b,i){
        return b.children[i];
    },
    // returns the adjacent index at clock direction [cd] of tile [i]
    adjacent: function(b,i,cd,warning){
        var w=b.gridWidth, h=b.gridHeight;
        var x=i%w;
        //              0   1   2   3   4   5   6   7   8   9   10  11
        var adj_even=[-w, -w+1,-w+1,0, +1,  +1, +w,-1,  -1, 0,  -w-1,-w-1];
        var adj_odd= [-w, +1,   +1, 0, +w+1,+w+1,+w,+w-1,+w-1,0,-1,     -1];
        // see if it is the leftmost/rightmost
        if(x===0){
            adj_even[7]=0, adj_even[8]=0, adj_even[10]=0, adj_even[11]=0;
        }else if(x===w-1){
            adj_even[1]=0, adj_even[2]=0, adj_even[4]=0, adj_even[5]=0;
        }
        var newIndex=(x%2===0?i+adj_even[cd]:i+adj_odd[cd]);
        if(newIndex<0 || newIndex>=w*h){
            if(warning) console.warn('[Board] Tile '+i+' does not have an adjacent at '+cd);
            return null;
        }else if(newIndex===i){
            if(warning) console.error('[Board] The clock direction should not be '+cd);
            return null;
        }else{
            return newIndex;
        }
    },
    // returns all adjacent indice within [N] steps of tile [i]
    allAdjacent: function(b,i,N){
        var result = [i];
        var p0 = 0, p1 = 1;
        
        for (var j = 0; j < N; j++) {
            p1 = result.length;
            for (var p = p0; p < p1; p++) {
                var index = result[p];
                for (var cd = 0; cd < 12; cd += 2) {
                    var adj = b.adjacent(index, cd);
                    if (adj) result.push(adj);
                }
            }
        }

        result.shift();
        return result;
    },
    // returns the (x,y) of i
    xyOf: function(b,i){
        var w=b.gridWidth;
        return {x:i%w, y:Math.floor(i/w)};
    },
    // returns the rect of i
    rectOf: function(b,i,scale){
        if(!scale || scale<=0) scale=1.0;
        var ixy=b.xyOf(i);
        var pw=b.tileWidth*scale;
        var ph=b.tileHeight*scale;
        var x=pw*0.75*ixy.x;
        var y=ph*ixy.y;
        if(ixy.x%2===1){
            y+=ph*0.5;
        }
        return {x:x, y:y, w:pw, h:ph};
    },
    // returns the index of the given building's tile 
    indexOfBuilding: function(board,building){
        var tiles=board.children;
        for(var i = 0; i < tiles.length; i += 1){
            if(tiles[i].building===building){
                return i;
            }
        }
    },
    // returns the index of (x,y)
    hitTest: function(b,px,py,isLocal){
        var N=b.gridWidth*b.gridHeight;
        for(var i=0;i<N;i++){
            var r=b.rectOf(i,b.currentScale);
            if(!isLocal){
                r.x+=b.x;
                r.y+=b.y;
            }
            if(px>r.x && px<r.x+r.w && py>r.y && py<r.y+r.h){
                return i;
            }
        }
        return null;
    },

    // returns the step distance between i and j
    distanceOf: function(b,i,j){
        var p0=b.xyOf(i), p1=b.xyOf(j);
        if(p0.x===p1.x){
            return Math.abs(p0.y-p1.y);
        }else if(p0.y===p1.y){
            return Math.abs(p0.x-p1.x);
        }else{
            var dx=Math.abs(p0.x-p1.x);
            var dy=Math.abs(p0.y-p1.y);
            if(p0.x%2===1){
                if(p0.y<p1.y){
                    return dx+dy-Math.ceil(dx/2);
                }else{
                    return dx+dy-Math.floor(dx/2);
                }
            }else{
                if(p0.y>p1.y){
                    return dx+dy-Math.ceil(dx/2);
                }else{
                    return dx+dy-Math.floor(dx/2);
                }
            }
        }
    },
    // returns if i and j is connected by road; returns true if i and j are adjacent.
    hasRoadConnect: function(b,i,j){
        console.assert(i!==j, "[Board] hasRoadConnect: the two indice should not be identical!");
        // TODO: use A* instead
        // now let's use BFS
        var conStack=[i];
        var checkedStack=[];
        while(conStack.length>0){
            var current=conStack.shift();
            for(var cd=0;cd<12;cd+=2){
                var adjacent=b.adjacent(current,cd);
                // check if adjacent is j
                if(adjacent===j){
                    return true;
                }
                // push it for future check
                if(adjacent && checkedStack.indexOf(adjacent)===-1){
                    var oneTile=b.children[adjacent];
                    if(oneTile.building){ 
                        if(oneTile.building.subtype==="road"){
                            conStack.push(adjacent);
                        }
                    }
                }
            }
            checkedStack.push(current);
        }
        return false;
    },
    // returns the indice that match the condition!
    findTerrain: function(b,type){
        var res=[];
        var N=b.tileCount();
        for(var i=0;i<N;i++)
            if(b.at(i).getTerrainType()===type)
                res.push(i);
        return res;
    },

    findBuilding: function(b,name,faction,subtype,effect){
        var res=[];
        var N=b.tileCount();
        for(var i=0;i<N;i++) {
            if (b.at(i).hasBuilding() === false) continue;

            var bld = b.at(i).getBuilding();
            if((bld.faction===faction || !faction) && (bld.subtype===subtype || !subtype) && 
                (bld.name===name || !name)){
                if (!effect) {
                    res.push(i);
                } else {
                    for(var bIndex=0;bIndex<bld.effects.length;++bIndex){
                        if(bld.effects[bIndex].type===effect){
                            res.push(i);
                            break;
                        }
                    }
                }
            }
        }
        return res;
    },

    findUnits: function(board, type) {
        var unitIndexes = [];
        var size = board.tileCount();

        for (var i = 0; i < size; i++) {
            var tile = board.at(i);

            if (tile.hasUnit()) {
                if (type === null || tile.getUnit().type === type) {
                    unitIndexes.push(i);
                }
            }
        }

        return unitIndexes;
    },

    buildShanty: function(board){
        var roads = board.findBuilding(null,null,"road",null);
        var choices = [];
        var distance = 0;
        
        //checking all tiles up to three steps removed from a road
        do{
            ++distance;
            for(var roadIndex=0;roadIndex<roads.length;++roadIndex){
                var check = board.allAdjacent(roads[roadIndex],distance);
                if(distance>1){
                    var remove = board.allAdjacent(roads[roadIndex],distance-1);
                    for(var removeIndex=0;removeIndex<remove.length;++removeIndex){
                        var ind = check.indexOf(remove[removeIndex]);
                        if(ind != -1){  check.splice(ind,1);    }
                    }
                }
                for(var adjIndex=0;adjIndex<check.length;++adjIndex){
                    if(!board.at(check[adjIndex]).hasBuilding() &&
                        board.at(check[adjIndex]).getTerrainType()!=="water" &&
                            board.at(check[adjIndex]).getTerrainType()!=="mountain"){
                        for(var choiceIndex=0;choiceIndex<choices.length;++choiceIndex){
                            if(check[adjIndex] === choices[choiceIndex]){
                                check[adjIndex] = null;
                                break;
                            }
                        }

                        if(check[adjIndex]!==null){   choices.push(check[adjIndex]);  }
                    }
                }
            }
        }while(choices.length === 0 && distance <= 3);

        // In case no index could be found at least 3 steps from a road
        if(choices.length === 0){
            for(var tileIndex = 0; tileIndex < board.tileCount(); ++tileIndex){
                if(!board.at(tileIndex).hasBuilding() && 
                    board.at(tileIndex).getTerrainType()!=="water" && 
                        board.at(tileIndex).getTerrainType()!=="mountain"){
                    choices.push(tileIndex);
                }
            }
        }

        var index = choices[Math.floor(Math.random()*choices.length)];
        /* global Building */
        board.at(index).setBuilding(Building.createNew({name:"shantyTown",startingTurn:MainGame.global.turn,people:0}));
        /*global updateHome*/
        updateHome(index);
        return index;
    },
    // to next turn
    nextTurn: function(b, turn) {
        // DFS call nextTurn
        var queue=[b];
        while(queue.length>0){
            var node=queue.shift();
            if(node.nextTurn && node!==b){
                node.nextTurn(turn);
            }
            for(var i=0;i<node.children.length;i++){
                queue.push(node.children[i]);
            }
        }
    },

    // let camera move (x,y)
    cameraMoveBy: function(b,x,y){
        b._offset.x+=x;
        b._offset.y+=y;
        b.x-=x;
        b.y-=y;

        /*global MainGame*/
        // MainGame.mapSelector.positionBuildingDetail(b);
    },

    // let camera center on i
    cameraCenterOn: function(b,i){        
        console.assert(typeof(i)==="number" && i>=0 && i<b.tileCount(), "i must be an index.");
        //console.log(b.at(i).getBuilding().effects);
        /*global MainGame*/

        // calc the current center pos of i (with consideration of board.scale)
        var rect_i=b.rectOf(i, b.currentScale);
        var center_i={x:rect_i.x+0.5*rect_i.w, y:rect_i.y+0.5*rect_i.h};
        // console.log("Center of i is:",center_i);

        // calc the geo center of the screen
        var screenCenter={x:MainGame.game.camera.x+MainGame.game.camera.width*0.5,
            y:MainGame.game.camera.y+MainGame.game.camera.height*0.5};
        // console.log("Center of camera:",screenCenter);

        // set offset of the board
        var newX=screenCenter.x-center_i.x; var offsetX=b.x-newX;
        var newY=screenCenter.y-center_i.y; var offsetY=b.y-newY;
        var boardTween = game.add.tween(b).to({x:newX,y:newY},200,Phaser.Easing.Quadratic.InOut,true);
        var offsetTween = game.add.tween(b._offset).to({x:offsetX,y:offsetY},200,Phaser.Easing.Quadratic.InOut,true);
        // b.x=(screenCenter.x-center_i.x);
        // b.y=(screenCenter.y-center_i.y);
        // b._offset.x+=oldX-b.x;
        // b._offset.y+=oldY-b.y;

        // MainGame.mapSelector.positionBuildingDetail(b);
    },

    // let camera zoom at zoom
    cameraZoomAt: function(b, zoomLevel){
        //console.log('zoomLevel: ', zoomLevel)
        var zoom = Board.zoomLevelList[Board.defaultZoomIndex];
        if(zoomLevel!==null && zoomLevel!==undefined){
            console.assert(zoomLevel>=0 && zoomLevel<Board.zoomLevelList.length);
            b.currentZoomIndex=zoomLevel;
            zoom = Board.zoomLevelList[zoomLevel];
            //console.log("zoom level ", zoomLevel, Board.zoomLevelList);
        }else{
            b.currentZoomIndex = Board.defaultZoomIndex;
        }
        //console.log("cameraZoomAt: zoom is ", zoom);

        /*global MainGame*/
        // 1. get the anchor/pivot point
        var screenCenter={x:MainGame.game.camera.x+MainGame.game.camera.width*0.5,
            y:MainGame.game.camera.y+MainGame.game.camera.height*0.5};
        var xy={x:screenCenter.x-b.x, y:screenCenter.y-b.y};
        var anchor={x:xy.x/b.width, y:xy.y/b.height};
        // console.log("anchor is",anchor);

        // 2. scale
        b.scale.set(zoom,zoom);
        b.currentScale=zoom;

        // 3. reset (x,y) according to the anchor point
        var oldX=b.x;
        var oldY=b.y;
        b.x=MainGame.game.camera.width*0.5-anchor.x*b.width;
        b.y=MainGame.game.camera.height*0.5-anchor.y*b.height;
        b._offset.x+=oldX-b.x;
        b._offset.y+=oldY-b.y;
        // console.log("new xy is:",b.x,b.y);
        
        // MainGame.mapSelector.positionBuildingDetail(b);
    },

    // Disable interaction on a single tile
    disableInteraction: function(board, i) {
        console.assert(typeof(i) === "number" && i >= 0 && i < board.tileCount(), "i must be an index.");
        board.at(i).interactable = false;
    },

    // Disable interaction on all tiles except for the given index
    limitInteractionTo: function(board, i) {
        console.assert(typeof(i) === "number" && i >= 0 && i < board.tileCount(), "i must be an index.");

        for (var index = 0; index < board.tileCount(); index++) {
            board.at(index).interactable = (i === index);
        }
    },

    // Enable interaction for the given index
    enableInteractionOn: function(board, i) {
        console.assert(typeof(i) === "number" && i >= 0 && i < board.tileCount(), "i must be an index.");
        board.at(i).interactable = true;
    },

    // Disable interaction on all tiles
    disableAllInteraction: function(board) {
        for (var index = 0; index < board.tileCount(); index++) {
            board.at(index).interactable = false;
        }
    },

    // Enable interaction on all tiles
    enableInteraction: function(board) {
        for (var index = 0; index < board.tileCount(); index++) {
            board.at(index).interactable = true;
        }
    },
};
