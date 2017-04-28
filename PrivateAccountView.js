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

    createNew: function() {
        var accountView = Page.createNew();
        accountView.anchor.set(0.5, 0.5);
        accountView.position.set(MainGame.game.width/2, MainGame.game.height/2);

        // setup the mask
        /* global DUiMask */
        accountView.uiMask = DUiMask.createNew();
        accountView.uiMask.setController(100, function(){
            accountView.uiMask.destroy();
            //accountView.sfx.play();
            accountView.destroy();
        });

        // Show current deposit amount
        accountView.depositLabelText = MainGame.game.make.text(0, 0, "Account Balance");
        accountView.depositLabelText.anchor.set(0.5, 0);
        accountView.depositLabelText.position.set(0, -accountView.height/2 + Page.margin.y + 10);
        accountView.addChild(accountView.depositLabelText);

        // Show current deposit amount
        accountView.depositText = MainGame.game.make.text(0, 0, "₸0");
        accountView.depositText.anchor.set(0.5, 0);
        accountView.depositText.position.set(0, accountView.depositLabelText.y + 40);
        accountView.addChild(accountView.depositText);

        // Show current milestone
        accountView.currentMilText = MainGame.game.make.text(0, 0, "Current Milestone:");
        accountView.currentMilText.anchor.set(0.5, 0);
        accountView.addChild(accountView.currentMilText);

        // Show next milestone
        accountView.nextMilText = MainGame.game.make.text(0, 0, "Next Milestone:");
        accountView.nextMilText.anchor.set(0.5, 0);
        accountView.addChild(accountView.nextMilText);

        return accountView;
    },

    getCurrentMilestone: function() {
        return this.mileStones[0];
    },

    getNextMilestone: function() {
        return this.mileStones[0];
    },
};