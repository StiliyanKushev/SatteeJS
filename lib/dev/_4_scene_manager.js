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
                let keysDown = Sattee._getButtons();
                if(keysDown.length > 0){
                    runEvent("keyDown",[keysDown]);
                }
                let keysUp = Sattee._getButtons(true);
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