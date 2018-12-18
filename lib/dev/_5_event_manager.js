//##########################################################//
//########### HERE IS ALL OF THE EVENT STUFF ###############//
//##########################################################//

// the keyevents happen in the scene manager (the actual calling of th functions in the scene)

function _getButtons(bool){
    let arr = [];
    for(let key in Sattee.keys){
        if((Sattee.keys[key] && !bool) || (!Sattee.keys[key] && bool)){
            arr.push(String.fromCharCode(key));
        }
    }
    return arr;
}

function runEvent(name,args){
    if(Sattee.scenes[Sattee.currentScene][name]){
        if(args)
        Sattee.scenes[Sattee.currentScene][name](...args);
        else
        Sattee.scenes[Sattee.currentScene][name]();
    }
}

//this object all of the keys that the user has used
// but when a key is released and logged as realeased it deleates itself
Sattee.keys = {};

onkeydown = onkeyup = function(event){
    let bool = event.type == 'keydown';
    if(event.keyCode == 9){
        event.preventDefault();
    }
    Sattee.keys[event.keyCode || event.which] = bool;
}

Sattee._loadEvents = function(div){
    div.addEventListener("click",function(){runEvent("mouseClicked")});
    document.addEventListener("keydown",onkeydown);
    document.addEventListener("keyup",onkeyup);
}