var SwissAccountView = {
    // formula for pay levels: 1.073^(5(x+1)+4)
    // to calculate expected pay: math.floor(Influence/5)
    pays: [1,2,3,5,7,10,15,22,31,44,63,90,129,183,261,371,528,752,1073],
    contractStyle: {font:"20px myKaiti", fill:"black", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.85)", shadowOffsetX: 1, shadowOffsetY: 1 },
    styleButton: {font:"32px myKaiti", fill:"#ffffff", boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.85)", shadowOffsetX: 1, shadowOffsetY: 1 },

    createNew: function(){
        var v = MainGame.game.add.sprite(MainGame.game.width/2, MainGame.game.height/2, 'peopleViewContractBg');
        v.anchor.set(0.5, 0.5);
        v.inputEnabled=true;
        v.input.priorityID=120;

        // audio
        v.sfx = game.make.audio('message_close');

        // setup the mask
        /* global DUiMask */
        v.uiMask = DUiMask.createNew();
        v.uiMask.setController(100, function(){
            v.uiMask.destroy();
            v.sfx.play();
            v.destroy();
        });

        // ----Description----
        v.description = MainGame.game.make.text(-v.width/2+25, -v.height/2+25, 'Your private Swiss Bank Account can be used to\ndiscretely store excess revenue from the national\nfunds of Tian.', this.contractStyle);
        v.addChild(v.description);

        // ----Current Amount----
        v.currentAmountLabel = MainGame.game.make.text((v.width*1/16), (v.height*13/48), 'Account Balance: ', this.contractStyle);
        v.currentAmountLabel.anchor.setTo(0,0.5);
        v.currentPay=MainGame.game.make.text(0, 0, "", this.contractStyle);
        v.currentPay.anchor.setTo(0.5,0.5);
        v.currentPayName=MainGame.game.make.text(0, 0, "", this.contractStyle);
        v.currentPayName.anchor.setTo(0.5,0.5);
        // set in updateSelf
        v.addChild(v.currentPayLabel);
        v.currentPayLabel.addChild(v.currentPay);
        v.currentPayLabel.addChild(v.currentPayName);

        // ----Flee Button----

        // ----Set New Payment----
        v.newPayLabel=MainGame.game.make.text((v.width*1/16),(v.height*27/48),"Set their new salary:       ________", this.contractStyle);
        v.addChild(v.newPayLabel);

        v.decButton=MainGame.game.make.button((v.newPayLabel.width*13/20),(v.newPayLabel.height*3/8),'redMinusButton',function(){
            PeopleContractView.onPaymentChanged(v,false)},v,1,0,2,1);
        v.decButton.anchor.setTo(0.5,0.5);
        v.decButton.scale.setTo(0.5,0.5);
        v.decButton.input.priorityID=121;
        v.newPayLabel.addChild(v.decButton);

        v.incButton=MainGame.game.make.button((v.newPayLabel.width*21/20),(v.newPayLabel.height*3/8),'redPlusButton',function(){
            PeopleContractView.onPaymentChanged(v,true)},v,1,0,2,1);
        v.incButton.anchor.setTo(0.5,0.5);
        v.incButton.scale.setTo(0.5,0.5);
        v.incButton.input.priorityID=121;
        v.newPayLabel.addChild(v.incButton);

        v.newPay=MainGame.game.make.text((v.newPayLabel.width*17/20),(v.newPayLabel.height*3/8),"", this.contractStyle);
        // set in updateSelf
        v.newPay.anchor.setTo(0.5,0.5);
        v.newPayLabel.addChild(v.newPay);

        if (v.newPayLevel === 0)
            v.decButton.visible=false;
        if (v.newPayLevel === this.pays.length-1)
            v.incButton.visible=false;

        // ----Confirm Deposit----

        // Audio
        v.openSfx = game.make.audio('message_open');
        v.openSfx.play();
        v.closeSfx = game.make.audio('message_close');
        v.workChangeSfx = game.make.audio('cloth_click_' + Math.ceil(Math.random()*14)); // Assume we have 14 cloth click sounds
        v.paymentChangeSfx = game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds

        // Class func
        v.suicide = function() { SwissAccountView.suicide(v); };
        v.updateSelf = function() { SwissAccountView.updateSelf(v); };

        v.updateSelf();

        return v;
    },
    suicide: function(v) {
        v.incButton.freezeFrames=true;
        v.decButton.freezeFrames=true;
        v.cancelButton.freezeFrames=true;
        v.hireButton.freezeFrames=true;
        v.closeSfx.play();
        v.destroy();
    },

    onPaymentChanged: function(view, isInc){
        view.newPayLevel+=(isInc?1:-1);
        view["decButton"].visible=(view.newPayLevel>0);
        view["incButton"].visible=(view.newPayLevel<PeopleContractView.pays.length-1);
        view["newPay"].text="₸"+PeopleContractView.pays[view.newPayLevel];

        // Play sfx
        view.paymentChangeSfx.play();
        view.paymentChangeSfx = game.make.audio('paper_click_' + Math.ceil(Math.random()*8)); // Assume we have 8 paper click sounds
    },
    
    updateSelf: function(v){
        // TODO: hide Hire, update Bure -> Ministor of Bure, etc.
        console.log("Update Swiss Account View");

        // ----Current Amount----

        // ----Set New Payment----
        v.newPay.text="₸"+PeopleContractView.pays[v.newPayLevel];

        v.decButton.visible=(v.newPayLevel!==0);
        v.incButton.visible=(v.newPayLevel!==PeopleContractView.pays.length-1);
    }
};
