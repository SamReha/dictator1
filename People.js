// We assume that we have a separate class for People

// Basic class for all people
var Person={
    // Static vars
    Low: 0,
    Mid: 1,
    Hi: 2,
    learningSpeed: 10,
    
    // the create function
    createNew: function(data){  // data is a Table
        console.log("[People] created.");
        var p={};
        
        // Class vars
        p.type=data.type;               // must be one of Person.types
        p.name=data.name;               // nullable
        p.portIndex=data.portIndex;     // nullable
        p.workplace=data.workplace;     // nullable, index of the tile
        p.home=data.home;               // nullable, index of the tile
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
        p.findHousing=function(pop){return Person.findHousing(p,pop)};
        p.toString=function(){return "PPL:"+p.type};
        p.updateStats=function(board){return Person.updateStats(p,board)};
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

    
    findHousing: function(p,pop){
        /*global MainGame*/
        var board = MainGame.board;
        var housingIndices=board.findBuilding(null,"housing",null);
        console.log("housingIndices"+ housingIndices);
        
        for(var i=0;i<housingIndices.length;++i){
            var bld1 = board.at(housingIndices[i]);
            for(var j=i+1;j<housingIndices.length;++j){
                var bld2 = board.at(housingIndices[j]);
                if(bld2.shelter>bld1.shelter){
                    var tempIndex = housingIndices[i];
                    housingIndices[i] = housingIndices[j];
                    housingIndices[j] = tempIndex;
                }
            }
        }
        console.log("housingIndices"+ housingIndices);
        for (var i=0;i<housingIndices.length;i++) {
            console.log(i);
            if (pop.hirePersonAt(p, housingIndices[i])) {
                return true;
            }
        }
        return false;
    },
    
    updateStats: function(p,board){
        var house=board.at(p.home).getBuilding();
        p.health=house.health;
        p.shelter=house.shelter;
        //To be removed when the system changes
        p.education=house.education;
    },
    
    updateFreeUn: function(p,board){
        if(p.home!==null){
            var house = board.at(p.home).getBuilding();
            p.freedom = Math.min(p.health,50) + Math.min(p.education,50) + house.aoeFreedom;
            p.unrest = Math.max(50-p.health,0) + Math.max(50-p.shelter,0) + house.aoeUnrest;
        }
        else{
            p.freedom = 0;
            p.unrest = 0;
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
        pop.people=[];

        // Class funcs
        pop.at=function(index){return pop.people[index]};
        pop.nextTurn=function(){return Population.nextTurn(pop)};
        pop.count=function(){return pop.people.length};
        pop.report=function(){return Population.report(pop)};  // Class func: Declaration
        pop.increase=function(amount){return Population.increase(pop,amount)};
        pop.hire=function(tileIndex){return Population.hire(pop,tileIndex)};
        pop.hirePersonAt=function(person,tileIndex){return Population.hirePersonAt(pop,person,tileIndex)};
        pop.fire=function(tileIndex){return Population.fire(pop,tileIndex)};
        pop.firePersonAt=function(person,tileIndex){return Population.firePersonAt()};
        // filter people
        pop.lowList=function(){return pop.people.filter(function(p){return p.type===0})};
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
        /*global MainGame*/
        pop.people.forEach(function(p){p.nextTurn(MainGame.board)});
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
        for(var i = 0; i < amount; i++) {
            var per=Person.createNew({"type":0});
            pop.people.push(per);
            if(!per.findHousing(pop)){
                /*global MainGame*/
                var shanty = MainGame.board.buildShanty();
                if(shanty!==null){  pop.hirePersonAt(per, shanty);  }
            }
        }
    },
    
    hire: function(pop,tileIndex){
        console.log("work and house map:");
        /*global MainGame*/
        var bld=MainGame.board.at(tileIndex).getBuilding();
        console.assert(bld);
        // set home for person
        if(bld.subtype==="housing"){
            var hl=pop.findNotHoused();
            if(hl.length>0){
                if(bld.addPerson()){
                    pop.people[hl[0]].home=tileIndex;
                    return true;
                }
            }
            return false;
        }else{
            var hl=pop.findNotEmployed();
            if(hl.length>0){
                if(bld.addPerson()) {
                    pop.people[hl[0]].workplace=tileIndex;
                    return true;
                }
            }
            return false;
        }
    },
    
    hirePersonAt: function(pop, person, tileIndex){
        console.log("hirePersonAt: " + tileIndex);
        /*global MainGame*/
        var bld = MainGame.board.at(tileIndex).getBuilding();
        //set location for person
        if(bld.subtype==="housing"){
            if(bld.addPerson()){
                person.home=tileIndex;
                return true;
            }
            return false;
        }
        else{
            if(bld.addPerson()){
                person.workplace=tileIndex;
                return true;
            }
            return false;
        }
    },
    
    fire: function(pop,tileIndex){
        /*global MainGame*/
        var bld=MainGame.board.at(tileIndex).getBuilding();
        console.assert(bld);
        // unset home
        if(bld.subtype==="housing"){
            var h=pop.findHoused();
            console.log(h);
            for(var i=0;i<h.length;i++){
                if(pop.people[h[i]].home===tileIndex){
                    bld.removePerson();
                    pop.people[h[i]].home=null;
                    return true;
                }
            }
            return false;
        }else{
            var h=pop.findEmployed();
            console.log(h);
            for(var j=0;j<h.length;j++){
                if(pop.people[h[j]].workplace===tileIndex){
                    bld.removePerson();
                    pop.people[h[j]].workplace=null;
                    return true;
                }
            }
            return false;
        }
    },
    
    firePersonAt: function(pop,person,tileIndex){
        /*global MainGame*/
        var bld=MainGame.board.at()
        //set location for player
        if(bld.subtype==="housing"){
            if(person.home===tileIndex){
                bld.removePerson();
                person.home=null;
                return true;
            }
            return false;
        }
        else{
            if(person.workplace===tileIndex){
                bld.removePerson();
                person.workplace=null;
                return true;
            }
            return false;
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