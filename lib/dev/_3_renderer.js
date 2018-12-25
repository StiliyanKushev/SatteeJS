//##########################################################//
//######### HERE IS ALL OF THE RENDERING STUFF #############//
//##########################################################//

Sattee.getCanvas = function (layer) {
    let canvas = document.getElementById(`${Sattee.name}${layer || Sattee.currentLayer}`);
    let ctx = canvas.getContext("2d");

    return [ctx, canvas];
}

//The draw function must be called each time you try to draw on the canvas (any of the canvases)
// the arguments it takes are the canvas layer you want to draw on
// and the function that holds all of the drawing instructions

Sattee.draw = function (layer, func) {
    Sattee.validate("draw")
        .arguments([layer, func], 2)
        .type(layer, "number", func, "function")
        .range(layer, 0, this.layers);

    //set the layer
    this.currentLayer = layer;
    //call the function with all of the drawing stuff in it
    func.apply(this.scenes[this.currentScene]);
    //and then remove the layer to prevent someone from trying to draw outside of the .draw function
    this.currentLayer = undefined;
}
Sattee.background = function (r, g, b, a) {
    Sattee.validate("background")
        .arguments([r, g, b], 3)
        .type(r, "number", g, "number", b, "number");
    Sattee.validate();
    let [canvas, ctx] = this.getCanvas();

    ctx.fillStyle = `rgba(${r},${g},${b},${a && typeof a == "number" ? a : 255})`;
    let layer = Sattee.currentLayer;
    ctx.fillRect(-(this.canvasArray[layer].x), -(this.canvasArray[layer].y), canvas.width, canvas.height);
}
Sattee.clear = function (layer, options) {
    Sattee.validate("clear")
        .arguments([layer], 1)
        .type(layer, "number")
        .range(layer, 0, this.layers);

    let [ctx, canvas] = this.getCanvas(layer);

    let x = 0;
    let y = 0;
    if (options) {
        Sattee.validate("clear",`There was an error with the options in the Sattee.clear() function`)
            .arguments([options.x, options.y, options.width, options.height], 4)
            .type(options.x, "number", options.y, "number", options.width, "number", options.height, "number");
        x = options.x;
        y = options.y;
        if (!options.offset)
            ctx.clearRect(x, y, options.width, options.height);
        else
            ctx.clearRect(x - options.offset, y - options.offset, options.width + options.offset * 2, options.height + options.offset * 2);
    }
    else {
        ctx.clearRect(x, y, canvas.width, canvas.height);
    }
}
Sattee.rect = function (x, y, w, h, options) {
    Sattee.validate("rect")
        .arguments([x, y, w, h], 4)
        .type(x, "number", y, "number", w, "number", h, "number");

    Sattee.validate();

    let [ctx] = this.getCanvas();

    if (options && options.color && typeof options.color != "string")
        throw new Error("The given color in the options of the rect function is invalid.");
    else if (options && options.color) {
        ctx.fillStyle = options.color;
    }
    else {
        ctx.fillStyle = "rgba(255,255,255,255)";
    }

    //draw the rectagle
    ctx.beginPath();
    ctx.rect(x, y, w, h);

    //manage the stroke color and size
    if (options && options.strokeSize && typeof options.strokeSize != "number")
        throw new Error("The given strokeSize in the options of the triangle function is invalid.");
    else if (options && options.strokeSize) {
        ctx.lineWidth = options.strokeSize;
        if (options && options.strokeColor && typeof options.strokeColor != "string")
            throw new Error("The given strokeColor in the options of the rect function is invalid.");
        else if (options && options.strokeColor) {
            ctx.strokeStyle = options.strokeColor;
        }
        ctx.stroke();
    }
    ctx.fill();

    //remove all of the settings when done
    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.lineWidth = 1;
}
Sattee.ellipse = function (x, y, w, h, options) {
    Sattee.validate("ellipse")
        .arguments([x, y, w, h], 4)
        .type(x, "number", y, "number", w, "number", h, "number");

    Sattee.validate();

    let [ctx] = this.getCanvas();

    if (options && options.color && typeof options.color != "string")
        throw new Error("The given color in the options of the ellipse function is invalid.");
    else if (options && options.color) {
        ctx.fillStyle = options.color;
    }
    else {
        ctx.fillStyle = "rgba(255,255,255,255)";
    }

    // Draw the ellipse
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 90, 90); // w / 2 and h / 2 are cuz ctx.ellipse expects radius

    //manage the stroke color and size
    if (options && options.strokeSize && typeof options.strokeSize != "number")
        throw new Error("The given strokeSize in the options of the triangle function is invalid.");
    else if (options && options.strokeSize) {
        ctx.lineWidth = options.strokeSize;
        if (options && options.strokeColor && typeof options.strokeColor != "string")
            throw new Error("The given strokeColor in the options of the ellipse function is invalid.");
        else if (options && options.strokeColor) {
            ctx.strokeStyle = options.strokeColor;
        }
        ctx.stroke();
    }
    ctx.fill();

    //remove all of the settings when done
    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.lineWidth = 1;
}
Sattee.triangle = function (x1, y1, x2, y2, x3, y3, options) {
    Sattee.validate("triangle")
        .arguments([x1, y1, x2, y2, x3, y3], 6)
        .type(x1, "number", y1, "number", x2, "number", y2, "number", x3, "number", y3, "number");

    Sattee.validate();

    let [ctx] = Sattee.getCanvas();

    if (options && options.color && typeof options.color != "string")
        throw new Error("The given color in the options of the triangle function is invalid.");
    else if (options && options.color) {
        ctx.fillStyle = options.color;
    }
    else {
        ctx.fillStyle = "rgba(255,255,255,255)";
    }

    //draw the triangle
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    //manage the stroke color and size
    if (options && options.strokeSize && typeof options.strokeSize != "number")
        throw new Error("The given strokeSize in the options of the triangle function is invalid.");
    else if (options && options.strokeSize) {
        ctx.lineWidth = options.strokeSize;
        if (options && options.strokeColor && typeof options.strokeColor != "string")
            throw new Error("The given strokeColor in the options of the triangle function is invalid.");
        else if (options && options.strokeColor) {
            ctx.strokeStyle = options.strokeColor;
        }
        ctx.stroke();
    }
    ctx.fill();

    //remove all of the settings when done
    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.lineWidth = 1;
}
Sattee.line = function (x1, y1, x2, y2, options) {
    Sattee.validate("line")
        .arguments([x1, y1, x2, y2],4)
        .type(x1,"number",y1,"number",x2,"number",y2,"number",x3,"number",y3,"number");

    Sattee.validate();

    let [ctx] = this.getCanvas();

    ctx.fillStyle = "rgba(255,255,255,255)";
    ctx.strokeStyle = "rgba(255,255,255,255)";

    if (options && options.color && typeof options.color != "string")
        throw new Error("The given color in the options of the line function is invalid.");
    else if (options && options.color) {
        ctx.fillStyle = options.color;
    }
    else {
        ctx.fillStyle = "rgba(255,255,255,255)";
    }

    //draw the line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    //manage the stroke color and size
    if (options && options.strokeSize && typeof options.strokeSize != "number")
        throw new Error("The given strokeSize in the options of the line function is invalid.");
    else if (options && options.strokeSize) {
        ctx.lineWidth = options.strokeSize;
    }
    if (options && options.strokeColor && typeof options.strokeColor != "string")
        throw new Error("The given strokeColor in the options of the line function is invalid.");
    else if (options && options.strokeColor) {
        ctx.strokeStyle = options.strokeColor;
    }
    //makes the line a little rounder
    ctx.lineCap = "round";

    ctx.stroke();
    ctx.fill();
    // //remove all of the settings when done
    ctx.strokeStyle = "rgba(255,255,255,0)";
    ctx.lineWidth = 1;
}
//temporary sets the canvas (0,0) origin to whatever the x and y is given as an argument
Sattee.translate = function (layer, x, y, func) {
    Sattee.validate("translate")
        .arguments([layer,x,y,func],4)
        .type(layer,"number",x,"number",y,"number",func,"function")
        .range(layer,0,this.layers);
        
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