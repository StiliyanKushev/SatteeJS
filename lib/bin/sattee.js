//#############################################################//
//####### THE SATTEE OBJECT HOLDS SOME KEY FEATURES ##########//
//#############################################################//

/**
 * @namespace SATTEE_OBJECT
 */

/**
 * this is the sattee object that holds some key features
 * @property {String} name The id of the game div and the begining of the id of each canvas layer followed by the the layer index
 * @property {String} container The id or class of a div that you want the game div to be in
 * @property {Number} layers The number of canvases layer on top of each other in the game div
 * @property {Number} width The width of the game container and all canvases in it
 * @property {Number} height The height of the game container and all canvases in it
 * @property {String} main The name of the first game scene that will be played on game start
 * @property {String} loopFunction The type of function that will be used for controlling the frame aniamtion -> options: timeout,interval,animation (animation is the best) 
 * @property {Boolean} mouseIsDragged True, if the mouse is dragged on one of the canvases
 * @property {Number} frameRate The frame rate of the animation of the game (can be set using Sattee.frameRate = anyNumber)
 * @property {Number} delta Time that passed from the last frame to the current one 
 */

let Sattee = {
    name: undefined,
    layers: null,
    main: null,
    currentScene: null,
    currentLayer: undefined,
    loadedScene: false,
    canvasArray: [],
    mouseX:0,
    mouseY:0,
    // in the event listener it changes the value and set the mouseDragged event int the init function
    mouseIsDragged: false,
    //the default frame rate
    frameRate: 60,
    //these are used for calculating the delta (calculated in the scene manager)
    lastFrameDate: undefined,
    currentFrameDate: undefined,
    delta: undefined,
    // if true it will not loop any scene any more
    exited: false,
    scenes: {},
    assets: {},
    /**
     * This function loads given assets as key-value pair of an object (ex: myImage:path/to/image.png)
     * @name Sattee.load
     * @param {Object} assets 
     */
    load: function (assets) {
        this.assets = assets;
        this.preload();
    },
    /**
     * @name Sattee.configure
     * @param {Object} settings All of the settings that you can give to Sattee when configuring a game
     * @param {String} settings.name The id of the game div and the begining of the id of each canvas layer followed by the the layer index
     * @param {String} [settings.container=body] The id or class of a div that you want the game div to be in
     * @param {Number} settings.layers The number of canvases layer on top of each other in the game div
     * @param {Number} settings.width The width of the game container and all canvases in it
     * @param {Number} settings.height The height of the game container and all canvases in it
     * @param {String} settings.main The name of the first game scene that will be played on game start
     * @param {String} settings.loopFunction The type of function that will be used for controlling the frame aniamtion -> options: timeout,interval,animation (animation is the best) 
     */
    configure: function ({ width, height, layers, name, container, main, loopFunction }) {
        //set all of the global variables
        this.width = width;
        this.height = height;
        this.layers = layers;
        this.main = main;
        this.currentScene = main;
        this.name = name;
        this.loopFunction = loopFunction;
        //and generate the divs and canvases
        let div = document.createElement("div");
        this.container = div;
        div.setAttribute("id", name);
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        //make the canvas layers
        for (let i = 0; i < layers; i++) {
            let canvas = document.createElement("canvas");
            canvas.width = `${width}`;
            canvas.height = `${height}`;
            canvas.style.position = `absolute`;
            canvas.style.left = `0px`;
            canvas.style.top = `0px`;
            canvas.setAttribute("id", name + i);
            //append it to the container
            div.appendChild(canvas);

            //add the canvas data to the canvas array
            this.canvasArray.push({
                x: 0,
                y: 0,
                layer: i,
            });
            //set the default styles to the canvases
            this._setCtxToLayer(canvas);
        }

        //if you have specified a container ex: (#myDiv or .mySection)
        if (container && typeof container == "string") {
            if (container[0] == "#") {
                document.getElementById(container.replace("#", "")).appendChild(div);
            }
            else if (container[0] == ".") {
                document.getElementsByClassName(container.replace(".", "")).appendChild(div);
            }
        }
        else {
            //append it to the body
            document.body.appendChild(div);
        }
    }
}
//##########################################################//
//########## HERE IS ALL OF THE ENTITY STUFF ###############//
//##########################################################//

