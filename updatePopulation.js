// Insures that each person in the population has up-to-date stats for health, shelter and education
var updatePopulation = function() {
	/* global MainGame */
	var pop = MainGame.population;
	var workMap = pop.getWorkMap;
	var houseMap = pop.getHouseMap;

	for (var person in pop.lowList) {
		console.log(person);
		console.log(MainGame.board.at(homeIndex));
		var homeIndex = person.home;
		var home = MainGame.board.at(homeIndex).building;

		// Get new health
		var totalBuildingHealth = 0;
		var allHealthBuildingIndexes = MainGame.board.findBuilding(null, "health");
		
		for (var i in allHealthBuildingIndexes) {
			var buildingData = MainGame.board.at(i).building.buildingData;
			
			// If the distance between the two buildings is <= the range of the healthBuilding, accumulate the health
			for (var effect in buildingData.effects) {
				if (effect.type != "health") continue;
				if (MainGame.board.distanceOf(homeIndex, i) <= effect.range) {
					var outPut = effect.outputTable[buildingData.people];
					totalBuildingHealth += outPut;
				}
			}
			
			// If we've breached 100 health, just stop counting
			if (totalBuildingHealth >= 100) {
				totalBuildingHealth = 100;
				break;
			}
		}
		person.health = totalBuildingHealth;

		// Get new shelter
		console.log(home);
		person.shelter = home.shelter;

		// Get new education
		var totalBuildingEdu = 0;
		var allEduBuildingIndexes = MainGame.board.findBuilding(null, "education");
		
		for (var i in allEduBuildingIndexes) {
			var buildingData = MainGame.board.at(i).building.buildingData;
			
			// If the distance between the two buildings is <= the range of the eduBuilding, accumulate education
			for (var effect in buildingData.effects) {
				if (effect.type != "education") continue;
				if (MainGame.board.distanceOf(homeIndex, i) <= effect.range) {
					var outPut = effect.outputTable[buildingData.people];
					totalBuildingEdu += outPut;
				}
			}
			
			// If we've breached 100 education, just stop counting
			if (totalBuildingEdu >= 100) {
				totalBuildingEdu = 100;
				break;
			}
		}
		if (person.education < totalBuildingEdu) {
			person.education = clampedSum(person.education, person.learningSpeed, totalBuildingEdu);
		}
	}

	for (person in pop.midList) {
		var homeIndex = person.home;
		var home = MainGame.board.at(homeIndex).building;

		// Get new health
		person.health = home.health;

		// Get new shelter
		person.shelter = home.shelter;

		// Get new education
		person.education = home.education;
	}

	for (person in pop.highList) {
		var homeIndex = person.home;
		var home = MainGame.board.at(homeIndex).building;

		// Get new health
		person.health = home.health;

		// Get new shelter
		person.shelter = home.shelter;

		// Get new education
		person.education = home.education;
	}
}

var clampedSum = function(a, b, max) {
	var sum = a + b;
	return sum > max ? max : sum;
}