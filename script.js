/*jslint browser: true, bitwise: true*/
/*global console, field, Shape*/

(function () {
    'use strict';
    
    var engine, render, field, Shape, walls;
    
    // business
    (function () {
        var shapes = {
                I: [[0, 0, 0, 30720], [8192, 8192, 8192, 8192]],
                O: [[0, 24576, 24576]],
                S: [[0, 12288, 24576], [16384, 24576, 8192]],
                Z: [[0, 24576, 12288], [8192, 24576, 16384]],
                J: [[0, 16384, 28672], [24576, 16384, 16384], [0, 28672, 4096], [8192, 8192, 24576]],
                L: [[0, 4096, 28672], [16384, 16384, 24576], [24576, 8192, 8192], [0, 28672, 16384]],
                T: [[0, 8192, 28672], [16384, 24576, 16384], [0, 28672, 8192], [8192, 24576, 8192]]
            },
            
            setBits = function (bits, variable) {
                return (variable |= bits);
            },
        
            removeBits = function (bits, variable) {
                return (variable &= ~bits);
            },
             
            manipulateBits = function (bitArr, arr, startIndex, callback) {
                if ((arr.length - startIndex - bitArr.length) < 0) {
                    throw new Error('Bit array is too long, or array index is too big!');
                }
                
                var i;
        
                for (i = 0; i < bitArr.length; i += 1) {
                    arr[i + startIndex] = callback(bitArr[i], arr[i + startIndex]);
                }
            };
        
        field = {
            kind: 'Field',
            
            matrix: (function () {
                var i, arr = [],
                    FIELD_VISIBLE_ROWS = 20,
                    ROW_WALLS = 8196,   // b 10000000001000
                    ROW_BOTTOM = 16380; // b 11111111111000
        
                for (i = 0; i < FIELD_VISIBLE_ROWS; i += 1) {
                    arr.push(ROW_WALLS);
                }
                
                arr.push(ROW_BOTTOM);
                
                return arr;
            }()),
            
            getStampArr: function (shape) {
                var i, stamp = [];
            
                for (i = 0; i < shape.matrix.length; i += 1) {
                    stamp.push(this.matrix[i + shape.getY()]);
                }
        
                return stamp;
            },
        
            addShape: function (shape) {
                if (!field.hasFreeSpace(shape)) {
                    throw new Error('Game Over !!!');
                    //return false;
                }
                
                manipulateBits(shape.matrix, this.matrix, shape.getY(), setBits);
                return true;
            },
                
            removeShape: function (shape) {
                manipulateBits(shape.matrix, this.matrix, shape.getY(), removeBits);
            },
            
            hasFreeSpace: function (shape) {
                var i, matrix = shape.matrix,
                    place = this.getStampArr(shape);
                
                manipulateBits(matrix, place, 0, setBits);
                manipulateBits(matrix, place, 0, removeBits);
                
                for (i = 0; i < place.length; i += 1) {
                    if (place[i] !== this.matrix[i + shape.getY()]) {
                        return false;
                    }
                }
                
                return true;
            }
        };
    
        Shape = function (kind) {
            var x = 3,
                y = 0;
            
            this.orientation = 0;
            this.kind = kind;
            this.getX = function () {return x; };
            this.matrix = this.getMatrix();
            this.setX = function (val) {x = val; this.matrix = this.getMatrix(); };
            this.setY = function (val) {y = val; };
            this.getY = function () {return y; };
        };
    
        Shape.prototype.getMatrix = function () {
            var i, arr = [],
                
                protoArr = shapes[this.kind][this.orientation];
            
            for (i = 0; i < protoArr.length; i += 1) {
                arr.push(protoArr[i] >> this.getX());
            }
            
            return arr;
        };
    
        Shape.prototype.getCopy = function () {
            var newShape = new Shape(this.kind);
            
            newShape.rotate = this.rotate;
            newShape.x = this.x;
            newShape.y = this.y;
            
            return newShape;
        };
        
        Shape.prototype.rotate = function () {
            var orientation = this.orientation;
            
            field.removeShape(this);
            
            if ((this.orientation += 1) >= shapes[this.kind].length) {
                this.orientation = 0;
            }
            
            this.matrix = this.getMatrix();
            
            if (!field.hasFreeSpace(this)) {
                this.orientation = orientation;
                this.matrix = this.getMatrix();
            }

            
            field.addShape(this);
        };
    
        Shape.prototype.moveDown = function () {
            var y = this.getY();
            
            field.removeShape(this);
            this.setY(y + 1);
            
            if (!field.hasFreeSpace(this)) {
                this.setY(y);
            }
            
            field.addShape(this);
        };
    
        Shape.prototype.moveRight = function () {
            var x = this.getX();
            
            field.removeShape(this);
            this.setX(x + 1);
            
            if (!field.hasFreeSpace(this)) {
                this.setX(x);
            }
            
            field.addShape(this);
        };
    
        Shape.prototype.moveLeft = function () {
            var x = this.getX();
            
            field.removeShape(this);
            this.setX(x - 1);
            
            if (!field.hasFreeSpace(this)) {
                this.setX(x);
            }
            
            field.addShape(this);
        };
    }());

    // Graphics
    (function () {
        var colorScheme, ctx, ctxNext,
            
            CANVAS_SQUARE_WIDTH = 22,
            CANVAS_SQUARE_HEIHGT = 22,
            CANVAS_SQUARE_BORDER = 1,
            CANVAS_CELL_WIDTH = CANVAS_SQUARE_WIDTH + (2 * CANVAS_SQUARE_BORDER),
            CANVAS_CELL_HEIHGT = CANVAS_SQUARE_HEIHGT + (2 * CANVAS_SQUARE_BORDER),
            CANVAS_COLS = 10,
            CANVAS_ROWS = 20,
            CANVAS_WIDTH = CANVAS_CELL_WIDTH * CANVAS_COLS,
            CANVAS_HEIGHT = CANVAS_CELL_HEIHGT * CANVAS_ROWS,
            
            shapesColors = {
                scheme1: {  // Vadim Gerasimov's Tetris 3.12
                    'I': '#AA0000',
                    'J': '#FFFFFF',
                    'L': '#AA00AA',
                    'O': '#0000AA',
                    'S': '#00AA00',
                    'T': '#AA5500',
                    'Z': '#00AAAA'
                },
                scheme2: {  // Microsoft Tetris
                    'I': '#FF0000',
                    'J': '#FF00FF',
                    'L': '#FFFF00',
                    'O': '#00FFFF',
                    'S': '#0000FF',
                    'T': '#C0C0C0',
                    'Z': '#00FF00'
                },
                scheme3: { // Sega/Arika (TGM series)
                    'I': '#FF0000',
                    'J': '#0000FF',
                    'L': '#FFA500',
                    'O': '#FFFF00',
                    'S': '#FF00FF',
                    'T': '#00FFFF',
                    'Z': '#00FF00'
                },
                scheme4: {  // The New Tetris and Kids Tetris
                    'I': '#00FFFF',
                    'J': '#8000FF',
                    'L': '#FF00FF',
                    'O': '#C0C0C0',
                    'S': '#00FF00',
                    'T': '#FFFF00',
                    'Z': '#FF0000'
                },
                scheme5: {  // The Tetris Company standardization (beginning with Tetris Worlds) Tetris Party
                    'I': '#00FFFF',
                    'J': '#0000FF',
                    'L': '#FFA500',
                    'O': '#FFFF00',
                    'S': '#00FF00',
                    'T': '#AA00FF',
                    'Z': '#FF0000'
                },
                scheme6: {  // Atari/Arcade
                    'I': '#FF0000',
                    'J': '#FFFF00',
                    'L': '#FF00FF',
                    'O': '#0000FF',
                    'S': '#00FFFF',
                    'T': '#00FF00',
                    'Z': '#FFA500'
                },
                scheme7: {  // TETЯIS The Soviet Mind Game
                    'I': '#FF0000',
                    'J': '#FFA500',
                    'L': '#FF00FF',
                    'O': '#0000FF',
                    'S': '#00FF00',
                    'T': '#808000',
                    'Z': '#00FFFF'
                }
            };
        
        function drawSquare(x, y, color) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.lineWidth = "1px";
            ctx.strokeStyle = "black";
            ctx.rect(x, y, CANVAS_CELL_WIDTH, CANVAS_CELL_HEIHGT);
            ctx.fill();
            ctx.stroke();
        }
        
        function drawShape(shape) {
            var row, col, x, y, mask;
            
            for (row = 0; row < shape.matrix.length; row += 1) {
                mask = 8192;   // b 100 0000 0000 0000
                
                for (col = 0; col < CANVAS_COLS; col += 1) {
                    if (shape.matrix[row] & (mask >>= 1)) {
                        x = col * CANVAS_CELL_WIDTH;
                        y = row * CANVAS_CELL_HEIHGT + (shape.getY() * CANVAS_CELL_HEIHGT);
                        
                        drawSquare(x, y, colorScheme[shape.kind]);
                    }
                }
            }
        }
        
        render = {
            setColors: function (scheme) {
                colorScheme = shapesColors[scheme];
            },
            
            draw: function () {
                var i;
                
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                
                for (i = 0; i < engine.objects.length; i += 1) {
                    drawShape(engine.objects[i]);
                }
            },
            
            drawNextShape: function () {
                var ctxBack = ctx;
                ctx = ctxNext;
                ctxNext.clearRect(0, 0, 128, 128);
                drawShape(engine.nextShape);
                ctx = ctxBack;
            },
            
            setCanvas: function (fieldId, nextShapeId) {
                var canvas = document.getElementById(fieldId),
                    canvasNext = document.getElementById(nextShapeId);
                canvas.width = CANVAS_WIDTH;
                canvas.height = CANVAS_HEIGHT;
                
                canvasNext.width = 128;
                canvasNext.height = 128;
                ctx = canvas.getContext('2d');
                ctxNext = canvasNext.getContext('2d');
            }
        };
    }());
        
    // game engine
    (function () {
        
        var
            Key = {
                pressed: {},
            
                done: {
                    left: false,
                    right: false,
                    up: false,
                    down: false
                },
            
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
            
                isDown: function (keyCode) {
                    return this.pressed[keyCode];
                },
            
                onKeydown: function (event) {
                    this.pressed[event.keyCode] = true;
                },
            
                onKeyup: function (event) {
                    delete this.pressed[event.keyCode];
                    this.done.right = false;
                    this.done.left = false;
                    this.done.up = false;
                    this.done.down = false;
                }
            },
            
            // time function
            requestAnimFrame = (function (callback) {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            }()),
                
            stopMoving = function () {
                engine.nextShape.setX(5);
                engine.addObject(engine.nextShape);
                
                engine.nextShape = getRandomShape();
                render.drawNextShape();
            },
                
            getRandomShape = function () {
                // get random number 1 - 7
                var shp,
                    type = Math.floor((Math.random() * 7) + 1);
        
                switch (type) {
                case 1:
                    shp = new Shape('I');
                    break;
    
                case 2:
                    shp = new Shape('O');
                    break;
    
                case 3:
                    shp = new Shape('S');
                    break;
    
                case 4:
                    shp = new Shape('J');
                    break;
    
                case 5:
                    shp = new Shape('T');
                    break;
    
                case 6:
                    shp = new Shape('Z');
                    break;
    
                case 7:
                    shp = new Shape('L');
                    break;
    
                default:
                    break;
                }
        
                return shp;
            },
                
            rotate = function () {
                engine.drivableShape.rotate();
            },
                
            moveRight = function () {
                engine.drivableShape.moveRight();
            },
                
            moveLeft = function () {
                engine.drivableShape.moveLeft();
            },
                
            moveDown = function () {
                var y = engine.drivableShape.getY();
                engine.drivableShape.moveDown();
                
                if (engine.drivableShape.getY() === y) {
                    stopMoving();
                }
            },
        
            // animate function
            animate = function (lastTime) {
                // update time
                var currentTime = new Date().getTime(),
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
                
                if (Key.isDown(Key.DOWN) && !Key.done.down) {
                    Key.done.down = true;
                    moveDown();
                }
        
                // update objects state
                render.draw();
        
                // request new frame
                requestAnimFrame(function () {
                    animate(lastTime);
                });
            };
        
        engine = {
            objects: [],
            
            addObject: function (obj) {
                this.objects.push(obj);
                this.drivableShape = obj;
                field.addShape(obj);
            },
            
            start: function () {    // start animation
                engine.nextShape = getRandomShape();
                var shape = getRandomShape();
                render.drawNextShape();
                shape.setX(5);
                engine.addObject(shape);
                animate(new Date().getTime());
            }
        };
        
        window.addEventListener('keyup', function (event) {
            Key.onKeyup(event);
        }, false);
        
        window.addEventListener('keydown', function (event) {
            Key.onKeydown(event);
        }, false);
    }());
    
    
    // tests
    (function () {
        render.setCanvas('play-field', 'next-shape');
        render.setColors('scheme1');

        engine.start();
    }());

}());