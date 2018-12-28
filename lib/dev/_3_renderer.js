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
                f(options[key]);
            }
            else {
                if (f1 != undefined) f1();
            }
        }
    }
}
function _manageDefaultDrawingOptions(name, options, ctx) {
    _manageOptions(name, options, {
        "color": ["string", () => { ctx.fillStyle = options.color }],
        "strokeSize": ["number", () => { ctx.lineWidth = options.strokeSize }],
        "strokeColor": ["string", () => { ctx.strokeStyle = options.strokeColor }],
    });
}
function _validateDrawingFunction(name, args) {
    //validate all of the arguments
    Sattee.validate(name)
        .arguments(args, args.length)
        .type("number", args);

    //check if you are inside the Sattee.draw() function
    Sattee.validate();
}
function _colorize(ctx, stroke) {
    //add the styles to the drawing
    if (stroke)
        ctx.stroke();
    ctx.fill();
}

//sets some default canvas styles
//called in the sattee object configure function
function _setCtxToLayer(canvas) {
    let ctx = canvas.getContext("2d");
    //here are all of the default styles
    ctx.fillStyle = "rgb(51,51,51)";
    // ctx.lineCap = "round";
}

//The draw function must be called each time you try to draw on the canvas (any of the canvases)
// the arguments it takes are the canvas layer you want to draw on
// and the function that holds all of the drawing instructions

Sattee.draw = function (layer, func) {
    //validate all of the arguments
    Sattee.validate("draw")
        .arguments([layer, func], 2)
        .type([layer, "number", func, "function"])
        .range(layer, 0, this.layers - 1);

    //set the layer
    this.currentLayer = layer;
    //call the function with all of the drawing stuff in it
    func.apply(this.scenes[this.currentScene]);
    //and then remove the layer to prevent someone from trying to draw outside of the .draw function
    this.currentLayer = undefined;
}
Sattee.background = function (r, g, b, a) {
    //validate all of the arguments
    _validateDrawingFunction("background", [r, g, b]);

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
        if (this.canvasArray[layer].translated)
            ctx.clearRect(-(this.canvasArray[layer].x), -(this.canvasArray[layer].y), canvas.width, canvas.height);
        else
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    //YOU CAN NOT CLEAR THE WHOLE CANVAS WHEN IN TRANSLATE NEED TO BE FIXED
}
Sattee.rect = function (x, y, w, h, options) {
    //validate all of the arguments
    _validateDrawingFunction("rect", [x, y, w, h]);

    //get the 2DContext of the current canvas layer
    let [ctx] = this.getCanvas();

    //save the current canvas drawing settings
    ctx.save();

    //manage the default options
    _manageDefaultDrawingOptions("rect", options, ctx);

    //manage additional options that change in other drawing function
    let fx = x, fy = y; // final x , final y (where the drawing will be rotated)
    _manageOptions("rect", options, {
        "rotateX": ["number", (rx) => { fx = rx }],
        "rotateY": ["number", (ry) => { fy = ry }],
        "rotate": ["number", (deg) => {
            Sattee.translate(Sattee.currentLayer, fx, fy, function () {
                ctx.rotate(deg * Math.PI / 180)
            });
        }],
        "borderRadius": ["object", (radius) => {
            //draw a path (rectangle like) with the given raduises
            var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };

            if (radius.all != undefined) {
                for (let key in cornerRadius) {
                    cornerRadius[key] = radius.all;
                }
            }
            else if (radius.upperLeft == undefined && radius.upperRight == undefined &&
                radius.lowerLeft == undefined && radius.lowerRight == undefined) {
                throw new Error("There was an error in the borderRadius option in the Sattee.rect(); function");
            }
            else {
                for (var side in radius) {
                    cornerRadius[side] = radius[side];
                }
            }
            let m = Math.min(w,h);
            for (var side in radius) {
                if(cornerRadius[side] > m)
                cornerRadius[side] = m;
            }

            ctx.beginPath();
            ctx.moveTo(x + cornerRadius.upperLeft, y);
            ctx.lineTo(x + w - cornerRadius.upperRight, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + cornerRadius.upperRight);
            ctx.lineTo(x + w, y + h - cornerRadius.lowerRight);
            ctx.quadraticCurveTo(x + w, y + h, x + w - cornerRadius.lowerRight, y + h);
            ctx.lineTo(x + cornerRadius.lowerLeft, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - cornerRadius.lowerLeft);
            ctx.lineTo(x, y + cornerRadius.upperLeft);
            ctx.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
            ctx.closePath();
        }, () => {
            //draw the rectagle without radius
            ctx.beginPath();
            ctx.rect(x, y, w, h);
        }]
    });

    //add the styles to the drawing
    _colorize(ctx, options && options.strokeSize != undefined);

    //remove all of the settings when done
    ctx.restore();
}
Sattee.ellipse = function (x, y, w, h, options) {
    //validate all of the arguments
    _validateDrawingFunction("ellipse", [x, y, w, h]);

    //get the 2DContext of the current canvas layer
    let [ctx] = this.getCanvas();

    //save the current canvas drawing settings
    ctx.save();

    //manage the default options
    _manageDefaultDrawingOptions("ellipse", options, ctx);

    // Draw the ellipse
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 90, 90); // w / 2 and h / 2 are cuz ctx.ellipse expects radius

    //add the styles to the drawing
    _colorize(ctx, options && options.strokeSize != undefined);

    //remove all of the settings when done
    ctx.restore();
}
Sattee.triangle = function (x1, y1, x2, y2, x3, y3, options) {
    //validate all of the arguments
    _validateDrawingFunction("triangle", [x1, y1, x2, y2, x3, y3]);

    //get the 2DContext of the current canvas layer
    let [ctx] = Sattee.getCanvas();

    //save the current canvas drawing settings
    ctx.save();

    //manage the default options
    _manageDefaultDrawingOptions("triangle", options, ctx);

    //manage additional options that change in other drawing function
    let fx = x1, fy = y1;   // final x , final y (where the drawing will be rotated)
    _manageOptions("rect", options, {
        "rotateX": ["number", (rx) => { fx = rx }],
        "rotateY": ["number", (ry) => { fy = ry }],
        "rotate": ["number", (deg) => {
            Sattee.translate(Sattee.currentLayer, fx, fy, function () {
                ctx.rotate(deg * Math.PI / 180)
            });
        }],
    });

    //draw the triangle
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);

    //add the styles to the drawing
    _colorize(ctx, options && options.strokeSize != undefined);

    //remove all of the settings when done
    ctx.restore();
}
Sattee.line = function (x1, y1, x2, y2, options) {
    //validate all of the arguments
    _validateDrawingFunction("line", [x1, y1, x2, y2]);

    //get the 2DContext of the current canvas layer
    let [ctx] = this.getCanvas();

    //save the current canvas drawing settings
    ctx.save();

    //manage the default options
    _manageDefaultDrawingOptions("line", options, ctx);

    //manage additional options that change in other drawing function
    let fx = x1, fy = y1;   // final x , final y (where the drawing will be rotated)
    _manageOptions("rect", options, {
        "rotateX": ["number", (rx) => { fx = rx }],
        "rotateY": ["number", (ry) => { fy = ry }],
        "rotate": ["number", (deg) => {
            Sattee.translate(Sattee.currentLayer, fx, fy, function () {
                ctx.rotate(deg * Math.PI / 180)
            });
        }],
    });

    //draw the line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    //add the styles to the drawing
    _colorize(ctx, options && options.strokeSize != undefined);

    //remove all of the settings when done
    ctx.restore();
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