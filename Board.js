// require: MainGame.game !== null
var Tile={
    // create from JSON. json MUST be a string to prevent the ref issue.
    fromJSON: function(json){
        // create the tile
        /*global MainGame*/
        var tile=MainGame.game.make.sprite(0,0);
        // decode json
        var data=JSON.parse(json);

        // Class members
        var tempTerrain = data.terrain;
        data.terrain+=MainGame.game.rnd.integerInRange(1,3);
        tile.terrain=MainGame.game.make.sprite(0,0,data.terrain);
        tile.terrain.key=tempTerrain;
        tile.addChild(tile.terrain);

        //tile.res=MainGame.game.make.sprite(0,0,data.res);
        tile.resType=data.res;
        if(data.res==='forest'){
            data.res+=MainGame.game.rnd.integerInRange(1,2);
            tile.res=MainGame.game.make.sprite(0,0,data.res);
            tile.res.key='forest';
            tile.addChild(tile.res);
        }else{
            tile.res=MainGame.game.make.sprite(0,0,data.res);
            tile.addChild(tile.res);
        }

        // Set resLabel and terrainLabel
        switch (tile.resType) {
            case 'forest':
                tile.resLabel = 'Forest';
                break;
            case 'coal':
                tile.resLabel = 'Coal';
                break;
            case 'wheat':
                tile.resLabel = 'Pasture';
                break;
            default:
                break;
        }

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

        /* global Building*/
        tile.building=Building.createNew(data.building);
        tile.addChild(tile.building);

        // Class funcs
        tile.getTerrain=function(){return tile.terrain};
        tile.getTerrainType=function(){return tile.terrain.key};
        tile.getResType=function(){return tile.resType};
        tile.getRes=function(){return tile.res};
        tile.removeRes = function() { Tile.removeRes(tile); };
        tile.hasBuilding=function(){return tile.building && !tile.building.isEmpty()};
        tile.getBuilding=function(){return tile.building};
        tile.setBuilding=function(building){Tile.setBuilding(tile,building)};

        return tile;
    },
    toJSON: function(t){
        var data={terrain:t.terrain.key, res:t.res.key, building:JSON.parse(t.building.toJSON())};
        return JSON.stringify(data);
    },

    removeRes: function(tile) {
        tile.resType = null;
        tile.removeChild(tile.res);
        tile.res = MainGame.game.make.sprite(0,0, null);
        tile.addChild(tile.res);
    },

    setBuilding: function(tile, building) {
        // If this building already exists on this tile, do nothing
        if (tile.building === building) {
            return;
        }

        // If we already have a building, remove it before the new building this placed.
        if (tile.building) {
            tile.removeChild(tile.building);
            tile.building = null;
        }

        // Based on the type of the building, check to see if we need to remove the tile's resource (if any)
        if (tile.getResType() !== null) {
            console.log(building);
            if (tile.getResType() === 'forest') {
                if (building.name !== 'lumberYard') {
                    tile.removeRes();
                }
            } else if (tile.getResType() === 'soy') {
                if (building.name !== 'fertileFarm') {
                    tile.removeRes();
                }
            }
        }

        // Apply the new building to the tile
        tile.building = building;
        tile.addChild(building);
    },
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
        // returns all the *indice* of the res type
        board.findRes=function(type){return Board.findRes(board,type)};
        // returns all the *indice* of the building type(nullable)/subtype(nullable)
        board.findBuilding=function(type,subtype,effect){return Board.findBuilding(board,type,subtype,effect)};
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

        // init tiles
        var tileData=data.tiles;
        var N=board.gridWidth*board.gridHeight;
        for(var i=0;i<N;i++){
            // create the tile group from JSON. json MUST be a string!
            var oneTile=Tile.fromJSON(JSON.stringify(tileData[i]));
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
        var result=[i];
        var p0=0, p1=1;
        for(var j=0;j<N;j++){
            p1=result.length;
            for(var p=p0;p<p1;p++){
                var index=result[p];
                for(var cd=0;cd<12;cd+=2){
                    var adj=b.adjacent(index,cd);
                    if(adj) result.push(adj);
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
                        if(oneTile.building.type==="road"){
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
    findRes: function(b,type){
        var res=[];
        var N=b.tileCount();
        for(var i=0;i<N;i++)
            if(b.at(i).getResType()===type)
                res.push(i);
        return res;
    },
    findBuilding: function(b,type,subtype,effect){
        var res=[];
        var N=b.tileCount();
        for(var i=0;i<N;i++){
            var bld=b.at(i).getBuilding();
            if(bld.name !== null){
                if((bld.type===type || !type) && (bld.subtype===subtype || !subtype)){
                    if(!effect){res.push(i);}
                    else{
                        for(var bIndex=0;bIndex<bld.effects.length;++bIndex){
                            if(bld.effects[bIndex].type===effect){
                                res.push(i);
                                break;
                            }
                        }
                    }
                }
            }
        }
        return res;
    },
    buildShanty: function(board){
        var roads = board.findBuilding(null,"road",null);
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
        board.at(index).setBuilding(Building.createNew({name:"shantyTown",level:1,startingTurn:0,people:0}));
        return index;
    },
    // to next turn
    nextTurn: function(b,turn){
        // DFS call nextTurn
        var stack=[b];
        while(stack.length>0){
            var node=stack.pop();
            if(node.nextTurn && node!==b)
                node.nextTurn(turn);
            for(var i=0;i<node.children.length;i++){
                stack.push(node.children[i]);
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
        console.log(b.at(i).getBuilding().effects);
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
        var oldX=b.x;
        var oldY=b.y;
        b.x=(screenCenter.x-center_i.x);
        b.y=(screenCenter.y-center_i.y);
        b._offset.x+=oldX-b.x;
        b._offset.y+=oldY-b.y;

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
};
