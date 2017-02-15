// Insures that each person in the population has up-to-date stats for health, shelter and education
updatePopulation() {
	var pop = MainGame.population;
	var workMap = pop.getWorkMap;
	var houseMap = pop.getHouseMap;

	for (person in pop.lowList) {
		var homeIndex = person.home;
		var home = MainGame.board.at(homeIndex).building;

		// Get new health
		person.health = home.health;

		// Get new shelter
		person.shelter = home.shelter;

		// Get new education
		person.education = home.education;
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