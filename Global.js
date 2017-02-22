// singleton
var Global={
    turn: 1,
	freedom: 0,
    unrest: 0,
    money: 30,
    moneyPerTurn: 0,

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
        // /*global MainGame*/
        // var N=MainGame.board.gridWidth*MainGame.board.gridHeight;
        // for(var i=0;i<N;++i){
        //     var tile=MainGame.board.at(i);
        //     var bld=tile.getBuilding();
        //     if(bld && !bld.isEmpty()){
        //         bld.nextTurn(Global.turn);

        //         for(var out=0;out<bld.effects.length;++out){
        //             var effect = bld.effects[out];
        //             if(effect.type==="money"){
        //                 Global.money += effect.outputTable[bld.people];
        //             }
        //         }
        //         var outputCount=bld.outputCount;
        //         for(var out=0;out<outputCount;++out){
        //             var outputType=bld.outputTypes[out];
        //             var outputTable=bld.outputTables[out];
        //             console.assert(this.hasOwnProperty(outputType));
        //             console.assert(typeof this[outputType] !== "function");
        //             this[outputType]+=outputTable[bld.people];
        //             console.log("[Global] nextTurn: add "+outputTable[bld.people]+" to "+outputType+", and now is:"+this[outputType]);
        //         }
        //     }
        // }

        /*globabl updatePopulation*/
        updatePopulation(true,true);
        Global.money+=Global.moneyPerTurn;
        Global.updateFreedomUnrest();
    },

    toString: function(){
        var string = "Freedom: "+this.freedom+"%  Unrest: "+this.unrest+"%  $="+this.money+"K (";
        if(this.moneyPerTurn >= 0){string += "+"+this.moneyPerTurn+"K/turn)";}
        else{string += "-"+this.moneyPerTurn+"/turn)"};
        return string
    },
    // Finds the current Freedom value by averaging the health and education of all low people
    updateFreedomUnrest: function(){
        var freeAv = 0;
        var unrestAv = 0;
        /*global MainGame*/
        var lowList = MainGame.population.lowList();
        
        for(var index=0;index<lowList.length;++index){
            //console.log("Person of type "+lowList[index].type+" living at "+lowList[index].home+" - Freedom: "+lowList[index].freedom+" - Unrest: "+lowList[index].unrest);
            freeAv += lowList[index].freedom;
            unrestAv += lowList[index].unrest;
        }
        //console.log("freeTotal: "+freeAv+" unrestTotal: "+unrestAv+" low people: "+lowList.length);
        freeAv = Math.round(freeAv/lowList.length,0);
        unrestAv = Math.round(unrestAv/lowList.length,0);

        console.log(MainGame.board.findBuilding(null,"road",null).length);
        Global.freedom = Phaser.Math.clamp(freeAv + MainGame.board.findBuilding(null,"road",null).length,0,100);
        Global.unrest = Phaser.Math.clamp(unrestAv + MainGame.population.findNotEmployed().length,0,100);
    },
    updateMoneyPerTurn: function(){
        var totalIncome = 0;
        /*global MainGame*/
        var buildings = MainGame.board.findBuilding(null,null,"money");

        for(var bldIndex=0;bldIndex<buildings.length;++bldIndex){
            var building = MainGame.board.at(buildings[bldIndex]).building;
            var effectList = building.effects;
            for(var effIndex=0;effIndex<effectList.length;++effIndex){
                if(effectList[effIndex].type==="money"){
                    console.log("Building: "+building.name+" people: "+building.people+" output: "+effectList[effIndex].outputTable[building.people]);
                    totalIncome+=effectList[effIndex].outputTable[building.people];
                }
            }
        }

        Global.moneyPerTurn = totalIncome;
    },
};
