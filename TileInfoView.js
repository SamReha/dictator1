var style = { font: "20px STKaiti", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, boundsAlignH: "center", boundsAlignV: "middle" , backgroundColor: "#ffff00" };

var TileBriefInfoView={
    style:{font: "20px myKaiti", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, boundsAlignH: "center", boundsAlignV: "middle" , backgroundColor: "#ffff00" },
	createNew: function(){
		/* global MainGame */
		var game=MainGame.game;
		// bg
		var tbiView=game.add.sprite(0,0,"tile_hover_backpanel");
		// label position
		var centerPos={x:tbiView.texture.width*0.5, y:tbiView.texture.height*0.5};
		// label1 (building name/lv)
		tbiView.label=game.make.text(centerPos.x, centerPos.y-20, "", TileBriefInfoView.style);
		tbiView.label.anchor.x=0.5;
		tbiView.label.anchor.y=0.5;
		tbiView.addChild(tbiView.label);
		// label2 (people)
		tbiView.label2=game.make.text(centerPos.x, centerPos.y+30, "", TileBriefInfoView.style);
		tbiView.label2.anchor.x=0.5;
		tbiView.label2.anchor.y=0.5;
		tbiView.addChild(tbiView.label2);

		// Class func
		tbiView.updateInfo=function(tile){return TileBriefInfoView.updateInfo(tbiView,tile)};
		return tbiView;
	},
	updateInfo: function(t, tile){
		console.assert(tile);
        /*global MainGame*/

        // Let's figure out what kind of info we need to display
        t.label.text=tile.terrain.key+ (tile.getResType()?" ("+tile.getResType()+")":"" );

        if(tile.hasBuilding()){
        	var bld=tile.getBuilding();
        	var bldStr=bld.name;
        	bldStr+=("People:"+bld.people+"/"+bld.maxPeople);
	        t.label2.text=bldStr;
        }
	}
};

// var TileDetailInfoView={
// 	createNew: function(curIndex){
// 		/* global MainGame*/
// 		var game=MainGame.game;

// 		var view=game.add.sprite(0,0,"building_detail_backpanel");
//         var labelX = Math.floor(view.texture.width*0.5);
//         var labelY = Math.floor(view.texture.height*0.5);

//         // label (bld name/lv)
//         view.label = MainGame.game.make.text(labelX, -labelY+30, "Bld", style);
//         view.label.anchor.x = 0.5;
//         view.label.anchor.y = 0.5;
//         view.addChild(view.label);

//         // label2 (people)
//         view.label2 = MainGame.game.make.text(10, -labelY+60, "People", style);
//         view.label2.anchor.y = 0.5;
//         view.addChild(view.label2);

//         // label3 (health)
//         view.label3=MainGame.game.make.text(10,-labelY+90,"Health",style);
//         view.label3.anchor.y = 0.5;
//         view.addChild(view.label3);

//         // label3 (health)
//         view.label4=MainGame.game.make.text(10,-labelY+120,"Edu",style);
//         view.label4.anchor.y = 0.5;
//         view.addChild(view.label4);

//         // label3 (health)
//         view.label5=MainGame.game.make.text(10,-labelY+150,"Shelter",style);
//         view.label5.anchor.y = 0.5;
//         view.addChild(view.label5);

//         // Hire button
//         view.addPersonButton = MainGame.game.make.button(30, -labelY+200, "btnHire", 
//             function() {
//                 //console.log("[MapSelector] Hire people for index: ",curIndex);
//                 // TODO
//                 /*global MainGame*/
//                 var bld = MainGame.board.at(curIndex).building;
//                 if (bld.people >= bld.maxPeople) {
//                     return;
//                 }
                
//                 //console.log("[MapSelector] and the building's type/name is:["+bld.type+","+bld.name+"]");
//                 MainGame.population.hire(curIndex);
//                 //bld.people=bld.people+actual; [this is now done in building.addPerson()]
//                 // update display
//                 view.label2.text="People: "+bld.people+"/"+bld.maxPeople;

//                 for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
//                     var outType = bld.effects[outIndex].type;
//                     if(outType==="health"){ 
//                         outType="Health";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(curIndex);
//                     }else if(outType==="education"){
//                         outType="Edu";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(curIndex);
//                     }else if(outType==="freedom"){
//                         outType="Extra Freedom";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(curIndex);
//                     }else if(outType==="unrest"){
//                         outType="Extra Unrest";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(curIndex);
//                     }else if(outType==="money"){    outType="Money";    }

//                     if(outIndex===0){
//                         view.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }else if(outIndex===1){
//                         view.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }else if(outIndex===2){
//                         view.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }
//                 }
//                 /*global updatePopulation*/
//                 updatePopulation(false,false);
//             }, view, 0, 1, 2, 3);
//         view.addPersonButton.input.priorityID = 2;
//         view.addChild(view.addPersonButton);

