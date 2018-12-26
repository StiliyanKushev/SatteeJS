# sattee.js
A small framework for making a multiplayer game with built-in html5 canvas renderer

TODO LIST ON THE RENDERER
~~1. Add a rotate function in the options object~~
2. We need to add a Sattee.text() function

3. Add a origin function (ex: origin:"CENTER") in the options object

4. Add a scale function in the options object

5. Add a border radius in the options object of the rect and triangle functions (the triangle may be tricky)

6. Add a function to draw an image. Sattee.image(name,x,y,options); where options can hold {width,height,opacity,border-radius,origin etc...}

7. Add the functiononality to load a video in the Sattee.preload / Sattee.load function.

8. Add a function to draw a video on the canvas. Sattee.video(name,x,y,options); Where the options are the same as the image options. I think maybe we need to draw each frame of the video, as Sattee.image(), each frame of animation.

9. Add a functiononality to controll the Sattee.frameRate when using the loopFunction:"animation" (Window.requestFrame())

~~:solution-1:https://stackoverflow.com/questions/17125632/html5-canvas-rotate-object-without-moving-coordinates~~

:solution-2:https://www.w3schools.com/graphics/canvas_text.asp

:solution-4:https://www.w3schools.com/tags/canvas_scale.asp

:solution-5:https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas

:solution-6:https://www.w3schools.com/tags/canvas_drawimage.asp

:solution-7:https://stackoverflow.com/questions/19251983/dynamically-create-a-html5-video-element-without-it-being-shown-in-the-page

:solution-8:https://stackoverflow.com/questions/4429440/html5-display-video-inside-canvas

:solution-9:https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
