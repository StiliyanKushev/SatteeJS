/**
 * @namespace EVENT_MANAGER
 */

// the keyevents happen in the scene manager (the actual calling of th functions in the scene)
(function () {
    Sattee._getButtons = function(bool) {
        let arr = [];
        for (let key in Sattee.keys) {
            if ((Sattee.keys[key] && !bool) || (!Sattee.keys[key] && bool)) {
                arr.push(String.fromCharCode(key));
            }
        }
        return arr;
    }

    Sattee._runEvent = function(name, args) {
        if (Sattee.scenes[Sattee.currentScene][name]) {
            if (args)
                Sattee.scenes[Sattee.currentScene][name](...args);
            else
                Sattee.scenes[Sattee.currentScene][name]();
        }
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

    //SOME of the evenets are controlled in the scene manager
    Sattee._loadEvents = function (div) {
        div.addEventListener("mousemove", function (event) { getMPos(event) });
        div.addEventListener("click", function () { Sattee._runEvent("mouseClicked") });
        div.addEventListener("mouseup", function () { Sattee.mouseIsDragged = false; Sattee._runEvent("mouseReleased") });
        div.addEventListener("mousedown", function () { Sattee.mouseIsDragged = true; Sattee._runEvent("mouseDown") });
        div.addEventListener("keydown", onkeydown);
        div.addEventListener("keyup", onkeyup);
    };
}());