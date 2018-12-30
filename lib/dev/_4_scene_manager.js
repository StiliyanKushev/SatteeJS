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
                    runEvent("keyDown", [keysDown]);
                }
                let keysUp = Sattee._getButtons(true);
                if (keysUp.length > 0) {
                    runEvent("keyUp", [...keysUp]);
                    //remove the released keys from the Sattee.keys object
                    for (let key in Sattee.keys) {
                        if (Sattee.keys[key] == false) {
                            delete Sattee.keys[key];
                        }
                    }
                }

                //call the mouse dragged event function
                if (Sattee.mouseIsDragged) {
                    runEvent("mouseDragged");
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