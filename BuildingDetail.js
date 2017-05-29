var BDOverView = {
    createNew: function(buildingIndex, bdInfo) {
        if(!bdInfo && (buildingIndex || buildingIndex === 0)){
            var bdInfo = BDController.getInfo(buildingIndex);
        } else if(!bdInfo){
            console.log("BDOverView error");
            return null;
        }

        var overview = MainGame.game.make.group();
        overview.index = buildingIndex;

        overview.page = Page.createNew();
        overview.page.anchor.setTo(.5,.5);
        overview.addChild(overview.page);

        overview.icon = MainGame.game.make.sprite(0, 0, bdInfo.building.detailIconTexture);
        overview.icon.anchor.setTo(.5,.5);
        overview.iconFrame = MainGame.game.make.sprite(0, 0, 'detail_icon_frame');
        overview.iconFrame.anchor.setTo(.5,.5);
        overview.icon.addChild(overview.iconFrame);
        overview.icon.scale.setTo(.75,.75);
        overview.icon.x = (-overview.width*7/15 + overview.iconFrame.width/2);
        overview.icon.y = (-overview.height*7/15 + overview.iconFrame.height/2);
        overview.addChild(overview.icon);

        overview.buildingName = MainGame.game.make.text(0, 0, bdInfo.building.playerLabel + ' ', BDController.header1);
        overview.buildingName.anchor.setTo(.5,.5);
        overview.addChild(overview.buildingName);
        overview.buildingName.x = overview.width*1/15;
        overview.buildingName.y = overview.icon.y - overview.buildingName.height/2;

        overview.pageName = MainGame.game.make.text(0, 0, "Overview", BDController.header2);
        overview.pageName.anchor.setTo(.5,.5);
        overview.addChild(overview.pageName);
        overview.pageName.x = overview.width*1/15;
        overview.pageName.y = overview.icon.y + overview.pageName.height/2;

        if(bdInfo.building.name === 'palace'){
            overview.occupantsText = MainGame.game.make.text(-overview.width*4/15,-overview.height*10/45,'Residents',BDController.header2);
            overview.occupantsText.anchor.setTo(.5,.5);
        }
        else{
            overview.occupantsText = TextLinkButton.createNew(-overview.width*4/15,-overview.height*10/45,
                (bdInfo.residential?'Residents':'Workers'), BDController.header2,function(){
                    overview.parent.parent.changeTabs(1);
                },overview);
        }
        overview.addChild(overview.occupantsText);
        overview.occupantsIcons = [];
        for(var i = 0; i < bdInfo.building.maxPeople; ++i){
            overview.occupantsIcons.push(MainGame.game.make.sprite(-overview.width*1/3,-overview.height*2/15,'person_icon'));
            overview.occupantsIcons[i].anchor.setTo(.5,.5);

            if(i < bdInfo.building.people)
                overview.occupantsIcons[i].tint = 0x20a020;
            else
                overview.occupantsIcons[i].tint = 0x777777;
            
            overview.occupantsIcons[i].x += overview.occupantsIcons[i].width * i*.6;
            overview.addChild(overview.occupantsIcons[i]);
        }
        var availibilityString = bdInfo.building.people + '/' + bdInfo.building.maxPeople + ' ' + bdInfo.availableNoun + 's taken';
        overview.availabilityText = MainGame.game.make.text(overview.width*1/5,-overview.height*10/45, availibilityString, BDController.body1); // Example: 3 jobs available, or No beds available
        overview.availabilityText.anchor.setTo(.5,.5);
        overview.addChild(overview.availabilityText);

        if(bdInfo.building.name === 'palace'){
            overview.statsText = MainGame.game.make.text(-overview.width*1/6,-overview.height*1/45,'Living Conditions',BDController.header2);
            overview.statsText.anchor.setTo(.5,.5);
        }
        else{
            overview.statsText = TextLinkButton.createNew(-overview.width*1/6,-overview.height*1/45,
                (bdInfo.residential?'Living Conditions':'Building Output'), BDController.header2,function(){
                    overview.parent.parent.changeTabs(2);
                },overview);
        }
        overview.addChild(overview.statsText);
        if(bdInfo.residential){
            overview.shelterText = MainGame.game.make.text(-overview.width*19/45,overview.height*2/45,"Shelter: ",BDController.body1);
            overview.healthText = MainGame.game.make.text(-overview.width*19/45,overview.height*1/9,"Health: ",BDController.body1);
            overview.cultureText = MainGame.game.make.text(-overview.width*19/45,overview.height*8/45,"Culture: ",BDController.body1);
            overview.freedomText = MainGame.game.make.text(-overview.width*19/45,overview.height*11/45,"Freedom: ",BDController.body1);
            overview.unrestText = MainGame.game.make.text(-overview.width*19/45,overview.height*14/45,"Unrest: ",BDController.body1);

            overview.shelterText.anchor.setTo(0,.5);    overview.addChild(overview.shelterText);
            overview.healthText.anchor.setTo(0,.5);     overview.addChild(overview.healthText);
            overview.cultureText.anchor.setTo(0,.5);    overview.addChild(overview.cultureText);
            overview.freedomText.anchor.setTo(0,.5);    overview.addChild(overview.freedomText);
            overview.unrestText.anchor.setTo(0,.5);     overview.addChild(overview.unrestText);

            overview.shelterIcons = []; overview.healthIcons = []; overview.cultureIcons = []; overview.freedomIcons = []; overview.unrestIcons = [];
            for(var i = 0; i < 10; ++i){
                overview.shelterIcons.push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*2/45,'shelter_output_full'));
                overview.healthIcons.push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*1/9,'health_output_full'));
                overview.cultureIcons.push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*8/45,'culture_output_full'));
                overview.freedomIcons.push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*11/45,'freedom_output_full'));
                overview.unrestIcons.push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*14/45,'unrest_output_full'));

                overview.shelterIcons[i].anchor.setTo(.5,.5); overview.shelterIcons[i].scale.setTo(.45,.45);
                overview.healthIcons[i].anchor.setTo(.5,.5); overview.healthIcons[i].scale.setTo(.45,.45);
                overview.cultureIcons[i].anchor.setTo(.5,.5); overview.cultureIcons[i].scale.setTo(.45,.45);
                overview.freedomIcons[i].anchor.setTo(.5,.5); overview.freedomIcons[i].scale.setTo(.45,.45);
                overview.unrestIcons[i].anchor.setTo(.5,.5); overview.unrestIcons[i].scale.setTo(.45,.45);

                if(Math.round(bdInfo.building.shelter/5)*5 >= (i+1)*10)
                    overview.shelterIcons[i].tint = 0x20a020;
                else
                    overview.shelterIcons[i].tint = 0x777777;
                if(Math.round(bdInfo.building.health/5)*5 >= (i+1)*10)
                    overview.healthIcons[i].tint = 0x20a020;
                else
                    overview.healthIcons[i].tint = 0x777777;
                if(Math.round(bdInfo.building.culture/5)*5 >= (i+1)*10)
                    overview.cultureIcons[i].tint = 0x20a020;
                else
                    overview.cultureIcons[i].tint = 0x777777;
                if(Math.round(Math.abs(bdInfo.building.aoeFreedom)/5)*5 >= (i+1)*10)
                    overview.freedomIcons[i].tint = (bdInfo.building.aoeFreedom>0?0x20a020:0xa02020);
                else
                    overview.freedomIcons[i].tint = 0x777777;
                if(Math.round(Math.abs(bdInfo.building.aoeUnrest)/5)*5 >= (i+1)*10)
                    overview.unrestIcons[i].tint = (bdInfo.building.aoeUnrest>0?0x20a020:0xa02020);
                else
                    overview.unrestIcons[i].tint = 0x777777;

                overview.shelterIcons[i].x += overview.shelterIcons[i].width * i*1.1;
                overview.healthIcons[i].x += overview.healthIcons[i].width * i*1.1;
                overview.cultureIcons[i].x += overview.cultureIcons[i].width * i*1.1;
                overview.freedomIcons[i].x += overview.freedomIcons[i].width * i*1.1;
                overview.unrestIcons[i].x += overview.unrestIcons[i].width * i*1.1;

                overview.addChild(overview.shelterIcons[i]);
                overview.addChild(overview.healthIcons[i]);
                overview.addChild(overview.cultureIcons[i]);
                overview.addChild(overview.freedomIcons[i]);
                overview.addChild(overview.unrestIcons[i]);
            }
        } else{
            overview.outputs = [];

            for(var i = 0; i < bdInfo.building.effects.length; ++ i){
                if(bdInfo.building.effects[i].type === "money"){
                    overview.outputs.push({});

                    var effect = bdInfo.building.effects[i];
                    overview.outputs[i].effectText = MainGame.game.make.text(-overview.width*19/45,overview.height*(2+3*i)/45,effect.type.charAt(0).toUpperCase()+effect.type.slice(1),BDController.body1);
                    overview.outputs[i].effectText.anchor.setTo(0,.5);     overview.addChild(overview.outputs[i].effectText);

                    overview.outputs[i].effectIcons = [];
                    for(var j = 0; j < bdInfo.building.maxPeople; ++j){
                        overview.outputs[i].effectIcons.push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,effect.type+'_output_full'));
                        overview.outputs[i].effectIcons[j].anchor.setTo(.5,.5);     overview.outputs[i].effectIcons[j].scale.setTo(.45,.45);
                        
                        if(j < bdInfo.building.people)
                            overview.outputs[i].effectIcons[j].tint = 0x20a020;
                        else
                            overview.outputs[i].effectIcons[j].tint = 0x777777;
                        overview.outputs[i].effectIcons[j].x += overview.outputs[i].effectIcons[j].width * j*1.1;
                        overview.addChild(overview.outputs[i].effectIcons[j]);
                    }
                } else if(bdInfo.building.effects[i].type !== null){
                    overview.outputs.push({});

                    var effect = bdInfo.building.effects[i];
                    overview.outputs[i].effectText = MainGame.game.make.text(-overview.width*19/45,overview.height*(2+3*i)/45,effect.type.charAt(0).toUpperCase()+effect.type.slice(1),BDController.body1);
                    overview.outputs[i].effectText.anchor.setTo(0,.5);     overview.addChild(overview.outputs[i].effectText);

                    var maxOutput = Math.round(Math.abs(effect.outputTable[bdInfo.building.maxPeople])/5)*5;
                    var currentOutput = Math.round(Math.abs(effect.outputTable[bdInfo.building.people])/5)*5

                    overview.outputs[i].effectIcons = [];
                    for(var j = 0; j < Math.ceil(maxOutput/10); ++j){
                        overview.outputs[i].effectIcons.push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,effect.type+'_output_full'));
                        overview.outputs[i].effectIcons[j].anchor.setTo(.5,.5);     overview.outputs[i].effectIcons[j].scale.setTo(.45,.45);

                        if((j+1)*10 <= maxOutput){
                            if(currentOutput >= (j+1)*10)
                                overview.outputs[i].effectIcons[j].tint = (currentOutput > 0?0x20a020:0xa02020);
                            else
                                overview.outputs[i].effectIcons[j].tint = 0x777777;

                            overview.outputs[i].effectIcons[j].x += overview.outputs[i].effectIcons[j].width * j*1.1;
                            overview.addChild(overview.outputs[i].effectIcons[j]);
                        }
                    }
                }
            }
        }

        overview.demolishButton = TextButton.createNew(0, overview.height*2/5, 'small_generic_button',
            function() { BDController.demolishBuilding(overview, bdInfo); },
            overview, 0, 2, 1, 2, 'Demolish -₸10', BDController.buttonStyle);
        overview.demolishButton.input.priorityID = 102;
        overview.demolishButton.x -= overview.demolishButton.width/2;
        overview.demolishButton.y -= overview.demolishButton.height/2;
        overview.addChild(overview.demolishButton);

        overview.openSfx = MainGame.game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds
        overview.openSfx.play();
        overview.closeSfx = MainGame.game.make.audio('message_close');
        overview.add_remove_sfx = MainGame.game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        overview.demolishSfx = MainGame.game.make.audio('building_placement_' + Math.ceil(Math.random()*5)); // Assume we have 5 building sounds

        return overview;
    },
};

