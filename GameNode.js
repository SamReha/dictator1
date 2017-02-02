// need: MainGame.js

var GameNode={ //abstract class
    createNew: function(name){
        var gameNode={};
        // member vars
        gameNode.name=name;
        // member funcs
        gameNode.destroySelf=function(){GameNode.destroySelf(gameNode)};
        // end
        return gameNode;
    },
    destroySelf: function(gameNode){
        console.error("[GameNode]: this function is abstract and should NOT be called.");
    },
};

var GroupNode={ //extends GameNode
    createNew: function(name){
        var groupNode=GameNode.createNew(name);
        // member funcs
        groupNode.addChild=function(child){GroupNode.addChild(groupNode,child,index)};
        groupNode.removeChild=function(child){GroupNode.removeChild(groupNode,child)};
        groupNode.removeAllChildren=function(){GroupNode.removeAllChildren(groupNode)};
        groupNode.numChildren=function(){return GroupNode.numChildren(groupNode)};
        groupNode.destroySelf=function(){return GroupNode.destroySelf(groupNode)};
        // member vars
        /*global MainGame*/
        groupNode.node=MainGame.game.add.group();
        groupNode.children=[];
        // end
        return groupNode;
    },
    addChild: function(group, child, index){
        for(var i=0;i<group.children.length;i++){
            if(group.children[i]===child){
                console.warn("[GroupNode] group "+group.name+" can NOT add the existing child: "+child.name);
                return;
            }
        }
        group.children.splice(index, 0, child);
        group.node.addChild(child.node, index);
    },
    removeChild: function(group, child){
        for(var i=0;i<group.children.length;i++){
            if(group.children[i]===child){
                group.node.removeChild(child);
                group.children.splice(i,1);
                return;
            }
        }
        console.warn("[GroupNode] group "+group.name+" can NOT find child: "+child.name);
    },
    removeAllChildren: function(group){
        
    },
    numChildren: function(group){
        return group.children.length;
    },
    destroySelf: function(group){
        group.kill();
    },
};

var SingleNode={ //abstract class, extends GameNode
    createNew: function(name){
        var singleNode=GameNode.createNew(name);
        // member funcs
        // end
        return singleNode;
    }
};