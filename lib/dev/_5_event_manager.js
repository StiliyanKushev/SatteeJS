/**
 * @namespace EVENT_MANAGER
 */

(function () {
    Sattee._runEvent = function (name, args) {
        if (Sattee.scenes[Sattee.currentScene][name]) {
            if (args)
                Sattee.scenes[Sattee.currentScene][name](...args);
            else
                Sattee.scenes[Sattee.currentScene][name]();
        }
    }

    Sattee._getButtons = function (bool) {
        let arr = [];
        for (let key in Sattee.keys) {
            if ((Sattee.keys[key] && !bool) || (!Sattee.keys[key] && bool)) {
                arr.push(String.fromCharCode(key));
            }
        }
        return arr;
    }

    //this object all of the keys that the user has used
    // but when a key is released and logged as realeased it deleates itself
    Sattee.keys = {};

    onkeydown = onkeyup = function (event) {
        let bool = event.type == 'keydown';
        if (event.keyCode == 9) {
            event.preventDefault();
        }
        Sattee.keys[event.keyCode || event.which] = bool;

        Sattee._addRuntimeFunction("keyUpDown", function () {
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
        });
    };

    let getMPos = function (event) {
        let canvas = document.getElementById(`${Sattee.name}${0}`);
        let rect = canvas.getBoundingClientRect();
        Sattee.prevmouseX = Sattee.mouseX || event.clientX - rect.left;
        Sattee.prevmouseY = Sattee.mouseY || event.clientY - rect.top;
        Sattee.mouseX = event.clientX - rect.left;
        Sattee.mouseY = event.clientY - rect.top;
    };

    /**
     * Event function used in a scene for detecting a mouse click
     * @name mouseClicked
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      mouseClicked: function(){
     *          //codes runs when the event fires
     *      }
     * });
     */

    /**
     * Event function used in a scene for detecting a mouse release
     * @name mouseReleased
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      mouseReleased: function(){
     *          //codes runs when the event fires
     *      }
     * });
     */

    /**
     * Event function used in a scene for detecting if mouse is clicked but not released
     * @name mouseDown
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      mouseDown: function(){
     *          //codes runs when the event fires
     *      }
     * });
     */

    /**
     * Event function used in a scene for detecting all keys that are currently down
     * @name keyDown
     * @param {Array} keys an array of keys that are fired on that event ex: ["A","S","D"]
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      keyDown: function(keys){
     *          //codes runs when the event fires
     *          if(keys.includes("A")){
     *              //checks if a specific key fires the event
     *          }
     *      }
     * });
     */

    /**
     * Event function used in a scene for detecting all keys that are currently up 
     * @name keyUp
     * @param {Array} keys an array of keys that are fired on that event ex: ["A","S","D"] 
     * @example
     * Sattee.init("myScene",{
     *      setup: function(){
     *      
     *      },
     *      loop: function(){
     * 
     *      },
     *      keyUp: function(keys){
     *          //codes runs when the event fires
     *          if(keys.includes("A")){
     *              //checks if a specific key fires the event
     *          }
     *      }
     * });
     */

    //Here are all events that are in the sceneBody
    Sattee._loadEvents = function (div, sceneBody) {
        if (sceneBody['mouseMoved'] != undefined)
            div.addEventListener("mousemove", function (event) {
                getMPos(event)
                Sattee._runEvent("mouseMoved");
            });
        if (sceneBody['mouseClicked'] != undefined)
            div.addEventListener("click", function () {
                Sattee._runEvent("mouseClicked")
            });
        if (sceneBody['mouseReleased'] != undefined)
            div.addEventListener("mouseup", function () {
                Sattee.mouseIsDragged = false;
                Sattee._runEvent("mouseReleased")
            });
        if (sceneBody['mouseDown'] != undefined)
            div.addEventListener("mousedown", function () {
                Sattee.mouseIsDragged = true;
                Sattee._runEvent("mouseDown")
            });
        if (sceneBody['mouseDragged'] != undefined)
            Sattee._addRuntimeFunction("mouseDragged", function () {
                //call the mouse dragged event function
                if (Sattee.mouseIsDragged) {
                    Sattee._runEvent("mouseDragged");
                }
            });
        div.addEventListener("keydown", onkeydown); // these are ran in the runtime loop
        div.addEventListener("keyup", onkeyup); // these are ran in the runtime loop
    };
}());