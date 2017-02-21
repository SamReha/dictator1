// Insures that each person in the population has up-to-date stats for health, shelter and education
var updatePopulation = function(nextTurn,updatingHomes) {
	/* global MainGame */
	var pop = MainGame.population;
	var houseList = MainGame.board.findBuilding(null,"housing",null);
	//var workMap = pop.getWorkMap();
	// var houseMap = pop.getHouseMap();

	if(nextTurn){	pop.increase(Math.floor(Math.random()*3)+1);	}
	if(updatingHomes){
		for(var houseIndex=0;houseIndex<houseList.length;++houseIndex){
			var h=MainGame.board.at(houseList[houseIndex]).building;
			if(h.name==="palace"){continue;}
			updateHome(houseList[houseIndex]);
			h.shelter = h.maxShelter * Phaser.Math.clamp((20 - Global.turn + h.startingTurn) / 20,0,1);
		}
	}

	var lowList = pop.lowList();
	for (var personIndex=0;personIndex<lowList.length;++personIndex) {
		var person = lowList[personIndex];
		var homeIndex = person.home;
		
		//console.log("updatePopulation health: " + person.health + " education: " + person.education + " shelter: " + person.shelter);
		
		// This check can be safely ignored once shanty towns are spawning correctly
		if (MainGame.board.at(homeIndex) != undefined) {
			var home = MainGame.board.at(homeIndex).building;
	
			// Get new health
			person.health = home.health;
	
			// Get new shelter
			person.shelter = home.shelter;
	
			// Get new education
			if (person.education < home.education && nextTurn) {
				/*global Person*/
				person.education = clampedSum(person.education, Person.learningSpeed, home.education);
			}
		}
		
		// Make sure the global pop array gets updated
		pop.people[personIndex] = person;
	}
	pop.update();

	/*global Global*/
	Global.updateFreedomUnrest();
};

var clampedSum = function(a, b, max) {
	var sum = a + b;
	return sum > max ? max : sum;
};

var updateHomesNearOutput = function(tileIndex,range){
	/*global MainGame*/
	var homes = MainGame.board.findBuilding(null,"housing",null);
	for(var houseIndex=0;houseIndex<homes.length;++houseIndex){
		if(MainGame.board.distanceOf(tileIndex,homes[houseIndex]) <= 2 && MainGame.board.at(homes[houseIndex]).building.name!=="palace"){
			updateHome(homes[houseIndex]);
		}
	}
};

var updateHome = function(houseIndex){
	var home = MainGame.board.at(houseIndex).building;
	home.health = getEffectOutputInRangeByType(houseIndex, "health");
	home.education = getEffectOutputInRangeByType(houseIndex, "education");
	home.aoeFreedom = getEffectOutputInRangeByType(houseIndex, "freedom");
	home.aoeUnrest = getEffectOutputInRangeByType(houseIndex, "unrest");

	MainGame.board.at(houseIndex).building=home;
};

var getEffectOutputInRangeByType = function(homeIndex, type) {
	var totalOutput = 0;
	var allBuildingIndexes = MainGame.board.findBuilding(null, null, type);

	for (var index=0;index<allBuildingIndexes.length;++index) {
		var buildingData = MainGame.board.at(allBuildingIndexes[index]).building;
		
		// If the distance between the two buildings is <= the range of the eduBuilding, accumulate education
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