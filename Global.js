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
        /*global MainGame*/
        MainGame.board.nextTurn(Global.turn);

        /*globabl updatePopulation*/
        updatePopulation(true,true);
        Global.money+=Global.moneyPerTurn;
        Global.updateFreedomUnrest();
    },

    toString: function(){
        var string = "Freedom: "+this.freedom+"%  Unrest: "+this.unrest+"%  T="+this.money+" (";
        if(this.moneyPerTurn >= 0){string += "+"+this.moneyPerTurn+"/turn)";}
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
            // =================================================================
            // change later when influential members are a thing
            if(lowList[index].health>=50 && lowList[index].education>=50 && lowList[index].shelter>=50)
                continue;
            // ===================================================================
            //console.log("Person of type "+lowList[index].type+" living at "+lowList[index].home+" - Freedom: "+lowList[index].freedom+" - Unrest: "+lowList[index].unrest);
            freeAv += lowList[index].freedom;
            unrestAv += lowList[index].unrest;
        }
        //console.log("freeTotal: "+freeAv+" unrestTotal: "+unrestAv+" low people: "+lowList.length);
        freeAv = Math.round(freeAv/lowList.length,0);
        unrestAv = Math.round(unrestAv/lowList.length,0);

        // console.log(MainGame.board.findBuilding(null,"road",null).length);
        Global.freedom = Phaser.Math.clamp(freeAv + MainGame.board.findBuilding(null,"road",null).length,0,100);
        Global.unrest = Phaser.Math.clamp(unrestAv + MainGame.population.findNotEmployed().length + MainGame.population.findNotHoused().length,0,100);
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
                    // console.log("Building: "+building.name+" people: "+building.people+" output: "+effectList[effIndex].outputTable[building.people]);
                    totalIncome+=effectList[effIndex].outputTable[building.people];
                }
            }
        }

        Global.moneyPerTurn = totalIncome;
    },
};
