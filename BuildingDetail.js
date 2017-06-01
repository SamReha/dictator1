var BDOverView = {
    createNew: function(buildingIndex, bdInfo) {
        if(!bdInfo && (buildingIndex || buildingIndex === 0)){
            var bdInfo = BDController.getInfo(buildingIndex);
        } else if(!bdInfo){
            console.log("BDOverView error");
            return null;
        }

        var overview = MainGame.game.make.group();
        // overview.index = buildingIndex;
        overview.bdInfo = bdInfo;

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
                },overview,3);
        }
        overview.addChild(overview.occupantsText);
        overview.occupantsIcons = [];
        overview.rightSide = null;

        pickupFunction = function(i,overview,bdInfo){return function(spriteBase){
            if(overview.rightSide===null){
                overview.rightSide = Clipboard.createNew('transfer',{
                    bdInfo:bdInfo,
                    person:(MainGame.population.at(spriteBase.personIndex)),
                    tag:(bdInfo.residential?'occupant':'occupant_'+i)
                });
            }
            else{
                if(!bdInfo.residential)
                    TransferClipboard.setUpListView(overview.rightSide.page,bdInfo,MainGame.population.at(spriteBase.personIndex),'occupant_'+i);
                else 
                    TransferClipboard.setUpListView(overview.rightSide.page,bdInfo,MainGame.population.at(spriteBase.personIndex),'occupant');
            }
        };}
        dropFunction = function(i,overview,bdInfo){return function(spriteBase,targetSprite){
            MainGame.population.firePersonAt(MainGame.population.at(spriteBase.personIndex),spriteBase.buildingIndex);
            MainGame.population.hirePersonAt(MainGame.population.at(spriteBase.personIndex),targetSprite.parent.buildingIndex);
            var openSlot = targetSprite.parent.occupantIcons[MainGame.board.at(targetSprite.parent.buildingIndex).getBuilding().people-1];
            spriteBase.dragSprite.tween = MainGame.game.make.tween(spriteBase.dragSprite).to({x:openSlot.world.x,y:openSlot.world.y},100,Phaser.Easing.Quadratic.InOut,true);
            spriteBase.dragSprite.tween.onComplete.add(function(){
                BDOverView.refreshPage(overview);
                TransferClipboard.setUpListView(overview.rightSide.page,bdInfo,MainGame.population.at(spriteBase.personIndex),(bdInfo.residential?'occupant':'occupant_'+i))
                spriteBase.dragSprite.destroy();
            },spriteBase.dragSprite);
        };}

        var occupants = (bdInfo.residential?MainGame.population.getHouseMap()[bdInfo.index]:MainGame.population.getWorkMap()[bdInfo.index]);
        for(var i = 0; i < bdInfo.building.maxPeople; ++i){
            overview.occupantsIcons.push(DragableSprite.createNew(-overview.width*1/3,-overview.height*2/15,'worker_icon','worker_icon_empty',
                pickupFunction(i,overview,bdInfo),dropFunction(i,overview,bdInfo),
                'occupant_'+i));
            overview.occupantsIcons[i].spriteFront.tint = 0x20a020;
            overview.occupantsIcons[i].buildingIndex = bdInfo.index;
            overview.occupantsIcons[i].anchor.setTo(.5,.5);
            overview.occupantsIcons[i].x += overview.occupantsIcons[i].width * i*.6;
            overview.addChild(overview.occupantsIcons[i]);
            if(i >= bdInfo.building.people)
                overview.occupantsIcons[i].spriteFront.visible = false;
            else
                overview.occupantsIcons[i].personIndex = occupants[i];
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
                },overview,3);
        }
        overview.addChild(overview.statsText);

        textLinkFunction = function(array,i){return function(){
            var binder = overview.parent.parent;
            binder.changeTabs(2);
            BDController.setupOutputList(binder.page,bdInfo,0,array[i]);
        };}

        if(bdInfo.residential){
            var stats = ['shelter','health','culture','freedom','unrest'];

            for(var i = 0; i < stats.length; ++i){
                overview[(stats[i]+"Text")] = TextLinkButton.createNew(-overview.width*19/45,overview.height*(2+3*i)/45,stats[i].charAt(0).toUpperCase()+stats[i].slice(1)+":",BDController.body1,
                    (textLinkFunction(stats,i))
                ,overview,2);
                overview[stats[i]+"Text"].text.anchor.setTo(0,.5);  overview[stats[i]+"Text"].underline.anchor.setTo(0,.5); overview.addChild(overview[stats[i]+"Text"]);

                overview[stats[i]+"Backs"] = [];
                overview[stats[i]+"Full"] = [];
                overview[stats[i]+"Half"] = [];
                for(var j = 0; j < 10; ++j){
                    overview[stats[i]+"Backs"].push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,stats[i]+'_output_full'));
                    overview[stats[i]+"Backs"][j].anchor.setTo(.5,.5);  overview[stats[i]+"Backs"][j].scale.setTo(.45,.45);
                    overview[stats[i]+"Backs"][j].tint = 0x3a3a3a;
                    overview[stats[i]+"Backs"][j].x += overview[stats[i]+"Backs"][j].width * (j*11/10);
                    overview.addChild(overview[stats[i]+"Backs"][j]);

                    overview[stats[i]+"Full"].push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,stats[i]+'_output_full'));
                    overview[stats[i]+"Full"][j].anchor.setTo(.5,.5);  overview[stats[i]+"Full"][j].scale.setTo(.45,.45);
                    overview[stats[i]+"Full"][j].tint = 0x20a020;
                    overview[stats[i]+"Full"][j].x += overview[stats[i]+"Full"][j].width * (j*11/10);
                    overview.addChild(overview[stats[i]+"Full"][j]);

                    overview[stats[i]+"Half"].push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,stats[i]+'_output_half'));
                    overview[stats[i]+"Half"][j].anchor.setTo(.5,.5);  overview[stats[i]+"Half"][j].scale.setTo(.45,.45);
                    overview[stats[i]+"Half"][j].tint = 0x20a020;
                    overview[stats[i]+"Half"][j].x += overview[stats[i]+"Half"][j].width * (j*11/10);
                    overview.addChild(overview[stats[i]+"Half"][j]);

                    var curStat = bdInfo.building[(stats[i]==='freedom'?"aoeFreedom":(stats[i]==='unrest'?"aoeUnrest":stats[i]))];
                    if(Math.round(curStat/5)*5 >= (j+1)*10){
                        overview[stats[i]+"Full"][j].visible = true;
                        overview[stats[i]+"Half"][j].visible = false;
                    } else if(Math.round(curStat/5)*5 >= (j*10)+5) {
                        overview[stats[i]+"Full"][j].visible = false;
                        overview[stats[i]+"Half"][j].visible = true;
                    } else {
                        overview[stats[i]+"Full"][j].visible = false;
                        overview[stats[i]+"Half"][j].visible = false;
                    }
                }
            }
        } else{
            var outputs = [];
            for(var i = 0; i < bdInfo.building.effects.length; ++ i){
                outputs.push(bdInfo.building.effects[i].type);
                if(overview[i] === null)
                    continue;

                var effect = bdInfo.building.effects[i];
                overview[(outputs[i]+"Text")] = TextLinkButton.createNew(-overview.width*19/45,overview.height*(2+3*i)/45,outputs[i].charAt(0).toUpperCase()+outputs[i].slice(1)+":",BDController.body1,
                    (textLinkFunction(outputs,i))
                ,overview,2);
                overview[outputs[i]+"Text"].text.anchor.setTo(0,.5);  overview[outputs[i]+"Text"].underline.anchor.setTo(0,.5); overview.addChild(overview[outputs[i]+"Text"]);

                overview[outputs[i]+"Backs"] = [];
                overview[outputs[i]+"Full"] = [];
                overview[outputs[i]+"Half"] = [];
                if(outputs[i] === "money"){
                    for(var j = 0; j < bdInfo.building.maxPeople; ++j){
                        overview[outputs[i]+"Backs"].push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,outputs[i]+'_output_full'));
                        overview[outputs[i]+"Full"].push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,outputs[i]+'_output_full'));
                        if(j < bdInfo.building.people)
                            overview[outputs[i]+"Full"][j].visible = true;
                        else
                            overview[outputs[i]+"Full"][j].visible = false;
                    }
                } else {
                    var maxOutput = Math.round(Math.abs(effect.outputTable[bdInfo.building.maxPeople])/5)*5;
                    var currentOutput = Math.round(Math.abs(effect.outputTable[bdInfo.building.people])/5)*5;
                    
                    for(var j = 0; j < Math.ceil(maxOutput/10); ++j){
                        overview[outputs[i]+"Backs"].push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,outputs[i]+'_output_full'));
                        overview[outputs[i]+"Full"].push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,outputs[i]+'_output_full'));
                        overview[outputs[i]+"Half"].push(MainGame.game.make.sprite(-overview.width*1/5,overview.height*(2+3*i)/45,outputs[i]+'_output_full'));
                    
                        if(currentOutput >= (j+1)*10){
                            overview[outputs[i]+"Full"][j].visible = true;
                            overview[outputs[i]+"Half"][j].visible = false;
                        } else if(currentOutput >= (j*10)+5){
                            overview[outputs[i]+"Full"][j].visible = false;
                            overview[outputs[i]+"Half"][j].visible = true;
                        } else {
                            overview[outputs[i]+"Full"][j].visible = false;
                            overview[outputs[i]+"Half"][j].visible = false;
                        }
                    }
                }
                for(var j = 0; j < overview[outputs[i]+"Backs"].length; ++j){
                    overview[outputs[i]+"Backs"][j].anchor.setTo(.5,.5);   overview[outputs[i]+"Backs"][j].scale.setTo(.45,.45);
                    overview[outputs[i]+"Backs"][j].tint = 0x3a3a3a;
                    overview[outputs[i]+"Backs"][j].x += overview[outputs[i]+"Backs"][j].width * (j*11/10);
                    overview.addChild(overview[outputs[i]+"Backs"][j]);

                    overview[outputs[i]+"Full"][j].anchor.setTo(.5,.5);    overview[outputs[i]+"Full"][j].scale.setTo(.45,.45);
                    overview[outputs[i]+"Full"][j].tint = (effect.outputTable[bdInfo.building.people] > 0?0x20a020:0xa02020);
                    overview[outputs[i]+"Full"][j].x += overview[outputs[i]+"Full"][j].width * (j*11/10);
                    overview.addChild(overview[outputs[i]+"Full"][j]);

                    if(outputs[i] !== 'money'){
                        overview[outputs[i]+"Half"][j].anchor.setTo(.5,.5);    overview[outputs[i]+"Half"][j].scale.setTo(.45,.45);
                        overview[outputs[i]+"Half"][j].tint = (effect.outputTable[bdInfo.building.people] > 0?0x20a020:0xa02020);
                        overview[outputs[i]+"Half"][j].x += overview[outputs[i]+"Half"][j].width * (j*11/10);
                        overview.addChild(overview[outputs[i]+"Half"][j]);
                    }
                }
            }
        }
        if(bdInfo.building.name !== 'palace'){
            overview.demolishButton = TextButton.createNew(0, overview.height*2/5, 'small_generic_button',
                function() { BDController.demolishBuilding(overview, bdInfo); },
                overview, 0, 2, 1, 2, 'Demolish -₸10', BDController.buttonStyle);
            overview.demolishButton.input.priorityID = 102;
            overview.demolishButton.x -= overview.demolishButton.width/2;
            overview.demolishButton.y -= overview.demolishButton.height/2;
            overview.addChild(overview.demolishButton);
        }

        overview.openSfx = MainGame.game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds
        overview.openSfx.play();
        overview.closeSfx = MainGame.game.make.audio('message_close');
        overview.add_remove_sfx = MainGame.game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        overview.demolishSfx = MainGame.game.make.audio('building_placement_' + Math.ceil(Math.random()*5)); // Assume we have 5 building sounds

        return overview;
    },

    refreshPage: function(overview){
        overview.availabilityText.text = overview.bdInfo.building.people + '/' + overview.bdInfo.building.maxPeople + ' ' + overview.bdInfo.availableNoun + 's taken';

        for(var i = 0; i < overview.bdInfo.building.maxPeople; ++i){
            if(i >= overview.bdInfo.building.people)
                overview.occupantsIcons[i].spriteFront.visible = false;
            else 
                overview.occupantsIcons[i].spriteFront.visible = true;
        }

        if(overview.bdInfo.residential){
            var stats = ['shelter','health','culture','freedom','unrest'];
            for(var i = 0; i < stats.length; ++i){
                for(var j = 0; j < 10; ++j){
                    var curStat = overview.bdInfo.building[(stats[i]==='freedom'?"aoeFreedom":(stats[i]==='unrest'?"aoeUnrest":stats[i]))];
                    if(Math.round(curStat/5)*5 >= (j+1)*10){
                        overview[stats[i]+"Full"][j].visible = true;
                        overview[stats[i]+"Half"][j].visible = false;
                    } else if(Math.round(curStat/5)*5 >= (j*10)+5) {
                        overview[stats[i]+"Full"][j].visible = false;
                        overview[stats[i]+"Half"][j].visible = true;
                    } else {
                        overview[stats[i]+"Full"][j].visible = false;
                        overview[stats[i]+"Half"][j].visible = false;
                    }
                }
            }
        }else{
            var outputs = [];
            for(var i = 0; i < overview.bdInfo.building.effects.length; ++ i){
                outputs.push(overview.bdInfo.building.effects[i].type);
                if(overview[i] === null)
                    continue;
            }
            for(var i = 0; i < overview.bdInfo.building.effects.length; ++i){
                var effect = overview.bdInfo.building.effects[i];
                if(outputs[i] === "money"){
                    for(var j = 0; j < overview.bdInfo.building.maxPeople; ++j){
                        if(j < overview.bdInfo.building.people)
                            overview[outputs[i]+"Full"][j].visible = true;
                        else
                            overview[outputs[i]+"Full"][j].visible = false;
                    }
                }else{
                    var maxOutput = Math.round(Math.abs(effect.outputTable[overview.bdInfo.building.maxPeople])/5)*5;
                    var currentOutput = Math.round(Math.abs(effect.outputTable[overview.bdInfo.building.people])/5)*5;
                    
                    for(var j = 0; j < Math.ceil(maxOutput/10); ++j){
                        if(currentOutput >= (j+1)*10){
                            overview[outputs[i]+"Full"][j].visible = true;
                            overview[outputs[i]+"Half"][j].visible = false;
                        } else if(currentOutput >= (j*10)+5){
                            overview[outputs[i]+"Full"][j].visible = false;
                            overview[outputs[i]+"Half"][j].visible = true;
                        } else {
                            overview[outputs[i]+"Full"][j].visible = false;
                            overview[outputs[i]+"Half"][j].visible = false;
                        }
                    }
                }
            }
        }
    }
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
    createNew: function(buildingIndex, bdInfo, outputIndex) {
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

        if(bdInfo.residential){
            output.outputTypes = ["shelter", "health", "culture", "freedom", "unrest"];
        } else {
            var buildingOutput = bdInfo.building.effects;
            output.outputTypes = [];
            for(var i = 0; i < buildingOutput.length; ++i){

                if(buildingOutput[i].type !== null)
                    output.outputTypes.push(buildingOutput[i].type);
            }
        }
        output.outputButtons = [];

        function newOutput(typeIndex){return function(){BDController.setupOutputList(output, bdInfo, 0, output.outputTypes[typeIndex]);};}
        for(var i = 0; i < output.outputTypes.length; ++i){
            output.outputButtons.push(TextLinkButton.createNew(-output.width*1/3,-output.height*3/16,
                output.outputTypes[i].charAt(0).toUpperCase()+output.outputTypes[i].slice(1), BDController.body1,
                    (newOutput(i)),
                output,2));

            output.outputButtons[i].y += output.height*(2*i)/16;
            output.addChild(output.outputButtons[i]);
        }
        var bar = MainGame.game.make.graphics(0,0);
        bar.lineStyle(5,0x000000,.5);
        bar.moveTo(0,0);
        bar.lineTo(0,output.height*2/3);
        output.bar = MainGame.game.make.sprite(-output.width*1/5,-output.height*4/15,bar.generateTexture());
        output.addChild(output.bar);

        output.listTitle = MainGame.game.make.text(-output.width*1/10,-output.height*4/15,(outputIndex!==null?output.outputTypes[outputIndex]:output.outputTypes[0]),BDController.header2);
        output.addChild(output.listTitle);
        // ListView
        output.outputListView = DListView.createNew(
            {},                  // don't need textures
            {l:15, t:40},        // margin inside the list view
            {w:output.width*9/20, h:output.height*3/20},       // size of an item
            function(index){  }, // forwards the callback
            false,               // not horizontal
            110                  // priority ID
        );
        BDController.setupOutputList(output, bdInfo, 0, output.outputTypes[0]);
        output.outputListView.x = -output.width*1/4;
        output.outputListView.y = -output.height*1/4;
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

        if (buildingInfo.building.subtype === 'housing' || buildingInfo.building.subtype === 'palace') {
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

            var currentPage = Math.ceil(bdInfo.building.people / view.itemsPerPage);
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
    makeOccupantEntry: function(citizen, residential, plainText) {
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
                        case 'factory':
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
                    view.occupantListView.add(BDController.makeOccupantEntry("< Room Available >",false,true));
                else
                    view.occupantListView.add(BDController.makeOccupantEntry("< Job Available >",false,true));
            } else {
                var citizen = MainGame.population.at(occupants[i]);
                view.occupantListView.add(BDController.makeOccupantEntry(citizen, bdInfo.residential,false));
            }               
        }
    },

    makeOutputEntry: function(bdInfo, outputBuilding, outputType){
        var entrySprite = MainGame.game.make.sprite(0,0);
        var building = MainGame.board.at(outputBuilding.index).getBuilding();
        var buildingImage = MainGame.game.make.sprite(0,0,building.name);
        entrySprite.addChild(buildingImage);
        buildingImage.scale.setTo(.4,.4);
        var buildingText = MainGame.game.make.text(buildingImage.width*16/15,0,building.playerLabel,BDController.body1);
        entrySprite.addChild(buildingText);

        // if(bdInfo.residential){
        //     var maxOutput = Math.round(Math.abs(outputBuilding.effect.outputTable[bdInfo.building.maxPeople])/5)*5;
        //     var currentStat = Math.round(building[outputType]/5)*5;
        //     var currentOutput = Math.round(Math.abs(outputBuilding.effect.outputTable[bdInfo.building.people])/5)*5;
        // } else {
        //     var maxOutput = Math.round(Math.abs(outputBuilding.effect.outputTable[building.maxPeople])/5)*5;
        //     var currentOutput = Math.round(Math.abs(outputBuilding.effect.outputTable[building.people])/5)*5;
        // }
        
        // var valueSprites = [];
        // for(){

        // }

        return entrySprite;
    },

    setupOutputList: function(view, bdInfo, pageIndex, outputType){
        view.outputListView.removeAll();

        view.listTitle.text = outputType.charAt(0).toUpperCase()+outputType.slice(1)+":";
        var outputBuildings = [];

        if (bdInfo.residential) {
            var allBuildingIndexes = MainGame.board.findBuilding(null, null, null, outputType);

            for (var i=0; i<allBuildingIndexes.length; ++i) {
                var buildingData = MainGame.board.at(allBuildingIndexes[i]).getBuilding();
                if(buildingData.startingTurn > Global.turn)
                    continue;
                
                // If the distance between the two buildings is <= the range of the eduBuilding, accumulate culture
                var effectList = buildingData.effects;
                for (var effectIndex = 0; effectIndex < effectList.length; ++effectIndex) {
                    var thisEffect = effectList[effectIndex];
                    if (thisEffect.type !== outputType) continue;
                    if (MainGame.board.distanceOf(bdInfo.index, allBuildingIndexes[i]) <= thisEffect.range) {
                        outputBuildings.push({});
                        outputBuildings[outputBuildings.length-1].index = allBuildingIndexes[i];
                        outputBuildings[outputBuildings.length-1].effect = thisEffect;
                    }
                }
            }
        } else {
            var allBuildingIndexes = MainGame.board.findBuilding(null, null, 'housing', null);

            var effect = bdInfo.building.effects;
            for(var i = 0; i < effect.length; ++i){
                if(effect[i].type === outputType){
                    effect = effect[i];
                    break;
                }
            }

            for(var i = 0; i < allBuildingIndexes.length; ++i){
                if(MainGame.board.distanceOf(bdInfo.index,allBuildingIndexes[i]) <= effect.range){
                    outputBuildings.push({});
                    outputBuildings[outputBuildings.length-1].index = allBuildingIndexes[i];
                    outputBuildings[outputBuildings.length-1].effect = effect;
                }
            }
        }

        for(var i = 0; i < outputBuildings.length; ++i)
            view.outputListView.add(BDController.makeOutputEntry(bdInfo, outputBuildings[i], outputType));
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
            MainGame.board.at(bdInfo.index).removeBuilding();

            // Bill the player
            Global.money -= 10;

            // Close the Detail View
            view.demolishSfx.play();
            view.demolishButton.freezeFrames = true;
            //view.destroy();
            // MenuController.uiMask.destroy();
            // MenuController.closeSfx.play();
            MenuController.closeAllMenus();
            MainGame.board.controller.detailView = null;
        }
    },
};


