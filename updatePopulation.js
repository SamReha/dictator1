// Insures that each person in the population has up-to-date stats for health, shelter and education
var updatePopulation = function(nextTurn, updatingHomes) {
	/* global MainGame */
	var pop = MainGame.population;
	var houseList = MainGame.board.findBuilding(null,null,"housing",null);
	//var workMap = pop.getWorkMap();
	// var houseMap = pop.getHouseMap();
	if (updatingHomes) {
		for(var houseIndex=0;houseIndex<houseList.length;++houseIndex){
			var h=MainGame.board.at(houseList[houseIndex]).getBuilding();
			// if(h.name==="palace"){continue;}
			updateHome(houseList[houseIndex]);
		}
	}

	// var lowList = pop.lowList();
	// for (var personIndex=0;personIndex<lowList.length;++personIndex) {
	// 	var person = lowList[personIndex];
	// 	var homeIndex = person.home;
		
	// 	//console.log("updatePopulation health: " + person.health + " culture: " + person.culture + " shelter: " + person.shelter);
		
	// 	// This check can be safely ignored once shanty towns are spawning correctly
	// 	if (MainGame.board.at(homeIndex) != undefined) {
	// 		var home = MainGame.board.at(homeIndex).getBuilding();
	
	// 		// Get new health
	// 		person.health = home.health;
	
	// 		// Get new shelter
	// 		person.shelter = home.shelter;
	
	// 		// Get new culture
	// 		if (person.culture < home.culture && nextTurn) {
	// 			/*global Person*/
	// 			person.culture = clampedSum(person.culture, Person.learningSpeed, home.culture);
	// 		}
	// 	}
		
		// Make sure the global pop array gets updated
	// 	pop.people[personIndex] = person;
	// }
	pop.update(nextTurn);
};

var updateHomesNearOutput = function(tileIndex,range) {
	/*global MainGame*/
	var homes = MainGame.board.findBuilding(null,null,"housing",null);
	for(var houseIndex=0;houseIndex<homes.length;++houseIndex){
		if(MainGame.board.distanceOf(tileIndex,homes[houseIndex]) <= range){
			updateHome(homes[houseIndex]);
		}
	}
};

var updateHome = function(houseIndex){
	var home = MainGame.board.at(houseIndex).building;
	home.health = getEffectOutputInRangeByType(houseIndex, "health");
	home.culture = getEffectOutputInRangeByType(houseIndex, "culture");
	home.aoeFreedom = getEffectOutputInRangeByType(houseIndex, "freedom");
	home.aoeUnrest = getEffectOutputInRangeByType(houseIndex, "unrest");
	home.shelter = home.maxShelter;

	MainGame.board.at(houseIndex).building=home;
};

var getEffectOutputInRangeByType = function(homeIndex, type) {
	var totalOutput = 0;
	var allBuildingIndexes = MainGame.board.findBuilding(null, null, null, type);

	for (var index=0;index<allBuildingIndexes.length;++index) {
		var buildingData = MainGame.board.at(allBuildingIndexes[index]).building;
		
		// If the distance between the two buildings is <= the range of the eduBuilding, accumulate culture
		var effectList = buildingData.effects;
		for (var effectIndex=0;effectIndex<effectList.length;++effectIndex) {
			var thisEffect = effectList[effectIndex];
			if (thisEffect.type != type) continue;
			if (MainGame.board.distanceOf(homeIndex, allBuildingIndexes[index]) <= thisEffect.range) {
				var outPut = thisEffect.outputTable[buildingData.people];
				totalOutput += outPut;
			}
		}
		
		// If we've breached 100%, just stop counting
		if (totalOutput >= 100) {
			totalOutput = 100;
			break;
		}
	}
	
	return totalOutput;
};