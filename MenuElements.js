// An empty sheet of paper that can be used as a background / holder for other menus
var Page = {
    margin: {x: 20, y: 20},  // How far away do we need to be from the edges (in pixels) to avoid drawing over artistic embellishments

    createNew: function() {
        var page = MainGame.game.add.sprite(0, 0, 'page_texture');
        page.inputEnabled = true;
        page.input.priorityID = 1; // Probably a reasonable default value -Sam

        return page;
    },
};

var TextButton = {
    createNew: function(x, y, sprite_sheet, callback, callback_context, up, down, over, out, text, textStyle) {
        var button = game.make.button(x, y, sprite_sheet, callback, callback_context, up, down, over, out);
        button.inputEnabled = true;
        button.input.priorityID = 10;

        button.label = game.make.text(button.width/2, button.height/2, text, textStyle);
        button.label.anchor.set(0.5, 0.5);
        button.addChild(button.label);

        return button;
    }
};