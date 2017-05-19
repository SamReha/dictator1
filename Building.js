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

        if (b.name === 'armyBase') {
            b.squad =  null;
            b.squadDeployed = false;
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
        if (b.startingTurn===turn && b.constructionIcon) {
            b.tint = 0xffffff;
            b.constructionIcon.destroy();
            b.counterIcon.destroy();
        }else if(b.startingTurn>turn){
            b.counterIcon.loadTexture("counter_icon"+(b.startingTurn-MainGame.global.turn));
        }
    },
};