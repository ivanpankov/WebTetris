(function () {
    "use strict"

    window.onload = function () {
        var playField = {
            canvas: document.getElementById("play-field"),
            matrix: [2049, 2049, 2049, 2049, 2049, 2049, 2049, 2049, 2049, 2049, 2049,
               2049, 2049, 2049, 2049, 2049, 2049, 2049, 2049, 2049],
           // matrix: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        },
        engine = new GameEngine(playField);

        playField.canvas.width = 240;
        playField.canvas.height = 480;

       // var sp = new shapeT(44, 44, 22, 22, true, "#8ED6FF", "black", 2);
        //var sp1 = new shapeO(44, 120, 22, 22, true, "#8AA6FF", "black", 2);

       


        
        //engine.add(shp);
        //engine.add(sp1);

        engine.start();
    }
})();
