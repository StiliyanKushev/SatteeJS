//##########################################################//
//######### HERE IS ALL OF THE RENDERING STUFF #############//
//##########################################################//

//The draw function must be called each time you try to draw on the canvas (any of the canvases)
// the arguments it takes are the canvas layer you want to draw on
// and the function that holds all of the drawing instructions
Sattee.draw = function (layer, func) {
    if (!func || typeof layer != "number" || layer < 0 || layer > this.layers - 1)
        throw new Error("Invalid number of layers when drawing in Sattee.draw();\n" + "Expected number between 0 and " + Sattee.layers + " but instead got " + layer);
    //set the layer
    this.currentLayer = layer;
    //call the function with all of the drawing stuff in it
    func.apply(this.scenes[this.currentScene]);
    //and then remove the layer to prevent someone from trying to draw outside of the .draw function
    this.currentLayer = undefined;
}
Sattee.background = function (r, g, b, a) {
    if (b === undefined)
        throw new Error("The Sattee.background() function needs at least 3 arguments (r,g,b); (r,g,b,a) 'a' is optional. But instead got " + `${r} ${g} ${b} ${a}`);
    if (this.currentLayer == undefined)
        throw new Error("You are not allowed to draw on the canvas outside the Sattee.draw function");

    let canvas = document.getElementById(`${Sattee.name}${Sattee.currentLayer}`);
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = `rgba(${r},${g},${b},${a || 255})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
Sattee.clear = function (layer, options) {
    if (layer == undefined || typeof layer != "number" || layer < 0 || layer > this.layers - 1)
        throw new Error("Cannot Sattee.clear() the canvas because the given layer is invalid or not given. Expected Sattee.clear(*layer*) but got " + `Sattee.clear(${layer})`);

    let canvas = document.getElementById(`${Sattee.name}${layer}`);
    let ctx = canvas.getContext('2d');

    if (options) {
        if (options.x != undefined && options.y != undefined && options.width != undefined && options.height != undefined) {
            if (!options.offset)
                ctx.clearRect(options.x, options.y, options.width, options.height);
            else
                ctx.clearRect(options.x - options.offset, options.y - options.offset, options.width + options.offset * 2, options.height + options.offset * 2);
        }
        else {
            throw new Error("Invalid options set in Sattee.clear() function.");
        }
    }
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
Sattee.rect = function (x, y, w, h, options) {
    if (h == undefined)
        throw new Error("The Sattee.rect() function needs at least 4 arguments (x,y,w,h); (x,y,w,h,options) 'options' is optional. But instead got " + `${x} ${y} ${w} ${h} ${options}`);
    if (this.currentLayer == undefined)
        throw new Error("You are not allowed to draw on the canvas outside the Sattee.draw function");

    let canvas = document.getElementById(`${Sattee.name}${Sattee.currentLayer}`);
    let ctx = canvas.getContext("2d");

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
    if (h == undefined)
        throw new Error("The Sattee.ellipse() function needs at least 4 arguments (x,y,w,h); (x,y,w,h,options) 'options' is optional. But instead got " + `${x} ${y} ${w} ${h} ${options}`);
    if (this.currentLayer == undefined)
        throw new Error("You are not allowed to draw on the canvas outside the Sattee.draw function");

    let canvas = document.getElementById(`${Sattee.name}${Sattee.currentLayer}`);
    let ctx = canvas.getContext('2d');

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
    ctx.ellipse(x, y, w / 2, h / 2, 0, 90, 90); // w / 2 and h / 2 are cuz ctx.ellipse expects radius

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
    if (y3 == undefined)
        throw new Error("The Sattee.triangle() function needs at least 6 arguments (x1,y1,x2,y2,x3,y3); (x1,y1,x2,y2,x3,y3,options) 'options' is optional. But instead got " + `${x1} ${y1} ${x2} ${y2} ${x3} ${y3} ${options}`);
    if (this.currentLayer == undefined)
        throw new Error("You are not allowed to draw on the canvas outside the Sattee.draw function");

    let canvas = document.getElementById(`${Sattee.name}${Sattee.currentLayer}`);
    let ctx = canvas.getContext("2d");

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
    if (y2 == undefined)
        throw new Error("The Sattee.line() function needs at least 4 arguments (x1,y1,x2,y2); (x1,y1,x2,y2,options) 'options' is optional. But instead got " + `${x1} ${y1} ${x2} ${y2} ${x3} ${y3} ${options}`);
    if (this.currentLayer == undefined)
        throw new Error("You are not allowed to draw on the canvas outside the Sattee.draw function");

    let canvas = document.getElementById(`${Sattee.name}${Sattee.currentLayer}`);
    let ctx = canvas.getContext("2d");
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
    ctx.closePath();

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
    // ctx.lineWidth = 1;
}

//TODO FIX THIS SHIT
Sattee.translate = function (layer, x, y, func) {
    if (typeof layer != "number" || layer < 0 || layer > this.layers - 1)
        throw new Error("Invalid number of layers when drawing in Sattee.transform();\n" + "Expected number between 0 and " + Sattee.layers + " but instead got " + layer);
    if (!func)
        throw new Error("Not enough arguments passed in the Sattee.transform() function.");
    let canvas = document.getElementById(`${Sattee.name}${layer}`);
    let ctx = canvas.getContext("2d");
    //translate by x and y
    ctx.translate(x, y);
    //call the function with all of the drawing stuff in it
    func.apply(this.scenes[this.currentScene]);
    //return the x and y back to it's normall state
    ctx.translate(0, 0);
}