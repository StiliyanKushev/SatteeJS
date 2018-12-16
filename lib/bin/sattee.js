//##################################################################################//
//########## THIS IS THE SATTEE OBJECT THAT HOLDS SOME KEY FUEATURES ###############//
//##################################################################################//

let Sattee = {
    loadedScene: false,
    scenes:{},
    currentScene:null,
    assets: {},
    load: function (assets) {
        this.assets = assets;
    },
    configure: function ({ width, height, layers, name , container, main}) {
        this.main = main;
        this.currentScene = main;
        //and generate the divs and canvases
        let div = document.createElement("div");
        div.setAttribute("id", name);
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        //make the canvas layers
        for(let i = 0; i < layers;i++){
            let canvas = document.createElement("canvas");
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.style.position = `absolute`;
            canvas.style.left = `0px`;
            canvas.style.top = `0px`;
            canvas.setAttribute("id", name + i);
            //append it to the container
            div.appendChild(canvas);
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
(function(){
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
})();

//##########################################################//
//######### HERE IS ALL OF THE RENDERING STUFF #############//
//##########################################################//
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
}

// The run Scene will run the scene as it is starting for the first time
// the reset part, if true, will also run the setup function, else not
// ex:
// Sattee.switchScene("second",true); // this will run second scene (first setup,then loop)
Sattee.switchScene = function (name,reset) {
    if(!this.scenes[name])
    throw new Error(`The specified scene (${name}) is missing. Check your code!`);

    if(reset){
        this.scenes[name].setuped = false;
    }

    this.currentScene = name;
    let temp = this.currentScene;

    if(!this.scenes[name].setuped){
        this.scenes[name].setuped = true;
        //run the setup function
        this.scenes[name].setup.apply(this.scenes[name]);
    }
    
    //continuesly run the loop
    let loop_func = this.scenes[name].loop.bind(this.scenes[name]);
    function runLoop() {
        function _frame() {
            //run the loop function
            if(temp == Sattee.currentScene)
                loop_func();
            else return;
            setTimeout(function() {_frame()});          
        }
        return _frame();
    }
    runLoop();
}