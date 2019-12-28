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
    this._loadEvents(this.container, sceneBody);
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
        Sattee.lastFrameDate = performance.now();
        _frame();

        function _frame() {
            //request another frame
            window.requestAnimationFrame(_frame);

            //run the loop function
            if (temp == Sattee.currentScene && Sattee.exited == false) {
                //get the values of the dates
                Sattee.currentFrameDate = performance.now();
                //calculate the delta
                Sattee.delta = (Sattee.currentFrameDate - Sattee.lastFrameDate) / 1000;

                //save current date as last
                Sattee.lastFrameDate = Sattee.currentFrameDate;

                //calulate fps
                Sattee.frameRate = Math.round(1/Sattee.delta);
                if(Sattee.frameRate > 200){ // at start the frameRate is very high (ex: 3564fps)
                    Sattee.frameRate = 60;
                }

                //run the loop
                loop_func();

                //call all other function that need to happen here on each frame
                for (let fname in Sattee._runtimeFunctions) {
                    Sattee._runtimeFunctions[fname]();
                }
            } else return;
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