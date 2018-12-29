//##########################################################//
//########### HERE IS ALL OF THE EVENT STUFF ###############//
//##########################################################//

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

    function runEvent(name, args) {
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

    //SOME of the evenets are controlled in the scene manager
    Sattee._loadEvents = function (div) {
        div.addEventListener("mousemove", function (event) { getMPos(event) });
        div.addEventListener("click", function () { runEvent("mouseClicked") });
        div.addEventListener("mouseup", function () { Sattee.mouseIsDragged = false; runEvent("mouseReleased") });
        div.addEventListener("mousedown", function () { Sattee.mouseIsDragged = true; runEvent("mouseDown") });
        div.addEventListener("keydown", onkeydown);
        div.addEventListener("keyup", onkeyup);
    };
}());