
var shapesColors = {
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

var colors = shapesColors.scheme1;

function shape(type) {

    this.direction = 0;
    this.x = 1;
    this.y = 1;
    this.row = 0;
    this.col = 3;
    this.isAlive = true;
    this.color;

    switch (type) {
        case "I":
            this.matrix = [[120], [32, 32, 32, 32]];
            this.color = colors.I;
            break;

        case "O":
            this.matrix = [[48, 48]];
            this.color = colors.O;
            break;

        case "S":
            this.matrix = [[48, 96], [32, 48, 16]];
            this.color = colors.S;
            break;

        case "J":
            this.matrix = [[64, 120], [48, 32, 32, 32], [120, 8], [16, 16, 16, 48]];
            this.color = colors.J;
            break;

        case "T":
            this.matrix = [[32, 112], [32, 48, 32], [112, 32], [16, 48, 16]];
            this.color = colors.T;
            break;

        case "Z":
            this.matrix = [[48, 24], [16, 48, 32]];
            this.color = colors.Z;
            break;

        case "L":
            this.matrix = [[8, 120], [32, 32, 32, 48], [120, 64], [48, 16, 16, 16]];
            this.color = colors.L;
            break;

        default:
            throw new TypeError("The type of shape can be: I, O, S, J, T, Z or L !");
            break;
    }

    
}
shape.prototype.getBody = function () {
    if (this.direction >= this.matrix.length) {
        this.direction = 0;
    }
    return this.matrix[this.direction];
};
shape.prototype.setBody = function (value) {
    this.matrix[this.direction] = value;
};
shape.prototype.getGhost = function(){
    var ghost = [];
    var arr = this.getBody();
    for (var i = 0; i < arr.length; i++) {
        ghost.push(arr[i]);
    }
    return ghost;
};