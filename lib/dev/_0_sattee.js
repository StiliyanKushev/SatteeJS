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
 * @property {Number} [frameRate=autoAjusted] The frame rate of the animation of the game (can be set using Sattee.frameRate = anyNumber)
 * @property {Number} delta Time that passed from the last frame to the current one 
 */

let Sattee = {
    name: undefined,
    layers: null,
    main: null,
    currentScene: null,
    currentLayer: undefined,
    canvasArray: [],
    mouseX: 0,
    mouseY: 0,
    // in the event listener it changes the value and set the mouseDragged event int the init function
    mouseIsDragged: false,
    //the default frame rate
    frameRate: undefined,
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

        //focus the div
        div.focus();

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