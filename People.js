// We assume that we have a separate class for People

// Basic class for all people
var Person={
    // Static vars
    //  for type
    Low: 0,
    Mid: 1,
    Hi: 2,
    //  for role
    Bureaucrat: '?',
    Merchant: '$',
    Military: '!',

    learningSpeed: 10,    
    
    // the create function
    createNew: function(data){  // data is a Table
        console.log("[People] created.",data);
        var p={};
        
        // Class vars
        p.type=data.type;               // must be one of Person.types
        p.name=(data.name?data.name:Person.randomName());   // either given or randomized
        p.portIndex=data.portIndex;     // nullable
        p.workplace=data.workplace;     // nullable, index of the tile
        p.home=data.home;               // nullable, index of the tile
        p.health=(data.health?data.health:0);           // int
        p.education=(data.education?data.education:0);  // int
        p.shelter=(data.shelter?data.shelter:0);        // int
        p.freedom=0;        // int
        p.unrest=0;         // int
        // Class vars (nullable)
        p.influence=(p.type>=Person.Mid?0:null);
        p.role=(data.role?data.role:null);
        p.loyalty=(p.type>=Person.Hi?0:null);
        p.payLevel=data.payLevel;
        console.log("P's payLevel is:"+p.payLevel);

        // Class funcs
        p.update=function(board,nextTurn){return Person.update(p,board,nextTurn)};
        p.report=function(){return Person.report(p)};  // Class func: Declaration
        p.findHousing=function(pop){return Person.findHousing(p,pop)};
        p.toString=function(){return "<Person:"+p.name+",type:"+p.type+",role:"+p.role};
        p.updateStats=function(board,nextTurn){return Person.updateStats(p,board,nextTurn)};
        p.updateFreeUn=function(board){return Person.updateFreeUn(p,board)};

        p.setLowClass = function() { return Person.setLowClass(p); };
        p.setMidClass = function() { return Person.setMidClass(p); };
        p.setHighClass = function() { return Person.setHighClass(p); };

        return p;
    },

    // Class func: Implementation
    update: function(p, board,nextTurn){
        p.updateStats(board,nextTurn);
        if (p.type === Person.Low) {
            p.updateFreeUn(board);
        }
    },
    
    report: function(p){
        console.log("[Person] type="+p.type+", name="+p.name);
        // TODO: add other infomation that needs to show
    },

    randomName: function(){
        /*global MainGame*/
        var nameList = MainGame.game.cache.getJSON('names');
        var firstName = nameList.firstNames[Math.floor(Math.random()*nameList.firstNames.length)];
        var lastName = nameList.lastNames[Math.floor(Math.random()*nameList.lastNames.length)];
        return firstName+" "+lastName;
    },

    
    findHousing: function(p,pop){
        /*global MainGame*/
        var board = MainGame.board;
        var housingIndices=board.findBuilding(null,"housing",null);
        // console.log("housingIndices "+ housingIndices);
        
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
        // console.log("housingIndices "+ housingIndices);
        for (var i=0;i<housingIndices.length;i++) {
            if(board.at(housingIndices[i]).getBuilding().startingTurn>MainGame.global.turn)
                continue;
            if (pop.hirePersonAt(p, housingIndices[i]))
                return true;
        }
        return false;
    },
    
    updateStats: function(p,board,nextTurn){
        if(p.home!==null){
            var house = board.at(p.home).getBuilding();
    
            // Get new health
            p.health = house.health;
    
            // Get new shelter
            p.shelter = house.shelter;
    
            // Get new education
            if (p.education < house.education && nextTurn) {
                /*global Person*/
                p.education = clampedSum(p.education, Person.learningSpeed, house.education);
            }
        }
        else{
            p.health = 0;
            p.shelter = 0;
        }
        // Update social class
        if (p.health < 50 || p.shelter < 50 || p.education < 50) {
            p.setLowClass();
        } else {
            // Don't set mid class if they're already high class!
            if (p.type != Person.Hi) {
                console.log("promotion!");
                p.setMidClass();
            }
        }
    },
    
    updateFreeUn: function(p,board){
        if(p.home!==null){
            var house = board.at(p.home).getBuilding();
            p.freedom = Phaser.Math.clamp(Math.min(p.health,50) + Math.min(p.education,50) + house.aoeFreedom,0,100);
            p.unrest = Phaser.Math.clamp(Math.max(50-p.health,0) + Math.max(50-p.shelter,0) + house.aoeUnrest,0,100);
        }
        else{
            p.freedom = 0;
            p.unrest = 0;
        }
    },

    setLowClass: function(p) {
        p.type = Person.Low;
    },

    setMidClass: function(p, role) {
        p.type = Person.Mid;
        // if p has a role
        if(p.role!==null && p.role!==undefined)
            return;
        // if role is specified
        if(role){
            console.assert(role===Person.Bureaucrat || role===Person.Merchant || role===Person.Military);
            p.role=role;
            return;
        }
        // find his workplace
        if(p.workplace!==null){
            var workplaceTile=MainGame.board.at(p.workplace);
            console.assert(workplaceTile.hasBuilding());
            var bld=workplaceTile.getBuilding();
            console.assert(bld.type===Person.Bureaucrat||bld.type===Person.Merchant||bld.type===Person.Military);
            p.role=bld.type;
        }else{
            var typeArray=[Person.Bureaucrat, Person.Merchant, Person.Military];
            role=(role?role:Math.floor(Math.random()*typeArray.length));
            p.role = role;            
        }
    },

    setHighClass: function(p) {
        p.type = Person.Hi;
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
        pop.update=function(nextTurn){return Population.update(pop,nextTurn)};
        pop.count=function(){return pop.people.length};
        pop.report=function(){return Population.report(pop)};  // Class func: Declaration
        pop.increase=function(amount){return Population.increase(pop,amount)};
        pop.hire=function(tileIndex){return Population.hire(pop,tileIndex)};
        pop.hirePersonAt=function(person,tileIndex){return Population.hirePersonAt(pop,person,tileIndex)};
        pop.fire=function(tileIndex){return Population.fire(pop,tileIndex)};
        pop.firePersonAt=function(person,tileIndex){return Population.firePersonAt()};

        // returns people by the filter of type
        pop.lowList=function() { return pop.people.filter(function(p) { return p.type === 0; })};
        pop.midList=function() { return pop.people.filter(function(p) { return p.type === 1; })};
        pop.highList=function() { return pop.people.filter(function(p) { return p.type === 2; })};
        // returns people by the filter of role
        pop.roleList=function(role){
            return pop.people.filter(function(p){return p.role===role})};
        pop.typeRoleList=function(type,role){
            return pop.people.filter(function(p){return p.type===type})
                            .filter(function(p){return p.role===role});
        }

        // returns the indice of housed/not housed people in lowList
        pop.findHoused=function(){return Population.findHousingStatus(pop,true)};
        pop.findNotHoused=function(){return Population.findHousingStatus(pop,false)};
        // returns the indice of employed/not employed people in lowList
        pop.findEmployed=function(){return Population.findEmployStatus(pop,true)};
        pop.findNotEmployed=function(){return Population.findEmployStatus(pop,false)};
        // returns the indice of [type] people
        
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
    update: function(pop,nextTurn){
        /*global MainGame*/
        pop.people.forEach(function(p){p.update(MainGame.board,nextTurn)});
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
            var per=Person.createNew({"type":0,"workplace":null,"home":null});
            pop.people.push(per);
            if(!per.findHousing(pop)){
                /*global MainGame*/
                var shanty = MainGame.board.buildShanty();
                if(shanty!==null){  pop.hirePersonAt(per, shanty);  }
            }
        }
    },
    
    hire: function(pop,tileIndex){
        // console.log("work and house map:");
        /*global MainGame*/
        var bld=MainGame.board.at(tileIndex).getBuilding();
        // console.assert(bld);
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
        // console.log("hirePersonAt: " + tileIndex);
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
        // console.assert(bld);
        // unset home
        console.log("firing");
        if(bld.subtype==="housing"){
            console.log(tileIndex);
            var h=pop.findHoused();
            for(var i=0;i<h.length;i++){
                if(pop.people[h[i]].home===tileIndex){
                    console.log("found");
                    bld.removePerson();
                    pop.people[h[i]].home=null;
                    return true;
                }
            }
            return false;
        }else{
            var h=pop.findEmployed();
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
            if(p.type===Person.Low){
                if(p.home!==null){
                    /*global MainGame*/
                    var name=MainGame.board.at(p.home).getBuilding().name;
                    if((name==="shantyTown" ? true : hasHouse))
                        res.push(i);
                }else if(p.home===null && !hasHouse)
                    res.push(i);
            }
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

var clampedSum = function(a, b, max) {
    var sum = a + b;
    return sum > max ? max : sum;
};