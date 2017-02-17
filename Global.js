// singleton
var Global={
	freedom: 0,
    unrest: 0,
    money: 30,

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
    },
    // Finds the current Freedom value by averaging the health and education of all low people
    updateFreedomUnrest: function(){
        var freeAv = 0;
        var unrestAv = 0;
        var pop = MainGame.population.lowList();
        
        for(var person in pop){
            freeAv += person.freedom;
            unrestAv += person.unrest;
        }
        freeAv = freeAv/pop.length;
        unrestAv = unrestAv/pop.length;

        Global.freedom = freeAv + MainGame.board.getBuilding(null,"road").length;
        Global.unrest = unrestAv;
    },
};
