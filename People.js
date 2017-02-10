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
        var housing=MainGame.board.getAllOfSubtype("housing");
        for(var i = 0; i <= housing.length; i += 1){
            for(var j = i+1; j < housing.length; j += 1){
                if(housing[j].shelter>housing[i].shelter){
                    var temp = housing[i];
                    housing[i]=housing[j];
                    housing[j]=temp;
                }
            }
        }
        for(var house in housing){
            if(house.people < house.maxPeople){
                house.people += 1;
                
            }
        }
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
        pop.nextTurn=function(){Population.nextTurn(pop)};
        pop.count=function(){return pop.length};        // Class func: inline style
        pop.report=function(){Population.report(pop)};  // Class func: Declaration
        pop.increasePopulation=function(amount){Population.increasePopulation(pop,amount)};
        pop.hire=function(tileIndex,buildingType){Population.hire(pop,tileIndex,buildingType)};
        pop.fire=function(tileIndex,buildingType){Population.fire(pop,tileIndex,buildingType)};
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
        }
    },
    
    hire: function(pop,tileIndex,buildingType){
        
    },
    
    fire: function(pop,tileIndex,buildingType){
        
    }
};