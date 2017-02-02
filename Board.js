// require: MainGame.game !== null
var Tile={
    createNew: function(name,terrainTexture,resTexture){
        /*global MainGame*/
        var t=MainGame.game.add.group();
        Tile.init(t,terrainTexture,resTexture);
        
        // Class vars
        t.name=name;
        
        // Class funcs
        t.getBuilding=function(){return t.building};
        t.setBuilding=function(building){Tile.setBuilding(t,building)};
        
        return t;
    },
    init: function(t, terrainTexture, resTexture){
        // add terrain
        t.terrain=MainGame.game.add.sprite(0,0,terrainTexture);
        t.addChild(t.terrain);
        
        // add resource
        if(resTexture){
            t.res=MainGame.game.add.sprite(0,0,resTexture);
            t.addChild(t.res);
        }else{
            t.res=null;
        }
        
        // add building
        t.building=null;
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
    // init func
    createNew: function(w,h,pw,terrain,res,building){
        // board is a group
        var board=MainGame.game.add.group();
        // Class vars
        board.game=MainGame.game;
        board.width=w;
        board.height=h;
        
        // Class funcs
        // returns the tile sprite at [i]
        board.at=function(i){return Board.at(board,i);};
        // returns the adjacent index at clock direction [cd] of tile [i]
        board.adjacent=function(i,cd,warning){return Board.adjacent(board,i,cd,warning);};
        // returns all adjacent indice within [N] steps of tile [i]
        board.allAdjacent=function(i,N){return Board.allAdjacent(board,i,N);};
        // returns the (x,y) of i
        board.xyOf=function(i){return Board.xyOf(board,i);};
        // returns the step distance between i and j
        board.distanceOf=function(i,j){return Board.distanceOf(board,i,j);};
        
        // init
        var N=w*h;
        var ph=pw*(1.732/2.0);
        for(var i=0;i<N;i++){
            var ix=i%w;
            var iy=Math.floor(i/w);
            var x=pw*0.75*ix;
            var y=ph*iy;
            if(ix%2===1){
                y+=ph*0.5;
            }
            // create the tile group
            
            // create map table
            var terrainTable=[null, 'coast', 'desert', 'grass', 'mountain', 'water'];
            var resTable=[null, 'forest', 'oil'];
            
            // create terrain, res and building
            var terrainIndex=parseInt(terrain[i],10);
            var resIndex=parseInt(res[i],10);

            var oneTile=Tile.createNew("tile("+x+","+y+")", terrainTable[terrainIndex], resTable[resIndex]);
            oneTile.x=x;
            oneTile.y=y;
            board.addChild(oneTile);
        }
        return board;
    },

    // returns the tile sprite at [i]
    at: function(b,i){
        return b.children[i];
    },
    // returns the adjacent index at clock direction [cd] of tile [i]
    adjacent: function(b,i,cd,warning){
        var w=b.width, h=b.height;
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
        var newIndex=(x%2===0?i+adj_even[cd]:i+adj_odd[cd])
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
        var w=b.width;
        return {x:i%w, y:Math.floor(i/w)};
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
};
