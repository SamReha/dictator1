/* A subcomponent of the FunPanel that displays when there is a risk of riot. */
var PressureGauge = {
    drainRate: 10,
    red: 0xff0000,
    barOpacity: .80,
    maxDelta: 35, // Out of 100

    createNew: function(x, y) {
        var pressureGauge = MainGame.game.make.sprite(x, y, 'rebellion_pressure_back');
        ToolTip.addTipTo(pressureGauge, 2, 'Revolutionary Pressure: ', 550, y + 70);
        pressureGauge.visible = true;
        pressureGauge.fillAmount = 0;

        pressureGauge.needle = MainGame.game.make.sprite(pressureGauge.width/2, 5, 'rebellion_pressure_needle');
        pressureGauge.needle.anchor.set(0.9167, 0.5);
        pressureGauge.addChild(pressureGauge.needle);

        pressureGauge.frontPlate = MainGame.game.make.sprite(0, 0, 'rebellion_pressure_front');
        pressureGauge.addChild(pressureGauge.frontPlate);

        // Properties
        pressureGauge.delta = 0;      // Percent change per turn

        // Class functions
        pressureGauge.updateData = function() { PressureGauge.updateData(pressureGauge); };
        pressureGauge.setVisibility = function() { PressureGauge.setVisibility(pressureGauge); };

        return pressureGauge;
    },

    updateData: function(pressureGauge) {
        //pressureGauge.setVisibility();

        // Only bother updating if I am visible.
        if (pressureGauge.visible) {
            var newFillAmount = (MainGame.global.thermometerFill/100) * 180; // convert thermometer fill (a percent) into newFillAmount (an angle in degrees)
            if (pressureGauge.fillAmount !== newFillAmount) {
                pressureGauge.fillAmount = newFillAmount;
                MainGame.game.add.tween(pressureGauge.needle).to({angle: -newFillAmount}, 200,Phaser.Easing.Quadratic.InOut,true);
            }
        }

        pressureGauge.toolTip.updateData('Revolutionary Pressure: ' + MainGame.global.thermometerFill + '%');
    },

    // Show the pressureGauge iff: Free and Unrest are overlapping OR there is fluid in the pressureGauge
    setVisibility: function(pressureGauge) {
        // Estimate current delta
        pressureGauge.delta = MainGame.global.freedom + MainGame.global.unrest - 100;

        pressureGauge.visible = pressureGauge.delta > 0 || MainGame.global.pressureGaugeFill > 0;
    }
}

