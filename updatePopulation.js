// Insures that each person in the population has up-to-date stats for health, shelter and education
var updatePopulation = function() {
	/* global MainGame */
	var pop = MainGame.population;
	//var workMap = pop.getWorkMap();
	//var houseMap = pop.getHouseMap();

	for (var personIndex in pop.lowList()) {
		var person = pop.at(personIndex);
		var homeIndex = person.home;
		
		//console.log("updatePopulation health: " + person.health + " education: " + person.education + " shelter: " + person.shelter);
		
		// This check can be safely ignored once shanty towns are spawning correctly
		if (MainGame.board.at(homeIndex) != undefined) {
			var home = MainGame.board.at(homeIndex).building;
	
			// Get new health
			var totalBuildingHealth = getEffectOutputInRangeByType(homeIndex, "health");
			person.health = totalBuildingHealth;
	
			// Get new shelter
			person.shelter = home.maxShelter;
	
			// Get new education
			var totalBuildingEdu = getEffectOutputInRangeByType(homeIndex, "education");
			if (person.education < totalBuildingEdu) {
				person.education = clampedSum(person.education, person.learningSpeed, totalBuildingEdu);
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

var getEffectOutputInRangeByType = function(homeIndex, type) {
	var totalOutput = 0;
	var allBuildingIndexes = MainGame.board.findBuilding(null, type);
	
	for (var i in allBuildingIndexes) {
		var buildingData = MainGame.board.at(i).building.buildingData;
		
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