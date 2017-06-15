// singleton
var Global = {
    sessionID: guid(), // keep this value the same across game restarts!
    turn: 1,
    freedom: 0,
    unrest: 0,
    startingMoney: 30,
    money: 30,
    privateMoney: 0,
    moneyPerTurn: 0,
    thermometerFill: 0,
    thermometerDelta: 0,
    yearViewData: [],       // Year Entry follows format {year: xxxx, population: xxxx, employmentPercent: xx%, homelessPercent: xx%, publicFunds: ₸xxxx}
    turnTimer: null,
    gameTimer: null,

    // Internal Global States
    buildMenuOpened: false,    // Set to true the first time the player opens the build menu
    buildMenuIsOpen: false,    // Similar to buildMenuOpened, but tells whether the build menu is open in a given instant.
    boughtRoad: false,         // Has the player at least attempted to buy a road yet?
    contractIsOpen: false,     // Flag that shows whether or not a contract is open
    isBuilding: false,         // Is the player trying to build a building?

    nextTurn: function() {
        // Send the MOTHER OF ALL TELEMETRY PAYLOADS
        var bureaucratMinister = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat)[0];
        var merchantMinister = MainGame.population.typeRoleList(Person.Hi, Person.Merchant)[0];
        var militaryMinister = MainGame.population.typeRoleList(Person.Hi, Person.Military)[0];

        Telemetry.send({
            type: 'turn_completed',
            turnTime: Global.turnTimer.seconds,
            turn: Global.turn,
            money: Global.money,
            moneyPerTurn: Global.moneyPerTurn,
            privateMoney: Global.privateMoney,
            totalPopulation: MainGame.population.count(),
            workingClassPopulation: MainGame.population.lowList().length,
            bureaucratCount: MainGame.population.roleList(Person.Bureaucrat).length,
            militaryCount: MainGame.population.roleList(Person.Military).length,
            financeCount: MainGame.population.roleList(Person.Merchant).length,
            bureaucratMinister: (bureaucratMinister === undefined ? '' : bureaucratMinister.name),
            bureaucratPay: (bureaucratMinister === undefined ? 0 : bureaucratMinister.salary),
            merchantMinister: (merchantMinister === undefined ? '' : merchantMinister.name),
            merchantPay: (merchantMinister === undefined ? 0 : merchantMinister.salary),
            militaryMinister: (militaryMinister === undefined ? '' : militaryMinister.name),
            militaryPay: (militaryMinister === undefined ? 0 : militaryMinister.salary),
            hasRiot: (MainGame.board.findUnits(Unit.Riot).length > 0),
            freedom: Global.freedom,
            unrest: Global.unrest,
            pressure: Global.thermometerFill,
        });

        MainGame.hud.setEndTurnActive(false);
        ++Global.turn;

        // Check no ministry fail before we do any updates (to make sure the player intentionally ended their turn with no ministers)
        if (!Global.checkNoMinistryFail()) {
            // Then, let's start going through the sequence of update functions
            showMinisterDemotions(function() {
                showThermometerUpdate(function() {
                    showUnitAction(function() {
                        showNewBuildings(function() {
                            showHomelessCamps(function() {
                                concludeNextTurnSequence();

                                /*global MainGame*/
                                MainGame.board.nextTurn(Global.turn);

                                Global.updateMoneyPerTurn();
                                Global.money += Global.moneyPerTurn;
                                Global.checkGameFail();
                                
                                // Makes sure we record the state after updating all the game info
                                Global.updateYearViewData();

                                MainGame.hud.setEndTurnActive(true);
                            });
                        });
                    });
                });
            });
        }

        // Reset the turn timer
        Global.turnTimer.stop();
        Global.turnTimer.start();
    },

    toString: function(){
        var string = "Freedom: "+this.freedom+"%  Unrest: "+this.unrest+"%  $="+this.money+"K (";
        if(this.moneyPerTurn >= 0){string += "+"+this.moneyPerTurn+"K/turn)";}
        else{string += "-"+this.moneyPerTurn+"/turn)"};
        return string;
    },

    // Finds the current Freedom value by averaging the health and education of all low people
    updateFreedomUnrest: function() {
        var freeAv = 0;
        var unrestAv = 0;
        /*global MainGame*/
        var lowList = MainGame.population.lowList();
        
        for (var index = 0; index < lowList.length; ++index) {
            // =================================================================
            // TODO: change later when influential members are a thing
            if (lowList[index].health >= 50 && lowList[index].education >= 50 && lowList[index].shelter >= 50)
                continue;
            // =================================================================
            freeAv += lowList[index].freedom;
            unrestAv += lowList[index].unrest;
        }

        freeAv = Math.round(freeAv/lowList.length, 0);
        unrestAv = Math.round(unrestAv/lowList.length, 0);

        Global.freedom = Phaser.Math.clamp(freeAv + MainGame.board.findBuilding(null,null,"road",null).length, 0, 100);
        Global.unrest = Phaser.Math.clamp(unrestAv + MainGame.population.findNotEmployed().length + MainGame.population.findNotHoused().length, 0, 100);
    },

    updateMoneyPerTurn: function(){
        var totalIncome = 0;
        /*global MainGame*/
        var buildings = MainGame.board.findBuilding(null,null,null,"money");

        for (var bldIndex = 0; bldIndex < buildings.length; ++bldIndex) {
            var building = MainGame.board.at(buildings[bldIndex]).building;
            var effectList = building.effects;
            for (var effIndex = 0; effIndex < effectList.length; ++effIndex) {
                if (effectList[effIndex].type === "money") {
                    // console.log("Building: "+building.name+" people: "+building.people+" output: "+effectList[effIndex].outputTable[building.people]);
                    totalIncome += effectList[effIndex].outputTable[building.people];
                }
            }
        }

        Global.moneyPerTurn = totalIncome;
    },

    checkNoMinistryFail: function() {
        // No ministers - loss due to failure to form government
        if (MainGame.population.highList().length === 0) {
            getGameLoseWindow("Without any active Ministers, you government has dissolved. You lose.");
            return true;
        } else return false;
    },

    checkGameFail: function() {
        // No palace - Loss due to revolution
        var housing = MainGame.board.findBuilding('palace');

        if (housing.length === 0) {
            getGameLoseWindow("Your palace was stormed by revolutionaires. You lose.");
            return;
        }

        // No money - loss due to economic failure
        if (this.money < 0 && this.moneyPerTurn < 0) {
            getGameLoseWindow("Your government is bankrupt and can no longer function. You lose.");
            return;
        }

        // All Ministers Coup'ing - loss due to Coup
        // if (this.coups.bureaucrats && this.coups.finance && this.coups.military) {
        //     getGameLoseWindow("You have been deposed of in a Coup D'etat. You lose.");
        //     return;
        // }
    },

    updateYearViewData: function() {
        var homeless     = MainGame.population.findNotHoused().length;
        var jobless      = MainGame.population.findNotEmployed().length;
        var workingClass = MainGame.population.lowList().length;

        this.yearViewData[this.yearViewData.length] = {
            year:              1949 + this.turn,
            population:        MainGame.population.count(),
            employmentPercent: Math.floor(100 - (jobless / workingClass) * 100),
            homelessPercent:   Math.floor((homeless / workingClass) * 100),
            publicFunds:       this.money
        };
    },

    restart: function() {
        var bureaucratMinister = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat)[0];
        var merchantMinister = MainGame.population.typeRoleList(Person.Hi, Person.Merchant)[0];
        var militaryMinister = MainGame.population.typeRoleList(Person.Hi, Person.Military)[0];

        Telemetry.send({
            type: 'game_restarted',
            turnTime: Global.turnTimer.seconds,
            gameTime: Global.gameTimer.seconds,
            turn: Global.turn,
            money: Global.money,
            moneyPerTurn: Global.moneyPerTurn,
            privateMoney: Global.privateMoney,
            totalPopulation: MainGame.population.count(),
            workingClassPopulation: MainGame.population.lowList().length,
            bureaucratCount: MainGame.population.roleList(Person.Bureaucrat).length,
            militaryCount: MainGame.population.roleList(Person.Military).length,
            financeCount: MainGame.population.roleList(Person.Merchant).length,
            bureaucratMinister: (bureaucratMinister === undefined ? '' : bureaucratMinister.name),
            bureaucratPay: (bureaucratMinister === undefined ? 0 : bureaucratMinister.salary),
            merchantMinister: (merchantMinister === undefined ? '' : merchantMinister.name),
            merchantPay: (merchantMinister === undefined ? 0 : merchantMinister.salary),
            militaryMinister: (militaryMinister === undefined ? '' : militaryMinister.name),
            militaryPay: (militaryMinister === undefined ? 0 : militaryMinister.salary),
            hasRiot: (MainGame.board.findUnits(Unit.Riot).length > 0),
            freedom: Global.freedom,
            unrest: Global.unrest,
            pressure: Global.thermometerFill,
        });

        // Reset the game timer
        Global.gameTimer.stop();
        Global.gameTimer.start();

        MainGame.music.stop();
        MainGame.game.state.restart();
        MainGame.global.money = Global.startingMoney;
        MainGame.global.moneyPerTurn = 0;
        MainGame.global.freedom = 0;
        MainGame.global.unrest = 0;
        MainGame.global.thermometerFill = 0;
        MainGame.global.thermometerDelta = 0;
    },
};

