//##########################################################//
//########### HERE IS ALL OF THE EVENT STUFF ###############//
//##########################################################//

function _getButton(event){
    return String.fromCharCode(event.which || event.keyCode);
}

function runEvent(name,args){
    if(Sattee.scenes[Sattee.currentScene][name]){
        if(args)
        Sattee.scenes[Sattee.currentScene][name](...args);
        else
        Sattee.scenes[Sattee.currentScene][name]();
    }
}

Sattee._loadEvents = function(div){
    div.addEventListener("click",function(){runEvent("mouseClicked")});
    document.addEventListener("keypress",function(event){runEvent("keyPressed",[_getButton(event)])});
    document.addEventListener("keydown",function(event){runEvent("keyDown",[_getButton(event)])});
}