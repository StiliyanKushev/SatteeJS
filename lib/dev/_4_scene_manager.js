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