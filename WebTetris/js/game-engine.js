function Render(objArr, canvas) {
    var ctx = canvas.getContext('2d');

    function drawSquare(x, y, width, height, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.lineWidth = "1px";
        ctx.strokeStyle = "black";
        ctx.rect(x, y, width, height);
        ctx.fill();
        ctx.stroke();
    }

    function drawWalls() {

    }

    function drawShape(obj) {
        var bodyArr = obj.getBody(),
            lenY = bodyArr.length,
            x;


        for (var i = 0; i < lenY; i++) {
            x = 2048;
            for (var j = 0; j < 10; j++) {
                x >>= 1;

                if (bodyArr[i] & x) {
                    drawSquare((obj.x + j * 24), (obj.y + i * 24), 22, 22, obj.color);
                }
            }
        }
    }

    this.drawAll = function () {
       // ctx.fillStyle = '#c69c6d';
        //ctx.fillRect(23, 0, canvas.width - 48, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.fill;

        for (var i = 0; i < objArr.length; i++) {
            drawShape(objArr[i]);
        }
    }
}

// the engine
function GameEngine(playField) {
    var objectsQueue = [];
    var timeDelta;
    var render = new Render(objectsQueue, playField.canvas);
    var theShape;

    function getRandomShape() {
        // get random number 1 - 7
        var type = Math.floor((Math.random() * 7) + 1);
        var shp;

        switch (type) {
            case 1:
                shp = new shape('I');
                break;

            case 2:
                shp = new shape('O');
                break;

            case 3:
                shp = new shape('S');
                break;

            case 4:
                shp = new shape('J');
                break;

            case 5:
                shp = new shape('T');
                break;

            case 6:
                shp = new shape('Z');
                break;

            case 7:
                shp = new shape('L');
                break;

            default:
                break;
        }

        return shp;
    }

    function isMovePossible(ghost) {
        // check move possibility
        for (var i = 0; i < ghost.length; i++) {
            if (ghost[i] & playField.matrix[theShape.y + i]) {
                return false; // move is impossible
            }
        }

        // no overlap - the move is possible
        return true;
    }

    function moveLeft() {
        // clone shape body
        var ghost = theShape.getGhost();
        // shift cloning left
        for (var i = 0; i < ghost.length; i++) {
            ghost[i] <<= 1;
        }

        if (isMovePossible(ghost)) {
            // move is possible
            for (var i = 0; i < theShape.matrix.length; i++) {
                for (j = 0; j < theShape.matrix[i].length; j++) {
                    theShape.matrix[i][j] <<= 1;
                }
            }
        }
    }

    function moveRight() {
        // clone shape body
        var ghost = theShape.getGhost();
        // shift cloning right
        for (var i = 0; i < ghost.length; i++) {
            ghost[i] >>= 1;
        }

        if (isMovePossible(ghost)) {
            // move is possible
            for (var i = 0; i < theShape.matrix.length; i++) {
                for (j = 0; j < theShape.matrix[i].length; j++) {
                    theShape.matrix[i][j] >>= 1;
                }
            }
        }
    }

    function rotate() {
        var matrix = theShape.matrix;
        var dir = theShape.direction + 1;
        if (dir >= matrix.length) dir = 0;
        var ghost = matrix[dir];
        if (isMovePossible(ghost)) {
            theShape.direction = dir;
        }
    }

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

    // animate function
    var animate = function (lastTime) {
        // update time
        var currentTime = new Date().getTime();
        timeDelta = currentTime - lastTime;
        lastTime = currentTime;


        // keyboard
        //if (Key.isDown(Key.UP)) this.moveUp();
        if (Key.isDown(Key.LEFT) && !Key.done.left) {
            Key.done.left = true;
            moveLeft();
        }
        //if (Key.isDown(Key.DOWN)) this.moveDown();
        if (Key.isDown(Key.RIGHT) && !Key.done.right) {
            Key.done.right = true;
            moveRight();
        }
        if (Key.isDown(Key.UP) && !Key.done.up) {
            Key.done.up = true;
            rotate();
        }

        // update objects state
        render.drawAll();

        // request new frame
        requestAnimFrame(function () {
            animate(lastTime);
        });
    };

    // start animation
    this.start = function () {
        theShape = getRandomShape();
        this.add(theShape);

        animate(new Date().getTime());
    };

    // add object to queue
    this.add = function (obj) {
        objectsQueue.push(obj);
    };
}