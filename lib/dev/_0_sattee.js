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
 * value of 0 on both width and height means full screen / auto ajust to the size of div
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
    widthToHeight: 0,
    configWidth: 0,
    configHeight: 0,
    isFullscreen: false,
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
        if (!assets || typeof assets != "object") {
            throw new Error("Assets object missing in the Sattee.load function!");
        }
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
    configure: function ({
        width,
        height,
        layers,
        name,
        container,
        main,
        fullScreen,
    }) {
        //set all of the global variables
        this.width = width;
        this.height = height;
        this.configWidth = width;
        this.configHeight = height;
        if(!fullScreen)
        this.widthToHeight = this.width / this.height;
        else this.widthToHeight = window.innerWidth / window.innerHeight;
        this.layers = layers;
        this.main = main;
        this.isFullscreen = fullScreen;
        this.currentScene = main;
        this.name = name;
        //and generate the divs and canvases
        let div = document.createElement("div");
        //allows the stacking of layers in this div
        div.style.position = "absolute";
        div.style.left = "50%";
        div.style.top = "50%";
        //save the div so sattee can add the event listeners later
        this.container = div;
        div.setAttribute("id", name);

        div.style.width = `fit-content;`;
        div.style.height = `fit-content;`;
        //make the canvas layers
        for (let i = 0; i < layers; i++) {
            let canvas = document.createElement("canvas");

            canvas.width = `${width}`;
            canvas.height = `${height}`;

            //stackin them layers
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
                if (document.body.contains(document.getElementById(container.replace("#", "")))) {
                    document.getElementById(container.replace("#", "")).appendChild(div);
                } else throw new Error("The specified container id or class is invalid in Sattee.configure()");
            } else if (container[0] == ".") {
                if (document.body.contains(document.getElementsByClassName(container.replace(".", "")))) {
                    document.getElementsByClassName(container.replace(".", "")).appendChild(div);
                } else throw new Error("The specified container id or class is invalid in Sattee.configure()");
            }
        } else {
            //append it to the body
            document.body.appendChild(div);
        }

        window.addEventListener("resize", Sattee._resize, false);
        window.addEventListener("orientationchange", Sattee._resize, false);

        this._resize();

        console.log("SatteeJS configured. GL&HF!");
    },

    _resize: function () {
        let gameArea = document.getElementById(`${Sattee.name}`);
        let newWidthToHeight;
        if (Sattee.isFullscreen || Sattee.configWidth > window.innerWidth || Sattee.configHeight > window.innerHeight) {
            console.log(this);
            Sattee.width = window.innerWidth;
            Sattee.height = window.innerHeight;
        } else {
            Sattee.width = Sattee.configWidth;
            Sattee.height = Sattee.configHeight;
        }
        newWidthToHeight = Sattee.width / Sattee.height;

        if (newWidthToHeight > Sattee.widthToHeight) {
            Sattee.width = Sattee.height * Sattee.widthToHeight;
            gameArea.style.height = Sattee.height + "px";
            gameArea.style.width = Sattee.width + "px";
        } else {
            Sattee.height = Sattee.width / Sattee.widthToHeight;
            gameArea.style.width = Sattee.width + "px";
            gameArea.style.height = Sattee.height + "px";
        }

        gameArea.style.marginTop = -Sattee.height / 2 + "px";
        gameArea.style.marginLeft = -Sattee.width / 2 + "px";

        for (let i = 0; i < Sattee.layers; i++) {
            let gameCanvas = document.getElementById(`${Sattee.name}${i}`);
            gameCanvas.width = Sattee.width;
            gameCanvas.height = Sattee.height;
        }
    }
}