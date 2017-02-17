// require: MainGame.game !== null
var Tile={
    // create from JSON. json MUST be a string to prevent the ref issue.
    fromJSON: function(json){
        // create the tile
        /*global MainGame*/
        var tile=MainGame.game.make.group();
        // decode json
        var data=JSON.parse(json);

        // Class members
        tile.terrain=tile.create(0,0,data.terrain);
        tile.res=tile.create(0,0,data.res);
        tile.influence={freedom:0,unrest:0};
        /* global Building*/
        tile.building=Building.createNew(data.building);
        tile.addChild(tile.building);

        // Class funcs
        tile.getTerrain=function(){return tile.terrain};
        tile.getRes=function(){return tile.res};
        tile.hasBuilding=function(){return tile.building && !tile.building.isEmpty()};
        tile.getBuilding=function(){return tile.building};
        tile.setBuilding=function(building){Tile.setBuilding(tile,building)};

        return tile;
    },
    toJSON: function(t){
        var data={terrain:t.terrain.key, res:t.res.key, building:JSON.parse(t.building.toJSON())};
        return JSON.stringify(data);
    },
    setBuilding: function(tile, building){
        if(tile.building===building){
            return;
        }
        if(tile.building){
            tile.removeChild(tile.building);
            tile.building=null;
        }
        tile.building=building;
        tile.addChild(building);
    },
};

// Board as turnSystem
var Board={
    // create from JSON. json MUST be a string to prevent the ref issue.
    fromJSON: function(json){
        // create the board
        var board=MainGame.game.add.group();
        // decode JSON
        var data=JSON.parse(json);

        // Class vars
        board.gridWidth=data.gridWidth;
        board.gridHeight=data.gridHeight;
        board.tileWidth=data.tileWidth;
        board.currentScale=1.0;

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
        // returns the rect of i
        board.rectOf=function(i,scale){return Board.rectOf(board,i,scale)};
        // returns the index of (x,y); nullable
        board.hitTest=function(px,py){return Board.hitTest(board,px,py)};
        // returns the step distance between i and j
        board.distanceOf=function(i,j){return Board.distanceOf(board,i,j)};
        // returns whether i is connected with j
        board.hasRoadConnect=function(i,j){return Board.hasRoadConnect(board,i,j)};
        // returns all the *indice* of the terrain type
        board.findTerrain=function(type){return Board.findTerrain(board,type)};
        // returns all the *indice* of the res type
        board.findRes=function(type){return Board.findRes(board,type)};
        // returns all the *indice* of the building type(nullable)/subtype(nullable)
        board.findBuilding=function(type,subtype){return Board.findBuilding(board,type,subtype)};
        //build new shanty town next to a random road tile
        board.buildShanty=function(){board};
        // go to next turn
        board.nextTurn=function(){return Board.nextTurn(board)};
        // // returns an array of tiles that have one type of building on them
        // // returns the index of the given building's tile
         // board.indexOfBuilding=function(building){return Board.indexOfBuilding(board,building)};        
         // board.getAllOfSubtype=function(buildingSubtype){return Board.getAllOfSubtype(board,buildingSubtype)};

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

        return board;
    },
    // save to JSON
    toJSON: function(b){
        var tiles=[];
        var data={gridWidth:b.gridWidth, gridHeight:b.gridHeight, tileWidth:b.tileWidth, tiles:tiles};
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
        var ph=pw*1.732/2.0;
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
    hitTest: function(b,px,py){
        var N=b.gridWidth*b.gridHeight;
        for(var i=0;i<N;i++){
            var r=b.rectOf(i,b.currentScale);
            if(px>r.x && px<r.x+r.w && py>r.y && py<r.y+r.h)
                return i;
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
            if(b.at(i).getTerrain()===type)
                res.push(i);
        return res;
    },
    findRes: function(b,type){
        var res=[];
        var N=b.tileCount();
        for(var i=0;i<N;i++)
            if(b.at(i).getRes()===type)
                res.push(i);
        return res;
    },
    findBuilding: function(b,type,subtype){
        var res=[];
        var N=b.tileCount();
        for(var i=0;i<N;i++){
            var bld=b.at(i).getBuilding;
            if((bld.type===type || !type) && (bld.subtype===subtype || !subtype)){
                res.push(i);
            }
        }
        return res;
    },
    buildShanty: function(board){
      var roads = board.findBuilding(null,"road");
      var choices = [];
      
      for(var i = 0; i < roads.length; i += 1){
          var check = board.allAdjacent(board,i,1);
          for(var j = 0; j < check.length; j += 1){
              if(!board.at(j).hasBuilding()){
                  for(var k = 0; k < choices.length; k += 1){
                      if(j === choices[k]){
                          j = null;
                          break;
                      }
                  }
                  
                  if(j!==null){   choices.push(j);  }
              }
          }
      }
      
      var index = choices[Math.floor(Math.random()*choices.length)];
      board.at(index).setBuilding(Building.createNew({name:"shanty",level:1,startingTurn:0,people:0}));
      return index;
    },
    // to next turn
    nextTurn: function(b){
        // DFS call nextTurn
        var stack=[b];
        while(stack.length>0){
            var node=stack.pop();
            if(node.nextTurn && node!==b) node.nextTurn();
            for(var i=0;i<node.children.length;i++){
                stack.push(node.children[i]);
            }
        }
    },
};
