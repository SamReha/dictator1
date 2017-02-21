// Insures that each person in the population has up-to-date stats for health, shelter and education
var updatePopulation = function() {
	/* global MainGame */
	var pop = MainGame.population;
	var houseList = MainGame.board.findBuilding(null,"housing",null);
	//var workMap = pop.getWorkMap();
	// var houseMap = pop.getHouseMap();

	if(MainGame.global.turn!==1){pop.nextTurn();}

	for(var houseIndex in houseList){
		if(MainGame.board.at(houseIndex).building.name==="palace"){continue;}
		updateHome(houseIndex);
	}

	for (var personIndex in pop.lowList()) {
		var person = pop.at(personIndex);
		var homeIndex = person.home;
		
		//console.log("updatePopulation health: " + person.health + " education: " + person.education + " shelter: " + person.shelter);
		
		// This check can be safely ignored once shanty towns are spawning correctly
		if (MainGame.board.at(homeIndex) != undefined) {
			var home = MainGame.board.at(homeIndex).building;
	
			// Get new health
			person.health = home.health;
	
			// Get new shelter
			person.shelter = home.maxShelter;
	
			// Get new education
			if (person.education < home.education) {
				/*global Person*/
				person.education = clampedSum(person.education, Person.learningSpeed, home.education);
			}
		}
		
		// Make sure the global pop array gets updated
		pop.people[personIndex] = person;
	}
}

var clampedSum = function(a, b, max) {
	var sum = a + b;
	return sum > max ? max : sum;
}

var updateHomesNearOutput = function(tileIndex,range){
	/*global MainGame*/
	var homes = MainGame.board.findBuilding(null,"housing",null);
	for(var houseIndex in homes){
		if(MainGame.board.distanceOf(tileIndex,houseIndex) <= 2 && MainGame.board.at(houseIndex).building.name!=="palace"){
			updateHome(houseIndex);
		}
	}
}

var updateHome = function(houseIndex){
	var home = MainGame.board.at(houseIndex).building;
	home.health = getEffectOutputInRangeByType(houseIndex, "health");
	home.education = getEffectOutputInRangeByType(houseIndex, "education");
	home.aoeFreedom = getEffectOutputInRangeByType(houseIndex, "freedom");
	home.aoeUnrest = getEffectOutputInRangeByType(houseIndex, "unrest");
	/*global Global*/
	home.shelter = home.shelter * (Global.turn - home.startingTurn) / 20;
}

var getEffectOutputInRangeByType = function(homeIndex, type) {
	var totalOutput = 0;
	var allBuildingIndexes = MainGame.board.findBuilding(null, null, type);
	
	for (var i in allBuildingIndexes) {
		var buildingData = MainGame.board.at(i).building;
		
		// If the distance between the two buildings is <= the range of the eduBuilding, accumulate education
		for (var effect in buildingData.effects) {
			if (effect.type != type) continue;
			if (MainGame.board.distanceOf(homeIndex, i) <= effect.range) {
				var outPut = effect.outputTable[buildingData.people];
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
}