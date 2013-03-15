// rectangle
function rectangle() {
    this.width = 100;
    this.height = 50;
    this.borderWidth = 5;
    this.linearSpead = 100;
}
rectangle.prototype = new shape();
rectangle.prototype.draw = function() {
    this.context.beginPath();
    this.context.rect(this.x, this.y, this.width, this.height);
    this.context.fillStyle = "#8ED6FF";
    this.context.fill();
    this.context.lineWidth = this.borderWidth;
    this.context.strokeStyle = "black";
    this.context.stroke();
};
rectangle.prototype.move = function(timeDelta) {
    var linearDelta = this.linearSpead * timeDelta / 1000;
    if (this.y < (this.canvas.height - this.height - this.borderWidth / 2)) {
        this.y += linearDelta;
    }
};


// shape
function shape() {
    this.x = null;
    this.y = null;
    this.context = null;
    if (this.canvas) {
        this.context = this.canvas.getContext('2d');
    }
}
shape.prototype.canvas = null;
shape.prototype.update = function(timeDelta) {
    this.draw(this.context);
    this.move(timeDelta);
};
shape.prototype.draw = function() {
    console.log("Function draw() is not implemented!");
};













window.onload = (function() {
    var rect = new rectangle();

    var canvas = document.getElementById("play-field");
    canvas.width = 240;
    canvas.height = 480;

    var engine = new gameCanvasEngine(canvas);


    rect.canvas = canvas;
    rect.x = 50;
    rect.y = 200;
    rect.draw();
    console.log(rect);


    engine.add(new rectangle());
    engine.start();
})();