var BDOccupants = {
    createNew: function(buildingIndex, bdInfo) {
        if(!bdInfo && (buildingIndex || buildingIndex === 0)){
            var bdInfo = BDController.getInfo(buildingIndex);
        } else if(!bdInfo){
            console.log("BDOccupants error");
            return null;
        }

        var occupants = MainGame.game.make.group();

        occupants.index = buildingIndex;

        occupants.page = Page.createNew();
        occupants.page.anchor.setTo(.5,.5);
        occupants.addChild(occupants.page);

        occupants.icon = MainGame.game.make.sprite(0, 0, bdInfo.building.detailIconTexture);
        occupants.icon.anchor.setTo(.5,.5);
        occupants.iconFrame = MainGame.game.make.sprite(0, 0, 'detail_icon_frame');
        occupants.iconFrame.anchor.setTo(.5,.5);
        occupants.icon.addChild(occupants.iconFrame);
        occupants.icon.scale.setTo(.75,.75);
        occupants.icon.x = (-occupants.width*7/15 + occupants.iconFrame.width/2);
        occupants.icon.y = (-occupants.height*7/15 + occupants.iconFrame.height/2);
        occupants.addChild(occupants.icon);

        occupants.buildingName = MainGame.game.make.text(0, 0, bdInfo.building.playerLabel + ' ', BDController.header1);
        occupants.buildingName.anchor.setTo(.5,.5);
        occupants.addChild(occupants.buildingName);
        occupants.buildingName.x = occupants.width*1/15;
        occupants.buildingName.y = occupants.icon.y - occupants.buildingName.height/2;

        occupants.pageName = MainGame.game.make.text(0, 0, (bdInfo.residential?'Residents':'Workers'), BDController.header2);
        occupants.pageName.anchor.setTo(.5,.5);
        occupants.addChild(occupants.pageName);
        occupants.pageName.x = occupants.width*1/15;
        occupants.pageName.y = occupants.icon.y + occupants.pageName.height/2;

        // ListView Background
        var background = MainGame.game.make.graphics();
        var backgroundX = (-occupants.width/2) + BDController.horizontalBorderWidth;
        var backgroundY = -85;
        var backgroundWitdh = occupants.width - (BDController.horizontalBorderWidth * 2);
        var backgroundHeight = 125;
        background.lineStyle(0);
        background.beginFill(0x000000, 0.66);
        background.drawRect(backgroundX, backgroundY, backgroundWitdh, backgroundHeight);
        background.endFill();
        occupants.addChild(background);

        // DPageIndicator: N pages
        occupants.itemsPerPage = 5;
        var pageCount = Math.ceil(bdInfo.building.maxPeople / occupants.itemsPerPage);
        occupants.pageIndicator = DPageIndicator.createNew((occupants.width*1/8),{x:(occupants.width*1/2),y:0}); //width, textPos
        occupants.pageIndicator.setModel(0, pageCount); // current, max
        occupants.pageIndicator.setController(function(index){ BDController.setupOccupantList(occupants, bdInfo, index); }, 111);
        occupants.pageIndicator.x = -(occupants.width*1/2);
        occupants.pageIndicator.y = (occupants.height*1/8);
        occupants.pageIndicator.visible = (pageCount > 1);
        occupants.addChild(occupants.pageIndicator);

        // ListView
        occupants.occupantListView = DListView.createNew(
            {},                  // don't need textures
            {l:15, t:40},        // margin inside the list view
            {w:400, h:22},       // size of an item
            function(index){  }, // forwards the callback
            false,               // not horizontal
            110                  // priority ID
        );
        BDController.setupOccupantList(occupants, bdInfo, 0);
        occupants.occupantListView.x = -occupants.width/2 + BDController.horizontalBorderWidth;
        occupants.occupantListView.y = -120;
        occupants.addChild(occupants.occupantListView);

        // Hire button
        occupants.addPersonButton = TextButton.createNew(0, 0, 'small_generic_button', 
            function() {BDController.onHireButtonPressed(occupants, bdInfo)}, occupants, 0, 2, 1, 2, bdInfo.addPersonString, BDController.buttonStyle);

        occupants.addPersonButton.input.priorityID = 102;
        occupants.addPersonButton.x = -occupants.width/4 - occupants.addPersonButton.width/2;
        occupants.addPersonButton.y = occupants.height/2 - occupants.addPersonButton.height*2 - BDController.verticalBorderWidth - 5;
        occupants.addChild(occupants.addPersonButton);

        if (bdInfo.building.people >= bdInfo.building.maxPeople) {
            occupants.addPersonButton.visible = false;
        }

        // Fire button
        occupants.removePersonButton = TextButton.createNew(0, 0, 'small_generic_button',
            function() {BDController.onFireButtonPressed(occupants, bdInfo)}, occupants, 0, 2, 1, 2, bdInfo.removePersonString, BDController.buttonStyle);

        occupants.removePersonButton.input.priorityID = 102;
        occupants.removePersonButton.x = occupants.width/4 - occupants.removePersonButton.width/2;
        occupants.removePersonButton.y = occupants.height/2 - occupants.removePersonButton.height*2 - BDController.verticalBorderWidth - 5;
        occupants.addChild(occupants.removePersonButton);

        if (bdInfo.building.people <= 0) {
            occupants.removePersonButton.visible = false;
        }

        occupants.openSfx = MainGame.game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds
        occupants.openSfx.play();
        occupants.closeSfx = MainGame.game.make.audio('message_close');
        occupants.add_remove_sfx = MainGame.game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        occupants.demolishSfx = MainGame.game.make.audio('building_placement_' + Math.ceil(Math.random()*5)); // Assume we have 5 building sounds

        return occupants;
    },
};

