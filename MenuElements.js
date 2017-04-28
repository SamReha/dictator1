// An empty sheet of paper that can be used as a background / holder for other menus
var Page = {
    margin: {x: 20, y: 20},  // How far away do we need to be from the edges (in pixels) to avoid drawing over artistic embellishments

    createNew: function() {
        var page = MainGame.game.make.sprite(0, 0, 'page_texture');
        page.inputEnabled = true;
        page.input.priorityID = 1; // Probably a reasonable default value -Sam

        return page;
    },
};