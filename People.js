// We assume that we have a separate class for People

// Basic class for all people
var Person={
    // Static vars
    types:['low','mid','hi'],   // Adjust-able, but please use simple words.
    
    // the create function
    createNew: function(data){
        console.log("[People] created.");
        var p={};
        
        // Class vars
        p.type=data.type;               // must be one of Person.types
        p.name=data.name;               // nullable
        p.portIndex=data.portIndex;     // nullable
        // TODO: add other vars

        // Class funcs
        p.isMid=function{return p.type==='mid'};// Class func: inline style
        p.isHi=function{return p.type==='hi'};  // Class func: inline style
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
    createNew: function(data){ 
        console.log("[Population] created.");
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