//##################################################################################//
//########## THIS IS THE SATTEE OBJECT THAT HOLDS SOME KEY FUEATURES ###############//
//##################################################################################//

let Sattee = {
    name: undefined,
    layers: null,
    main: null,
    currentScene: null,
    currentLayer: undefined,
    loadedScene: false,
    canvasArray: [],
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
    load: function (assets) {
        this.assets = assets;
        this.preload();
    },
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
            _setCtxToLayer(canvas);
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
    },
    loadImage: function (path, callback) {
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
    },
    loadSound: function (path, callback) {
        //create the audio with the path
        let audio = new Audio(path);
        //execute the callback when the data loaded
        audio.onload = function () {
            callback();
        }
        //return the audio object
        return audio;
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
//##########################################################//
//######### HERE IS ALL OF THE PRELOAD STUFF ###############//
//##########################################################//

// in the beggining of the file you would want to set the assets that you wanna use
//for ex: Sattee.load({myImg:"./images/myImage.png",mySong:"./audio/music.mp3"});

//holds the percentage of the loaded canvas game.
let loaded = 0;

//this handles the preaload function
Sattee.preload = function(){
    let need_to_load = Object.keys(Sattee.assets).length;
    let loaded_count = 0;

    function endsWith(path,endings){
        for(let end of endings){
            if(path.endsWith(end)) return end;
        }
        return false;
    }

    function done_loading(){
        loaded_count++;
        loaded = need_to_load / loaded_count;
    }
    for(let key in Sattee.assets){
        let path = Sattee.assets[key];
        let value = false;
        //determine what kind of file is that
        if(endsWith(path,[".png",".jpg",".jpeg"])){
            value = Sattee.loadImage(path,done_loading);
        }
        else if(endsWith(path,[".mp3",".wav"])){
            value = Sattee.loadSound(path,done_loading);
        }
        else if(endsWith(path,[".mp4"])){
            
        }
        else{
            throw new Error(`Unsupported file format in the path: (${path}) of the asset: (${key})`);
        }
        //if something in that path have loaded then save it to its place in the assets
        if(value){
            Sattee.assets[key] = value;
        }
        else{
            throw new Error(`No such asset file (${path})`);
        }
    }
};

//##########################################################//
//######### HERE IS ALL OF THE RENDERING STUFF #############//
//##########################################################//

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
//##########################################################//
//######## HERE IS THE SCENE MANAGER FOR THE GAME ##########//
//##########################################################//

//init makes a new scene 
//ex:
// init("main",{
//     setup: () => {
//        
//     },
//     loop: (delta) => {
//
//     }
// });
//in the setup you can init all variable used in the scene later
//the loop function is going to be called each frame
//the delta is the time between the last frame and the current frame

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

// The run Scene will run the scene as it is starting for the first time
// the reset part, if true, will also run the setup function, else not
// ex:
// Sattee.switchScene("second",true); // this will run second scene (first setup,then loop)
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
            if (temp == Sattee.currentScene && !Sattee.exited){
                //get the values of the dates
                if(Sattee.lastFrameDate == undefined){
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
                let keysDown = _getButtons();
                if(keysDown.length > 0){
                    runEvent("keyDown",[keysDown]);
                }
                let keysUp = _getButtons(true);
                if(keysUp.length > 0){
                    runEvent("keyUp",[...keysUp]);
                    //remove the released keys from the Sattee.keys object
                    for(let key in Sattee.keys){
                        if(Sattee.keys[key] == false){
                            delete Sattee.keys[key];
                        }
                    }
                }

                //call the mouse dragged event function
                if(Sattee.mouseIsDragged){
                    runEvent("mouseDragged");
                }
            }
            else return;
            // if not sure just use animation. It is better cuz it doesnt skips frames
            if(Sattee.loopFunction == "interval")
            setInterval(function () { _frame() },1000 /  Sattee.frameRate);
            else if(Sattee.loopFunction == "timeout")
            setTimeout(function () { _frame() },1000 /  Sattee.frameRate);
            else if(Sattee.loopFunction == "animation")
            window.requestAnimationFrame(_frame);
            else throw new Error(`You need to specify a loop function in the config. If you are not sure what to use, use timeout. (loopfunction:"timeout")`);
        }
        return _frame();
    }
    runLoop();
}

