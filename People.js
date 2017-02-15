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
        // Class vars (nullable)
        p.influence=(p.type>=Person.Mid?0:null);
        p.role=(p.type>=Person.Mid?0:null);
        p.loyalty=(p.type>=Person.Hi?0:null);

        // Class funcs
        p.nextTurn=function(){return Person.nextTurn(p)};
        p.report=function(){return Person.report(p)};  // Class func: Declaration
        // p.findHousing=function(){return Person.findHousing(p)};

        return p;
    },

    // Class func: Implementation
    nextTurn: function(p){
        // TODO
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
};

// Contains all the literal information (string/number/bool vars) of all people
var Population={
    // please see stage1.json: it will be created by stage1.population table.
    createNew: function(data){  // data is an Array
        console.log("[Population] created with count:"+data.length);
        console.assert(Array.isArray(data), "[Population] data must be an Array!");
        var pop={};

        // Class vars
        pop.people=[];

        // Class funcs
        pop.at=function(index){return pop.people[index]};
        pop.nextTurn=function(){return Population.nextTurn(pop)};
        pop.count=function(){return pop.people.length};
        pop.report=function(){return Population.report(pop)};  // Class func: Declaration
        pop.increase=function(amount){return Population.increase(pop,amount)};
        pop.hire=function(tileIndex,buildingType){return Population.hire(pop,tileIndex,buildingType)};
        pop.fire=function(tileIndex,buildingType){return Population.fire(pop,tileIndex,buildingType)};
        // filter people
        // returns the indice of housed/not housed people in lowList
        pop.findHoused=function(){return Population.findHousingStatus(pop,true)};
        pop.findNotHoused=function(){return Population.findHousingStatus(pop,false)};
        // returns the indice of employed/not employed people in lowList
        pop.findEmployed=function(){return Population.findEmployStatus(pop,true)};
        pop.findNotEmployed=function(){return Population.findEmployStatus(pop,false)};
        // returns the workplace table
        pop.getWorkMap=function(){
            var N=MainGame.board.tileCount();
            var map=[];
            for(var i=0;i<N;i++)
                map.push([]);
            pop.people.forEach(function(p,i){
                console.assert(p.workplace!==undefined);
                if(p.workplace!==null)
                    map[p.workplace].push(i);
            });
            return map;
        }
        pop.getHouseMap=function(){
            var N=MainGame.board.tileCount();
            var map=[];
            for(var i=0;i<N;i++)
                map.push([]);
            pop.people.forEach(function(p,i){
                console.assert(p.home!==undefined);
                if(p.home!==null)
                    map[p.home].push(i);
            });
            return map;
        }
        // returns the string representation
        pop.toString=function(){return Population.toString(pop)};

        // TODO: add other funcs

        // load the JSON data
        Population.init(pop,data);

        return pop;
    },
    init: function(pop,data){
        console.assert(Array.isArray(data));
        data.forEach(function(element){
            pop.people.push(Person.createNew(element));
        });
    },

    // Class func: Implementation
    nextTurn: function(pop){
        pop.people.forEach(function(p){p.nextTurn()});
        pop.increase(Math.floor(Math.random()*3));
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
            pop.people.push(per);
        }
    },
    
    hire: function(pop,tileIndex){
        console.log("work and house map:");
        /*global MainGame*/
        var bld=MainGame.board.at(tileIndex).getBuilding();
        console.assert(bld);
        // set home for person
        if(bld.name==="apartment"){
            var hl=pop.findNotHoused();
            if(hl.length>0 && bld.people<bld.maxPeople){
                pop.people[hl[0]].home=tileIndex;
                return 1;
            }
            return 0;
        }else{
            var hl=pop.findNotEmployed();
            if(hl.length>0 && bld.people<bld.maxPeople){
                pop.people[hl[0]].workplace=tileIndex;
                return 1;
            }
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
                if(pop.people[h[i]].home===tileIndex){
                    pop.people[h[i]].home=null;
                    return 1;
                }
            }
            return 0;
        }else{
            var h=pop.findEmployed();
            console.log(h);
            for(var j=0;j<h.length;j++){
                if(pop.people[h[j]].workplace===tileIndex){
                    pop.people[h[j]].workplace=null;
                    return 1;
                }
            }
            return 0;
        }
    },

    findHousingStatus: function(pop, hasHouse){
        var res=[];
        pop.people.forEach(function(p,i){
            console.assert(p.home!==undefined);
            if(p.type===Person.Low && (p.home!==null && hasHouse || p.home===null && !hasHouse))
                res.push(i);
        })
        return res;
    },

    findEmployStatus: function(pop, hasWork){
        var res=[];
        pop.people.forEach(function(p,i){
            console.assert(p.workplace!==undefined);
            if(p.type===Person.Low && (p.workplace!==null && hasWork || p.workplace===null && !hasWork))
                res.push(i);
        });
        return res;
    },

    toString: function(pop){
        var stats=[0,0,0];
        pop.people.forEach(function(p){
            stats[p.type]++;
        });
        return "Pop[low,mid,hi]=["+stats[0]+","+stats[1]+","+stats[2]+"]"
        +" Pop[housed,employed]=["+pop.findHoused().length+","+pop.findEmployed().length+"]";
    }
};