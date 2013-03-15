// the engine
function gameCanvasEngine(canvas) {
    var context = canvas.getContext('2d');
    var objectsQueue = [];
    var timeDelta;

    // time function
    var requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    // anumate function
    var animate = function(lastTime) {
        // update time
        var currentTime = new Date().getTime();
        var obj;
        timeDelta = currentTime - lastTime;
        lastTime = currentTime;

        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // update objects state
        for (i=0; i < objectsQueue.length; i++) {
            objectsQueue[i].update(timeDelta);
        }

        // request new frame
        requestAnimFrame(function() {
            animate(lastTime);
        });
    };
    
    this.start = function(){
        animate(new Date().getTime());
    };

    // add object to queue
    this.add = function(obj) {
        obj.canvas = canvas;
        objectsQueue.push(obj);
    };
}