// singleton
var Global={
    turn: 1,
	freedom: 0,
    unrest: 0,
    money: 30,
    moneyPerTurn: 0,
    thermometerFill: 0,
    thermometerDelta: 0,

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
        Global.money += Global.moneyPerTurn;
        Global.updateFreedomUnrest();
        Global.updateThermometer();
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

        // console.log(MainGame.board.findBuilding(null,null,"road",null).length);
        Global.freedom = Phaser.Math.clamp(freeAv + MainGame.board.findBuilding(null,null,"road",null).length,0,100);
        Global.unrest = Phaser.Math.clamp(unrestAv + MainGame.population.findNotEmployed().length + MainGame.population.findNotHoused().length,0,100);
    },

    // Updates thermometer data. In general, should be called AFTER updateFreedomUnrest()
    updateThermometer: function() {
        // Get new delta (how much the thermometer will change by this turn)
        this.thermometerDelta = this.freedom + this.unrest - 100;

        // Apply delta
        this.thermometerFill = Phaser.Math.clamp(this.thermometerFill + this.thermometerDelta, 0, 100); ;

        // Check if unit spawn
        if (this.thermometerFill >= 100) {
            this.thermometerFill = 50;

            // Compute angriest citizen
            var workingClass = MainGame.population.lowList();
            workingClass.sort(function(a, b) {
                return b.unrest - a.unrest;
            });
            var citizenToRiot = workingClass[0];
        
            // Figure out where they live and work, so that we'll be ready to make them a rioter
            var homeIndex = citizenToRiot.home;
            var homeTile = MainGame.board.at(homeIndex);
            var homeBuilding = homeTile.getBuilding();

            // Figure out what (if any) tile to spawn this rioter on.
            var spawnIndex = -1;
            if (!homeTile.hasUnit()) {
                spawnIndex = homeIndex;
            }

            // If we got an index, then spawn a rioter (otherwise, board is completely full and we can assume the player is in enough trouble as is)
            if (spawnIndex !== -1) {
                // Remove them from their home
                homeBuilding.removePerson();
                citizenToRiot.home = null;

                // Remove them from their workplace
                var workIndex = citizenToRiot.workplace;
                if (workIndex !== null) {
                    var workPlace = MainGame.board.at(workIndex).getBuilding();
                    workPlace.removePerson();
                    citizenToRiot.work = null;
                }

                // Place them on the board
                var spawnTile = MainGame.board.at(spawnIndex);
                Unit.loadUnitData();
                spawnTile.unit = Unit.createNew(Unit.unitData['rioter'], spawnIndex, citizenToRiot.name);
                spawnTile.addChild(spawnTile.unit);
            } else console.log('[Global] Failed to spawn unit');
        }
    },

    updateMoneyPerTurn: function(){
        var totalIncome = 0;
        /*global MainGame*/
        var buildings = MainGame.board.findBuilding(null,null,null,"money");

        for (var bldIndex = 0; bldIndex < buildings.length; ++bldIndex) {
            var building = MainGame.board.at(buildings[bldIndex]).building;
            var effectList = building.effects;
            for (var effIndex = 0; effIndex < effectList.length; ++effIndex) {
                if (effectList[effIndex].type === "money") {
                    // console.log("Building: "+building.name+" people: "+building.people+" output: "+effectList[effIndex].outputTable[building.people]);
                    totalIncome += effectList[effIndex].outputTable[building.people];
                }
            }
        }

        Global.moneyPerTurn = totalIncome;
    },
};