//Holds all of the entities
//When filled with some it will look like this
// {
//     //this is the gruop
//     players: [{entityObject},{entityObject}]
// }
let entityArray = {}

//The config object contains thinks like the controllers, the group
//A config example:
// let config = {
//     controller: ARCADE_CONTROLLER,
//     group: "player",
//     collideGroups: ["obstacles","love","goodmarksinschool"]
//     id: "80330425"
// }
// You can even add other things for example an ID that you will use with sockets.io

function newEntity(config){
    let result_object = {
        position:createVector(0,0),
        velocity:createVector(0,0),
        _index:0,
    };
    //set all of the keys-value pairs to the new object
    for(let key in config){
        let value = config[key];
        result_object[key] = value;
    }
    //add the object to the array of entities on the coresponding group or the default one
    if('group' in config){
        if(entityArray[config.group]){
            //The index is going to be used for faster accsess in the entityArray
            let index = entityArray[config.group].length + 1;
            result_object._index = index;
            entityArray[config.group].push(result_object);
        }
        else{
            entityArray[config.group] = [];
        }
    }
}
/**
 * @namespace LOADING
 */

// in the beggining of the file you would want to set the assets that you wanna use
//for ex: Sattee.load({myImg:"./images/myImage.png",mySong:"./audio/music.mp3"});

/**
 * holds the percentage of the loaded canvas game.
 * @name Sattee.loaded
 */
Sattee.loaded = 0;

/**
 * This function loads an image file and save it in the Sattee.assets array
 * @name Sattee.loadImage
 * @param {String} path the path to the image file
 * @param {Function} callback a callback when the image is loaded 
 */
Sattee.loadImage = function (path, callback) {
    //create the image object
    let newImg = new Image;
    //execute the callback when the data loaded
    newImg.onload = function () {
        callback();
    }
    //set the src to the path
    newImg.src = path;
    //return the image object
    return newImg;
}

/**
 * This function loads a sound file and save it in the Sattee.assets array
 * @name Sattee.loadSound
 * @param {String} path the path to the sound file
 * @param {Function} callback a callback when the sound is loaded 
 */
Sattee.loadSound = function (path, callback) {
    //create the audio with the path
    let audio = new Audio(path);
    //execute the callback when the data loaded
    audio.onload = function () {
        callback();
    }
    //return the audio object
    return audio;
}

//this handles the preaload function
Sattee.preload = function () {
    let need_to_load = Object.keys(Sattee.assets).length;
    let loaded_count = 0;

    function endsWith(path, endings) {
        for (let end of endings) {
            if (path.endsWith(end)) return end;
        }
        return false;
    }

    function done_loading() {
        loaded_count++;
        Sattee.loaded = need_to_load / loaded_count;
    }
    for (let key in Sattee.assets) {
        let path = Sattee.assets[key];
        let value = false;
        //determine what kind of file is that
        if (endsWith(path, [".png", ".jpg", ".jpeg"])) {
            value = Sattee.loadImage(path, done_loading);
        }
        else if (endsWith(path, [".mp3", ".wav"])) {
            value = Sattee.loadSound(path, done_loading);
        }
        else if (endsWith(path, [".mp4"])) {

        }
        else {
            throw new Error(`Unsupported file format in the path: (${path}) of the asset: (${key})`);
        }
        //if something in that path have loaded then save it to its place in the assets
        if (value) {
            Sattee.assets[key] = value;
        }
        else {
            throw new Error(`No such asset file (${path})`);
        }
    }
};
/**
 * @namespace RENDERING
 */

