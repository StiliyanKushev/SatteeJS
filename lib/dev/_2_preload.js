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
 * This function loads an video file and save it in the Sattee.assets array
 * @name Sattee.loadVideo
 * @param {String} path the path to the video file
 * @param {Function} callback a callback when the video is loaded 
 */
Sattee.loadVideo = function (path, callback) {
    //create the image object
    let newVid = document.createElement("video");

    //set the src to the path
    newVid.src = path;

    //dont auto play the video
    newVid.removeAttribute('autoplay');

    newVid.isPaused = false;
    newVid.hasEnded = false;

    newVid.playFunction = function () {
        if (newVid.isPaused == false && newVid.hasEnded == false) {
            Sattee.image.givenCtx = newVid.givenCtx;
            Sattee.image.givenLayer = newVid.givenLayer;
            Sattee.image(newVid, newVid.givenX, newVid.givenY, newVid.givenW, newVid.givenH, newVid.givenOptions);
        }
    }

    newVid.onplaying = function () {

    }

    //execute the callback when the data loaded
    newVid.oncanplay = function () {
        callback();
    }
    //return the video
    return newVid;
}

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
    //add some default proprties to global objects
    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
        get: function () {
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        }
    })

    let need_to_load = Object.keys(Sattee.assets).length;
    //add the fonts if any
    if (Object.keys(Sattee.assets).includes("fonts")) {
        //remove the fonts propery as things to be loaded
        need_to_load--;
        //there are fonts to be loaded
        need_to_load += Object.keys(Sattee.assets["fonts"]).length;
    }
    let loaded_count = 0;

    function endsWith(path, endings) {
        for (let end of endings) {
            if (path.endsWith(end)) return end;
        }
        return false;
    }

    function done_loading() {
        loaded_count++;
        Sattee.loaded = need_to_load / loaded_count * 100;
        if (Sattee.loaded == 100) {
            //start the main scene
            Sattee.switchScene(Sattee.main);
        }
    }

    //if there is notting to load just start the main scene
    if (Object.keys(Sattee.assets).length === 0 && Sattee.assets.constructor === Object) {
        Sattee.switchScene(Sattee.main);
    } else {
        for (let key in Sattee.assets) {
            let path = Sattee.assets[key];
            let value = false;
            //check if its not loading fonts
            if (key == "fonts") {
                let fontsObj = Sattee.assets[key];
                //load each font
                for (let fontName in fontsObj) {
                    let fontUrl = fontsObj[fontName];

                    var _font = new FontFace(fontName, `url(${fontUrl})`);
                    _font.load().then(function (loaded_face) {
                        document.fonts.add(loaded_face);
                        done_loading();
                        //save the font in the assets
                        Sattee.assets.fonts[fontName] = loaded_face;
                    }).catch(function (error) {
                        // error occurred
                        console.log(error);
                        throw new Error(`Invalid font url for ${fontName} : ( ${fontUrl} ), in Sattee.configure()`);
                    });
                }
            }
            else{
                //determine what kind of file is that
                if (endsWith(path, [".png", ".jpg", ".jpeg"])) {
                    value = Sattee.loadImage(path, done_loading);
                } else if (endsWith(path, [".mp3", ".wav"])) {
                    value = Sattee.loadSound(path, done_loading);
                } else if (endsWith(path, [".mp4"])) {
                    value = Sattee.loadVideo(path, done_loading);
                } else {
                    throw new Error(`Unsupported file format in the path: (${path}) of the asset: (${key})`);
                }
                //if something in that path have loaded then save it to its place in the assets
                if (value) {
                    Sattee.assets[key] = value;
                } else {
                    throw new Error(`No such asset file (${path})`);
                }
            }
        }
    }
};