var BDOutput = {
    createNew: function(buildingIndex, bdInfo) {
        if(!bdInfo && (buildingIndex || buildingIndex === 0)){
            var bdInfo = BDController.getInfo(buildingIndex);
        } else if(!bdInfo){
            console.log("BDOutput error");
            return null;
        }

        var output = MainGame.game.make.group();

        output.page = Page.createNew();
        output.page.anchor.setTo(.5,.5);
        output.addChild(output.page);

        output.icon = MainGame.game.make.sprite(0, 0, bdInfo.building.detailIconTexture);
        output.icon.anchor.setTo(.5,.5);
        output.iconFrame = MainGame.game.make.sprite(0, 0, 'detail_icon_frame');
        output.iconFrame.anchor.setTo(.5,.5);
        output.icon.addChild(output.iconFrame);
        output.icon.scale.setTo(.75,.75);
        output.icon.x = (-output.width*7/15 + output.iconFrame.width/2);
        output.icon.y = (-output.height*7/15 + output.iconFrame.height/2);
        output.addChild(output.icon);

        output.buildingName = MainGame.game.make.text(0, 0, bdInfo.building.playerLabel + ' ', BDController.header1);
        output.buildingName.anchor.setTo(.5,.5);
        output.addChild(output.buildingName);
        output.buildingName.x = output.width*1/15;
        output.buildingName.y = output.icon.y - output.buildingName.height/2;

        output.pageName = MainGame.game.make.text(0, 0, (bdInfo.residential?'Living Conditions':'Building Output'), BDController.header2);
        output.pageName.anchor.setTo(.5,.5);
        output.addChild(output.pageName);
        output.pageName.x = output.width*1/15;
        output.pageName.y = output.icon.y + output.pageName.height/2;

        output.openSfx = MainGame.game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds
        output.openSfx.play();
        output.closeSfx = MainGame.game.make.audio('message_close');
        output.add_remove_sfx = MainGame.game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        output.demolishSfx = MainGame.game.make.audio('building_placement_' + Math.ceil(Math.random()*5)); // Assume we have 5 building sounds

        output.outputButtons = ["Shelter", "Health", "Culture", "Freedom", "Unrest"];
        for(var i = 0; i < output.outputButtons.length; ++i){
        }

        // ListView
        output.outputListView = DListView.createNew(
            {},                  // don't need textures
            {l:15, t:40},        // margin inside the list view
            {w:output.width, h:22},       // size of an item
            function(index){  }, // forwards the callback
            false,               // not horizontal
            110                  // priority ID
        );
        BDController.setupOutputList(output, bdInfo, 0);
        output.outputListView.x = -output.width/2 + BDController.horizontalBorderWidth;
        output.outputListView.y = -120;
        output.addChild(output.outputListView);

        return output;
    },
};

