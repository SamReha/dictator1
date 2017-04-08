//Class and subclasses for all types of buildings

//Top Level, Abstract class
var Building = {
    buildingData: null,
    loadBuildingData: function(){
        if(Building.buildingData===null){
            console.log("[Building] loading building data...");
            Building.buildingData=MainGame.game.cache.getJSON('buildingData');
            console.log("[Building] OK.");
        }
    },
    createNew: function(data){
        //console.log("[Building] createNew, the building's textureKey must be name+level.");

        // load building data (first time only)
        Building.loadBuildingData();

        var b=null;

        // Class vars: name, level, startingTurn, people, {props_in_buildingData.json[name]}
        if(!data){
            b=MainGame.game.make.sprite(0,0);
            b.name=null;
        }else{
            /*global MainGame*/
            b=MainGame.game.make.sprite(0,0,data.name+data.level);

            // copy name,level,startingTurn,people
            for(var key in data){
                b[key]=data[key];
            }
            // copy props in buildingData.json[name]
            var b_data=Building.buildingData[data.name];
            for(var key2 in b_data){
                b[key2]=b_data[key2];
            }

            // Set detail icon texture string
            b.detailIconTexture = b.name + '_detail';
            //console.log(b.name);
        }

        b.health = 10;

        // Class funcs
        b.isEmpty=function(){return b.name===null};
        b.addPerson=function(){return Building.addPerson(b)};
        b.removePerson=function(){return Building.removePerson(b)};
        b.nextTurn=function(turn){return Building.nextTurn(b,turn)};

        return b;
    },
    
    addPerson: function(b) {
        if(b.people < b.maxPeople){
            b.people += 1;
            return true;
        }
        else{   return false;   }
    },
    
    removePerson: function(b) {
        if(b.people > 0){
            b.people -= 1;
            return true;
        }
        else{   return false;   }
    },

    nextTurn: function(b,turn){
        if(b.startingTurn===turn){
            b.tint = 0xffffff;
            b.constructionIcon.destroy();
            b.counterIcon.destroy();
        }else if(b.startingTurn>turn){
            b.counterIcon.loadTexture("counter_icon"+(b.startingTurn-MainGame.global.turn));
        }
    },
};

//Second Level
// var Road = {
//     createNew: function(startingTurn){
//         var road = Building.createNew("road", 0, 2, "road");
//         return road;
//     },
// }

// var Housing = {
//     createNew: function(aMaxOccupants, aMaxShelter, aStartingTurn, aCost, textureKey){
//         var housing = Building.createNew("bureaucratic", aStartingTurn, aCost, textureKey);
        
//         housing.numOccupants = 0;
//         housing.maxOccupants = aMaxOccupants;
//         housing.quality = null;
//         housing.costToRepair = null;
//         housing.starving = false;
//         housing.healthCenters = null;
//         housing.eduCenters = null;
//         housing.maxShelter = aMaxShelter;
//         housing.health = null;
//         housing.edu = null;
//         housing.shelter = null;

//         return housing;
//     },
// }

// var Health = {
//         createNew: function(aMaxWorkers, aMaxHealth, aStartingTurn, aCost, textureKey){
//         var health = Building.createNew("bureaucratic", aStartingTurn, aCost, textureKey);
        
//         health.numWorkers = 0;
//         health.maxWorkers = aMaxWorkers;
//         health.maxHealth = aMaxHealth;
//         health.healthMade = null;
        
//         return health;
//     },
// }

// var Education = {
//         createNew: function(aMaxWorkers, aMaxEdu, aStartingTurn, aCost, textureKey){
//         var education = Building.createNew("bureaucratic", aStartingTurn, aCost, textureKey);
        
//         education.numWorkers = 0;
//         education.maxWorkers = aMaxWorkers;
//         education.maxEdu = aMaxEdu;
//         education.eduMade = null;
        
//         return education;
//     },
// }

// var Resources = {
//         createNew: function(aMaxWorkers, aMaxProfit, aStartingTurn, aCost, textureKey){
//         var resources = Building.createNew(aStartingTurn, aCost, textureKey);
        
//         resources.numWorkers = 0;
//         resources.maxWorkers = aMaxWorkers;
//         resources.maxProfit = aMaxProfit;
//         resources.profit = null;
        
//         return resources;
//     },
// }

// var Millitary = {
//         createNew: function(aMaxWorkers, aMaxAntiFree, aStartingTurn, aCost, textureKey){
//         var millitary = Building.createNew(aStartingTurn, aCost, textureKey);
        
//         millitary.numWorkers = 0;
//         millitary.maxWorkers = aMaxWorkers;
//         millitary.maxAntiFree = aMaxAntiFree;
//         millitary.antiFreedom = null;
        
//         return millitary;
//     },
// }

// //Third Level
// var ShantyTown = {
//     createNew: function(textureKey){
//         var shantyTown = Housing.createNew(5, 10, 0, 0, "shanties");
        
//         return shantyTown;
//     },
// }

// var Apartment = {
//     createNew: function(textureKey){
//         var apartment = Housing.createNew(10, 50, 0, 10, "apartments");
        
//         apartment.residents = null;
        
//         apartment.school=false;

//         return apartment;
//     },

// }

// var Mansion = {
//     createNew: function(textureKey){
//         var mansion = Housing.createNew(1, 100, 0, 10, "mansion");
        
//         mansion.resident = null;
        
//         return mansion;
//     },
// }

// var Palace = {
//     createNew: function(aResident, textureKey){
//         var palace = Housing.createNew(1, 100, 0, 50, "palace");
        
//         palace.resident = aResident;

//         return palace;
//     },
// }

// var FertileFarm = {
//     createNew: function(textureKey){
//         var fertileFarm = Health.createNew(2, 50, 0, 10, "fertileFarm");
        
//         return fertileFarm;
//     },
// }

// var WeakFarm = {
//     createNew: function(textureKey){
//       var weakFarm = Health.createNew(2, 25, 0, 10, "weakFarm");
      
//       return weakFarm;
//     },
// }

// var School = {
//     createNew: function(textureKey){
//         var school = Education.createNew(5, 50, 0, 15, "school");
        
//         return school;
//     },
// }

// var Lumberyard = {
//     createNew: function(textureKey){
//         var lumberyard = Resources.createNew(5, 15, 0, 30, "lumberYard");
        
//         return lumberyard;
//     },
// }

// var ArmyBase = {
//     createNew: function(textureKey){
//         var armyBase = Millitary.createNew(5, 10, 0, 30, "armyBase");
        
//         armyBase.deployed = false;
//         armyBase.activeCost = 0;

//         return armyBase;
//     },
// }