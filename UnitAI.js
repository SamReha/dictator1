/*global MainGame*/
var UnitAI={
	takeTurn: function(unit){
		if (unit.target === null) {
			unit.target = UnitAI.findTarget(unit);
		}

		unit.move(UnitAI.chooseMove(unit));

		if(unit.isAttacking)
			UnitAI.attackTarget(unit);
	},

	findTarget: function(unit) {
		if (unit.type === Unit.Riot) {
			if(unit.currentIndex === unit.origin && MainGame.board.at(unit.currentIndex).getBuilding().name !== 'rubble')
				return unit.origin;
			else
				return MainGame.board.findBuilding('palace',null,null,null)[0];
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

	// Determines what index to move the unit to. Returns either a tile index adjacent to the current index, or null if no move is desire
	chooseMove: function(unit) {
		var targetIndex = null;
		if (unit.type === Unit.Army) {
			if (unit.target !== null) {
				if (MainGame.board.distanceOf(unit.currentIndex, unit.target.tileIndex) === 1) {
					unit.isAttacking = true;
					return null;
				}
				targetIndex = unit.target.tileIndex;
			} else {
				if (MainGame.board.at(unit.tileIndex).getBuilding().name === "road") {
					var adjacent = MainGame.board.allAdjacent(unit.tileIndex,1);
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
		} else {
			if (unit.currentIndex === unit.target) {
				unit.isAttacking = true;
				return null;
			}
			targetIndex = unit.target;
		}

		var adjacentTiles = MainGame.board.allAdjacent(unit.currentIndex, 1);
		var distances = [];
		for(var i=0; i<adjacentTiles.length; ++i){
			if(!MainGame.board.at(adjacentTiles[i]).hasUnit())
				distances.push(MainGame.board.distanceOf(adjacentTiles[i],targetIndex));
		}

		// simple sorting of distances
		for(var i=0; i<distances.length; ++i){
			for (var j = i + 1; j<distances.length; ++j) {
				if(distances[j]<distances[i]){
					var temp = distances[i];
					distances[i] = distances[j];
					distances[j] = temp;
					temp = adjacentTiles[i];
					adjacentTiles[i] = adjacentTiles[j];
					adjacentTiles[j] = temp;						}
			}
		}

		if(distances[0]===distances[1]){
			var tile0 = MainGame.board.at(adjacentTiles[0]);
			var tile1 = MainGame.board.at(adjacentTiles[1]);
			if(tile0.hasBuilding() && tile1.hasBuilding()){
				if(tile0.getBuilding().name==="road" && tile1.getBuilding().name!=="road")
					return adjacentTiles[0];
				else if(tile0.getBuilding().name!=="road" && tile1.getBuilding().name==="road")
					return adjacentTiles[1];
			}else if(tile0.hasBuilding()){
				if(tile0.getBuilding().name==="road")
					return adjacentTiles[0];
			}else if(tile1.hasBuilding()){
				if(tile1.getBuilding().name==="road")
					return adjacentTiles[1];
			}
		}else{
			return adjacentTiles[0];
		}
		//if none of the above conditions are met, then randomly choose a tile
		return (Math.floor(Math.random()*2)===0?adjacentTiles[0]:adjacentTiles[1]);
	},
	
	attackTarget: function(unit){
		if (unit.type === Unit.Riot) {
			MainGame.board.at(unit.target).getBuilding() -= unit.health;
		} else {
			unit.target.subtractPeople(unit.heath,true);
		}
	},

	mergeUnits: function(unit1, unit2) {
		var transfer = Math.min(unit2.health, 5 - unit1.heath);
		unit1.addPeople(transfer);
		unit2.subtractPeople(transfer,false);
	}
};