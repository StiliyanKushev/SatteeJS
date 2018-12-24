# sattee.js
A small framework for making a multiplayer game with built-in html5 canvas renderer

TODO LIST ON THE RENDERER
1. Add a rotate function in the options object
2. We need to add a Sattee.text() function
3. Add a origin function (ex: origin:"CENTER") in the options object
4. Add a scale function in the options object
5. Add a border radius in the options object of the rect and triangle functions (the triangle may be tricky)
6. Add a function to draw an image. Sattee.image(name,x,y,options); where options can hold {width,height,opacity,border-radius,origin etc...}
7. Add the functiononality to load a video in the Sattee.preload / Sattee.load function.
8. Add a function to draw a video on the canvas. Sattee.video(name,x,y,options); Where the options are the same as the image options. I think maybe we need to draw each frame of the video, as Sattee.image(), each frame of animation.
9. Add a functiononality to controll the Sattee.frameRate when using the loopFunction:"animation" (Window.requestFrame())