//this is going to stop the whole game
//Not something you would want to do if you make a game for the web tho
//but if you are going to make an Android game with webView or smt

Sattee.exit = function () {
    this.exited = true;
}
//##########################################################//
//########### HERE IS ALL OF THE EVENT STUFF ###############//
//##########################################################//

// the keyevents happen in the scene manager (the actual calling of th functions in the scene)

function _getButtons(bool){
    let arr = [];
    for(let key in Sattee.keys){
        if((Sattee.keys[key] && !bool) || (!Sattee.keys[key] && bool)){
            arr.push(String.fromCharCode(key));
        }
    }
    return arr;
}

function runEvent(name,args){
    if(Sattee.scenes[Sattee.currentScene][name]){
        if(args)
        Sattee.scenes[Sattee.currentScene][name](...args);
        else
        Sattee.scenes[Sattee.currentScene][name]();
    }
}

//this object all of the keys that the user has used
// but when a key is released and logged as realeased it deleates itself
Sattee.keys = {};

onkeydown = onkeyup = function(event){
    let bool = event.type == 'keydown';
    if(event.keyCode == 9){
        event.preventDefault();
    }
    Sattee.keys[event.keyCode || event.which] = bool;
}

let getMPos = function(event){
    let canvas = document.getElementById(`${Sattee.name}${0}`);
    let rect = canvas.getBoundingClientRect();
    Sattee.prevmouseX = Sattee.mouseX || event.clientX - rect.left;
    Sattee.prevmouseY = Sattee.mouseY || event.clientY - rect.top;
    Sattee.mouseX = event.clientX - rect.left;
    Sattee.mouseY = event.clientY - rect.top;
}

//SOME of the evenets are controlled in the scene manager
Sattee._loadEvents = function(div){
    div.addEventListener("mousemove",function(event){getMPos(event)});
    div.addEventListener("click",function(){runEvent("mouseClicked")});
    div.addEventListener("mouseup", function(){Sattee.mouseIsDragged = false;runEvent("mouseReleased")});
    div.addEventListener("mousedown", function(){Sattee.mouseIsDragged = true;runEvent("mouseDown")});
    div.addEventListener("keydown",onkeydown);
    div.addEventListener("keyup",onkeyup);
}
//##########################################################//
//####### HERE IS ALL OF THE ERROR HANDELING STUFF #########//
//##########################################################//

Sattee.validate = function (funcName) {
    let check = {};
    check.msg = `There was an error in the Sattee.${funcName}(); function.\n`;

    if (!funcName && this.currentLayer == undefined)
        throw new Error("You are not allowed to draw on the canvas outside the Sattee.draw function");

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

    check.range = function (num, min, max, e) {
        let err = e || "one or more of the arguments with type of number is with invalid range";

        if (num < min || num > max)
            throw new Error(this.msg + err);

        return this;
    }

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
Sattee.distance = function (x1, y1, x2, y2) {
    Sattee.validate("distance")
        .arguments([x1, y1, x2, y2], 4);

    try {
        Sattee.validate("distance")
            .type("number", [x1, y1, x2, y2])
        let a = x1 - x2;
        let b = y1 - y2;
        return Math.sqrt(a * a + b * b);
    } catch (err) {
        // Then they should be vectors (i should check if they are)
        //TODO WORK WIT VECTORS
    }
}

Sattee.midPoint = function(x1,y1,x2,y2){
    let x = 0;
    let y = 0;

    let distance = this.distance(x1,y1,x2,y2);

    if(x1 > x2)
    x = x1 + distance / 2;
    else if(x2 > x1) x = x2 - distance / 2;
    else x = x1;
    if(y1 > y2)
    y = y1 + distance / 2;
    else if(y2 > y1) y = y2 - distance / 2;
    else y = y1;
    return {x,y}
}