//##################################################################################//
//########## THIS IS THE SATTEE OBJECT THAT HOLDS SOME KEY FUEATURES ###############//
//##################################################################################//

let Sattee = {
    name:undefined,
    layers:null,
    main:null,
    currentScene:null,
    currentLayer:undefined,
    loadedScene: false,
    canvasArray: [],
    // in the event listener it changes the value and set the mouseDragged event int the init function
    mouseIsDragged: false,
    //the default frame rate
    frameRate:60,
    //these are used for calculating the delta (calculated in the scene manager)
    lastFrameDate:undefined,
    currentFrameDate:undefined,
    delta:undefined,
    // if true it will not loop any scene any more
    exited: false,
    scenes:{},
    assets: {},
    load: function (assets) {
        this.assets = assets;
        this.preload();
    },
    configure: function ({ width, height, layers, name , container, main,loopFunction}) {
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
        for(let i = 0; i < layers;i++){
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
                x:0,
                y:0
            });
        }

        //if you have specified a container ex: (#myDiv or .mySection)
        if(container && typeof container == "string"){
            if(container[0] == "#"){
                document.getElementById(container.replace("#","")).appendChild(div);
            }
            else if(container[0] == "."){
                document.getElementsByClassName(container.replace(".","")).appendChild(div);
            }
        }
        else{
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
    let layer = Sattee.currentLayer;
    ctx.fillRect(-(this.canvasArray[layer].x),-(this.canvasArray[layer].y), canvas.width, canvas.height);
}
Sattee.clear = function (layer, options) {
    if (layer == undefined || typeof layer != "number" || layer < 0 || layer > this.layers - 1)
        throw new Error("Cannot Sattee.clear() the canvas because the given layer is invalid or not given. Expected Sattee.clear(*layer*) but got " + `Sattee.clear(${layer})`);

    let canvas = document.getElementById(`${Sattee.name}${layer}`);
    let ctx = canvas.getContext('2d');

    let x = 0;
    let y = 0;
    // if(!this.canvasArray[layer].translated){
    //     x = -this.canvasArray[layer].x;
    //     y = -this.canvasArray[layer].y;
    // }
    if (options) {
        if (options.x != undefined && options.y != undefined && options.width != undefined && options.height != undefined) {
            x += options.x;
            y += options.y;
            if (!options.offset)
                ctx.clearRect(x, y, options.width, options.height);
            else
                ctx.clearRect(x - options.offset,y - options.offset, options.width + options.offset * 2, options.height + options.offset * 2);
        }
        else {
            throw new Error("Invalid options set in Sattee.clear() function.");
        }
    }
    else {
        ctx.clearRect(x, y, canvas.width, canvas.height);
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
    if (typeof layer != "number" || layer < 0 || layer > this.layers - 1)
        throw new Error("Invalid number of layers when drawing in Sattee.transform();\n" + "Expected number between 0 and " + Sattee.layers + " but instead got " + layer);
    if (!func)
        throw new Error("Not enough arguments passed in the Sattee.transform() function.");
    let canvas = document.getElementById(`${Sattee.name}${layer}`);
    let ctx = canvas.getContext("2d");
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

//this is going to stop the whole game and compleately close it
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