(function () {
    Sattee.getCanvas = function (layer) {
        let canvas = document.getElementById(`${this.name}${layer || this.currentLayer}`);
        let ctx = canvas.getContext("2d");
        return [ctx, canvas];
    }
    function _roundedPoly(ctx, points, radiusAll) {
        var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut, radius;
        // convert 2 points into vector form, polar form, and normalised 
        var asVec = function (p, pp, v) {
            v.x = pp.x - p.x;
            v.y = pp.y - p.y;
            v.len = Math.sqrt(v.x * v.x + v.y * v.y);
            v.nx = v.x / v.len;
            v.ny = v.y / v.len;
            v.ang = Math.atan2(v.ny, v.nx);
        }
        radius = radiusAll;
        v1 = {};
        v2 = {};
        len = points.length;
        p1 = points[len - 1];
        // for each point
        for (i = 0; i < len; i++) {
            p2 = points[(i) % len];
            p3 = points[(i + 1) % len];
            //-----------------------------------------
            // Part 1
            asVec(p2, p1, v1);
            asVec(p2, p3, v2);
            sinA = v1.nx * v2.ny - v1.ny * v2.nx;
            sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;
            angle = Math.asin(sinA);
            //-----------------------------------------
            radDirection = 1;
            drawDirection = false;
            if (sinA90 < 0) {
                if (angle < 0) {
                    angle = Math.PI + angle;
                } else {
                    angle = Math.PI - angle;
                    radDirection = -1;
                    drawDirection = true;
                }
            } else {
                if (angle > 0) {
                    radDirection = -1;
                    drawDirection = true;
                }
            }
            if (p2.radius !== undefined) {
                radius = p2.radius;
            } else {
                radius = radiusAll;
            }
            //-----------------------------------------
            // Part 2
            halfAngle = angle / 2;
            //-----------------------------------------

            //-----------------------------------------
            // Part 3
            lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
            //-----------------------------------------

            //-----------------------------------------
            // Special part A
            if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
                lenOut = Math.min(v1.len / 2, v2.len / 2);
                cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
            } else {
                cRadius = radius;
            }
            //-----------------------------------------
            // Part 4
            x = p2.x + v2.nx * lenOut;
            y = p2.y + v2.ny * lenOut;
            //-----------------------------------------
            // Part 5
            x += -v2.ny * cRadius * radDirection;
            y += v2.nx * cRadius * radDirection;
            //-----------------------------------------
            // Part 6
            ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection);
            //-----------------------------------------
            p1 = p2;
            p2 = p3;
        }
        ctx.closePath();
    }
    function _manageOptions(caller, options, obj) {
        if (options == undefined) options = {};
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
    Sattee._setCtxToLayer = function (canvas) {
        let ctx = canvas.getContext("2d");
        //here are all of the default styles
        ctx.fillStyle = "rgb(51,51,51)";
        ctx.font = `30px Sans-serif`;
        // ctx.lineCap = "round";
    }

    /**
     * The draw function must be called each time you try to draw on the canvas (any of the canvases)
     * @name Sattee.draw
     * @param {Number} layer the layer you will be drawing
     * @param {Function} func a function that contains all of the drawing functions
     * @example
     * Sattee.draw(0,function(){
     *      //here you can use all of the drawing functions
     * });
     */
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

    /**
     * This function draws the background of the canvas using rgba values
     * @name Sattee.bacground
     * @param {Number} r the red color 0 - 255
     * @param {Number} g the green color 0 - 255
     * @param {Number} b the blue color 0 - 255
     * @param {Number} [a=1] the alpha (opacity) color 0 - 1 
     * @example
     * //draws the background on the first layer
     * Sattee.draw(0,function(){
     *      Sattee.background(220,40,40,0.8);
     * });
     */
    Sattee.background = function (r, g, b, a) {
        //validate all of the arguments
        _validateDrawingFunction("background", [r, g, b]);

        //check if you are inside the Sattee.draw() function
        Sattee.validate();

        //get the 2DContext of the current canvas layer
        let [ctx, canvas] = this.getCanvas();

        ctx.save();

        //draw the bacground as a big rectangle on the current cordinates
        ctx.fillStyle = `rgba(${r},${g},${b},${a && typeof a == "number" ? a : 1})`;

        ctx.fillRect(-(this.canvasArray[this.currentLayer].x), -(this.canvasArray[this.currentLayer].y), canvas.width, canvas.height);

        ctx.restore();
    }
    /**
     * This function clears all pixels on the canvas
     * @name Sattee.clear
     * @param {Number} layer the layer you want to clear
     * @param {Object} [options={}] you can give as options an x,y,w,h of where you want to clear the canvas. This may increse the FPS 
     * @example
     * //this will clear the whole canvas
     * Sattee.clear(0);
     * Sattee.clear(0,{x:20,y:20,width:40,height:60});
     */
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
    }

    /**
     * Here are all possible styling options
     * @name options
     * @param {String} color [ "rgb(41,41,41)", "rgba(21,21,21,0.4)", "#fff", "red" ]
     * @param {String} strokeColor [ "rgb(41,41,41)", "rgba(21,21,21,0.4)", "#fff", "red" ]
     * @param {Number} strokeSize size of the stroke
     * @param {Object} borderRadius an object that holds the borderRadius settings
     * Examples for the border Radius
     * @example
     * //there are different settings for the different drawings
     * //for the rectangle
     * Sattee.draw(0,function(){
     *      Sattee.rect(10,10,40,40,{
     *          color: "rgba(20,20,20,0.4)",
     *          borderRadius:{topLeft:20,topRight:10,lowerLeft:20,lowerRight:10}
     *      });
     * });
     * @example
     * //for the triangle
     * //because the triangle has only 3 side, they are called A,B,C 
     * Sattee.draw(0,function(){
     *      Sattee.triangle(10,10,40,40,90,90,{
     *          strokeSize:2,
     *          strokeColor: "red",
     *          borderRadius:{A:20,B:10,C:20}
     *      });
     * });
     * @example
     * The border radius also has a propery "all" that sets borderRadius to all corners
     * Sattee.draw(0,function(){
     *      Sattee.rect(10,10,20,20,{
     *          borerRadius:{all:30,topleft:10}
     *      }); 
     * });
     * @param {Number} rotate Degrees of rotation of the drawing
     * By default the drawing is rotated by its 0,0 origin, but you can change that with rotateX,rotateY
     * @param {Number} rotateX custom X that the drawing will be rotated by
     * @param {Number} rotateY custom Y that the drawing will be rotated by
     * Here is an example for how to use the rotate, rotateX, rotateY
     * @example
     * Sattee.draw(0,function(){
     *      Sattee.rect(10,10,50,50,{
     *          rotate: 20, //rotate by 20 degrees
     *          rotateX:35,
     *          rotateY:35  //rotate by the center of the drawing 
     *      });
     * });
     */

    /**
     * draws a rectangle on the canvas
     * @name Sattee.rect
     * @param {Number} x the x cordinate of the drawing
     * @param {Number} x the y cordinate of the drawing
     * @param {Number} w the width of the drawing
     * @param {Number} h the height of the drawing
     * @param {Object} [options={}] You can specify the styling of the drawing 
     * @example
     * Sattee.draw(0,function(){
     *      //draws it with the default styles
     *      Sattee.rect(10,10,20,20);
     *      //add custom styles in the form of an object
     *      Sattee.rect(10,10,20,20,stylingObject);
     * });
     */
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
                let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };

                if (radius.all != undefined) {
                    for (let key in cornerRadius) {
                        cornerRadius[key] = radius.all;
                    }
                }
                else if (radius.upperLeft == undefined && radius.upperRight == undefined &&
                    radius.lowerLeft == undefined && radius.lowerRight == undefined) {
                    throw new Error("There was an error in the borderRadius option in the Sattee.rect(); function");
                }

                for (let side in radius) {
                    cornerRadius[side] = radius[side];
                }

                let m = Math.min(w, h);
                for (let side in cornerRadius) {
                    if (cornerRadius[side] > m) {
                        cornerRadius[side] = m / 2;
                    }
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

    /**
     * draws an ellipse on the canvas
     * @name Sattee.ellipse
     * @param {Number} x the x cordinate of the drawing
     * @param {Number} y the y cordinate of the drawing
     * @param {Number} w the width of the drawing
     * @param {Number} h the height of the drawing
     * @param {Object} [options={}] You can specify the styling of the drawing 
     * @example
     * Sattee.draw(0,function(){
     *      //draws it with the default styles
     *      Sattee.ellipse(10,10,20,20);
     *      //add custom styles in the form of an object
     *      Sattee.ellipse(10,10,20,20,stylingObject);
     * });
     */
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

    /**
     * draws a rectangle on the canvas
     * @name Sattee.rect
     * @param {Number} x1 the x cordinate of the first point of the drawing
     * @param {Number} y1 the y cordinate of the first point of the drawing
     * @param {Number} x2 the x cordinate of the seccond point of the drawing
     * @param {Number} y2 the y cordinate of the seccond point of the drawing
     * @param {Number} x3 the x cordinate of the third point of the drawing
     * @param {Number} y3 the y cordinate of the third point of the drawing
     * @param {Object} [options={}] You can specify the styling of the drawing
     * @example
     * Sattee.draw(0,function(){
     *      //draws it with the default styles
     *      Sattee.triangle(10,10,20,20,30,30);
     *      //add custom styles in the form of an object
     *      Sattee.triangle(10,10,20,20,30,30,stylingObject);
     * });
     */
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
        _manageOptions("triangle", options, {
            "rotateX": ["number", (rx) => { fx = rx }],
            "rotateY": ["number", (ry) => { fy = ry }],
            "rotate": ["number", (deg) => {
                Sattee.translate(Sattee.currentLayer, fx, fy, function () {
                    ctx.rotate(deg * Math.PI / 180)
                });
            }],
            "borderRadius": ["object", (radius) => {
                //draw a path (triangle like) with the given radiuses
                let cornerRadius = { A: 0, B: 0, C: 0, all: 0 };

                if (radius.all != undefined) {
                    for (let key in cornerRadius) {
                        cornerRadius[key] = radius.all;
                    }
                }
                else if (radius.A == undefined && radius.B == undefined && radius.C == undefined) {
                    throw new Error("There was an error in the borderRadius option in the Sattee.translate(); function");
                }

                for (var side in radius) {
                    cornerRadius[side] = radius[side];
                }

                _roundedPoly(ctx, [
                    {
                        x: x1,
                        y: y1,
                        radius: cornerRadius.A
                    },
                    {
                        x: x2,
                        y: y2,
                        radius: cornerRadius.B
                    },
                    {
                        x: x3,
                        y: y3,
                        radius: cornerRadius.C
                    }], cornerRadius.all);
            }, () => {
                //draw the triangle without border radius
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.lineTo(x1, y1);
            }]
        });

        //add the styles to the drawing
        _colorize(ctx, options && options.strokeSize != undefined);

        //remove all of the settings when done
        ctx.restore();
    }

    /**
     * draws a line on the canvas
     * @name Sattee.line
     * @param {Number} x1 the x cordinate of the first point of the drawing
     * @param {Number} y1 the y cordinate of the first point of the drawing
     * @param {Number} x2 the x cordinate of the seccond point of the drawing
     * @param {Number} y2 the y cordinate of the seccond point of the drawing
     * @param {Object} [options={}] You can specify the styling of the drawing
     * @example
     * Sattee.draw(0,function(){
     *      //draws it with the default styles
     *      Sattee.line(10,10,20,20);
     *      //add custom styles in the form of an object
     *      Sattee.line(10,10,20,20,stylingObject);
     * });
     */
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
        _manageOptions("line", options, {
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

    /**
     * The function draws a text on the current canvas
     * @name Sattee.text
     * @param {String} text the text you want to display
     * @param {Number} x the x cordinate
     * @param {Number} y the y cordinate
     * @param {Object} [options={}] the styling options
     * @param {Number} options.size This is a specific property for the text function that holds the fontSize
     * @example
     * Sattee.draw(1,function(){
     *      Sattee.text("Hello World",10,10,{
     *          size:20,
     *          strokeSize:5,
     *          strokeColor:"red",
     *          color:"gray",
     *          //etc.. 
     *      });
     * });
     */
    Sattee.text = function (text, x, y, options) {
        //validate all of the arguments
        Sattee.validate("text")
            .arguments([text, x, y], 3)
            .type([text, "string", x, "number", y, "number"]);

        //check if it is in the draw function
        Sattee.validate();

        //get the 2DContext of the current canvas layer
        let [ctx] = this.getCanvas();

        //manage text drawing options
        _manageOptions("text", options, {
            "size": ["number", () => { ctx.font = `${options.size}px Sans-serif` }],
            "strokeSize": ["number", () => { ctx.lineWidth = options.strokeSize }],
            "strokeColor": ["string", () => {
                if (options.strokeSize != undefined) {
                    ctx.strokeStyle = options.strokeColor;
                    ctx.lineJoin = "miter";
                    ctx.miterLimit = 2;
                    ctx.strokeText(text, x, y);
                }
            }],
            "color": ["string", () => { ctx.fillStyle = options.color }]
        });

        //manage additional options that change in other drawing function
        let fx = x, fy = y;   // final x , final y (where the drawing will be rotated)
        _manageOptions("text", options, {
            "rotateX": ["number", (rx) => { fx = rx }],
            "rotateY": ["number", (ry) => { fy = ry }],
            "rotate": ["number", (deg) => {
                Sattee.translate(Sattee.currentLayer, fx, fy, function () {
                    ctx.rotate(deg * Math.PI / 180)
                });
            }],
        });

        //draw the text
        ctx.fillText(text, x, y);

        //save the current canvas drawing settings
        ctx.save();

        //remove all of the settings when done
        ctx.restore();
    }

    /**
     * The function calculates the width of a text at a specific size
     * @name Sattee.textWidth
     * @param {String} text the text you wish to mesure
     * @param {Number} size the size of the text you wish to mesure
     * @returns {Number} the width of the given text at the given size
     */
    Sattee.textWidth = function (text, size) {
        //validate arguments
        Sattee.validate("textWidth")
            .arguments([text, size], 2)
            .type([text, "string", size, "number"]);

        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.font = `${size}px Sans-serif`;

        return ctx.measureText(text).width;
    }

    /**
     * temporary sets the canvas (0,0) origin to whatever the x and y is given as an argument
     * @name Sattee.triangle
     * @param {Number} layer the canvas layer you will temporary translate
     * @param {Number} x the x you will translate by
     * @param {Number} y the y you will translate by
     * @param {Function} func all drawings in this function will ve translated
     */
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
})();
/**
 * @namespace SCENE_MANAGER
 */