var BDMisc = {
    createNew: function(buildingIndex, bdInfo){
        if(!bdInfo && (buildingIndex || buildingIndex === 0)){
            var bdInfo = BDController.getInfo(buildingIndex);
        } else if(!bdInfo){
            console.log("BDMisc error");
            return null;
        }

        var misc = MainGame.game.make.group();

        misc.page = Page.createNew();
        misc.page.anchor.setTo(.5,.5);
        misc.addChild(misc.page);

        misc.icon = MainGame.game.make.sprite(0, 0, bdInfo.building.detailIconTexture);
        misc.icon.anchor.setTo(.5,.5);
        misc.iconFrame = MainGame.game.make.sprite(0, 0, 'detail_icon_frame');
        misc.iconFrame.anchor.setTo(.5,.5);
        misc.icon.addChild(misc.iconFrame);
        misc.icon.scale.setTo(.75,.75);
        misc.icon.x = (-misc.width*7/15 + misc.iconFrame.width/2);
        misc.icon.y = (-misc.height*7/15 + misc.iconFrame.height/2);
        misc.addChild(misc.icon);

        output.buildingName = MainGame.game.make.text(0, 0, bdInfo.building.playerLabel + ' ', BDController.header1);
        output.buildingName.anchor.setTo(.5,.5);
        output.addChild(output.buildingName);
        output.buildingName.x = output.width*1/15;
        output.buildingName.y = output.icon.y - output.buildingName.height/2;

        if(bdInfo.building.name==='armyBase')
            var miscPage = "Deployment";
        else if(bdInfo.building.name==='hospital')
            var miscPage = "Patients";
        else if(bdInfo.building.name==='prison')
            var miscPage = "Inmates"
        output.pageName = MainGame.game.make.text(0, 0, miscPage, BDController.header2);
        output.pageName.anchor.setTo(.5,.5);
        output.addChild(output.pageName);
        output.pageName.x = output.width*1/15;
        output.pageName.y = output.icon.y + output.pageName.height/2;
        
        if (bdInfo.building.name === 'armyBase') {
            var position = {
                x: 0,
                y: -view.width/2 + this.verticalBorderWidth,
            };
            view.deployButton = TextButton.createNew(position.x, position.y, 'small_generic_button', function() {
                view.deploySoldiers(buildingIndex);
            }, null, 0, 2, 1, 2, 'Deploy Soldiers', this.buttonStyle);
            view.deployButton.input.priorityID = 102;
            view.deployButton.visible = !bdInfo.building.squadDeployed;

            view.recallButton = TextButton.createNew(position.x, position.y, 'small_generic_button', function() {
                view.recallSoldiers(buildingIndex);
            }, null, 0, 2, 1, 2, 'Recall Soldiers', this.buttonStyle);
            view.recallButton.input.priorityID = 102;
            view.recallButton.visible = bdInfo.building.squadDeployed;

            view.addChild(view.recallButton);
            view.addChild(view.deployButton);
        }

        misc.openSfx = MainGame.game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds
        misc.openSfx.play();
        misc.closeSfx = MainGame.game.make.audio('message_close');
        misc.add_remove_sfx = MainGame.game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        misc.demolishSfx = MainGame.game.make.audio('building_placement_' + Math.ceil(Math.random()*5)); // Assume we have 5 building sounds

        return misc;
    },
};

