var MoneyPanel = {
    textStyle: { font: '24px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },

    createNew: function() {
        var moneyPanel = MainGame.game.make.sprite(0, 0, 'money_backpanel');
        moneyPanel.inputEnabled = true;
        moneyPanel.input.priorityID = 1;

        moneyPanel.sfxArray = [
            game.make.audio('typewriter_click_1'),
            game.make.audio('typewriter_click_2'),
            game.make.audio('typewriter_click_3'),
            game.make.audio('typewriter_click_4'),
            game.make.audio('typewriter_click_5')
        ];

        // State Money (warchest)
        moneyPanel.warchestGroup = MainGame.game.make.button(2, 0, 'money_icon', function(){
            FinanceView.createNew();
            moneyPanel.sfxArray[Math.floor(Math.random()*moneyPanel.sfxArray.length)].play();
        }, 0, 1, 0, 2);
        moneyPanel.warchestGroup.y = moneyPanel.height/2 - moneyPanel.warchestGroup.height/2;
        
        ToolTip.addTipTo(moneyPanel.warchestGroup, 2, 'Public Funds', moneyPanel.x, moneyPanel.y + moneyPanel.warchestGroup.y + moneyPanel.warchestGroup.height);
        //moneyPanel.warchestGroup.toolTip.x -= moneyPanel.warchestGroup.toolTip.width;

        moneyPanel.warchestGroup.textLabel = MainGame.game.make.text(moneyPanel.warchestGroup.x + moneyPanel.warchestGroup.width + 1, 0, '₸0 ', this.textStyle);
        moneyPanel.warchestGroup.addChild(moneyPanel.warchestGroup.textLabel);
        moneyPanel.addChild(moneyPanel.warchestGroup);

        // Money Per Turn
        moneyPanel.warchestGroup.moneyPerTurnText = MainGame.game.make.text(moneyPanel.warchestGroup.x + moneyPanel.warchestGroup.width + 1, moneyPanel.warchestGroup.textLabel.height/2 + 2, '+0 / yr ', this.textStyle);
        moneyPanel.warchestGroup.addChild(moneyPanel.warchestGroup.moneyPerTurnText);

        // Swiss Bank (personal money)
        moneyPanel.swissGroup = MainGame.game.make.button(moneyPanel.width/2, 0, 'swiss_icon', function() {
            PrivateAccountView.createNew();
            moneyPanel.sfxArray[Math.floor(Math.random()*moneyPanel.sfxArray.length)].play();
        }, 0, 1, 0, 2);
        moneyPanel.swissGroup.y = moneyPanel.height/2 - moneyPanel.swissGroup.height/2;

        ToolTip.addTipTo(moneyPanel.swissGroup, 2, 'Private Account', moneyPanel.x + moneyPanel.swissGroup.x, moneyPanel.y + moneyPanel.swissGroup.y + moneyPanel.warchestGroup.height);
        //moneyPanel.swissGroup.toolTip.x -= moneyPanel.swissGroup.toolTip.width;

        moneyPanel.swissGroup.textLabel = MainGame.game.make.text(moneyPanel.swissGroup.width + 1, 0, '₸0 ', this.textStyle);
        moneyPanel.swissGroup.textLabel.y = moneyPanel.swissGroup.height/2 - moneyPanel.swissGroup.textLabel.height/2;
        moneyPanel.swissGroup.addChild(moneyPanel.swissGroup.textLabel);
        moneyPanel.addChild(moneyPanel.swissGroup);

        // Set update loop
        MainGame.game.time.events.loop(300, function() {
            var globalStats = MainGame.global;

            var newWarchest = '₸' + globalStats.money + ' ';
            var newMoneyPerTurn = (globalStats.moneyPerTurn >= 0) ? '+' + globalStats.moneyPerTurn + ' / yr ' : globalStats.moneyPerTurn + ' / yr ';
            var newSwissAccount = '₸' + globalStats.privateMoney + ' ';

            moneyPanel.warchestGroup.textLabel.text = newWarchest;
            moneyPanel.warchestGroup.moneyPerTurnText.text = newMoneyPerTurn;
            moneyPanel.swissGroup.textLabel.text = newSwissAccount;

            // What color do we set the moneyPerTurn to?
            if (globalStats.moneyPerTurn > 0) {
                moneyPanel.warchestGroup.moneyPerTurnText.addColor('LimeGreen', 0);
            } else if (globalStats.moneyPerTurn < 0) {
                moneyPanel.warchestGroup.moneyPerTurnText.addColor('Crimson', 0);
            } else {
                moneyPanel.warchestGroup.moneyPerTurnText.addColor('white', 0);
            }
        }, moneyPanel);

        return moneyPanel;
    },
};