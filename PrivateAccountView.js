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
    header1: { font: '32px myKaiti' },
    header2: { font: '20px myKaiti' },

    createNew: function() {
        var accountView = MainGame.game.make.group();

        accountView.page = Page.createNew();
        //accountView.page.anchor.set(0.5, 0.5);
        accountView.addChild(accountView.page);

        accountView.sfxArray = [
            game.make.audio('paper_click_2'),
            game.make.audio('paper_click_3'),
            game.make.audio('paper_click_5'),
            game.make.audio('paper_click_7')
        ];

        accountView.closeSfx = game.make.audio('message_close');

        accountView.moneySfx = game.make.audio('money_earned');

        // setup the mask
        // accountView.uiMask = DUiMask.createNew();
        // accountView.uiMask.setController(2, function(){
        //     accountView.uiMask.destroy();
        //     accountView.closeSfx.play();
        //     accountView.destroy();
        // });

        // Show current deposit amount
        accountView.depositLabelText = MainGame.game.make.text(0, -accountView.height/2 + Page.margin.y + 10, "Account Balance", this.header1);
        accountView.depositLabelText.anchor.set(0.5, 0);
        accountView.addChild(accountView.depositLabelText);

        // Show current deposit amount
        accountView.depositAmountText = MainGame.game.make.text(0, accountView.depositLabelText.y + 40, '₸' + MainGame.global.privateMoney, this.header1);
        accountView.depositAmountText.anchor.set(0.5, 0);
        accountView.addChild(accountView.depositAmountText);

        // Show current milestone
        accountView.currentMilText = MainGame.game.make.text(-accountView.width/2 + Page.margin.x*1.5, -accountView.width/4, "Current Milestone:", this.header2);
        accountView.currentMilText.anchor.set(0, 0);
        accountView.addChild(accountView.currentMilText);

        accountView.currentMilAmountText = MainGame.game.make.text(accountView.currentMilText.x, accountView.currentMilText.y + accountView.currentMilText.height, '₸' + this.getCurrentMilestone(), this.header2);
        accountView.addChild(accountView.currentMilAmountText);

        // Show next milestone
        accountView.nextMilText = MainGame.game.make.text(Page.margin/2, -accountView.width/4, "Next Milestone:", this.header2);
        accountView.nextMilText.anchor.set(0, 0);
        accountView.addChild(accountView.nextMilText);

        accountView.nextMilAmountText = MainGame.game.make.text(accountView.nextMilText.x, accountView.nextMilText.y + accountView.nextMilText.height, '₸' + this.getNextMilestone(), this.header2);
        accountView.addChild(accountView.nextMilAmountText);

        // Set up withdrawal widget
        accountView.withdrawalAmount = 0;

        accountView.makeWithdrawal = TextButton.createNew(0, accountView.height/2 - Page.margin.y, 'small_generic_button', function() {
            if (PrivateAccountView.canWithdraw(accountView.withdrawalAmount)) {
                PrivateAccountView.makeWithdrawal(accountView.withdrawalAmount);
                accountView.withdrawalAmount = 0;
                accountView.updateData();
                accountView.moneySfx.play();
            }
        }, null, 0, 2, 1, 2, 'Withdraw', this.header2);
        accountView.makeWithdrawal.x -= accountView.makeWithdrawal.width/2;
        accountView.makeWithdrawal.y -= accountView.makeWithdrawal.height;
        accountView.addChild(accountView.makeWithdrawal);

        accountView.withdrawalText = MainGame.game.make.text(0, accountView.makeWithdrawal.y, '₸' + accountView.withdrawalAmount, this.header1);
        accountView.withdrawalText.anchor.set(0.5, 0.5);
        accountView.withdrawalText.y -= accountView.withdrawalText.height;
        accountView.addChild(accountView.withdrawalText);

        accountView.decreaseWithdrawal = MainGame.game.make.button(0, accountView.withdrawalText.y, 'redMinusButton', function() {
            accountView.withdrawalAmount--;
            accountView.updateData();
            accountView.sfxArray[Math.floor(Math.random()*accountView.sfxArray.length)].play();
        }, null, 1, 0, 2, 1);
        accountView.decreaseWithdrawal.inputEnabled = true;
        accountView.decreaseWithdrawal.input.priorityID = 10;

        accountView.decreaseWithdrawal.x = -accountView.makeWithdrawal.width;
        accountView.decreaseWithdrawal.anchor.set(0.5, 0.5);
        accountView.addChild(accountView.decreaseWithdrawal);

        accountView.increaseWithdrawal = MainGame.game.make.button(60, accountView.withdrawalText.y, 'redPlusButton', function() {
            accountView.withdrawalAmount++;
            accountView.updateData();
            accountView.sfxArray[Math.floor(Math.random()*accountView.sfxArray.length)].play();
        }, null, 1, 0, 2, 1);
        accountView.increaseWithdrawal.inputEnabled = true;
        accountView.increaseWithdrawal.input.priorityID = 10;

        accountView.increaseWithdrawal.x = accountView.makeWithdrawal.width;
        accountView.increaseWithdrawal.anchor.set(0.5, 0.5);
        accountView.addChild(accountView.increaseWithdrawal);

        // Set up deposit widget
        accountView.depositAmount = 0;

        accountView.makeDeposit = TextButton.createNew(0, accountView.withdrawalText.y, 'small_generic_button', function() {
            if (PrivateAccountView.canDeposit(accountView.depositAmount)) {
                PrivateAccountView.makeDeposit(accountView.depositAmount);
                accountView.depositAmount = 0;
                accountView.updateData();
                accountView.moneySfx.play();
            }
        }, null, 0, 2, 1, 2, 'Deposit', this.header2);
        accountView.makeDeposit.x -= accountView.makeDeposit.width/2;
        accountView.makeDeposit.y -= accountView.makeDeposit.height*2;
        accountView.addChild(accountView.makeDeposit);

        accountView.depositText = MainGame.game.make.text(0, accountView.makeDeposit.y, '₸' + accountView.depositAmount, this.header1);
        accountView.depositText.anchor.set(0.5, 0.5);
        accountView.depositText.y -= accountView.depositText.height;
        accountView.addChild(accountView.depositText);

        accountView.decreaseDeposit = MainGame.game.make.button(0, accountView.depositText.y, 'redMinusButton', function() {
            accountView.depositAmount--;
            accountView.updateData();
            accountView.sfxArray[Math.floor(Math.random()*accountView.sfxArray.length)].play();
        }, null, 1, 0, 2, 1);
        accountView.decreaseDeposit.inputEnabled = true;
        accountView.decreaseDeposit.input.priorityID = 10;

        accountView.decreaseDeposit.x = -accountView.makeDeposit.width;
        accountView.decreaseDeposit.anchor.set(0.5, 0.5);
        accountView.addChild(accountView.decreaseDeposit);

        accountView.increaseDeposit = MainGame.game.make.button(60, accountView.depositText.y, 'redPlusButton', function() {
            accountView.depositAmount++;
            accountView.updateData();
            accountView.sfxArray[Math.floor(Math.random()*accountView.sfxArray.length)].play();
        }, null, 1, 0, 2, 1);
        accountView.increaseDeposit.inputEnabled = true;
        accountView.increaseDeposit.input.priorityID = 10;


        accountView.increaseDeposit.x = accountView.makeDeposit.width;
        accountView.increaseDeposit.anchor.set(0.5, 0.5);
        accountView.addChild(accountView.increaseDeposit);

        accountView.updateData = function() { PrivateAccountView.updateData(accountView); };

        // And, just to make sure our buttons are in the right state...
        accountView.updateData();

        return accountView;
    },

    updateData: function(accountView) {
        accountView.depositAmountText.text    = '₸' + MainGame.global.privateMoney;
        accountView.currentMilAmountText.text = '₸' + this.getCurrentMilestone();
        accountView.nextMilAmountText.text    = '₸' + this.getNextMilestone();
        accountView.depositText.text          = '₸' + accountView.depositAmount;
        accountView.withdrawalText.text       = '₸' + accountView.withdrawalAmount;

        // Do any of our buttons need to change state?
        if (accountView.depositAmount <= 0) {
            accountView.decreaseDeposit.visible = false;
        } else accountView.decreaseDeposit.visible = true;

        if (accountView.depositAmount >= this.getNextMilestone()) {
            accountView.increaseDeposit.visible = false;
        } else accountView.increaseDeposit.visible = true;

        if (accountView.withdrawalAmount <= 0) {
            accountView.decreaseWithdrawal.visible = false;
        } else accountView.decreaseWithdrawal.visible = true;

        if (accountView.withdrawalAmount >= MainGame.global.privateMoney) {
            accountView.increaseWithdrawal.visible = false;
        } else accountView.increaseWithdrawal.visible = true;
    },

    getCurrentMilestone: function() {
        var milIndex = 0;

        while (MainGame.global.privateMoney >= this.mileStones[milIndex]) milIndex++;
        milIndex--;
        milIndex = Math.min(Math.max(milIndex, 0), this.mileStones.length-1);

        return this.mileStones[milIndex];
    },

    getNextMilestone: function() {
        var milIndex = 0;

        while (MainGame.global.privateMoney >= this.mileStones[milIndex]) milIndex++;
        milIndex = Math.min(Math.max(milIndex, 0), this.mileStones.length-1);

        return this.mileStones[milIndex];
    },

    // Guarantees that a deposit of the given amount can take place
    canDeposit: function(amount) {
        return amount <= this.getNextMilestone() && amount <= MainGame.global.money;
    },

    // Performs a deposit WITHOUT CHECKING TO SEE IF IT IS VALID
    makeDeposit: function(amount) {
        MainGame.global.money -= amount;
        MainGame.global.privateMoney += amount;

        // Send a telemetry payload!
        Telemetry.send({
            type: 'private_money_added',
            amount: amount,
            accountValue: MainGame.global.privateMoney,
            turn: MainGame.global.turn,
        });
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