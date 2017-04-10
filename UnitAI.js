/*global MainGame*/
var UnitAI = {
	takeTurn: function(unit) {
		console.log(MainGame.global.turn, unit.name, unit.currentIndex);
		if (unit.target === null) {
			unit.target = UnitAI.findTarget(unit);
		}

		unit.move(UnitAI.chooseMove(unit));

		if(unit.isAttacking)
			UnitAI.attackTarget(unit);
	},

	findTarget: function(unit) {
		if (unit.type === Unit.Riot) {
			if(unit.currentIndex === unit.origin && MainGame.board.at(unit.currentIndex).getBuilding().name !== 'rubble') {
				return unit.origin;
			} else {
				return MainGame.board.findBuilding('palace',null,null,null)[0];
			}
		} else if (unit.type === Unit.Army) { // Should never call findTarget with a homeless group, but just to be sure
			var riotIndecies = MainGame.board.findUnits(Unit.Riot);
			if (riotIndecies.length > 0) {
				var palaceIndex = MainGame.board.findBuilding('palace',null,null,null)[0];
				var armyDistance = MainGame.board.distanceOf(palaceIndex, unit.currentIndex);
				var minDistance = null;
				var minIndex = null;
				for (var i = 0; i < riotIndecies.length; ++i) {
					var totalDistance = MainGame.board.distanceOf(palaceIndex,riotIndecies[i]) + armyDistance;
					if (!minDistance) {
						minDistance = totalDistance;
						minIndex = riotIndecies[i];
					} else if (totalDistance < minDistance) {
						minDistance = totalDistance;
						minIndex = riotIndecies[i];
					}
				}

				return MainGame.board.at(minIndex).getUnit();
			}
		}
	},

	// Determines what index to move the unit to. Returns either a tile index adjacent to the current index, or null if no move is desired
	chooseMove: function(unit) {
		var targetIndex = null;
		if (unit.type === Unit.Army) {
			if (unit.target !== null) {
				if (MainGame.board.distanceOf(unit.currentIndex, unit.target.currentIndex) === 1) {
					unit.isAttacking = true;
					return null;
				}
				targetIndex = unit.target.currentIndex;
			} else {
				if (MainGame.board.at(unit.currentIndex).getBuilding().name === "road") {
					var adjacent = MainGame.board.allAdjacent(unit.currentIndex,1);
					var roads = [];
					for(var i=0; i<adjacent.length; ++i){
						if(MainGame.board.at(adjacent[i]).getBuilding().name)
							roads.push(adjacent[i]);
					}
					if(roads.length>0)
						return roads[Math.floor(Math.random()*roads.length)];
					else
						targetIndex = unit.origin;
				}else{
					targetIndex = unit.origin;
				}
			}
		} else if (unit.type === Unit.Riot) {
			if (unit.currentIndex === unit.target) {
				unit.isAttacking = true;
				return null;
			}
			targetIndex = unit.target;
		}

		var adjacentTiles = MainGame.board.allAdjacent(unit.currentIndex, 1);
		var distances = [];
		var buildings = [];
		for(var i=0; i<adjacentTiles.length; ++i){
			var tile = MainGame.board.at(adjacentTiles[i]);
			if(tile.hasBuilding())
				buildings.push(tile.getBuilding().name);
			else
				buildings.push("");
			if(!tile.hasUnit())
				distances.push(MainGame.board.distanceOf(adjacentTiles[i],targetIndex));
			else{
				var adjacentUnit = tile.getUnit();
				if(unit.type === Unit.Riot && adjacentUnit.type === Unit.Riot && unit.health <= adjacentUnit.health)
					UnitAI.mergeUnits(adjacentUnit,unit);
			}
		}

		// targeting nearby buildings
		if (unit.type === Unit.Riot) {
			// simple sorting of building names
			for(var i=0; i<buildings.length; ++i){
				for(var j=i+1; j<buildings.length; ++j){
					if(buildings[j]==="palace" || (buildings[i]!=="palace" && buildings[j]!=="road" && buildings[j]!=="")){
						var temp = distances[i];
						distances[i] = distances[j];
						distances[j] = temp;
						
						temp = adjacentTiles[i];
						adjacentTiles[i] = adjacentTiles[j];
						adjacentTiles[j] = temp;

						temp = buildings[i];
						buildings[i] = buildings[j];
						buildings[j] = temp;
					}
				}
			}

			if(buildings[0]!=="road" && buildings[0]!==""){
				unit.target = adjacentTiles[0];
				return adjacentTiles[0];
			}
		}

		// This is typically a better way to sort (clean + guarantees a good alg is used)
		// distances.sort(function(a, b) {
		//     return a - b;
		// });
		//console.log(distances);

		for(var i=0; i<distances.length; ++i){
			for (var j = i + 1; j<distances.length; ++j) {
				if(distances[j]<distances[i]){
					var temp = distances[i];
					distances[i] = distances[j];
					distances[j] = temp;

					temp = adjacentTiles[i];
					adjacentTiles[i] = adjacentTiles[j];
					adjacentTiles[j] = temp;

					temp = buildings[i];
					buildings[i] = buildings[j];
					buildings[j] = temp;
				}
			}
		}

		if (distances[0] === distances[1]) {
			var tile0 = MainGame.board.at(adjacentTiles[0]);
			var tile1 = MainGame.board.at(adjacentTiles[1]);
			if(buildings[0]==="road" && buildings[1]!=="road")
				return adjacentTiles[0];
			else if(buildings[0]!=="road" && buildings[0]==="road")
				return adjacentTiles[1];
			if(buildings[0]==="road")
				return adjacentTiles[0];
			if(buildings[1]==="road")
				return adjacentTiles[1];
		} else {
			return adjacentTiles[0];
		}

		//if none of the above conditions are met, then randomly choose a tile
		return (Math.floor(Math.random()*2)===0?adjacentTiles[0]:adjacentTiles[1]);
	},
	
	attackTarget: function(unit) {
		if (unit.type === Unit.Riot) {
			var targetTile = MainGame.board.at(unit.target);
			targetTile.damageBuilding(unit.health);

			// If the rioter has killed the building
			if (!targetTile.hasBuilding()) {
				unit.target = null;
				unit.isAttacking = false;
			}
		} else if (unit.type === Unit.Army) {
			var targetUnit = unit.target;
			if(unit.health >= targetUnit.health){
				unit.target = null;
				unit.isAttacking = false;
			}
			targetUnit.takeDamage(unit.health);
		}
	},

	mergeUnits: function(unit1, unit2) {
		var transfer = Math.min(unit2.health, Unit.maxSize - unit1.health);
		unit1.addPeople(transfer);
		unit2.subtractPeople(transfer);
	}
};