var TransferClipboard = {
    createNew: function(bdInfo, person, tag){
        var clipboard = MainGame.game.make.group();

        clipboard.page = Page.createNew();
        clipboard.page.anchor.setTo(.5,.5);
        clipboard.addChild(clipboard.page);

        clipboard.title = MainGame.game.make.text(0,-clipboard.height*11/30,'Transfer '+(bdInfo.residential?'Resident':'Worker'),BDController.header1);
        clipboard.title.anchor.setTo(.5,.5);
        clipboard.addChild(clipboard.title);
        clipboard.name = MainGame.game.make.text(0,-clipboard.height*3/10,'Transfering '+person.name,BDController.body1);
        clipboard.name.anchor.setTo(.5,.5);
        clipboard.addChild(clipboard.name);

        clipboard.listView = DListView.createNew(
            {},                  // don't need textures
            {l:15, t:20},        // margin inside the list view
            {w:clipboard.width*9/10, h:clipboard.height*1/5},       // size of an item
            function(index){  }, // forwards the callback
            false,               // not horizontal
            110                  // priority ID
        );
        TransferClipboard.setUpListView(clipboard,bdInfo,person,tag);
        clipboard.listView.x = -clipboard.width*1/2;
        clipboard.listView.y = -clipboard.height*3/10;
        clipboard.addChild(clipboard.listView);

        return clipboard;
    },

    makeEntry: function(itemSize, bdInfo, buildingIndex,tag){
        var entrySprite = MainGame.game.make.sprite(0,0);
        entrySprite.buildingIndex = buildingIndex;

        var back = MainGame.game.make.graphics();
        back.lineStyle(0);
        back.beginFill(0x000000,1);
        back.drawRect(0,0,itemSize.w,itemSize.h);
        back.endFill();
        entrySprite.backInput = MainGame.game.make.sprite(0,0,back.generateTexture());
        entrySprite.addChild(entrySprite.backInput);

        entrySprite.backInput.inputEnabled = true;
        entrySprite.backInput.input.priorityID = 160;
        entrySprite.backInput.tag = tag;
        entrySprite.backInput.alpha = 0;
        entrySprite.backInput.events.onInputUp.add(function(){entrySprite.backInput.alpha = .25;});
        entrySprite.backInput.events.onInputDown.add(function(){entrySprite.backInput.alpha = .5;});
        entrySprite.backInput.events.onInputOver.add(function(){entrySprite.backInput.alpha = .25;});
        entrySprite.backInput.events.onInputOut.add(function(){entrySprite.backInput.alpha = 0;});

        var building = MainGame.board.at(buildingIndex).getBuilding();
        var buildingImage = MainGame.game.make.sprite(0,0,building.name);
        entrySprite.addChild(buildingImage);
        buildingImage.scale.setTo(.4,.4);

        var buildingText = MainGame.game.make.text(buildingImage.width,buildingImage.height*1/5,building.playerLabel,BDController.body1);
        entrySprite.addChild(buildingText);
        buildingText.anchor.setTo(0,.5);

        entrySprite.occupantIcons = [];
        for(var i = 0; i < building.maxPeople; ++i){
            entrySprite.occupantIcons.push(MainGame.game.make.sprite(buildingImage.width*17/15,buildingImage.height*3/4,'worker_icon_empty'));
            entrySprite.occupantIcons[i].anchor.setTo(.5,.5);
            entrySprite.occupantIcons[i].x += entrySprite.occupantIcons[i].width*i*.6;
            entrySprite.addChild(entrySprite.occupantIcons[i]);

            if(i < building.people){
                entrySprite.occupantIcons[i].filled = MainGame.game.make.sprite(0,0,'worker_icon');
                entrySprite.occupantIcons[i].filled.anchor.setTo(.5,.5);
                entrySprite.occupantIcons[i].filled.tint = 0x20a020;
                entrySprite.occupantIcons[i].addChild(entrySprite.occupantIcons[i].filled);
            }
        }

        return entrySprite;
    },

    setUpListView: function(clipboard, bdInfo, person, tag){
        clipboard.name.text = 'Transfering '+person.name;

        clipboard.listView.removeAll();
        var transferBuildings = [];

        if(bdInfo.residential){
            var allBuildingIndexes = MainGame.board.findBuilding(null,null,'housing',null);
            for(var i = 0; i < allBuildingIndexes.length; ++i){
                if(allBuildingIndexes[i] === bdInfo.index)
                    continue;
                var bld = MainGame.board.at(allBuildingIndexes[i]).getBuilding();
                if(bld.people < bld.maxPeople && bld.startingTurn <= Global.turn)
                    transferBuildings.push(allBuildingIndexes[i]);
            }
        } else{
            var bureauBuildings = MainGame.board.findBuilding(null,Person.Bureaucrat,null,null);
            var commerceBuildings = MainGame.board.findBuilding(null,Person.Merchant,null,null);
            var militaryBuildings = MainGame.board.findBuilding(null,Person.Military,null,null);
            var allBuildingIndexes = bureauBuildings.concat(commerceBuildings).concat(militaryBuildings);

            for(var i = 0; i < allBuildingIndexes.length; ++i){
                if(allBuildingIndexes[i] === bdInfo.index)
                    continue;
                if(MainGame.board.hasRoadConnect(person.home,allBuildingIndexes[i])){
                    var bld = MainGame.board.at(allBuildingIndexes[i]).getBuilding();
                    if(bld.people < bld.maxPeople && bld.startingTurn <= Global.turn)
                        transferBuildings.push(allBuildingIndexes[i]);
                }
            }
        }

        for(var i = 0; i < transferBuildings.length; ++i)
            clipboard.listView.add(TransferClipboard.makeEntry(clipboard.listView.itemSize, bdInfo,transferBuildings[i],tag));
    },
};