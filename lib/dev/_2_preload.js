/**
 * @namespace LOADING
 */

// in the beggining of the file you would want to set the assets that you wanna use
//for ex: Sattee.load({myImg:"./images/myImage.png",mySong:"./audio/music.mp3"});

/**
 * holds the percentage of the loaded canvas game.
 * @name Sattee.loaded
 */
Sattee.loaded = 0;

/**
 * This function loads an image file and save it in the Sattee.assets array
 * @name Sattee.loadImage
 * @param {String} path the path to the image file
 * @param {Function} callback a callback when the image is loaded 
 */
Sattee.loadImage = function (path, callback) {
    //create the image object
    let newImg = new Image;
    //execute the callback when the data loaded
    newImg.onload = function () {
        callback();
    }
    //set the src to the path
    newImg.src = path;
    //return the image object
    return newImg;
}

/**
 * This function loads a sound file and save it in the Sattee.assets array
 * @name Sattee.loadSound
 * @param {String} path the path to the sound file
 * @param {Function} callback a callback when the sound is loaded 
 */
Sattee.loadSound = function (path, callback) {
    //create the audio with the path
    let audio = new Audio(path);
    //execute the callback when the data loaded
    audio.onload = function () {
        callback();
    }
    //return the audio object
    return audio;
}

//this handles the preaload function
Sattee.preload = function () {
    let need_to_load = Object.keys(Sattee.assets).length;
    let loaded_count = 0;

    function endsWith(path, endings) {
        for (let end of endings) {
            if (path.endsWith(end)) return end;
        }
        return false;
    }

    function done_loading() {
        loaded_count++;
        Sattee.loaded = need_to_load / loaded_count;
    }
    for (let key in Sattee.assets) {
        let path = Sattee.assets[key];
        let value = false;
        //determine what kind of file is that
        if (endsWith(path, [".png", ".jpg", ".jpeg"])) {
            value = Sattee.loadImage(path, done_loading);
        }
        else if (endsWith(path, [".mp3", ".wav"])) {
            value = Sattee.loadSound(path, done_loading);
        }
        else if (endsWith(path, [".mp4"])) {

        }
        else {
            throw new Error(`Unsupported file format in the path: (${path}) of the asset: (${key})`);
        }
        //if something in that path have loaded then save it to its place in the assets
        if (value) {
            Sattee.assets[key] = value;
        }
        else {
            throw new Error(`No such asset file (${path})`);
        }
    }
};