(function () {
    "use strict"

    window.onload = function () {
        var playField = document.getElementById("play-field"),
        engine = new GameEngine(playField);

        playField.width = 240;
        playField.height = 480;

        var sp = new shapeT(44, 44, 22, 22, true, "#8ED6FF", "black", 2);
        var sp1 = new shapeO(44, 120, 22, 22, true, "#8AA6FF", "black", 2);

        
        engine.add(sp);
        engine.add(sp1);

        engine.start();
    }
})();