var BDController = {
    verticalBorderWidth: 30,
    horizontalBorderWidth: 20,
    header1: { font: "32px myKaiti", fill:"black", shadowBlur: 1, shadowColor: "rgba(0,0,0,.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
    header2: { font: "28px myKaiti", fill:"black", shadowBlur: 0, shadowColor: "rgba(0,0,0,.55)", shadowOffsetX: 1, shadowOffsetY: 1 },
    body1:   { font: "20px myKaiti", fill:"black"},
    nameStyle: { font:"32px myKaiti", fill:"black", shadowBlur: 2, shadowColor: "rgba(0,0,0,1)", shadowOffsetX: 1, shadowOffsetY: 1 },
    buttonStyle: { font:"20px myKaiti", fill:"white"},
    descriptionStyle: { font:"22px myKaiti", fill:"black", wordWrap: true, wordWrapWidth: 353, shadowBlur: 1, shadowColor: "rgba(0,0,0,0.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
    listStyle: { font:"20px myKaiti", fill:"white", wordWrap: true, wordWrapWidth: 353, shadowBlur: 1, shadowColor: "rgba(0,0,0,0.85)", shadowOffsetX: 2, shadowOffsetY: 2 },

    getInfo: function(buildingIndex){
        var buildingInfo = {};
        buildingInfo.building = MainGame.board.at(buildingIndex).getBuilding();

        if (buildingInfo.building.subtype === 'housing') {
            buildingInfo.availableNoun = 'Room';
            buildingInfo.addPersonString = 'Add Resident';
            buildingInfo.removePersonString = 'Evict Resident';
            buildingInfo.residential = true;
        } else {
            buildingInfo.availableNoun = 'Job';
            buildingInfo.addPersonString = 'Hire Worker';
            buildingInfo.removePersonString = 'Fire Worker';
            buildingInfo.residential = false;
        }

        buildingInfo.index = buildingIndex;

        return buildingInfo;
    },

    onHireButtonPressed: function(view,bdInfo) {
        /*global MainGame*/
        console.assert(bdInfo.building, "Building can NOT be null!");

        if (bdInfo.building.people >= bdInfo.building.maxPeople)
            return;
        if (MainGame.population.hire(bdInfo.index)) {
            if (bdInfo.building.people >= bdInfo.building.maxPeople) {
                view.addPersonButton.visible = false;
            }
            view.removePersonButton.visible = true;

            // update display
            // BDController.updateAvailabilityText(view, bdInfo);

            if (!bdInfo.residential) {
                // BDController.updateState(view, bdInfo.building);
            }

            var currentPage = Math.ceil(bdInfo.building.people / view.itemsPerPage)
            var maxPage = Math.ceil(bdInfo.building.maxPeople / view.itemsPerPage);
            BDController.setupOccupantList(view, bdInfo, Math.max(currentPage-1,0));
            view.pageIndicator.setModel(Math.max(currentPage-1,0), maxPage); // current, max
            view.pageIndicator.visible = (maxPage > 1);

            // Play some funky music white boi
            view.add_remove_sfx.play();
            view.add_remove_sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds

            Global.updateMoneyPerTurn();
        }else{
            // Play an error sound
            view.add_remove_sfx.play();
            view.add_remove_sfx = game.make.audio('empty_click_' + Math.ceil(Math.random()*5)); // Assume we have 14 cloth click sounds
        }
    },

    onFireButtonPressed: function(view,bdInfo) {
        /*global MainGame*/
        console.assert(bdInfo.building, "Building can NOT be null!");
        if (bdInfo.building.people <= 0)
            return;

        // Get a citizen from that building (assume at least one occupant)
        if (bdInfo.residential) {
            var occupants = MainGame.population.getHouseMap()[bdInfo.index];
        } else {
            var occupants = MainGame.population.getWorkMap()[bdInfo.index];
        }
        var citizen = MainGame.population.at(occupants[0]);
        
        // Fire that person
        if(MainGame.population.firePersonAt(citizen, bdInfo.index)){
            // Update button visibilty as needed
            if (bdInfo.building.people <= 0) {
                view.removePersonButton.visible = false;
            }
            view.addPersonButton.visible = true;

            // update display
            // BDController.updateAvailabilityText(view, bdInfo);

            // If we're a workplace, update relevant gamestates
            if (!bdInfo.residential) {
                // BDController.updateState(view, bdInfo.building);
            }

            // Update the list view
            var currentPage = Math.ceil(bdInfo.building.people / view.itemsPerPage)
            var maxPage = Math.ceil(bdInfo.building.maxPeople / view.itemsPerPage);
            BDController.setupOccupantList(view, bdInfo, Math.max(currentPage-1,0));
            view.pageIndicator.setModel(Math.max(currentPage-1,0), maxPage); // current, max        var pageCount = Math.ceil(occupants.length / view.itemsPerPage);
            view.pageIndicator.visible = (maxPage > 1);


            // Play some funky music white boi
            view.add_remove_sfx.play();
            view.add_remove_sfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds

            Global.updateMoneyPerTurn();
        } else {
            // Play an error sound
            view.add_remove_sfx.play();
            view.add_remove_sfx = game.make.audio('empty_click_' + Math.ceil(Math.random()*5)); // Assume we have 14 cloth click sounds
        }
    },

    // Forms a sprite that represents an entry in the listview
    makeEntry: function(citizen, residential, plainText) {
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
                        case 'farm':
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
        } else if(!plainText) {
            // Else, it's a workplace
            entryString = citizen.name + ' (';
            if (citizen.home !== null) {
                entryString += MainGame.board.at(citizen.home).getBuilding().playerLabel + ')'
            } else {
                entryString += 'Homeless)'
            }
        } else {
            entryString = citizen;
        }

        var entryText = MainGame.game.make.text(0, 0, entryString, this.listStyle);
        entrySprite.addChild(entryText);

        return entrySprite;
    },

    setupOccupantList: function(view, bdInfo, pageIndex) {
        view.occupantListView.removeAll();

        if (bdInfo.residential) {
            var occupants = MainGame.population.getHouseMap()[bdInfo.index];
        } else {
            var occupants = MainGame.population.getWorkMap()[bdInfo.index];
        }

        var startIndex = pageIndex * view.itemsPerPage;
        var endIndex = Math.min(startIndex+view.itemsPerPage, bdInfo.building.maxPeople);

        for (var i = startIndex; i < endIndex; i++) {
            if(i >= occupants.length){
                if(bdInfo.residential)
                    view.occupantListView.add(BDController.makeEntry("< Room Available >",false,true));
                else
                    view.occupantListView.add(BDController.makeEntry("< Job Available >",false,true));
            } else {
                var citizen = MainGame.population.at(occupants[i]);
                view.occupantListView.add(BDController.makeEntry(citizen, bdInfo.residential,false));
            }               
        }
    },

    setupOutputList: function(view, bdInfo, pageIndex, outputType){
        view.outputListView.removeAll();

        if (bdInfo.residential) {
            var allBuildingIndexes = MainGame.board.findBuilding(null, null, null, outputType);

            var outputBuildings = [];
            for (var index=0;index<allBuildingIndexes.length;++index) {
                var buildingData = MainGame.board.at(allBuildingIndexes[index]).building;
                
                // If the distance between the two buildings is <= the range of the eduBuilding, accumulate culture
                var effectList = buildingData.effects;
                for (var effectIndex=0;effectIndex<effectList.length;++effectIndex) {
                    var thisEffect = effectList[effectIndex];
                    if (thisEffect.type != type) continue;
                    if (MainGame.board.distanceOf(homeIndex, allBuildingIndexes[index]) <= thisEffect.range) {
                        
                        var buildingName = buildingData.name;
                        var outPut = thisEffect.outputTable[buildingData.people];
                    }
                }
            }
        } else {

        }
    },

    demolishBuilding: function(view, bdInfo) {
        if (Global.money >= 10) {
            if (bdInfo.residential) {
                var occupants = MainGame.population.getHouseMap()[bdInfo.index];
            } else {
                var occupants = MainGame.population.getWorkMap()[bdInfo.index];
            }

            // Evict all residents
            for (var i in occupants) {
                MainGame.population.fire(bdInfo.index);
            }

            Global.updateMoneyPerTurn();

            // Remove the building at view.index
            MainGame.board.at(view.index).removeBuilding();

            // Bill the player
            Global.money -= 10;

            // Close the Detail View
            view.demolishSfx.play();
            view.demolishButton.freezeFrames = true;
            //view.destroy();
            MenuController.uiMask.destroy();
            MenuController.closeSfx.play();
            MenuController.closeAllMenus();
            MainGame.board.controller.detailView = null;
        }
    },
};


var transferClipboard = {
    createNew: function(bdInfo){

    }, 
};