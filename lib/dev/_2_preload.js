//##########################################################//
//######### HERE IS ALL OF THE PRELOAD STUFF ###############//
//##########################################################//

// in the beggining of the file you would want to set the assets that you wanna use
//for ex: Sattee.load({myImg:"./images/myImage.png",mySong:"./audio/music.mp3"});

//holds the percentage of the loaded canvas game.
let loaded = 0;

//this handles the preaload function
Sattee.preload = function(){
    let need_to_load = Object.keys(Sattee.assets).length;
    let loaded_count = 0;

    function endsWith(path,endings){
        for(let end of endings){
            if(path.endsWith(end)) return end;
        }
        return false;
    }

    function done_loading(){
        loaded_count++;
        loaded = need_to_load / loaded_count;
    }
    for(let key in Sattee.assets){
        let path = Sattee.assets[key];
        let value = false;
        //determine what kind of file is that
        if(endsWith(path,[".png",".jpg",".jpeg"])){
            value = Sattee.loadImage(path,done_loading);
        }
        else if(endsWith(path,[".mp3",".wav"])){
            value = Sattee.loadSound(path,done_loading);
        }
        else if(endsWith(path,[".mp4"])){
            
        }
        else{
            throw new Error(`Unsupported file format in the path: (${path}) of the asset: (${key})`);
        }
        //if something in that path have loaded then save it to its place in the assets
        if(value){
            Sattee.assets[key] = value;
        }
        else{
            throw new Error(`No such asset file (${path})`);
        }
    }
};
