// singleton
var Global={
    turn: 1,
	freedom: 0,
    unrest: 0,
    money: 30,

    // calcAvgEducation: function(){

    // },
    // calcAvgHealth: function(){

    // },
    // calcAvgShelter: function(){

    // },
    // calcAvgSalary: function(){

    // },

    // calcOvrIncome: function(){

    // },

    nextTurn: function(){
        ++Global.turn;
        /*global MainGame*/
        var N=MainGame.board.gridWidth*MainGame.board.gridHeight;
        for(var i=0;i<N;++i){
            var tile=MainGame.board.at(i);
            var bld=tile.getBuilding();
            if(bld && !bld.isEmpty()){
                bld.nextTurn(Global.turn);

                for(var out=0;out<bld.effects.length;++out){
                    var effect = bld.effects[out];
                    if(effect.type==="money"){
                        Global.money += effect.outputTable[bld.people];
                    }
                }
                // var outputCount=bld.outputCount;
                // for(var out=0;out<outputCount;++out){
                //     var outputType=bld.outputTypes[out];
                //     var outputTable=bld.outputTables[out];
                //     console.assert(this.hasOwnProperty(outputType));
                //     console.assert(typeof this[outputType] !== "function");
                //     this[outputType]+=outputTable[bld.people];
                //     console.log("[Global] nextTurn: add "+outputTable[bld.people]+" to "+outputType+", and now is:"+this[outputType]);
                // }
            }
        }

        /*globabl updatePopulation*/
        updatePopulation(true,true);

        Global.updateFreedomUnrest();
    },

    toString: function(){
        return "Freedom:"+this.freedom+"   Unrest:"+this.unrest+"   $="+this.money+"K";
    },
    // Finds the current Freedom value by averaging the health and education of all low people
    updateFreedomUnrest: function(){
        var freeAv = 0;
        var unrestAv = 0;
        /*global MainGame*/
        var lowList = MainGame.population.lowList();
        
        for(var index=0;index<lowList.length;++index){
            console.log("Person of type "+lowList[index].type+" living at "+lowList[index].home+" - Freedom: "+lowList[index].freedom+" - Unrest: "+lowList[index].unrest);
            freeAv += lowList[index].freedom;
            unrestAv += lowList[index].unrest;
        }
        console.log("freeTotal: "+freeAv+" unrestTotal: "+unrestAv+" low people: "+lowList.length);
        freeAv = Math.round(freeAv/lowList.length,0);
        unrestAv = Math.round(unrestAv/lowList.length,0);
        console.log(MainGame.board.findBuilding(null,"road",null).length);
        Global.freedom = freeAv + MainGame.board.findBuilding(null,"road",null).length;
        Global.unrest = unrestAv + MainGame.population.findNotEmployed().length;
    },
};
