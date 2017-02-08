// a base class for People

var Person={
    // define static prop/funcs here
    types:['low','mid','hi'],
    
    // the create function
    createNew: function(data){
        console.log("[People] created.")
        var p={}
        
        // Class vars
        p.type=data.type;
        p.name=data.name;   // nullable

        // Class func
        p.report=function(){Person.report(p)};  // declaration

        return p
    },

    // Class func, implementation
    report: function(p){
        console.log("[Person] type="+p.type+", name="+p.name);
    },
}