//         // Fire button
//         view.removePersonButton = MainGame.game.make.button(100, -labelY+200, "btnFire",
//             function() {
//                 //console.log("[MapSelector] Fire people for index: ",curIndex);
//                 // TODO
//                 /*global MainGame*/
//                 var bld=MainGame.board.at(curIndex).building;
//                 if(bld.people<=0){
//                     return;
//                 }
                
//                 //console.log("[MapSelector] and the building's type/name is:["+bld.type+","+bld.name+"]");
//                 MainGame.population.fire(curIndex);
//                 //bld.people=bld.people-actual; [this is now done in building.addPerson()]
//                 // update display
//                 view.label2.text="People: "+bld.people+"/"+bld.maxPeople;

//                 for(var outIndex = 0; outIndex < bld.effects.length; outIndex++) {
//                     var outType = bld.effects[outIndex].type;
//                     if(outType==="health"){ 
//                         outType="Health";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(curIndex);
//                     }else if(outType==="education"){
//                         outType="Edu";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(curIndex);
//                     }else if(outType==="freedom"){
//                         outType="Extra Freedom";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(curIndex);
//                     }else if(outType==="unrest"){
//                         outType="Extra Unrest";
//                         /*global updateHomesNearOutput*/
//                         updateHomesNearOutput(curIndex);
//                     }else if(outType==="money"){
//                         outType="Money";
//                         MainGame.global.updateMoneyPerTurn();                    }

//                     if(outIndex===0){
//                         view.label3.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }else if(outIndex===1){
//                         view.label4.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }else if(outIndex===2){
//                         view.label5.text=outType+" Output: "+bld.effects[outIndex].outputTable[bld.people];
//                     }
//                 }
//                 /*global updatePopulation*/
//                 updatePopulation(false,false);
//             }, view, 0,1,2,3);
//         view.removePersonButton.input.priorityID = 2;
//         view.addChild(view.removePersonButton);

// 		// Class func
// 		view.updateInfo=function(tile){return TileDetailInfoView.updateInfo(view,tile)};

//         return view;

// 	},
// 	updateInfo: function(view, tile){
//         if(!tile.hasBuilding())
//             return;

//         var b = MainGame.board;
//         var bld = tile.getBuilding();

//         // Let's figure out what kind of info we need to display
//         var displayName = '';

//         // If this tile has no building, display terrain info
//         if (bld === null || bld.isEmpty()) {
//             // If this terrain has a natural resource, display that, otherwise display the terrain name
//             displayName = tile.getRes().key === '__default' ? tile.terrain.key : tile.getRes().key;

//             view.label2.text = ''; // Make sure this text gets cleared if it's not going to be used
//         } else {
//             displayName = bld.name;// + " Lv"+bld.level;

//             // Most buildings can contain people, but some (like roads) cannot. Be sure to correct for that.
//             if (bld.subtype === 'road') {
//                 view.label2.text = '';
//             } else {
//                 view.label2.text = "People: " + bld.people + "/" + bld.maxPeople;
//             }

//             var str3="";
//             var str4="";
//             var str5="";
            
//             if(bld.subtype==="housing"){
//                 str3="Health: "+bld.health;
//                 str4="Education: "+bld.education;
//                 str5="Shelter: "+bld.shelter;
//             }
//             if(bld.effects[0].type!==null){
//                 for(var outIndex=0;outIndex<bld.effects.length;++outIndex){
//                     var outType = bld.effects[outIndex].type;
//                     var outValue = bld.effects[outIndex].outputTable[bld.people];
//                     if(outType==="health"){ outType="Health";   }
//                     else if(outType==="education"){ outType="Edu";  }
//                     else if(outType==="freedom"){   outType="Freedom";    }
//                     else if(outType==="unrest"){    outType="Unrest"; }
//                     else if(outType==="money"){
//                         outType="Money";
//                         outValue="$"+outValue+"K";
//                     }
            
//                     if(outIndex===0){
//                         str3=outType+" Output: "+outValue;
//                     }else if(outIndex===1){
//                         str4=outType+" Output: "+outValue;
//                     }else if(outIndex===2){
//                         str5.text=outType+" Output: "+outValue;
//                     }
//                 }
//             }
//             view.label3.text=str3;
//             view.label4.text=str4;
//             view.label5.text=str5;
//         }

//         view.label.text = displayName;

//         var rect = b.rectOf(view.activeIndex,b.currentScale);
//         view.buildingDetail.x = rect.x-b._offset.x+rect.w*.85;
//         view.buildingDetail.y = rect.y-b._offset.y+rect.h*.5;
//         view.buildingDetail.scale.set(b.currentScale);
// 	},
// };