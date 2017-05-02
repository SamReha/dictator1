var YearView = {
    header1: { font: '32px myKaiti' },
    header2: { font: '20px myKaiti' },

    createNew: function() {
        var yearView = Page.createNew();
        yearView.input.priorityID = 3;
        yearView.anchor.set(0.5, 0.5);
        yearView.position.set(MainGame.game.width/2, MainGame.game.height/2);

        yearView.records = MainGame.global.yearViewData;
        yearView.entryWidth = (yearView.width - (Page.margin.x*2)) / 5;

        yearView.sfxArray = [
            game.make.audio('paper_click_2'),
            game.make.audio('paper_click_3'),
            game.make.audio('paper_click_5'),
            game.make.audio('paper_click_7')
        ];

        // setup the mask
        /* global DUiMask */
        yearView.uiMask = DUiMask.createNew();
        yearView.uiMask.setController(2, function() {
            yearView.uiMask.destroy();
            //yearView.sfx.play();
            yearView.destroy();
        });

        yearView.label = MainGame.game.make.text(0, -yearView.height/2 + Page.margin.y, 'State Records', this.header1);
        yearView.label.anchor.set(0.5, 0);
        yearView.addChild(yearView.label);

        yearView.header = this.makeHeader(yearView.entryWidth);
        yearView.header.x = -yearView.width/2 + Page.margin.x;
        yearView.header.y = yearView.label.y + yearView.label.height;
        yearView.addChild(yearView.header);

        // Page Indicator
        yearView.itemsPerPage = 10;
        var pageCount = Math.ceil(yearView.records.length / yearView.itemsPerPage);
        yearView.pageIndicator = DPageIndicator.createNew((yearView.width * 1/8), {x:(yearView.width * 1/2), y:0}); //width, textPos
        yearView.pageIndicator.setModel(0, pageCount); // current, max
        yearView.pageIndicator.setController(function(index) { YearView.onPageChanged(yearView, index); }, 111);
        yearView.pageIndicator.x = -yearView.width/2 + Page.margin.x - yearView.pageIndicator.width/3;
        yearView.pageIndicator.y = yearView.height/2 - Page.margin.y - 150;
        yearView.pageIndicator.visible = (pageCount > 1);
        yearView.addChild(yearView.pageIndicator);

        // List View
        yearView.listView = DListView.createNew(
            {},                              // don't need textures
            {l: 0, t: 0},                    // margin inside the list view
            {w: yearView.entryWidth, h: 24}, // size of an item
            function(index){ },              // forwards the callback
            false,                           // not horizontal
            110                              // priority ID
        );
        YearView._setupListView_(yearView, 0);
        yearView.listView.x = -yearView.width/2 + Page.margin.x;
        yearView.listView.y =  yearView.header.y + yearView.header.height;
        yearView.addChild(yearView.listView);
    },

    _setupListView_: function(yearView, pageIndex) {
        yearView.listView.removeAll();

        var startIndex = pageIndex * yearView.itemsPerPage;
        var endIndex = Math.min(startIndex + yearView.itemsPerPage, yearView.records.length);

        for (var i = startIndex; i < endIndex; i++) {
            var record = yearView.records[i];
            yearView.listView.add(YearView._makeEntry_(record, yearView.entryWidth));
        }

        // See if we should show a page indicator
        var pageCount = Math.ceil(yearView.records.length / yearView.itemsPerPage);
        yearView.pageIndicator.visible = (pageCount > 1);
    },

    _makeEntry_: function(record, width) {
        var entry = MainGame.game.make.sprite(0, 0); 

        entry.year = MainGame.game.make.text(width*0, 0, record.year, this.header2);
        entry.addChild(entry.year);

        entry.population = MainGame.game.make.text(width*1.5, 0, record.population, this.header2);
        entry.population.anchor.set(0.5, 0);
        entry.addChild(entry.population);

        entry.employment = MainGame.game.make.text(width*3, 0, record.employmentPercent + '%', this.header2);
        entry.employment.anchor.set(1, 0);
        entry.addChild(entry.employment);

        entry.homeless = MainGame.game.make.text(width*4, 0, record.homelessPercent + '%', this.header2);
        entry.homeless.anchor.set(1, 0);
        entry.addChild(entry.homeless);

        entry.publicFunds = MainGame.game.make.text(width*4.5, 0, '₸' + record.publicFunds, this.header2);
        entry.publicFunds.anchor.set(0.5, 0);
        entry.addChild(entry.publicFunds);

        entry.bar = MainGame.game.make.graphics(0, 0);
        entry.bar.beginFill(0x555555);
        entry.bar.drawRect(0, 0, width*5, 1);
        entry.bar.endFill();
        entry.addChild(entry.bar);

        return entry;
    },

    onPageChanged: function(view, index) {
        YearView._setupListView_(view, index);
    },

    makeHeader: function(width) {
        var entry = MainGame.game.make.sprite(0, 0); 

        entry.year = MainGame.game.make.text(width*0, 0, 'Year', this.header2);
        entry.addChild(entry.year);

        entry.population = MainGame.game.make.text(width*1, 0, 'Pop.', this.header2);
        entry.addChild(entry.population);

        entry.employment = MainGame.game.make.text(width*2, 0, 'Empl.', this.header2);
        entry.addChild(entry.employment);

        entry.homeless = MainGame.game.make.text(width*3, 3, 'Homeless', { font: '17px myKaiti' }); // UGH
        entry.addChild(entry.homeless);

        entry.publicFunds = MainGame.game.make.text(width*4, 0, 'Funds', this.header2);
        entry.addChild(entry.publicFunds);

        return entry;
    }
}