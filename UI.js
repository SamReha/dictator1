// Group all our UI classes here (at least, for now)
var Hud = {
    buildMenuButton: null,
    buildMenu: null,
    
    createNew: function(game) {
        this.buildMenu = BuildMenu.createNew();
        this.buildMenuButton = game.make.button(game.world.centerX, game.world.centery, 'button', null, this, 2, 1, 0);
        
        return this;
    }
}

var BuildMenu = {
    buildingPurchaseList: [
        BuildingPurchaseOption.createNew(null, "Mansion",   10),
        BuildingPurchaseOption.createNew(null, "Suburbs",   10),
        BuildingPurchaseOption.createNew(null, "Apartment", 10),
        BuildingPurchaseOption.createNew(null, "School",    15),
        BuildingPurchaseOption.createNew(null, "Factory",   30),
        BuildingPurchaseOption.createNew(null, "Army Base", 30)
    ],
    visible: false,
    
    createNew: function() {
        return this;
    }
}

var BuildingPurchaseOption = {
    icon: null,
    name: "",
    cost: 0,
    purchaseable: false,
    
    createNew: function(icon, name, cost) {
        this.icon = icon;
        this.name = name;
        this.cost = cost;
        
        return this;
    }
}