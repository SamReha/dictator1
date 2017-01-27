// a base class for People

var People={
    // define static prop/funcs here
    types:['low','mid','hi'],
    
    // the create function
    createNew: function(name){
        console.log("[People] created.")
        var p={}
        
        // define class prop/funcs here.
        p.name=name
        p.testFunc=function(){
            console.log("[People] testFunc()")
        }
        
        return p
    },
    
}

var LowPerson={
    createNew: function(name){
        console.log("[LowPerson] created.")
        var p=People.createNew(name)
        p.type='low'
        return p
    }
}