/**
 * This function creates a new scene in the Sattee object
 * @name Sattee.init
 * @param {String} name the name of the scene
 * @param {Object} sceneBody the scene body
 * @example
 * Sattee.init("mainScene",{
 *      setup: function(){
 *          //this function is called only once at the start
 *      },
 *      loop: function(){
 *          //this function is called each frame of animation
 *      }
 * });
 */

Sattee.init = function (name, sceneBody) {
    sceneBody["setuped"] = false;
    this.scenes[name] = sceneBody;
    if (this.loadedScene == false) {
        this.loadedScene = true;
        //start the main scene
        this.switchScene(this.main);
    }
    //push it to a event listener function (add all events to it)
    this._loadEvents(this.container);
}

/**
 * This function switches to a new scene in the Sattee object
 * @name Sattee.switchScene
 * @param {String} name the name of the scene
 * @param {Boolean} [reset=false] if true it will also run the setup function of the next scene
 */
Sattee.switchScene = function (name, reset) {
    if (!this.scenes[name])
        throw new Error(`The specified scene (${name}) is missing. Check your code!`);

    if (this.exited)
        throw new Error("Trying to play a scene after Sattee.exit(); is called!");

    if (reset) {
        this.scenes[name].setuped = false;
    }

    this.currentScene = name;
    let temp = this.currentScene;

    if (!this.scenes[name].setuped) {
        this.scenes[name].setuped = true;
        //run the setup function
        this.scenes[name].setup.apply(this.scenes[name]);
    }

    //continuesly run the loop
    let loop_func = this.scenes[name].loop.bind(this.scenes[name]);
    function runLoop() {
        function _frame() {
            //run the loop function
            if (temp == Sattee.currentScene && !Sattee.exited) {
                //get the values of the dates
                if (Sattee.lastFrameDate == undefined) {
                    Sattee.lastFrameDate = new Date();
                }
                Sattee.currentFrameDate = new Date();
                //calculate the delta
                Sattee.delta = (Sattee.currentFrameDate.getTime() - Sattee.lastFrameDate.getTime()) / 1000;

                //update the last frame date
                Sattee.lastFrameDate = Sattee.currentFrameDate;

                //run the loop
                loop_func();

                //call the key events here
                let keysDown = Sattee._getButtons();
                if (keysDown.length > 0) {
                    Sattee._runEvent("keyDown", [keysDown]);
                }
                let keysUp = Sattee._getButtons(true);
                if (keysUp.length > 0) {
                    Sattee._runEvent("keyUp", [...keysUp]);
                    //remove the released keys from the Sattee.keys object
                    for (let key in Sattee.keys) {
                        if (Sattee.keys[key] == false) {
                            delete Sattee.keys[key];
                        }
                    }
                }

                //call the mouse dragged event function
                if (Sattee.mouseIsDragged) {
                    Sattee._runEvent("mouseDragged");
                }
            }
            else return;
            // if not sure just use animation. It is better cuz it doesnt skips frames
            if (Sattee.loopFunction == "interval")
                setInterval(function () { _frame() }, 1000 / Sattee.frameRate);
            else if (Sattee.loopFunction == "timeout")
                setTimeout(function () { _frame() }, 1000 / Sattee.frameRate);
            else if (Sattee.loopFunction == "animation")
                window.requestAnimationFrame(_frame);
            else throw new Error(`You need to specify a loop function in the config. If you are not sure what to use, use timeout. (loopfunction:"timeout")`);
        }
        return _frame();
    }
    runLoop();
}

