//##########################################################//
//######### HERE IS ALL OF THE RENDERING STUFF #############//
//##########################################################//

Sattee.getCanvas = function (layer) {
    let canvas = document.getElementById(`${this.name}${layer || this.currentLayer}`);
    let ctx = canvas.getContext("2d");
    return [ctx, canvas];
}

function _manageOptions(caller, options, obj) {
    if (options != undefined) {
        for (let key in obj) {
            let [t, f, f1] = obj[key];
            if (options[key] != undefined) {
                Sattee.validate(caller)
                    .type([options[key], t]);
                f();
            }
            else {
                if (f1 != undefined) f1();
            }
        }
    }
}

//The draw function must be called each time you try to draw on the canvas (any of the canvases)
// the arguments it takes are the canvas layer you want to draw on
// and the function that holds all of the drawing instructions

Sattee.draw = function (layer, func) {
    //validate all of the arguments
    Sattee.validate("draw")
        .arguments([layer, func], 2)
        .type([layer, "number", func, "function"])
        .range(layer, 0, this.layers);

    //set the layer
    this.currentLayer = layer;
    //call the function with all of the drawing stuff in it
    func.apply(this.scenes[this.currentScene]);
    //and then remove the layer to prevent someone from trying to draw outside of the .draw function
    this.currentLayer = undefined;
}
Sattee.background = function (r, g, b, a) {
    //validate all of the arguments
    Sattee.validate("background")
        .arguments([r, g, b], 3)
        .type([r, "number", g, "number", b, "number"]);

    //check if you are inside the Sattee.draw() function
    Sattee.validate();

    //get the 2DContext of the current canvas layer
    let [ctx, canvas] = this.getCanvas();

    //draw the bacground as a big rectangle on the current cordinates
    ctx.fillStyle = `rgba(${r},${g},${b},${a && typeof a == "number" ? a : 255})`;
    ctx.fillRect(-(this.canvasArray[this.currentLayer].x), -(this.canvasArray[this.currentLayer].y), canvas.width, canvas.height);
}
Sattee.clear = function (layer, options) {
    //validate all of the arguments
    Sattee.validate("clear")
        .arguments([layer], 1)
        .type([layer, "number"])
        .range(layer, 0, this.layers);

    //get the 2DContext of the current canvas layer
    let [ctx, canvas] = this.getCanvas(layer);

    if (options) {
        Sattee.validate("clear", `There was an error with the options in the Sattee.clear() function`)
            .arguments([options.x, options.y, options.width, options.height], 4)
            .type([options.x, "number", options.y, "number", options.width, "number", options.height, "number"]);
        x = options.x;
        y = options.y;
        if (!options.offset)
            ctx.clearRect(x, y, options.width, options.height);
        else
            ctx.clearRect(x - options.offset, y - options.offset, options.width + options.offset * 2, options.height + options.offset * 2);
    }
    else {
        if(this.canvasArray[layer].translated)
        ctx.clearRect(-(this.canvasArray[layer].x), -(this.canvasArray[layer].y), canvas.width, canvas.height);
        else
        ctx.clearRect(0,0, canvas.width, canvas.height);
    }

    //YOU CAN NOT CLEAR THE WHOLE CANVAS WHEN IN TRANSLATE NEED TO BE FIXED
}
Sattee.rect = function (x, y, w, h, options) {
    //validate all of the arguments
    Sattee.validate("rect")
        .arguments([x, y, w, h], 4)
        .type([x, "number", y, "number", w, "number", h, "number"]);

    //check if you are inside the Sattee.draw() function
    Sattee.validate();

    //get the 2DContext of the current canvas layer
    let [ctx] = this.getCanvas();

    //set some default styles
    ctx.fillStyle = "rgba(255,255,255,255)";

    //manage the options
    _manageOptions("rect", options, {
        "color": ["string", () => { ctx.fillStyle = options.color }],
        "strokeSize": ["number", () => { ctx.lineWidth = options.strokeSize }],
        "strokeColor": ["string", () => { ctx.strokeStyle = options.strokeColor }]
    });

    //draw the rectagle
    ctx.beginPath();
    ctx.rect(x, y, w, h);

    //add the styles to the drawing
    ctx.stroke();
    ctx.fill();

    //remove all of the settings when done
    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.lineWidth = 1;
}
Sattee.ellipse = function (x, y, w, h, options) {
    //validate all of the arguments
    Sattee.validate("ellipse")
        .arguments([x, y, w, h], 4)
        .type([x, "number", y, "number", w, "number", h, "number"]);

    //check if you are inside the Sattee.draw() function
    Sattee.validate();

    //get the 2DContext of the current canvas layer
    let [ctx] = this.getCanvas();

    //set some default styles
    ctx.fillStyle = "rgba(255,255,255,255)";

    //manage the stroke color and size
    _manageOptions("ellipse", options, {
        "color": ["string", () => { ctx.fillStyle = options.color }],
        "strokeSize": ["number", () => { ctx.lineWidth = options.strokeSize }],
        "strokeColor": ["string", () => { ctx.strokeStyle = options.strokeColor }]
    });

    // Draw the ellipse
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 90, 90); // w / 2 and h / 2 are cuz ctx.ellipse expects radius

    //add the styles to the drawing
    ctx.stroke();
    ctx.fill();

    //remove all of the settings when done
    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.lineWidth = 1;
}
Sattee.triangle = function (x1, y1, x2, y2, x3, y3, options) {
    //validate all of the arguments
    Sattee.validate("triangle")
        .arguments([x1, y1, x2, y2, x3, y3], 6)
        .type([x1, "number", y1, "number", x2, "number", y2, "number", x3, "number", y3, "number"]);

    //check if you are inside the Sattee.draw() function
    Sattee.validate();

    //get the 2DContext of the current canvas layer
    let [ctx] = Sattee.getCanvas();

    //set some default styles
    ctx.fillStyle = "rgba(255,255,255,255)";

    //manage the stroke color and size
    _manageOptions("triangle", options, {
        "color": ["string", () => { ctx.fillStyle = options.color }],
        "strokeSize": ["number", () => { ctx.lineWidth = options.strokeSize }],
        "strokeColor": ["string", () => { ctx.strokeStyle = options.strokeColor }]
    });

    //draw the triangle
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    //add the styles to the drawing
    ctx.stroke();
    ctx.fill();

    //remove all of the settings when done
    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.lineWidth = 1;
}
Sattee.line = function (x1, y1, x2, y2, options) {
    //validate all of the arguments
    Sattee.validate("line")
        .arguments([x1, y1, x2, y2], 4)
        .type([x1, "number", y1, "number", x2, "number", y2, "number", x3, "number", y3, "number"]);

    //check if you are inside the Sattee.draw() function
    Sattee.validate();

    //get the 2DContext of the current canvas layer
    let [ctx] = this.getCanvas();

    //set some default styles
    ctx.fillStyle = "rgba(255,255,255,255)";
    ctx.strokeStyle = "rgba(255,255,255,255)";

    //manage the stroke color and size
    _manageOptions("line", options, {
        "color": ["string", () => { ctx.fillStyle = options.color }],
        "strokeSize": ["number", () => { ctx.lineWidth = options.strokeSize }],
        "strokeColor": ["string", () => { ctx.strokeStyle = options.strokeColor }]
    });

    //draw the line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    //makes the line a little rounder
    ctx.lineCap = "round";

    //add the styles to the drawing
    ctx.stroke();
    ctx.fill();

    // //remove all of the settings when done
    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.lineWidth = 1;
}
//temporary sets the canvas (0,0) origin to whatever the x and y is given as an argument
Sattee.translate = function (layer, x, y, func) {
    //validate all of the arguments
    Sattee.validate("translate")
        .arguments([layer, x, y, func], 4)
        .type([layer, "number", x, "number", y, "number", func, "function"])
        .range(layer, 0, this.layers);

    //get the 2DContext of the current canvas layer
    let [ctx] = this.getCanvas(layer);

    //translate by x and y
    ctx.translate(x, y);
    //save the translate cordinates (used to corerctly clear or draw a background on the canvas)
    this.canvasArray[layer].translated = true;
    this.canvasArray[layer].x = x;
    this.canvasArray[layer].y = y;
    //call the function with all of the drawing stuff in it
    func.apply(this.scenes[this.currentScene]);
    //return the x and y back to it's normall state
    ctx.translate(-x, -y);
    //turn it back to 0,0 (or -x,-y)
    this.canvasArray[layer].translated = false;
    this.canvasArray[layer].x = -x;
    this.canvasArray[layer].y = -y;
}