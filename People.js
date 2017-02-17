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
        p.workplace=null;               // nullable, index of the tile
        p.home=null;                    // nullable, index of the tile
        p.health=0;         // int
        p.education=0;      // int
        p.shelter=0;        // int
        p.freedom=0;        // int
        p.unrest=0;         // int
        // Class vars (nullable)
        p.influence=(p.type>=Person.Mid?0:null);
        p.role=(p.type>=Person.Mid?0:null);
        p.loyalty=(p.type>=Person.Hi?0:null);

        // Class funcs
        p.nextTurn=function(board){return Person.nextTurn(p,board)};
        p.report=function(){return Person.report(p)};  // Class func: Declaration
        // p.findHousing=function(){return Person.findHousing(p)};
        p.updateFreeUn=function(board){return Person.updateFreeUn(p,board)};

        return p;
    },

    // Class func: Implementation
    nextTurn: function(p,board){
        // TODO
        if(p.type===Person.Low){
            p.updateFreeUn(board);
        }
    },
    
    report: function(p){
        console.log("[Person] type="+p.type+", name="+p.name);
        // TODO: add other infomation that needs to show
    },
    
    // /*global MainGame*/
    // findHousing: function(p){
    //     /*global MainGame*/
    //     var housingIndice=MainGame.board.findBuilding(null,"housing");
    //     console.log("housingIndice"+ housingIndice);

    //     for(var i=0;i<housingIndice.length;i++){
    //         var bld=MainGame.board.at(i);
    //         // found a good place
    //         if(bld.people<bld.maxPeople){
    //             p.home=i;
    //             p.health=bld.health;
    //             p.education=bld.education;
    //             p.shelter=bld.shelter;
    //             bld.people++;
    //             return true;
    //         }
    //     }
    //     return false;
    // },
    
    updateFreeUn: function(p,board){
      p.freedom = Math.min(p.health,50) + Math.min(p.education,50) + board.at(p.home).influence.freedom;
      p.unrest = Math.max(50-p.health,0) + Math.max(50-p.shelter,0) + board.at(p.home).influence.unrest;
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
        pop.lowList=[];
        pop.midList=[];
        pop.highList=[];

        // Class funcs
        pop.nextTurn=function(){return Population.nextTurn(pop)};
        pop.count=function(){return pop.lowList.length+pop.midList.length+pop.highList.length};
        pop.report=function(){return Population.report(pop)};  // Class func: Declaration
        pop.increase=function(amount){return Population.increase(pop,amount)};
        pop.hire=function(tileIndex,buildingType){return Population.hire(pop,tileIndex,buildingType)};
        pop.fire=function(tileIndex,buildingType){return Population.fire(pop,tileIndex,buildingType)};
        // returns the indice of housed/not housed people in lowList
        pop.findHoused=function(){return Population.findHousingStatus(pop,true)};
        pop.findNotHoused=function(){return Population.findHousingStatus(pop,false)};
        // returns the indice of employed/not employed people in lowList
        pop.findEmployed=function(){return Population.findEmployStatus(pop,true)};
        pop.findNotEmployed=function(){return Population.findEmployStatus(pop,false)};
        // returns the string representation
        pop.toString=function(){return Population.toString(pop)};

        // TODO: add other funcs

        // load the JSON data
        Population.init(pop,data);

        return pop;
    },
    init: function(pop,data){
        console.assert(Array.isArray(data));
        for(var i=0;i<data.length;i++){
            if(data[i].type===Person.Low){
                pop.lowList.push(Person.createNew(data[i]));
            }else if(data[i].type===Person.Mid){
                pop.midList.push(Person.createNew(data[i]));
            }else{
                pop.highList.push(Person.createNew(data[i]));
            }
        }
    },

    // Class func: Implementation
    nextTurn: function(pop){
        /*global MainGame*/
        var board = MainGame.board;
        for(var p in pop.lowList){
            p.nextTurn(board);
        }
        for(var p in pop.midList){
            p.nextTurn(board);
        }
        for(var p in pop.highList){
            p.nextTurn(board);
        }
        pop.increase(Math.floor(Math.random()*3)+1);
    },
    
    report: function(pop){
        console.log("[Population] now reporting-------");
        for(var i=0;i<pop.length;i++){
            pop[i].report();
        }
        // TODO: add other information that needs to show
        console.log("[Population] end of report.");
    },
    
    increase: function(pop,amount){
        for(var i = 1; i < amount; i += 1){
            var per=Person.createNew({"type":0});
            pop.lowList.push(per);
        }
    },
    
    hire: function(pop,tileIndex){
        /*global MainGame*/
        var bld=MainGame.board.at(tileIndex).getBuilding();
        console.assert(bld);
        // set home for person
        if(bld.name==="apartment"){
            var hl=pop.findNotHoused();
            if(hl.length>0 && bld.people<bld.maxPeople){
                pop.lowList[hl[0]].home=tileIndex;
                return 1;
            }
            return 0;
        }

        // set work place
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
            return 1;
        }
        else{
            return 0;
        }
    },
    
    fire: function(pop,tileIndex){
        /*global MainGame*/
        var bld=MainGame.board.at(tileIndex).getBuilding();
        console.assert(bld);
        // unset home
        if(bld.name==="apartment"){
            var h=pop.findHoused();
            console.log(h);
            for(var i=0;i<h.length;i++){
                if(pop.lowList[h[i]].home===tileIndex){
                    pop.lowList[h[i]].home=null;
                    return 1;
                }
            }
            return 0;
        }

        // unset work place
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
    },

    findHousingStatus: function(pop, hasHouse){
        var res=[];
        for(var i=0;i<pop.lowList.length;i++)
            if(pop.lowList[i].home!==null && hasHouse 
                || pop.lowList[i].home===null && !hasHouse)
                res.push(i);
        return res;
    },

    findEmployStatus: function(pop, hasWork){
        var res=[];
        for(var i=0;i<pop.lowList.length;i++)
            if(pop.lowList[i].workplace!==null && hasWork 
                || pop.lowList[i].workplace===null && !hasWork)
                res.push(i);
        return res;
    },

    toString: function(pop){
        return "Pop[low,mid,hi]=["+pop.lowList.length+","+pop.midList.length+","+pop.highList.length+"]"
        +" Pop[housed,employed]=["+pop.findHoused().length+","+pop.findEmployed().length+"]";
    }
};