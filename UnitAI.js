/*global MainGame*/
var UnitAI = {
	takeTurn: function(unit) {
		//console.log(MainGame.global.turn, unit.name, unit.currentIndex);
		if (unit.target === null) {
			unit.target = UnitAI.findTarget(unit);
		}

		var newMoveIndex = UnitAI.chooseMove(unit);
		unit.move(newMoveIndex);
		if (unit.isAttacking)
			UnitAI.attackTarget(unit);
		console.log("");
	},

	findTarget: function(unit) {
		if (unit.type === Unit.Riot) {
			if(unit.currentIndex === unit.origin && MainGame.board.at(unit.currentIndex).getBuilding().name !== 'rubble'){
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
			} else {
				return null;
			}
		}
	},

	// Determines what index to move the unit to. Returns either a tile index adjacent to the current index, or null if no move is desired
	chooseMove: function(unit) {
		var targetIndex = null;
		if (unit.type === Unit.Army) {
			if (unit.target !== null) {
				targetIndex = unit.target;
			} else {
				// If an Army unit does not have a target, then it will patrol roads
				// If it is not on a road, it will move toward the army base until it finds a road
				if (MainGame.board.at(unit.currentIndex).getBuilding().name === "road" || unit.currentIndex === unit.origin) {
					var adjacent = MainGame.board.allAdjacent(unit.currentIndex,1);
					var roads = [];
					for(var i=0; i<adjacent.length; ++i){
						if(MainGame.board.at(adjacent[i]).getBuilding().name)
							roads.push(adjacent[i]);
					}
					if(roads.length>0){
						return roads[Math.floor(Math.random()*roads.length)];
					}
					else{
						targetIndex = unit.origin;
					}
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

		var currentWeight = MainGame.board.distanceOf(unit.currentIndex, targetIndex);
		var adjacentTiles = MainGame.board.allAdjacent(unit.currentIndex, 1);
		var choices = [];
		for(var i = 0; i < adjacentTiles.length; ++i) {
			if(adjacentTiles[i])
			// Checking to see if the adjacent hex is the unit's target
			// if so, then the unit will immediately attack it
			if (adjacentTiles[i] === targetIndex) {
				if (unit.type === Unit.Army && unit.target != null) {
					unit.isAttacking = true;
					return null;
				} else {
					if(unit.type === Unit.Riot){
						unit.isAttacking = true;
					}
					return adjacentTiles[i];
				}
			}
			choices.push({tileIndex:adjacentTiles[i],weight:0,building:""});
			var tile = MainGame.board.at(adjacentTiles[i]);
			if(tile.hasBuilding())
				choices[i].building = tile.getBuilding().name;
			if(tile.hasUnit()){
				choices[i].weight = 999;
				var adjacentUnit = tile.getUnit();
				if(unit.type === Unit.Riot && adjacentUnit.type === Unit.Riot && unit.health <= adjacentUnit.health && choices[i].weight < currentWeight){
					UnitAI.mergeUnits(adjacentUnit,unit);
					return null;
				}
			}else if(tile.getTerrainType() !== "water" && tile.getTerrainType() !== "mountain"){
				choices[i].weight = MainGame.board.distanceOf(adjacentTiles[i],targetIndex)*100;
				if(choices[i].building === "road" || choices[i].building === "rubble")
					choices[i].weight -= Math.floor(Math.random()*50);
				else if(unit.type === Unit.Riot && choices[i].building !== "" && choices[i].weight <= currentWeight)
					choices[i].weight = Math.floor(Math.random()*choices[i].weight);
				else
					choices[i].weight += Math.floor(Math.random()*50);
			}
		}

		// sort choices by their weighted values
		choices.sort(function(a,b){return a.weight-b.weight;});

		// targeting nearby building
		if (unit.type === Unit.Riot) {
			if(choices[0].building !== "road" && choices[0].building !== "rubble" && choices[0].building !== ""){
				unit.isAttacking = true;
				unit.target = choices[0].tileIndex;
			}
		}

		return choices[0].tileIndex;
	},
	
	attackTarget: function(unit) {
		if (unit.type === Unit.Riot) {
			var targetTile = MainGame.board.at(unit.target);

			// If the building is about to die...
			if(unit.health >= targetTile.getBuilding().integrity){
				unit.target = null;
				unit.isAttacking = false;
			}
			targetTile.damageBuilding(unit.health);
		} else if (unit.type === Unit.Army) {
			var targetUnit = unit.target;

			// If the targeted unit is about to die...
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