/* A separate UI element from the stats panel that accentuates the Freedom and Unrest Stats. Should be near the top of the screen */
var FunPanel = {
    unitWidth: 120,
    horizontalPad: 5,
    textStyle: { font: '30px STKaiti', fill: '#ffffff', boundsAlignH: 'center', boundsAlignV: 'middle', shadowBlur: 1, shadowColor: "rgba(0,0,0,0.75)", shadowOffsetX: 2, shadowOffsetY: 2 },
    barOpacity: .80,

    createNew: function() {
        var funPanel = MainGame.game.make.sprite(0, 0, 'fun_panel_backpanel');
        funPanel.anchor.set(0.5, 0);
        funPanel.x = MainGame.game.width / 2;
        funPanel.inputEnabled = true;
        funPanel.input.priorityID = 1;
        funPanel.oldFreedom = 0;
        funPanel.oldUnrest = 0;

        // Meter
        funPanel.meter = MainGame.game.make.sprite(0, 5, 'freedomUnrestMeter');
        funPanel.meter.anchor.x = 0.5;
        funPanel.addChild(funPanel.meter);

        // Do the magic bars
        funPanel.freedomBar = MainGame.game.make.sprite(-funPanel.meter.width/2, 4, 'blue');
        funPanel.freedomBar.alpha = this.barOpacity;
        funPanel.freedomBar.height = 16;
        funPanel.meter.addChild(funPanel.freedomBar);

        funPanel.unrestBar = MainGame.game.make.sprite(funPanel.meter.width/2, 28, 'red');
        funPanel.unrestBar.alpha = this.barOpacity;
        funPanel.unrestBar.height = 16;
        funPanel.meter.addChild(funPanel.unrestBar);

        // Meter foreground
        funPanel.meterForeground = MainGame.game.make.sprite(0, 5, 'freedomUnrestMeter_foreground');
        funPanel.meterForeground.anchor.x = 0.5;
        funPanel.addChild(funPanel.meterForeground);

        // Freedom
        funPanel.freeSprite = MainGame.game.make.sprite(0, 5, 'freedom_icon');
        funPanel.freeSprite.x = -funPanel.meter.width/2 - funPanel.freeSprite.width/2 - 5;
        funPanel.freeSprite.anchor.x = 0.5;

        ToolTip.addTipTo(funPanel.freeSprite, 2, 'Total Freedom', funPanel.x + funPanel.freeSprite.x, 48);
        funPanel.addChild(funPanel.freeSprite);

        // Unrest
        funPanel.unrestSprite = MainGame.game.make.sprite(0, 5, 'unrest_icon');
        funPanel.unrestSprite.x = funPanel.meter.width/2 + funPanel.unrestSprite.width/2 + 5;
        funPanel.unrestSprite.anchor.x = 0.5;

        ToolTip.addTipTo(funPanel.unrestSprite, 2, 'Total Unrest', funPanel.x + funPanel.unrestSprite.x, 48);
        funPanel.addChild(funPanel.unrestSprite);

        // Particles!
        //  Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
        funPanel.steam = MainGame.game.add.emitter(funPanel.x, funPanel.y+funPanel.meter.height, funPanel.meter.height);
        funPanel.steam.width = funPanel.meter.width;

        funPanel.steam.makeParticles(['whitePuff0', 'whitePuff1', 'whitePuff2', 'whitePuff3', 'whitePuff4', 'whitePuff5', 'whitePuff6', 'whitePuff7', 'whitePuff8', 'whitePuff9', 'whitePuff10']);

        funPanel.steam.minParticleSpeed.set(0, 0);
        funPanel.steam.maxParticleSpeed.set(0, -100);

        funPanel.steam.setAlpha(0.0, 0.6, 400, Phaser.Easing.Linear.None, true);
        funPanel.steam.minParticleScale = 0.25;
        funPanel.steam.maxParticleScale = 0.5;
        funPanel.steam.gravity = -200;

        //  false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
        //  The 5000 value is the lifespan of each particle before it's killed
        funPanel.steam.start(false, 800, 10);
        funPanel.steam.on = false;

        //funPanel.scale.set(1.25, 1.25);

        // Riot Thermometer
        funPanel.pressureGauge = PressureGauge.createNew(0, 63);
        funPanel.pressureGauge.x = -funPanel.pressureGauge.width/2;
        // funPanel.pressureGauge = PressureGauge.createNew(funPanel.width/2 + 10, 0);
        funPanel.addChild(funPanel.pressureGauge);

        // Class functions
        funPanel.updateData = function() { FunPanel.updateData(funPanel); };

        // Set update loop
        var timer = MainGame.game.time.create(false);
        timer.loop(500, function() {
            funPanel.updateData();
        }, funPanel);
        timer.start();

        return funPanel;
    },

    updateData(funPanel) {
        var globalStats = MainGame.global;

        var newFreedom = globalStats.freedom;
        var newUnrest = globalStats.unrest;

        if((newFreedom !== funPanel.oldFreedom || newUnrest !== funPanel.oldUnrest) && newFreedom !== NaN && newUnrest !== NaN){
            // Update tooltips
            funPanel.freeSprite.toolTip.updateData('Total Freedom: ' + newFreedom + '%');
            funPanel.unrestSprite.toolTip.updateData('Total Unrest: ' + newUnrest + '%');

            // Update magic bars
            MainGame.game.add.tween(funPanel.freedomBar).to({width: globalStats.freedom/100 * funPanel.meter.width}, 200).start();
            MainGame.game.add.tween(funPanel.unrestBar).to({width: -globalStats.unrest/100 * funPanel.meter.width}, 200).start();

            // Is it getting steamy up in here?
            var pressureGaugeFillPercent = MainGame.global.thermometerFill/100;
            funPanel.steam.frequency = 110 - funPanel.pressureGauge.delta;
            funPanel.steam.width = (pressureGaugeFillPercent * funPanel.meter.width) * 0.9 + (funPanel.meter.width * 0.1);
            funPanel.steam.x = MainGame.game.width/2 - funPanel.meter.width/2 + funPanel.freedomBar.width - (pressureGaugeFillPercent * funPanel.meter.width)/2;
            funPanel.steam.on = pressureGaugeFillPercent > 0;

            funPanel.oldFreedom = newFreedom;
            funPanel.oldUnrest = newUnrest;
        }

        funPanel.pressureGauge.updateData();
    },
}