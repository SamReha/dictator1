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
        // TODO: add other vars

        // Class funcs
        p.isLow=function(){return p.type===0};  // Class func: inline style
        p.isMid=function(){return p.type===1};  // Class func: inline style
        p.isHi=function(){return p.type===2};   // Class func: inline style
        p.report=function(){Person.report(p)};  // Class func: Declaration
        // TODO: add other funcs

        return p
    },

    // Class func: Implementation
    report: function(p){
        console.log("[Person] type="+p.type+", name="+p.name);
        // TODO: add other infomation that needs to show
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
        // TODO: add other vars

        // Class funcs
        pop.count=function(){return pop.length};        // Class func: inline style
        pop.report=function(){Population.report(pop)};  // Class func: Declaration
        // TODO: add other funcs

        return pop;
    },

    // Class func: Implementation
    report: function(pop){
        console.log("[Population] now reporting-------");
        for(var i=0;i<pop.length;i++){
            pop[i].report();
        }
        // TODO: add other information that needs to show
        console.log("[Population] end of report.");
    },
};