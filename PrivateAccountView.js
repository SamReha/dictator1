var PrivateAccountView = {
    mileStones: [
        0,
        10,
        25,
        50,
        100,
        250,
        500,
        1000
    ],
    //textStyle: { font: '24px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
    header1: { font: '32px Arial' },
    header2: { font: '18px Arial' },

    createNew: function() {
        var accountView = Page.createNew();
        accountView.input.priorityID = 3;
        accountView.anchor.set(0.5, 0.5);
        accountView.position.set(MainGame.game.width/2, MainGame.game.height/2);

        // setup the mask
        /* global DUiMask */
        accountView.uiMask = DUiMask.createNew();
        accountView.uiMask.setController(2, function(){
            accountView.uiMask.destroy();
            //accountView.sfx.play();
            accountView.destroy();
        });

        // Show current deposit amount
        accountView.depositLabelText = MainGame.game.make.text(0, -accountView.height/2 + Page.margin.y + 10, "Account Balance", this.header1);
        accountView.depositLabelText.anchor.set(0.5, 0);
        accountView.addChild(accountView.depositLabelText);

        // Show current deposit amount
        accountView.depositText = MainGame.game.make.text(0, accountView.depositLabelText.y + 40, '₸' + MainGame.global.privateMoney, this.header1);
        accountView.depositText.anchor.set(0.5, 0);
        accountView.addChild(accountView.depositText);

        // Show current milestone
        accountView.currentMilText = MainGame.game.make.text(-accountView.width/2 + Page.margin.x, 0, "Current Milestone:", this.header2);
        accountView.currentMilText.anchor.set(0, 0);
        accountView.addChild(accountView.currentMilText);

        accountView.currentMilAmountText = MainGame.game.make.text(-accountView.width/2 + Page.margin.x, accountView.currentMilText.y + accountView.currentMilText.height, '₸' + this.getCurrentMilestone(), this.header2);
        accountView.addChild(accountView.currentMilAmountText);

        // Show next milestone
        accountView.nextMilText = MainGame.game.make.text(0, 0, "Next Milestone:", this.header2);
        accountView.nextMilText.anchor.set(0, 0);
        accountView.addChild(accountView.nextMilText);

        accountView.nextMilAmountText = MainGame.game.make.text(0, accountView.nextMilText.y + accountView.nextMilText.height, '₸' + this.getNextMilestone(), this.header2);
        accountView.addChild(accountView.nextMilAmountText);

        // Set up deposit widget
        accountView.depositAmount = 0;
        accountView.decreaseDeposit = MainGame.game.make.button(0, 0);
        accountView.addChild(accountView.decreaseDeposit);
        accountView.increaseDeposit = MainGame.game.make.button(0, 0);
        accountView.addChild(accountView.increaseDeposit);
        accountView.makeDeposit = MainGame.game.make.button(0, 0);
        accountView.addChild(accountView.makeDeposit);

        // Set up withdrawal widget
        accountView.withdrawalAmount = 0;
        accountView.decreaseWithdrawal = MainGame.game.make.button(0, 0);
        accountView.addChild(accountView.decreaseWithdrawal);
        accountView.increaseWithdrawal = MainGame.game.make.button(0, 0);
        accountView.addChild(accountView.increaseWithdrawal);
        accountView.makeWithdrawal = TextButton.createNew(0, 0, 'small_generic_button', function() { console.log('test text button!'); }, null, 0, 2, 1, 2, 'Withdraw', this.header2);
        accountView.addChild(accountView.makeWithdrawal);

        return accountView;
    },

    updateData: function() {
        accountView.depositText.text = '₸' + MainGame.global.privateMoney;
        accountView.currentMilAmountText.text = '₸' + this.getCurrentMilestone();
        accountView.nextMilAmountText.text = '₸' + this.getNextMilestone();
    },

    getCurrentMilestone: function() {
        var milIndex = 0;

        while (MainGame.global.privateMoney > this.mileStones[milIndex]) milIndex++;
        milIndex = Math.min(Math.max(milIndex, 0), this.mileStones.length-1);

        return this.mileStones[milIndex];
    },

    getNextMilestone: function() {
        var milIndex = 0;

        while (MainGame.global.privateMoney > this.mileStones[milIndex]) milIndex++;
        milIndex++;
        milIndex = Math.min(Math.max(milIndex, 0), this.mileStones.length-1);

        return this.mileStones[milIndex];
    },

    // Guarantees that a deposit of the given amount can take place
    canDeposit: function(amount) {
        return amount <= this.getCurrentMilestone && amount <= MainGame.global.money;
    },

    // Performs a deposit WITHOUT CHECKING TO SEE IF IT IS VALID
    makeDeposit: function(amount) {
        MainGame.global.money -= amount;
        MainGame.global.privateMoney += amount;
    },

    // Guarantees that a withdrawal of the given amount can take place
    canWithdraw: function(amount) {
        return amount <= MainGame.global.privateMoney;
    },

    // Performs a withdrawal WITHOUT CHECKING TO SEE IF IT IS VALID
    makeWithdrawal: function(amount) {
        MainGame.global.money += amount;
        MainGame.global.privateMoney -= amount;
    },
};