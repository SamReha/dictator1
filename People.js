// We assume that we have a separate class for People

// Basic class for all people
var Person={
    // Static vars
    //  for type
    Low: 0,
    Mid: 1,
    Hi: 2,
    //  for role
    Bureaucrat: 'Bureaucratic',
    Merchant: 'Commerce',
    Military: 'Military',

    learningSpeed: 10,    
    
    // the create function
    createNew: function(data){  // data is a Table
        // console.log("[People] created.",data);

        var p={};
        
        // Class vars
        p.type=data.type;               // must be one of Person.types
        p.name=(data.name?data.name:Person.randomName());   // either given or randomized
        p.portIndex = (data.portIndex !== undefined ? data.portIndex : null);     // nullable
        p.workplace=data.workplace;     // nullable, index of the tile
        p.home=data.home;               // nullable, index of the tile
        p.health=(data.health?data.health:0);           // int
        p.culture=(data.culture?data.culture:0);        // int
        p.shelter=(data.shelter?data.shelter:0);        // int
        p.freedom=0;        // int
        p.unrest=0;         // int
        // Class vars (nullable)
        p.baseInfluence=(data.baseInfluence?data.baseInfluence:null);
        p.accruedInfluence=(data.accruedInfluence?data.accruedInfluence:null);
        p.role=(data.role?data.role:null);
        p.loyalty=(data.loyalty?data.loyalty:null);
        p.payLevel=(data.payLevel?data.payLevel:null);
        p.salary=(data.salary?data.salary:null);

        // Class funcs
        p.update = function(board,nextTurn) { return Person.update(p,board,nextTurn); };
        p.report = function(){ return Person.report(p); };  // Class func: Declaration
        p.getPortTexString = function() {
            console.assert(p.type >= Person.Mid);

            // If we don't already have a port index, get one!
            if (p.portIndex === null) {
                p.portIndex = Math.floor(Math.random()*10);
            }

            var tb = {}; 
            tb[Person.Bureaucrat] = "bureaucrat_port_";
            tb[Person.Merchant] = "merchant_port_";
            tb[Person.Military] = "military_port_";

            return tb[p.role] + p.portIndex;
        };
        p.findHousing=function(){return Person.findHousing(p)};
        p.toString=function(){return "<Person:"+p.name+",type:"+p.type+",role:"+p.role+">"};
        p.updateStats=function(board,nextTurn){return Person.updateStats(p,board,nextTurn)};
        p.updateFreeUn=function(board){return Person.updateFreeUn(p,board)};
        p.setLowClass = function() { return Person.setLowClass(p); };
        p.setMidClass = function() { return Person.setMidClass(p); };
        p.setHighClass = function() { return Person.setHighClass(p); };
        p.unSetHighClass = function() { return Person.unSetHighClass(p); };
        p.addSalary = function() { return Person.addSalary(p);  };
        p.removeSalary = function() { return Person.removeSalary(p); };
        p.getJobTitle = function() { return Person.getJobTitle(p); };

        return p;
    },

    // Class func: Implementation
    update: function(p, board,nextTurn) {
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

    
    findHousing: function(p){
        /*global MainGame*/
        var board = MainGame.board;
        var housingIndices=board.findBuilding(null,null,"housing",null);
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
            if (MainGame.population.hirePersonAt(p, housingIndices[i])){
                var house = board.at(housingIndices[i]).getBuilding();
                p.health = house.health;
                p.shelter = house.shelter;
                // p.culture = house.culture;
                return true;
            }
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
    
            // Get new culture
            p.culture = house.culture;
        }
        else if(nextTurn){
            if(!p.findHousing()){
                /*global MainGame*/
                var shanty = MainGame.board.buildShanty();
                if(shanty!==null){  MainGame.population.hirePersonAt(p, shanty);  }
                else{
                    p.health = 0;
                    p.shelter = 0;
                }
            }
        }
        // Update social class
        if(p.type === Person.Low){
            if(p.health >= 50 && p.shelter >= 50 && p.culture >= 50) {
                console.log("promotion!");
                p.setMidClass();
            }
        }else if(p.health < 50 || p.shelter < 50 || p.culture < 50) {
            // console.log("demotion: "+p.name+" "+p.health+" "+p.culture+" "+p.shelter);
            // if(p.type === Person.Hi){
            //     p.unSetHighClass();
            // }

            // Deliberatly exclude Ministers (We process them in BetweenTurnEvents)
            if (p.type !== Person.Hi) {
                p.setLowClass();
            }
        }else{
            p.baseInfluence = Math.floor(((p.health-50)+(p.shelter-50)+(p.culture-50))/3);
            p.accruedInfluence+=(p.type===Person.Mid?1:2);
            p.accruedInfluence=Math.min(p.accruedInfluence,50);
            if(p.type===Person.Hi){
                var payGrade = Math.floor(Math.max(p.baseInfluence+p.accruedInfluence-5,0)/5);
                p.loyalty += p.payLevel-payGrade;
            }
        }
    },
    
    updateFreeUn: function(p,board){
        if(p.home!==null){
            var house = board.at(p.home).getBuilding();
            p.freedom = Phaser.Math.clamp(Math.min(p.health,50) + Math.min(p.culture,50) + house.aoeFreedom,0,100);
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
        // find their workplace
        if(p.workplace!==null){
            var workplaceTile=MainGame.board.at(p.workplace);
            console.assert(workplaceTile.hasBuilding());
            var bld=workplaceTile.getBuilding();
            console.assert(bld.type===Person.Bureaucrat||bld.type===Person.Merchant||bld.type===Person.Military);
            p.role=bld.type;
        }else{
            var typeArray=[Person.Bureaucrat, Person.Merchant, Person.Military];
            role=typeArray[Math.floor(Math.random()*typeArray.length)];
            p.role = role;            
        }
    },

    setHighClass: function(p) {
        if(p.type === Person.Hi){
            var effects = MainGame.board.at(p.home).getBuilding().effects;
            for(var count=0; count<effects.length; ++count){
                if(effects[count].type==="money"){
                    effects[count].outputTable[1]=-p.salary;
                    return;
                }
            }
        }else{
            var minister = MainGame.population.typeRoleList(Person.Hi,p.role);
            if(minister.length > 0)
                minister[0].unSetHighClass();
            p.type = Person.Hi;
            p.loyalty = 5;
            p.addSalary();
        }
    },

    unSetHighClass: function(p) {
        p.loyalty = null;
        p.type = Person.Mid;
        p.removeSalary();

        MainGame.hud.coalitionFlag.updateSelf();
    },

    addSalary: function(p){
        var newEffect = {"type":"money","outputTable":[0,-p.salary]};
        var effects = MainGame.board.at(p.home).getBuilding().effects;
        if(effects.length===1 && effects[0].type===null){
            MainGame.board.at(p.home).getBuilding().effects = [newEffect];
        }else
            MainGame.board.at(p.home).getBuilding().effects.push(newEffect);
    },

    removeSalary: function(p){
        var effects = MainGame.board.at(p.home).getBuilding().effects;
        if(effects.length===1)
            MainGame.board.at(p.home).getBuilding().effects = [{"type":null}];
        else{
            for(var count=0; count<effects.length; ++count){
                if(effects[count].type==="money"){
                    MainGame.board.at(p.home).getBuilding().effects.splice(count,1);
                }
            }
        }
    },

    getJobTitle: function(p) {
        if (p.type === Person.Low) {
            if (p.workplace === null) return 'Unemployed';

            var workplace = MainGame.board.at(p.workplace).building;
            switch (workplace.name) {
                case 'library':
                    return 'Librarian';
                case 'farm':
                    return 'Farmer';
                case 'hospital':
                    return 'Doctor';
                case 'university':
                    return 'Professor';
                case 'market':
                    return 'Merchant';
                case 'cinema':
                    return 'Usher';
                case 'bank':
                    return 'Banker';
                case 'factory':
                    return 'Factory Worker';
                case 'radioStation':
                    return 'Propagandist';
                case 'armyBase':
                    return 'Soldier';
                case 'prison':
                    return 'Prison Guard';
                default:
                    return 'MISSING JOBNAME';
            }
        } else if (p.type === Person.Mid) {
            switch (citizen.role) {
                case Person.Bureaucrat:
                    return 'Elite Bureaucrat';
                case Person.Military:
                    return 'Elite Military Officer';
                case Person.Merchant:
                    return 'Elite Financier';
                default:
                    return 'MISSING ROLE NAME';
            }
        } else if (p.type === Person.Hi) {
            switch (citizen.role) {
                case Person.Bureaucrat:
                    return 'Minster of Bureaucracy';
                case Person.Military:
                    return 'Minister of the Military';
                case Person.Merchant:
                    return 'Minister of Finance';
                default:
                    return 'MISSING ROLE NAME';
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
        pop.firePersonAt=function(person, tileIndex){return Population.firePersonAt(pop, person, tileIndex)};

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
    update: function(pop, nextTurn) {
        if (nextTurn)
            pop.increase(Math.floor(Math.random()*3)+1);

        /*global MainGame*/
        pop.people.forEach(function(p) { p.update(MainGame.board, nextTurn); });

        /*global Global*/
        Global.updateFreedomUnrest();
    },
    
    report: function(pop){
        console.log("[Population] now reporting-------");
        for(var i=0;i<pop.length;i++){
            pop[i].report();
        }
        // TODO: add other information that needs to show
        console.log("[Population] end of report.");
    },
    
    increase: function(pop,amount) {
        for(var i = 0; i < amount; i++) {
            var per=Person.createNew({"type":0,"workplace":null,"home":null});
            pop.people.push(per);
            if(!per.findHousing()){
                /*global MainGame*/
                var shanty = MainGame.board.buildShanty();
                if(shanty!==null){  pop.hirePersonAt(per, shanty);  }
            }
            var house = MainGame.board.at(per.home).getBuilding();
            per.health=house.health;
            per.shelter=house.shelter;
            per.culture=house.culture;
        }

        Global.updateFreedomUnrest();
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
                    if(pop.people[hl[0]].type===Person.Hi)
                        pop.people[hl[0]].addSalary();

                    updateHomes(false);
                    return true;
                }
            }
            return false;
        }else{
            var hl=pop.findNotEmployed();
            if(hl.length>0){
                for(var i=0;i<hl.length;++i){
                    if(MainGame.board.hasRoadConnect(tileIndex, pop.people[hl[i]].home)) {
                        if(bld.addPerson()){
                            pop.people[hl[i]].workplace=tileIndex;
                            if(pop.people[hl[i]].type===Person.Hi)
                                pop.people[hl[i]].removeSalary();

                            updateHomes(false);
                            return true;
                        }
                    }
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
                updateHomes(false);
                return true;
            }
            return false;
        }
        else{
            if(bld.addPerson()){
                person.workplace=tileIndex;
                updateHomes(false);
                return true;
            }
            return false;
        }
    },
    
    fire: function(pop, tileIndex){
        /*global MainGame*/
        var bld=MainGame.board.at(tileIndex).getBuilding();
        // console.assert(bld);
        // unset home
        if (bld.subtype === "housing") {
            //console.log(tileIndex);
            var housed = pop.findHoused();
            for (var i = 0; i < housed.length; i++) {
                if (pop.people[housed[i]].home === tileIndex) {
                    bld.removePerson();
                    pop.people[housed[i]].home = null;

                    updateHomes(false);
                    return true;
                }
            }
            return false;
        } else {
            var employed = pop.findEmployed();
            for(var j=0;j<employed.length;j++){
                if(pop.people[employed[j]].workplace===tileIndex){
                    bld.removePerson();
                    pop.people[employed[j]].workplace=null;

                    updateHomes(false);
                    return true;
                }
            }
            return false;
        }
    },
    
    firePersonAt: function(pop, person, tileIndex) {
        /*global MainGame*/
        var bld = MainGame.board.at(tileIndex).getBuilding();
        //set location for player
        if (bld.subtype === "housing") {
            if (person.home === tileIndex) {
                bld.removePerson();
                person.home = null;
                updateHomes(false);
                return true;
            }
            return false;
        } else {
            if(person.workplace===tileIndex){
                bld.removePerson();
                person.workplace=null;
                updateHomes(false);
                return true;
            }else{
                console.log(person.workplace+" "+tileIndex);
                console.log(person);
            }
            return false;
        }
    },

    findHousingStatus: function(pop, hasHouse) {
        var res = [];
        pop.people.forEach(function(p, i) {
            console.assert(p.home !== undefined);
            if (p.type === Person.Low) {
                if (p.home !== null) {
                    /*global MainGame*/
                    var name = MainGame.board.at(p.home).getBuilding().name;
                    if ((name === "shantyTown" ? true : hasHouse))
                        res.push(i);
                } else if (p.home === null && !hasHouse)
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