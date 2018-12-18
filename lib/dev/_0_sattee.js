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
    },
    configure: function ({ width, height, layers, name , container, main,loopFunction}) {
        //set all of the global variables
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