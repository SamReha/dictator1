// We assume that we have a separate class for People

// Basic class for all people
var Person={
    // Static vars
    Low: 0,
    Mid: 1,
    Hi: 2,
    
    // the create function
    createNew: function(data){  // data is a Table
        console.log("[People] created.");
        var p={};
        
        // Class vars
        p.type=data.type;               // must be one of Person.types
        p.name=data.name;               // nullable
        p.portIndex=data.portIndex;     // nullable
        p.workplace=null;
        p.home=null;
        p.health=0;
        p.education=0;
        p.shelter=0;
        if(p.type>=1){
            p.influence=0;
            p.role=0;
        }
        else{
            p.influence=null;
            p.role=null;
        }
        if(p.type===2)
        {   p.loyalty=0;    }
        else
        {   p.loyalty=null; }

        // Class funcs
        p.isLow=function(){return p.type===0};  // Class func: inline style
        p.isMid=function(){return p.type===1};  // Class func: inline style
        p.isHi=function(){return p.type===2};   // Class func: inline style
        p.nextTurn=function(){};
        p.report=function(){Person.report(p)};  // Class func: Declaration
        p.findHousing=function(){Person.findHousing(p)};
        // TODO: add other funcs

        return p;
    },

    // Class func: Implementation
    report: function(p){
        console.log("[Person] type="+p.type+", name="+p.name);
        // TODO: add other infomation that needs to show
    },
    
    /*global MainGame*/
    findHousing: function(p){
        /*global MainGame*/
        var housingIndice=MainGame.board.findBuilding(null,"housing");
        console.log("housingIndice"+ housingIndice);

        for(var i=0;i<housingIndice.length;i++){
            var bld=MainGame.board.at(i);
            if(bld.people<bld.maxPeople){
                p.home=i;
                p.health=bld.health;
                p.education=bld.education;
                p.shelter=bld.shelter;
                return true;
            }
        }
        return false;
    },
};

// Contains all the literal information (string/number/bool vars) of all people
var Population={
    // please see stage1.json: it will be created by stage1.population table.
    createNew: function(data){  // data is an Array
        console.log("[Population] created with count:"+data.length);
        console.assert(Array.isArray(data), "[Population] data must be an Array!");
        var pop={};

        // Class vars
        pop.total;
        pop.unemployed;
        pop.homeless;
        pop.lowList=[];
        pop.midList=[];
        pop.highList=[];

        // Class funcs
        pop.nextTurn=function(){return Population.nextTurn(pop)};
        pop.count=function(){return pop.lowList.length+pop.midList.length+pop.highList.length};        // Class func: inline style
        pop.report=function(){return Population.report(pop)};  // Class func: Declaration
        pop.increasePopulation=function(amount){return Population.increasePopulation(pop,amount)};
        pop.hire=function(tileIndex,buildingType){return Population.hire(pop,tileIndex,buildingType)};
        pop.fire=function(tileIndex,buildingType){return Population.fire(pop,tileIndex,buildingType)};
        // TODO: add other funcs

        return pop;
    },

    // Class func: Implementation
    nextTurn: function(pop){
        for(var p in pop.lowList){
            p.nextTurn();
        }
        for(var p in pop.midList){
            p.nextTurn();
        }
        for(var p in pop.highList){
            p.nextTurn();
        }
        /*global MainGame*/
        pop.increasePopulation(MainGame.game.rnd.integer()%3+1);
    },
    
    report: function(pop){
        console.log("[Population] now reporting-------");
        for(var i=0;i<pop.length;i++){
            pop[i].report();
        }
        // TODO: add other information that needs to show
        console.log("[Population] end of report.");
    },
    
    increasePopulation: function(pop,amount){
        for(var i = 1; i < amount; i += 1){
            var per=Person.createNew({"type":0});
            pop.lowList.push(per);
            if(!per.findHousing()){
                pop.homeless += 1;
            }
            pop.unemployed += 1;
        }
    },
    
    /*global MainGame*/
    hire: function(pop,tileIndex,buildingType){
        var employmentLine = [];
        for(var per in pop.lowList){
            if(per.workplace===null){
                if(MainGame.board.hasRoadConnect(per.home,tileIndex)){
                    employmentLine.push(per);
                }
            }
        }
        if(employmentLine.length > 0){
            employmentLine[MainGame.game.rnd.integer()%employmentLine.length].workplace=tileIndex;
            MainGame.board.children[tileIndex].building.people += 1;
            pop.unemployed -= 1;
            return 1;
        }
        else{
            return 0;
        }
    },
    
    /*global MainGame*/
    fire: function(pop,tileIndex,buildingType){
        var workers = [];
        for(var per in pop.lowList){
            if(per.workplace===tileIndex){
                workers.push(per);
            }
        }
        if(workers.length > 0){
            workers[MainGame.game.rnd.integer()%workers.length].workplace=null;
            MainGame.board.children[tileIndex].building.people -= 1;
            pop.unemployed += 1;
            return 1;
        }
        else{
            return 0;
        }
    }
};