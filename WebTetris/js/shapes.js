// square
function rendableSquare(x, y, width, height, isAlive, bodyColor, borderColor, borderWidth) {
    this.bodyColor = bodyColor;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;

    Rendable.call(this, x, y, width, height, isAlive);
}
rendableSquare.prototype = {
    constructor: rendableSquare,
    draw: function (context) {
        context.beginPath();
        context.fillStyle = this.bodyColor;
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderColor;
        context.rect(this.x, this.y, this.width, this.height);
        context.fill();
        context.stroke();
        //context.closePath();
    }
};


// shape object
function shape(x, y, width, height, isAlive, bodyColor, borderColor, borderWidth, bodyArr) {
    this.bodyColor = bodyColor;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.body = bodyArr;


    Rendable.call(this, x, y, width, height, isAlive);
}
shape.prototype = {
    constructor: shape,
    drawSquare: function (context, x, y, width, height) {
        context.beginPath();
        context.fillStyle = this.bodyColor;
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderColor;
        context.rect(x, y, width, height);
        context.fill();
        context.stroke();
    },
    draw: function (context) {
        var lenX = this.body.length,
            lenY = this.body[0].length;
        for (var i = 0; i < lenX; i++) {
            for (var j = 0; j < lenY; j++) {
                if (this.body[i][j]) {
                    this.drawSquare(context, this.x + 24 * j, this.y + 24 * i, 22, 22);
                }
            }
        }
    }
};

// T shape
function shapeT(x, y, width, height, isAlive, bodyColor, borderColor, borderWidth) {
    this.body = [[1, 1, 1], [0, 1, 0]];

    shape.apply(this, [x, y, width, height, isAlive, bodyColor, borderColor, borderWidth, this.body]);
}
shapeT.prototype.constructor = shapeT;
shapeT.prototype = new shape();


// O shape
function shapeO(x, y, width, height, isAlive, bodyColor, borderColor, borderWidth) {
    this.body = [[1, 1], [1, 1]];

    shape.apply(this, [x, y, width, height, isAlive, bodyColor, borderColor, borderWidth, this.body]);
}
shapeO.prototype.constructor = shapeO;
shapeO.prototype = new shape();