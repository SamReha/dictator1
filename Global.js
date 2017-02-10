// singleton
var Global={
	freedom: 10,
    unrest: 20,
    money: 10,
    education: 0,

    calcAvgEducation: function(){

    },
    calcAvgHealth: function(){

    },
    calcAvgShelter: function(){

    },
    calcAvgSalary: function(){

    },

    calcOvrIncome: function(){

    },

    nextTurn: function(){
        /*global MainGame*/
        var N=MainGame.board.gridWidth*MainGame.board.gridHeight;
        for(var i=0;i<N;i++){
            var tile=MainGame.board.at(i);
            var bld=tile.getBuilding();
            if(bld && !bld.isEmpty()){
                var outputCount=bld.outputCount;
                for(var out=0;out<outputCount;out++){
                    var outputType=bld.outputTypes[out];
                    var outputTable=bld.outputTables[out];
                    console.assert(this.hasOwnProperty(outputType));
                    console.assert(typeof this[outputType] !== "function");
                    this[outputType]+=outputTable[bld.people];
                    console.log("[Global] nextTurn: add "+outputTable[bld.people]+" to "+outputType+", and now is:"+this[outputType]);
                }
            }
        }
    },

    toString: function(){
        return "Freedom:"+this.freedom+" Unrest:"+this.unrest+" $="+this.money;
    }
};