function getGameLoseWindow(message) {
    var e = Event.createNew();
    e.setModel([
                    {
                        portrait: 'exclamation_01', 
                        description: message, 
                        buttonTexts: ["Restart"]
                    }
                ]);

    e.setController([
        [function() {
            var bureaucratMinister = MainGame.population.typeRoleList(Person.Hi, Person.Bureaucrat)[0];
            var merchantMinister = MainGame.population.typeRoleList(Person.Hi, Person.Merchant)[0];
            var militaryMinister = MainGame.population.typeRoleList(Person.Hi, Person.Military)[0];

            Telemetry.send({
                type: 'game_lost',
                message: message,
                turnTime: Global.turnTimer.seconds,
                gameTime: Global.gameTimer.seconds,
                turn: Global.turn,
                money: Global.money,
                moneyPerTurn: Global.moneyPerTurn,
                privateMoney: Global.privateMoney,
                totalPopulation: MainGame.population.count(),
                workingClassPopulation: MainGame.population.lowList().length,
                bureaucratCount: MainGame.population.roleList(Person.Bureaucrat).length,
                militaryCount: MainGame.population.roleList(Person.Military).length,
                financeCount: MainGame.population.roleList(Person.Merchant).length,
                bureaucratMinister: (bureaucratMinister === undefined ? '' : bureaucratMinister.name),
                bureaucratPay: (bureaucratMinister === undefined ? 0 : bureaucratMinister.salary),
                merchantMinister: (merchantMinister === undefined ? '' : merchantMinister.name),
                merchantPay: (merchantMinister === undefined ? 0 : merchantMinister.salary),
                militaryMinister: (militaryMinister === undefined ? '' : militaryMinister.name),
                militaryPay: (militaryMinister === undefined ? 0 : militaryMinister.salary),
                hasRiot: (MainGame.board.findUnits(Unit.Riot).length > 0),
                freedom: Global.freedom,
                unrest: Global.unrest,
                pressure: Global.thermometerFill,
            });

            Global.restart();
        }]
    ]);
}

// Generate a 'good-enough' GUID to be used as a session ID. Thanks https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}