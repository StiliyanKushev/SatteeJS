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

    if (Sattee.exited == true && Sattee.exitIsCalled == true)
        throw new Error("Trying to play a scene after Sattee.exit(); is called!");

    if (reset) {
        this.scenes[name].setuped = false;
    }

    Sattee.currentScene = name;
    let temp = Sattee.currentScene;

    if (!Sattee.scenes[name].setuped) {
        Sattee.scenes[name].setuped = true;
        //run the setup function
        if (Sattee.scenes[name].setup != undefined)
            Sattee.scenes[name].setup.apply(Sattee.scenes[name]);
    }

    //continuesly run the loop
    if (Sattee.scenes[name].loop != undefined) {
        let loop_func = Sattee.scenes[name].loop.bind(Sattee.scenes[name]);
        //call the first frame
        Sattee.lastFrameDate = Date.now();
        _frame();
        function _frame() {
            //request another frame
            window.requestAnimationFrame(_frame);

            //run the loop function
            if (temp == Sattee.currentScene && Sattee.exited == false) {
                //get the values of the dates
                Sattee.currentFrameDate = Date.now();
                //calculate the delta
                Sattee.delta = Sattee.currentFrameDate - Sattee.lastFrameDate;

                //stick to the framerate
                if (Sattee.frameRate == undefined || Sattee.delta > 1000 / Sattee.frameRate) {
                    //set the new frame dates
                    Sattee.lastFrameDate = Sattee.currentFrameDate - (Sattee.delta % 1000 / Sattee.frameRate);

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
            }
            else return;
        }
    }
}

/**
 * This function exits the whole game
 * @name Sattee.exit
 */
Sattee.exit = function () {
    console.log(arguments.callee.caller.name);
    Sattee.exited = true;
    Sattee.exitIsCalled = true;
};