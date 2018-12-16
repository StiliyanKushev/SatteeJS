//##########################################################//
//########## HERE IS ALL OF THE ENTITY STUFF ###############//
//##########################################################//

//Holds all of the entities
//When filled with some it will look like this
// {
//     //this is the gruop
//     players: [{entityObject},{entityObject}]
// }
let entityArray = {}

//The config object contains thinks like the controllers, the group
//A config example:
// let config = {
//     controller: ARCADE_CONTROLLER,
//     group: "player",
//     collideGroups: ["obstacles","love","goodmarksinschool"]
//     id: "80330425"
// }
// You can even add other things for example an ID that you will use with sockets.io

function newEntity(config){
    let result_object = {
        position:createVector(0,0),
        velocity:createVector(0,0),
        _index:0,
    };
    //set all of the keys-value pairs to the new object
    for(let key in config){
        let value = config[key];
        result_object[key] = value;
    }
    //add the object to the array of entities on the coresponding group or the default one
    if('group' in config){
        if(entityArray[config.group]){
            //The index is going to be used for faster accsess in the entityArray
            let index = entityArray[config.group].length + 1;
            result_object._index = index;
            entityArray[config.group].push(result_object);
        }
        else{
            entityArray[config.group] = [];
        }
    }
}