var BuildingDetail = {
    verticalBorderWidth: 30,
    horizontalBorderWidth: 20,
    nameStyle: { font:"22px myKaiti", fill:"black", boundsAlignH:"top", boundsAlignV:"middle", shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 1, shadowOffsetY: 1 },
    buttonStyle: { font:"20px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle" },
    descriptionStyle: { font:"22px myKaiti", fill:"black", boundsAlignH:"top", boundsAlignV:"middle", wordWrap: true, wordWrapWidth: 353, shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 1, shadowOffsetY: 1 },
    listStyle: { font:"20px myKaiti", fill:"white", boundsAlignH:"top", boundsAlignV:"middle", wordWrap: true, wordWrapWidth: 353, shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },

    createNew: function(buildingIndex) {
        console.assert(buildingIndex || buildingIndex === 0);

        var board = MainGame.board;
        var building = board.at(buildingIndex).getBuilding();

        var view = game.add.sprite(0, 0, 'building_detail_backpanel');
        view.inputEnabled = true;
        view.input.priorityID = 101;
        view.anchor.set(0.5, 0.5);
        view.x = MainGame.game.width / 2;
        view.y = MainGame.game.height / 4;
        view.alpha = 0;
        var rand = [Math.random(),Math.random(),Math.random()];
        var offsetX = (Math.sqrt(Math.abs(2*rand[0]-1))*((2*rand[0]-1)/Math.abs(2*rand[0]-1)))*25;
        var offsetY = (Math.sqrt(Math.abs(2*rand[1]-1))*((2*rand[1]-1)/Math.abs(2*rand[1]-1)))*25;
        var rotation = (Math.sqrt(Math.abs(2*rand[2]-1))*((2*rand[2]-1)/Math.abs(2*rand[2]-1)))*1.5;

        var viewTween = MainGame.game.add.tween(view).to({alpha:1},250,Phaser.Easing.Cubic.In,true);
        var rotTween = MainGame.game.add.tween(view).to({x:(MainGame.game.width/2)+offsetX, y:(MainGame.game.height/2)+offsetY,angle:rotation},400,Phaser.Easing.Back.Out,true);

        if (building.subtype === 'housing') {
            var availableNoun = 'bed';
            var addPersonString = 'Add Resident';
            var removePersonString = 'Evict Resident';
            view.residential = true;
        } else {
            var availableNoun = 'job';
            var addPersonString = 'Hire Worker';
            var removePersonString = 'Fire Worker';
            view.residential = false;
        }

        // setup the mask
        /* global DUiMask */
        view.uiMask = DUiMask.createNew();
        view.uiMask.setController(100, function() {
            view.closeSfx.play();
            view.uiMask.destroy();
            view.destroy();
            board.controller.detailView = null;
        });

        // Class variables
        view.index = buildingIndex;
        view.iconFrame = MainGame.game.make.sprite(0, 0, 'detail_icon_frame');
        view.icon = MainGame.game.make.sprite(0, 0, building.detailIconTexture);;
        view.icon.x = (-view.width / 2) + this.horizontalBorderWidth;
        view.icon.y = (-view.height / 2) + this.verticalBorderWidth;
        view.iconFrame.x = -8;
        view.iconFrame.y = -8;
        view.icon.addChild(view.iconFrame);
        view.addChild(view.icon);

        view.buildingName = MainGame.game.make.text(view.icon.x, view.icon.y + view.icon.height + 10, building.playerLabel + ' ', this.nameStyle);
        view.addChild(view.buildingName);

        // Create the deploy, recall buttons as necessary
        if (building.name === 'armyBase') {
            var position = {
                x: 0,
                y: -view.width/2 + this.verticalBorderWidth,
            };
            view.deployButton = TextButton.createNew(position.x, position.y, 'small_generic_button', function() {
                view.deploySoldiers(buildingIndex);
            }, null, 0, 2, 1, 2, 'Deploy Soldiers', this.buttonStyle);
            view.deployButton.input.priorityID = 102;
            view.deployButton.visible = !building.squadDeployed;

            view.recallButton = TextButton.createNew(position.x, position.y, 'small_generic_button', function() {
                view.recallSoldiers(buildingIndex);
            }, null, 0, 2, 1, 2, 'Recall Soldiers', this.buttonStyle);
            view.recallButton.input.priorityID = 102;
            view.recallButton.visible = building.squadDeployed;

            view.addChild(view.recallButton);
            view.addChild(view.deployButton);
        } else { // Otherwise, give the usual description
            view.textDescription = MainGame.game.make.text(0, 0, '', this.descriptionStyle);
            view.textDescription.x = view.icon.x + view.icon.width + this.horizontalBorderWidth/2 + 2;
            view.textDescription.y = -view.height/2 + this.verticalBorderWidth;
            view.addChild(view.textDescription);
        }

        // view.descriptionArea = MainGame.game.make.group();
        // view.addChild(view.descriptionArea);

        // ListView Background
        var background = MainGame.game.make.graphics();
        var backgroundX = (-view.width/2) + this.horizontalBorderWidth;
        var backgroundY = -85;
        var backgroundWitdh = view.width - (this.horizontalBorderWidth * 2);
        var backgroundHeight = 125;
        background.lineStyle(0);
        background.beginFill(0x000000, 0.66);
        background.drawRect(backgroundX, backgroundY, backgroundWitdh, backgroundHeight);
        background.endFill();
        view.addChild(background);

        // DPageIndicator: N pages
        view.itemsPerPage = 5;
        var pageCount = Math.ceil(building.people / view.itemsPerPage);
        view.pageIndicator = DPageIndicator.createNew((view.width*1/8),{x:(view.width*1/2),y:0}); //width, textPos
        view.pageIndicator.setModel(0, pageCount); // current, max
        view.pageIndicator.setController(function(index){ BuildingDetail.onPageChanged(view, index); }, 111);
        view.pageIndicator.x = -(view.width*1/2);
        view.pageIndicator.y = (view.height*1/8);
        view.pageIndicator.visible = (pageCount > 1);
        view.addChild(view.pageIndicator);

        // ListView
        view.occupantListView = DListView.createNew(
            {},                  // don't need textures
            {l:15, t:40},        // margin inside the list view
            {w:400, h:22},       // size of an item
            function(index){  }, // forwards the callback
            false,               // not horizontal
            110                  // priority ID
        );
        BuildingDetail._setupListView_(view, 0);
        view.occupantListView.x = -view.width/2 + this.horizontalBorderWidth;
        view.occupantListView.y = -120;
        view.addChild(view.occupantListView);

        // Availability Text
        var availibilityString = (building.maxPeople - building.people) + ' ' + availableNoun + 's available';
        view.availabilityText = MainGame.game.make.text(0, 0, availibilityString, this.descriptionStyle); // Example: 3 jobs available, or No beds available
        view.availabilityText.anchor.set(0.5, 0.5);
        view.availabilityText.y = (view.height*9/48);
        view.addChild(view.availabilityText);

        if (building.subtype !== "road" && building.name !== "palace" && building.startingTurn <= MainGame.global.turn) {
            // Hire button
            view.addPersonButton = TextButton.createNew(0, 0, 'small_generic_button', 
                function() {BuildingDetail._onHireButtonPressed_(view)}, view, 0, 2, 1, 2, addPersonString, this.buttonStyle);

            view.addPersonButton.input.priorityID = 102;
            view.addPersonButton.x = -view.width/4 - view.addPersonButton.width/2;
            view.addPersonButton.y = view.height/2 - view.addPersonButton.height*2 - this.verticalBorderWidth - 5;
            view.addChild(view.addPersonButton);

            if (building.people >= building.maxPeople) {
                view.addPersonButton.visible = false;
            }

            // Fire button
            view.removePersonButton = TextButton.createNew(0, 0, 'small_generic_button',
                function() {BuildingDetail._onFireButtonPressed_(view)}, view, 0, 2, 1, 2, removePersonString, this.buttonStyle);

            view.removePersonButton.input.priorityID = 102;
            view.removePersonButton.x = view.width/4 - view.removePersonButton.width/2;
            view.removePersonButton.y = view.height/2 - view.removePersonButton.height*2 - this.verticalBorderWidth - 5;
            view.addChild(view.removePersonButton);

            if (building.people <= 0) {
                view.removePersonButton.visible = false;
            }

            // Demolish button
            view.demolishButton = TextButton.createNew(0, 0, 'small_generic_button',
                function() { BuildingDetail.demolishBuilding(view); }, view, 0, 2, 1, 2, 'Demolish -₸10', this.buttonStyle);

            view.demolishButton.input.priorityID = 102;
            view.demolishButton.x = -view.demolishButton.width/2;
            view.demolishButton.y = view.height/2 - view.demolishButton.height - this.verticalBorderWidth;
            view.addChild(view.demolishButton);
        }

        // Audio
        view.openSfx = MainGame.game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds
        view.openSfx.play();
        view.closeSfx = MainGame.game.make.audio('message_close');
        view.add_remove_sfx = MainGame.game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        view.demolishSfx = MainGame.game.make.audio('building_placement_' + Math.ceil(Math.random()*5)); // Assume we have 5 building sounds

        view.scale.setTo(2,2);

        var scaleTween = MainGame.game.add.tween(view.scale).to({x:1,y:1},250,Phaser.Easing.Quadratic.In,true);

        // Class func
        view.updateInfo = function(tile) { return BuildingDetail.updateInfo(view,tile); };
        view.deploySoldiers = function(buildingIndex) { BuildingDetail.deploySoldiers(view, buildingIndex); };
        view.recallSoldiers = function(buildingIndex) { BuildingDetail.recallSoldiers(view, buildingIndex); };

        return view;
    },

    // event process
    _onHireButtonPressed_: function(view) {
        /*global MainGame*/
        var bld = MainGame.board.at(view.index).building;
        console.assert(bld, "Building can NOT be null!");

        if (bld.people >= bld.maxPeople)
            return;
        if (MainGame.population.hire(view.index)) {
            if (bld.people >= bld.maxPeople) {
                view.addPersonButton.visible = false;
            }
            view.removePersonButton.visible = true;

            // update display
            BuildingDetail._updateAvailabilityText(view, bld);

            if (!view.residential) {
                BuildingDetail._updateState(view, bld);
            }

            BuildingDetail._setupListView_(view, 0);

            // Play some funky music white boi
            view.add_remove_sfx.play();
            view.add_remove_sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds

            /*global updatePopulation*/
            updatePopulation(false, false);
        }else{
            // Play an error sound
            view.add_remove_sfx.play();
            view.add_remove_sfx = game.make.audio('empty_click_' + Math.ceil(Math.random()*5)); // Assume we have 14 cloth click sounds
        }
    },

    _onFireButtonPressed_: function(view) {
        // Get the building
        /*global MainGame*/
        var bld = MainGame.board.at(view.index).building;
        console.assert(bld, "Building can NOT be null!");
        if (bld.people <= 0)
            return;

        // Get a citizen from that building (assume at least one occupant)
        if (view.residential) {
            var occupants = MainGame.population.getHouseMap()[view.index];
        } else {
            var occupants = MainGame.population.getWorkMap()[view.index];
        }
        var citizen = MainGame.population.at(occupants[0]);
        
        // Fire that person
        if(MainGame.population.firePersonAt(citizen, view.index)){
            // Update button visibilty as needed
            if (bld.people <= 0) {
                view.removePersonButton.visible = false;
            }
            view.addPersonButton.visible = true;

            // update display
            BuildingDetail._updateAvailabilityText(view, bld);

            // If we're a workplace, update relevant gamestates
            if (!view.residential) {
                BuildingDetail._updateState(view, bld);
            }

            // Update the list view
            BuildingDetail._setupListView_(view, 0);

            // Play some funky music white boi
            view.add_remove_sfx.play();
            view.add_remove_sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds

            /*global updatePopulation*/
            updatePopulation(false,false);
        } else {
            // Play an error sound
            view.add_remove_sfx.play();
            view.add_remove_sfx = game.make.audio('empty_click_' + Math.ceil(Math.random()*5)); // Assume we have 14 cloth click sounds
        }
    },

    onPageChanged: function(view, index) {
        BuildingDetail._setupListView_(view, index);
    },

    /* Get's a simple string describing a buildings output (or input) */
    _getStatusString: function(outputValue, outputName) {
        var description = '';

        if (outputName === 'freedom' || outputName === 'unrest') {
            description = outputValue + ' ' + outputName + '.';
        } if (outputName === 'money') {
            description = '₸' + outputValue + ' each turn.';
        } else if (outputValue === 0) {
            description = "no " + outputName + ".";
        } else if (outputValue > 0 && outputValue < 25) {
            description = "little " + outputName + ".";
        } else if (outputValue >= 25 && outputValue < 50) {
            description = "some " + outputName + ".";
        } else if (outputValue >= 50 && outputValue < 75) {
            description = "a lot of " + outputName + ".";
        } else description = "maximum " + outputName + ".";

        return description;
    },

    // Forms a sprite that represents an entry in the listview
    _makeEntry_: function(citizen, residential) {
        var entrySprite = MainGame.game.make.sprite(0, 0);
        var entryString;

        if (residential) {
            if (citizen.type === Person.Low) {
                entryString = citizen.name + ' (';
                if (citizen.workplace === null) {
                    entryString += 'Unemployed';
                } else {
                    var workplace = MainGame.board.at(citizen.workplace).building;
                    switch (workplace.name) {
                        case 'school':
                            entryString += 'School Teacher';
                            break;
                        case 'fertileFarm':
                        case 'weakFarm':
                            entryString += 'Farmer';
                            break;
                        case 'lumberYard':
                            entryString += 'Factory Worker';
                            break;
                        case 'armyBase':
                            entryString += 'Soldier';
                            break;
                        default:
                            entryString += 'MISSING JOBNAME';

                    }
                }

                entryString += ')';
            } else if (citizen.type === Person.Mid) {
                entryString = citizen.name + ' (';

                switch (citizen.role) {
                    case Person.Bureaucrat:
                        entryString += 'Elite Bureaucrat';
                        break;
                    case Person.Military:
                        entryString += 'Elite Military Officer';
                        break;
                    case Person.Merchant:
                        entryString += 'Elite Financier';
                        break;
                    default:
                        entryString += 'MISSING ROLE NAME';
                }

                entryString += ')';
            } else if (citizen.type === Person.Hi) {
                entryString = citizen.name + ' (';

                switch (citizen.role) {
                    case Person.Bureaucrat:
                        entryString += 'Minster of Bureaucracy';
                        break;
                    case Person.Military:
                        entryString += 'Minister of the Military';
                        break;
                    case Person.Merchant:
                        entryString += 'Minister of Finance';
                        break;
                    default:
                        entryString += 'MISSING ROLE NAME';
                }

                entryString += ')';
            }
        } else {
            // Else, it's a workplace
            entryString = citizen.name + ' (';
            if (citizen.home !== null) {
                entryString += MainGame.board.at(citizen.home).getBuilding().playerLabel + ')'
            } else {
                entryString += 'Homeless)'
            }
        }

        var entryText = MainGame.game.make.text(0, 0, entryString, this.listStyle);
        entrySprite.addChild(entryText);
        return entrySprite;
    },

    // Populate our listview
    _setupListView_: function(view, pageIndex) {
        view.occupantListView.removeAll();

        if (view.residential) {
            var occupants = MainGame.population.getHouseMap()[view.index];
        } else {
            var occupants = MainGame.population.getWorkMap()[view.index];
        }

        var startIndex = pageIndex * view.itemsPerPage;
        var endIndex = Math.min(startIndex+view.itemsPerPage, occupants.length);

        for (var i = startIndex; i < endIndex; i++) {
            var citizen = MainGame.population.at(occupants[i]);
            view.occupantListView.add(BuildingDetail._makeEntry_(citizen, view.residential));
        }

        // See if we should show a page indicator
        var pageCount = Math.ceil(occupants.length / view.itemsPerPage);
        view.pageIndicator.visible = (pageCount > 1);
    },

    // Demolish a building!
    demolishBuilding: function(view) {
        if (Global.money >= 10) {
            if (view.residential) {
                var occupants = MainGame.population.getHouseMap()[view.index];
            } else {
                var occupants = MainGame.population.getWorkMap()[view.index];
            }

            // Evict all residents
            for (var i in occupants) {
                MainGame.population.fire(view.index);
            }

            /*global updatePopulation*/
            updatePopulation(false,false);

            // Remove the building at view.index
            MainGame.board.at(view.index).removeBuilding();

            // Bill the player
            Global.money -= 10;

            // Close the Detail View
            view.demolishSfx.play();
            view.uiMask.destroy();
            view.demolishButton.freezeFrames = true;
            view.destroy();
            MainGame.board.controller.detailView = null;
        }
    },

    _updateAvailabilityText: function(view, building) {
        if (view.residential) {
            var availableNoun = 'bed';
            var occupantNoun = 'resident';
            var globalAvailability = MainGame.population.findNotHoused().length;
            var citizenType = 'homeless';
        } else {
            var availableNoun = 'job';
            var occupantNoun = 'worker';
            var globalAvailability = MainGame.population.findNotEmployed().length;
            var citizenType = 'jobless'
        }

        var availability = building.maxPeople - building.people;

        // Pluralize!
        if (availability !== 1) availableNoun += 's';
        if (building.people !== 1) occupantNoun += 's';

        view.availabilityText.text = building.people + ' ' + occupantNoun + ' | ' + availability + ' ' + availableNoun + ' available | ' + globalAvailability + ' ' + citizenType;
    },

    // When a non-housing building gets a worker added or removed, some states need to get updated
    _updateState: function(view, building) {
        if (building.name == "armyBase")
            return;
        
        var sentenceStart = 'This building generates ';

        var str3 = '';
        var str4 = '';
        var str5 = '';

        for(var outIndex = 0; outIndex < building.effects.length; outIndex++) {
            var outType = building.effects[outIndex].type;
            var outValue = building.effects[outIndex].outputTable[building.people];

            /*global updateHomesNearOutput*/
            updateHomesNearOutput(view.index);
            MainGame.global.updateMoneyPerTurn();

            // fix the apartment firing people bug
            if (building.effects[outIndex].type === null)
                break;

            if (outIndex === 0) {
                str3 = sentenceStart + BuildingDetail._getStatusString(outValue, outType);;
            } else if(outIndex === 1) {
                str4 = sentenceStart + BuildingDetail._getStatusString(outValue, outType);;
            } else if(outIndex === 2) {
                str5 = sentenceStart + BuildingDetail._getStatusString(outValue, outType);;
            }
        }

        view.textDescription.text = str3 + '\n' + str4 + '\n' + str5;
    },

    updateInfo: function(view, tile) {
        if (!tile.hasBuilding() || tile.getBuilding().name == "armyBase")
            return;

        BuildingDetail._updateAvailabilityText(view, tile.getBuilding());

        var b = MainGame.board;
        var bld = tile.getBuilding();

        var str3 = '';
        var str4 = '';
        var str5 = '';
        
        if (view.residential) {
            var sentenceStart = 'This building recieves ';
            str3 = sentenceStart + BuildingDetail._getStatusString(bld.health, 'health');
            str4 = sentenceStart + BuildingDetail._getStatusString(bld.health, 'culture');
            str5 = sentenceStart + BuildingDetail._getStatusString(bld.health, 'shelter');
        }

        if (bld.effects[0].type !== null) {
            for (var outIndex=0; outIndex < bld.effects.length; ++outIndex) {
                var outType = bld.effects[outIndex].type;
                var outValue = bld.effects[outIndex].outputTable[bld.people];
                var sentenceStart = 'This building generates ';
        
                if (outIndex === 0) {
                    str3 = sentenceStart + BuildingDetail._getStatusString(outValue, outType);
                } else if(outIndex === 1) {
                    str4 = sentenceStart + BuildingDetail._getStatusString(outValue, outType);
                } else if(outIndex === 2) {
                    str5 = sentenceStart + BuildingDetail._getStatusString(outValue, outType);
                }
            }
        }

        view.textDescription.text = str3 + '\n' + str4 + '\n' + str5;
    },

    deploySoldiers: function(view, buildingIndex) {
        var tile = MainGame.board.at(buildingIndex)
        var building = tile.getBuilding();
        if (building.people > 0) {
            Unit.spawnUnitAt(Unit.Army, buildingIndex);
            building.squad = tile.getUnit();
            building.squad.addPeople(building.people-1);
            building.squadDeployed = true;

            // while (building.people > 0) {
            //     building.removePerson();
            // }
            // /*global updatePopulation*/
            // updatePopulation(false, false);

            view.deployButton.visible = false;
            view.recallButton.visible = true;
        }
    },

    recallSoldiers: function(view, buildingIndex) {
        var building = MainGame.board.at(buildingIndex).getBuilding();
        building.squad.target = buildingIndex;

        building.squadDeployed = false;

        view.deployButton.visible = true;
        view.recallButton.visible = false;
    },
};

var ResidentialInfoView = {
    makeResidential: function(genericView) {
        // Useful labels - what are we holding in this building? 'x residents | y beds available | z potential occupants'
        genericView.availableNoun = 'bed';
        genericView.occupantNoun = 'resident';
        genericView.nonOccupantType = 'homeless'; // What do you call a person who doesn't have what this building provides to occupants


    }
}