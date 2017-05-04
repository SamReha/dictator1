var FinanceView = {
    header1: { font: '32px myKaiti' },
    header2: { font: '20px myKaiti' },

    createNew: function() {
        var financeView = Page.createNew();
        financeView.input.priorityID = 3;
        financeView.anchor.set(0.5, 0.5);
        financeView.position.set(MainGame.game.width/2, MainGame.game.height/2);

        financeView.expenditures = [];
        financeView.revenue = [];
        this.getExpenditures(financeView);
        this.getRevenue(financeView);

        financeView.entryWidth = (financeView.width - (Page.margin.x*2)) / 3;
        financeView.entryHeight = 48;

        financeView.sfxArray = [
            game.make.audio('paper_click_2'),
            game.make.audio('paper_click_3'),
            game.make.audio('paper_click_5'),
            game.make.audio('paper_click_7')
        ];

        // setup the mask
        /* global DUiMask */
        financeView.uiMask = DUiMask.createNew();
        financeView.uiMask.setController(2, function() {
            financeView.uiMask.destroy();
            //financeView.sfx.play();
            financeView.destroy();
        });

        financeView.label = MainGame.game.make.text(0, -financeView.height/2 + Page.margin.y, 'Finances', this.header1);
        financeView.label.anchor.set(0.5, 0);
        financeView.addChild(financeView.label);

        financeView.expenditureLabel = MainGame.game.make.text(-financeView.width/2 + Page.margin.x, financeView.label.y + financeView.label.height, 'Expenditures', this.header1);
        financeView.addChild(financeView.expenditureLabel);

        // Expenditure Page Indicator
        financeView.itemsPerPage = 5;
        var pageCount = Math.ceil(financeView.expenditures.length / financeView.itemsPerPage);
        financeView.expPageIndicator = DPageIndicator.createNew((financeView.width * 1/8), {x:(financeView.width * 1/2), y:0}); //width, textPos
        financeView.expPageIndicator.setModel(0, pageCount); // current, max
        financeView.expPageIndicator.setController(function(index) { FinanceView.onExpPageChanged(financeView, index); }, 111);
        financeView.expPageIndicator.x = -financeView.width/2 + Page.margin.x - financeView.expPageIndicator.width/3;
        financeView.expPageIndicator.y = financeView.height/2 - Page.margin.y - 150;
        financeView.expPageIndicator.visible = (pageCount > 1);
        financeView.addChild(financeView.expPageIndicator);

        // Expenditure List View
        financeView.expListView = DListView.createNew(
            {},                              // don't need textures
            {l: 0, t: 0},                    // margin inside the list view
            {w: financeView.entryWidth, h: financeView.entryHeight}, // size of an item
            function(index){ },              // forwards the callback
            false,                           // not horizontal
            110                              // priority ID
        );
        this._setupExpListView_(financeView, 0);
        financeView.expListView.x = -financeView.width/2 + Page.margin.x;
        financeView.expListView.y = financeView.expenditureLabel.y + financeView.expenditureLabel.height;
        financeView.addChild(financeView.expListView);

        financeView.revenueLabel = MainGame.game.make.text(-financeView.width/2 + Page.margin.x, 0, 'Revenue', this.header1);
        financeView.addChild(financeView.revenueLabel);

        // Revenue List View
        financeView.revListView = DListView.createNew(
            {},                              // don't need textures
            {l: 0, t: 0},                    // margin inside the list view
            {w: financeView.entryWidth, h: financeView.entryHeight}, // size of an item
            function(index){ },              // forwards the callback
            false,                           // not horizontal
            110                              // priority ID
        );
        financeView.revListView.x = -financeView.width/2 + Page.margin.x;
        financeView.revListView.y = financeView.revenueLabel.y + financeView.revenueLabel.height;
        financeView.addChild(financeView.revListView);

        // Revenue Page Indicator
        var pageCount = Math.ceil(financeView.revenue.length / financeView.itemsPerPage);
        financeView.revPageIndicator = DPageIndicator.createNew((financeView.width * 1/8), {x:(financeView.width * 1/2), y:0}); //width, textPos
        financeView.revPageIndicator.setModel(0, pageCount); // current, max
        financeView.revPageIndicator.setController(function(index) { FinanceView.onRevPageChanged(financeView, index); }, 111);
        
        financeView.revPageIndicator.visible = (pageCount > 1);
        financeView.addChild(financeView.revPageIndicator);
        this._setupRevListView_(financeView, 0);

        financeView.revPageIndicator.x = -financeView.width/2 + Page.margin.x - financeView.revPageIndicator.width/3;
        financeView.revPageIndicator.y = financeView.revListView.y + (financeView.entryHeight*6);
    },

    _setupExpListView_: function(financeView, pageIndex) {
        financeView.expListView.removeAll();
        this.getExpenditures(financeView);

        var startIndex = pageIndex * financeView.itemsPerPage;
        var endIndex = Math.min(startIndex + financeView.itemsPerPage, financeView.expenditures.length);

        for (var i = startIndex; i < endIndex; i++) {
            var record = financeView.expenditures[i];
            financeView.expListView.add(this._makeEntry_(financeView, record, financeView.entryWidth));
        }

        // See if we should show a page indicator
        var pageCount = Math.ceil(financeView.expenditures.length / financeView.itemsPerPage);
        financeView.expPageIndicator.visible = (pageCount > 1);
    },

    _setupRevListView_: function(financeView, pageIndex) {
        financeView.revListView.removeAll();
        this.getRevenue(financeView);

        var startIndex = pageIndex * financeView.itemsPerPage;
        var endIndex = Math.min(startIndex + financeView.itemsPerPage, financeView.revenue.length);

        for (var i = startIndex; i < endIndex; i++) {
            var record = financeView.revenue[i];
            financeView.revListView.add(this._makeEntry_(financeView, record, financeView.entryWidth));
        }

        // See if we should show a page indicator
        var pageCount = Math.ceil(financeView.revenue.length / financeView.itemsPerPage);
        financeView.revPageIndicator.visible = (pageCount > 1);
    },

    _makeEntry_: function(financeView, record, width) {
        var entry = MainGame.game.make.sprite(0, 0); 

        entry.name = MainGame.game.make.text(width*0, 0, record.name, this.header2);
        entry.addChild(entry.name);

        entry.effect = MainGame.game.make.text(width*1, 0, record.effect, this.header2);
        entry.addChild(entry.effect);

        entry.showButton = TextButton.createNew(width*2, 0, 'small_generic_button', function() {
            // close the menu
            financeView.uiMask.destroy();
            //financeView.sfx.play();
            financeView.destroy();

            // Move the camera
            MainGame.board.cameraCenterOn(record.location);
        }, null, 0, 2, 1, 2, 'View', this.header2);
        entry.showButton.input.priorityID = 200;
        entry.addChild(entry.showButton);

        entry.bar = MainGame.game.make.graphics(0, 0);
        entry.bar.beginFill(0x555555);
        entry.bar.drawRect(0, 0, width*3, 1);
        entry.bar.endFill();
        entry.addChild(entry.bar);

        return entry;
    },

    onExpPageChanged: function(view, index) {
        FinanceView._setupExpListView_(view, index);
    },

    onRevPageChanged: function(view, index) {
        FinanceView._setupRevListView_(view, index);
    },

    getExpenditures: function(financeView) {
        // Expenditure {name: abcd, effect: 1234, location: 1234}
        financeView.expenditures = [];

        // First get all ministers
        var ministers = MainGame.population.highList();

        for (var i = 0; i < ministers.length; i++) {
            financeView.expenditures[financeView.expenditures.length] = {
                name: ministers[i].name,
                effect: '₸' + ministers[i].salary,
                location: ministers[i].home
            };
        }

        // Then, get all money-effecting buildings
        var moneyConsumers = MainGame.board.findBuilding(null, null, null, 'money');

        // Corner case - filter out houses of ministers so they don't get listed twice
        var moneyConsumers = moneyConsumers.filter(function(buildingIndex) {
            for (var i = 0; i < ministers.length; i++) {
                if (buildingIndex === ministers[i].home) {
                    return false;
                }
            }

            return true;
        });

        // If they have a negative effect (an expenditure), then append them to the expenditures list
        for (var i = 0; i < moneyConsumers.length; i++) {
            var building = MainGame.board.at(moneyConsumers[i]).getBuilding();

            for (var j = 0; j < building.effects.length; j++) {
                var effect = building.effects[j];

                // If this effect is a loss of money
                if (effect.type === 'money' && effect.outputTable[building.people] < 0) {
                    // Append to expenditures
                    financeView.expenditures[financeView.expenditures.length] = {
                        name: building.playerLabel,
                        effect: '₸' + Math.abs(effect.outputTable[building.people]),
                        location: moneyConsumers[i]
                    };

                    // And end the loop
                    break;
                }
            }
        }
    },

    getRevenue: function(financeView) {
        // Expenditure {name: abcd, effect: 1234, location: 1234}
        financeView.revenue = [];

        // Get all money-effecting buildings
        var moneyProducers = MainGame.board.findBuilding(null, null, null, null);// 'money');

        // If they have a positive effect (a revenue), then append them to the revenue list
        for (var i = 0; i < moneyProducers.length; i++) {
            var building = MainGame.board.at(moneyProducers[i]).getBuilding();

            for (var j = 0; j < building.effects.length; j++) {
                var effect = building.effects[j];

                if (effect.type === null) continue; // temp

                // If this effect is a monetary gain
                if (/*effect.type === 'money' &&*/ effect.outputTable[building.people] > 0) {
                    // Append to revenue
                    financeView.revenue[financeView.revenue.length] = {
                        name: building.playerLabel,
                        effect: '₸' + Math.abs(effect.outputTable[building.people]),
                        location: moneyProducers[i]
                    };

                    // And end the loop
                    break;
                }
            }
        }
    }
}