/**
 * This function exits the whole game
 * @name Sattee.exit
 */
Sattee.exit = function () {
    this.exited = true;
}
/**
 * @namespace EVENT_MANAGER
 */

// the keyevents happen in the scene manager (the actual calling of th functions in the scene)
(function () {
    Sattee._getButtons = function(bool) {
        let arr = [];
        for (let key in Sattee.keys) {
            if ((Sattee.keys[key] && !bool) || (!Sattee.keys[key] && bool)) {
                arr.push(String.fromCharCode(key));
            }
        }
        return arr;
    }

    Sattee._runEvent = function(name, args) {
        if (Sattee.scenes[Sattee.currentScene][name]) {
            if (args)
                Sattee.scenes[Sattee.currentScene][name](...args);
            else
                Sattee.scenes[Sattee.currentScene][name]();
        }
    }

    //this object all of the keys that the user has used
    // but when a key is released and logged as realeased it deleates itself
    Sattee.keys = {};

    onkeydown = onkeyup = function (event) {
        let bool = event.type == 'keydown';
        if (event.keyCode == 9) {
            event.preventDefault();
        }
        Sattee.keys[event.keyCode || event.which] = bool;
    };

    let getMPos = function (event) {
        let canvas = document.getElementById(`${Sattee.name}${0}`);
        let rect = canvas.getBoundingClientRect();
        Sattee.prevmouseX = Sattee.mouseX || event.clientX - rect.left;
        Sattee.prevmouseY = Sattee.mouseY || event.clientY - rect.top;
        Sattee.mouseX = event.clientX - rect.left;
        Sattee.mouseY = event.clientY - rect.top;
    };

    /**
     * Event function used in a scene for detecting a mouse click
     * @name mouseClicked
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      mouseClicked: function(){
     *          //codes runs when the event fires
     *      }
     * });
     */

    /**
     * Event function used in a scene for detecting a mouse release
     * @name mouseReleased
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      mouseReleased: function(){
     *          //codes runs when the event fires
     *      }
     * });
     */

    /**
     * Event function used in a scene for detecting if mouse is clicked but not released
     * @name mouseDown
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      mouseDown: function(){
     *          //codes runs when the event fires
     *      }
     * });
     */

    /**
     * Event function used in a scene for detecting all keys that are currently down
     * @name keyDown
     * @param {Array} keys an array of keys that are fired on that event ex: ["A","S","D"]
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      keyDown: function(keys){
     *          //codes runs when the event fires
     *          if(keys.includes("A")){
     *              //checks if a specific key fires the event
     *          }
     *      }
     * });
     */

    /**
     * Event function used in a scene for detecting all keys that are currently up 
     * @name keyUp
     * @param {Array} keys an array of keys that are fired on that event ex: ["A","S","D"] 
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      keyUp: function(keys){
     *          //codes runs when the event fires
     *          if(keys.includes("A")){
     *              //checks if a specific key fires the event
     *          }
     *      }
     * });
     */

    //SOME of the evenets are controlled in the scene manager
    Sattee._loadEvents = function (div) {
        div.addEventListener("mousemove", function (event) { getMPos(event) });
        div.addEventListener("click", function () { Sattee._runEvent("mouseClicked") });
        div.addEventListener("mouseup", function () { Sattee.mouseIsDragged = false; Sattee._runEvent("mouseReleased") });
        div.addEventListener("mousedown", function () { Sattee.mouseIsDragged = true; Sattee._runEvent("mouseDown") });
        div.addEventListener("keydown", onkeydown);
        div.addEventListener("keyup", onkeyup);
    };
}());
/**
 * @namespace ERROR_HANDELING
 */

