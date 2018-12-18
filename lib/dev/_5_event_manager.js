//##########################################################//
//########### HERE IS ALL OF THE EVENT STUFF ###############//
//##########################################################//

function _getButtons(){
    let arr = [];
    for(let key in Sattee.keys){
        if(Sattee.keys[key]){
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