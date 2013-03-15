// game object
function GameObject(x, y, isAlive) {
    this.x = x;
    this.y = y;
    this.isAlive = isAlive;
}

// shape
function Rendable(x, y, width, height, isAlive) {
    this.width = width;
    this.height = height;

    GameObject.call(this, x, y, isAlive);
}
Rendable.prototype = {
    constructor: Rendable,
    draw: function () {
        console.log("Function draw() is not implemented!");
    }
}


function Render(objArr, canvas) {
    var ctx = canvas.getContext('2d');

    this.draw = function () {
        var len = objArr.length,
            i = 0;

        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        while (len--) {
            objArr[i++].draw(ctx);
        }
    }
}

// the engine
function GameEngine(canvas) {
    var objectsQueue = [];
    var timeDelta;
    var render = new Render(objectsQueue, canvas);

    // time function
    var requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    // anumate function
    var animate = function (lastTime) {
        // update time
        var currentTime = new Date().getTime();
        timeDelta = currentTime - lastTime;
        lastTime = currentTime;

        // update objects state
        render.draw();

        // request new frame
        //requestAnimFrame(function () {
        //    animate(lastTime);
        //});
    };

    this.start = function () {
        animate(new Date().getTime());
    };

    // add object to queue
    this.add = function (obj) {
        obj.canvas = canvas;
        objectsQueue.push(obj);
    };
}