/**
 * This function can check and validate the arguments of another function
 * @name Sattee.validate
 * @param {String} [funcName="Checks if you are in a draw function"] The name of the function that you wish to validate
 * @returns {Object} An object that holds all of the validation functions (used for chaining)
 * @example
 * //this will return an object that you can use to validate the function
 * let checkMyFunction = Sattee.validate(myFunction);
 * //you can now chain functions from the returned object
 */
Sattee.validate = function (funcName) {
    let check = {};
    check.msg = `There was an error in the Sattee.${funcName}(); function.\n`;

    if (!funcName && this.currentLayer == undefined)
        throw new Error("You are not allowed to draw on the canvas outside the Sattee.draw function");

    /**
     * checks if all arguments are defined and are the correct count
     * @name Sattee.validate.arguments
     * @param {Array} args all of the arguments
     * @param {Number} count the count that the arguments should be
     * @param {String} [e="not enough or invald arguments"] the error that will be displayed if something goes wrong  
     * @example
     * function myFunction(arg1,arg2,arg3){
     *      Sattee.validate("myFunction").arguments([arg1,arg2,arg3],3);
     * }
     */
    check.arguments = function (args, count, e) {
        let err = e || "not enough or invald arguments";
        let inv = false;

        //check if all of the arguments are valid
        for (let i = 0; i < args.length; i++) {
            if (args[i] === undefined) {
                inv = true;
                break;
            }
        }

        if (args.length != count || inv)
            throw new Error(this.msg + err);

        return this;
    }

    /**
     * validates true if a given number is bettween the given minimum and maximum
     * @name Sattee.validate.range
     * @param {Number} num the number that you are checking
     * @param {Number} min the minimum
     * @param {Number} max the maximum
     * @param {String} [e="one or more of the arguments with type of number is with invalid range"] the error that will be displayed if something goes wrong  
     * @example
     * function myFunction(arg1,arg2,arg3){
     *      //this will also throw an error if arg1 is not a number
     *      //so before that you should check the type of the arg1
     *      Sattee.validate("myFunction").range(arg1,-10,30);
     * }
     */
    check.range = function (num, min, max, e) {
        let err = e || "one or more of the arguments with type of number is with invalid range";

        if (num < min || num > max)
            throw new Error(this.msg + err);

        return this;
    }
    /**
     * validates true if a all of the given arguments are the correct given type
     * @name Sattee.validate.type
     * @param {Array} arr An array that holds all all data and types ex: [2,"number","myName","string",false,"boolean"]
     * @param {String} [e="wrong type of argument on one or more of the give arguments"] the error that will be displayed if something goes wrong  
     * @example
     * function myFunction(arg1,arg2,arg3){
     *      //check the type of each argument and then check if arg1 is a number
     *      Sattee.validate("myFunction")
     *          .type([arg1,"number",arg2,"string",arg3,"string"])
     *          .range(arg1,-10,30);
     * }
     */
    check.type = function (arr, e) {
        let err = e || "wrong type of argument on one or more of the give arguments";

        if (typeof arr == "string") {
            for (let arg of e) {
                if (typeof arg != arr) {
                    throw new Error(this.msg + err);
                }
            }
        }
        else {
            let inv = false;
            //check if all of the arguments are the given type
            for (let i = 0; i < arr.length; i += 2) {
                if (typeof arr[i] != arr[i + 1]) {
                    inv = true;
                    break;
                }
            }
            if (inv)
                throw new Error(this.msg + err);
        }
        return this;
    }
    return check;
}
/**
 * @namespace MATH
 */

/**
 * calculates the distance between 2 points
 * @name Sattee.distance
 * @param {Number} x1 x of first point
 * @param {Number} y1 y of first point
 * @param {Number} x2 x of second point
 * @param {Number} y2 y of second point 
 * @returns {Number} The distance between the 2 points
 */
Sattee.distance = function (x1, y1, x2, y2) {
    Sattee.validate("distance")
        .arguments([x1, y1, x2, y2], 4);
    
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}


/**
 * calculates the position of a point in the middle of 2 points
 * @name Sattee.midPoint
 * @param {Number} x1 x of first point
 * @param {Number} y1 y of first point
 * @param {Number} x2 x of second point
 * @param {Number} y2 y of second point 
 * @returns {Object} A point that is in the middle of the 2 given points
 */
Sattee.midPoint = function (x1, y1, x2, y2) {
    let x = 0;
    let y = 0;

    let distance = this.distance(x1, y1, x2, y2);

    if (x1 > x2)
        x = x1 + distance / 2;
    else if (x2 > x1) x = x2 - distance / 2;
    else x = x1;
    if (y1 > y2)
        y = y1 + distance / 2;
    else if (y2 > y1) y = y2 - distance / 2;
    else y = y1;
    return { x, y }
}