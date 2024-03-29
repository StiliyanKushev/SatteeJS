# SatteeJS
A small framework for making a multiplayer game with a built-in html5 canvas renderer.
This is a layer-based framework that aims to be simple and effective!

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## SATTEE_OBJECT

## Sattee

this is the sattee object that holds some key features

### Properties

-   `name` **[String][1]** The id of the game div and the beginning of the id of each canvas layer followed by the the layer index
-   `container` **[String][1]** The id or class of a div that you want the game div to be in
-   `layers` **[Number][2]** The number of canvases layer on top of each other in the game div
-   `width` **[Number][2]** The width of the game container and all canvases in it
-   `height` **[Number][2]** The height of the game container and all canvases in it
    value of 0 on both width and height means full screen / auto ajust to the size of div
-   `main` **[String][1]** The name of the first game scene that will be played on game start
-   `loopFunction` **[String][1]** The type of function that will be used for controlling the frame animation -> options: timeout,interval,animation (animation is the best)
-   `mouseIsDragged` **[Boolean][3]** True, if the mouse is dragged on one of the canvases
-   `frameRate` **[Number][2]?** The frame rate of the animation of the game (can be set using Sattee.frameRate = anyNumber)
-   `delta` **[Number][2]** Time that passed from the last frame to the current one

### rect

Here are all possible styling options

#### Parameters

-   `x`  
-   `y`  
-   `w`  
-   `h`  
-   `options`  
-   `center` **[Boolean][3]** if true, it will centralize the drawing
-   `color` **[String][1]** [ "rgb(41,41,41)", "rgba(21,21,21,0.4)", "#fff", "red" ]
-   `strokeColor` **[String][1]** [ "rgb(41,41,41)", "rgba(21,21,21,0.4)", "#fff", "red" ]
-   `strokeSize` **[Number][2]** size of the stroke
-   `borderRadius` **[Object][4]** an object that holds the borderRadius settings
    Examples for the border Radius
-   `rotate` **[Number][2]** Degrees of rotation of the drawing
    By default the drawing is rotated by its 0,0 origin, but you can change that with rotateX,rotateY
-   `rotateX` **[Number][2]** custom X that the drawing will be rotated by
-   `rotateY` **[Number][2]** custom Y that the drawing will be rotated by
    Here is an example for how to use the rotate, rotateX, rotateY

#### Examples

```javascript
Sattee.draw(0,function(){
     Sattee.rect(10,10,20,20,{
         center:true,
     });
});
```

```javascript
//there are different settings for the different drawings
//for the rectangle
Sattee.draw(0,function(){
     Sattee.rect(10,10,40,40,{
         color: "rgba(20,20,20,0.4)",
         borderRadius:{topLeft:20,topRight:10,lowerLeft:20,lowerRight:10}
     });
});
```

```javascript
//for the triangle
//because the triangle has only 3 side, they are called A,B,C 
Sattee.draw(0,function(){
     Sattee.triangle(10,10,40,40,90,90,{
         strokeSize:2,
         strokeColor: "red",
         borderRadius:{A:20,B:10,C:20}
     });
});
```

```javascript
The border radius also has a propery "all" that sets borderRadius to all corners
Sattee.draw(0,function(){
     Sattee.rect(10,10,20,20,{
         borerRadius:{all:30,topleft:10}
     }); 
});
```

```javascript
Sattee.draw(0,function(){
     Sattee.rect(10,10,50,50,{
         rotate: 20, //rotate by 20 degrees
         rotateX:35,
         rotateY:35  //rotate by the center of the drawing 
     });
});
```

### optionsPercentages

#### Parameters

-   `options`  

## LOADING

## Sattee.loaded

holds the percentage of the loaded canvas game.

## Sattee.load

This function loads given assets as key-value pair of an object (ex: myImage:path/to/image.png)

### Parameters

-   `assets` **[Object][4]** 

## Sattee.configure

### Parameters

-   `settings` **[Object][4]** All of the settings that you can give to Sattee when configuring a game
    -   `settings.name` **[String][1]** The id of the game div and the begining of the id of each canvas layer followed by the the layer index
    -   `settings.container` **[String][1]** The id or class of a div that you want the game div to be in (optional, default `body`)
    -   `settings.layers` **[Number][2]** The number of canvases layer on top of each other in the game div
    -   `settings.width` **[Number][2]** The width of the game container and all canvases in it
    -   `settings.height` **[Number][2]** The height of the game container and all canvases in it
    -   `settings.main` **[String][1]** The name of the first game scene that will be played on game start

## Sattee.loadVideo

This function loads an video file and save it in the Sattee.assets array

### Parameters

-   `path` **[String][1]** the path to the video file
-   `callback` **[Function][5]** a callback when the video is loaded

## Sattee.loadImage

This function loads an image file and save it in the Sattee.assets array

### Parameters

-   `path` **[String][1]** the path to the image file
-   `callback` **[Function][5]** a callback when the image is loaded

## Sattee.loadSound

This function loads a sound file and save it in the Sattee.assets array

### Parameters

-   `path` **[String][1]** the path to the sound file
-   `callback` **[Function][5]** a callback when the sound is loaded

## pixel

## Sattee.draw

The draw function must be called each time you try to draw on the canvas (any of the canvases)

### Parameters

-   `layer` **[Number][2]** the layer you will be drawing
-   `func` **[Function][5]** a function that contains all of the drawing functions

### Examples

```javascript
Sattee.draw(0,function(){
     //here you can use all of the drawing functions
});
```

## Sattee.clear

This function clears all pixels on the canvas

### Parameters

-   `layer` **[Number][2]** the layer you want to clear
-   `options` **[Object][4]** you can give as options an x,y,w,h of where you want to clear the canvas. This may increse the FPS (optional, default `{}`)

### Examples

```javascript
//this will clear the whole canvas
Sattee.clear(0);
Sattee.clear(0,{x:20,y:20,width:40,height:60});
```

## Sattee.triangle

temporary sets the canvas (0,0) origin to whatever the x and y is given as an argument

### Parameters

-   `layer` **[Number][2]** the canvas layer you will temporary translate
-   `x` **[Number][2]** the x you will translate by
-   `y` **[Number][2]** the y you will translate by
-   `func` **[Function][5]** all drawings in this function will ve translated

## Sattee.scale

temporary scales the given canvas layer

### Parameters

-   `layer` **[Number][2]** the canvas layer you will temporary scale
-   `scaleX` **[Number][2]** the x you will scale by
-   `scaleY` **[Number][2]** the y you will scale by
-   `func` **[Function][5]** all drawings in this function will ve scaled

## Sattee.bacground

This function draws the background of the canvas using rgba values

### Parameters

-   `r` **[Number][2]** the red color 0 - 255
-   `g` **[Number][2]** the green color 0 - 255
-   `b` **[Number][2]** the blue color 0 - 255
-   `a` **[Number][2]** the alpha (opacity) color 0 - 1 (optional, default `1`)

### Examples

```javascript
//draws the background on the first layer
Sattee.draw(0,function(){
     Sattee.background(220,40,40,0.8);
});
```

## Sattee.rect

draws a rectangle on the canvas

### Parameters

-   `x` **[Number][2]** the x cordinate of the drawing
-   `x` **[Number][2]** the y cordinate of the drawing
-   `w` **[Number][2]** the width of the drawing
-   `h` **[Number][2]** the height of the drawing
-   `options` **[Object][4]** You can specify the styling of the drawing (optional, default `{}`)

### Examples

```javascript
Sattee.draw(0,function(){
     //draws it with the default styles
     Sattee.rect(10,10,20,20);
     //add custom styles in the form of an object
     Sattee.rect(10,10,20,20,stylingObject);
});
```

## Sattee.rect

draws a rectangle on the canvas

### Parameters

-   `x1` **[Number][2]** the x cordinate of the first point of the drawing
-   `y1` **[Number][2]** the y cordinate of the first point of the drawing
-   `x2` **[Number][2]** the x cordinate of the seccond point of the drawing
-   `y2` **[Number][2]** the y cordinate of the seccond point of the drawing
-   `x3` **[Number][2]** the x cordinate of the third point of the drawing
-   `y3` **[Number][2]** the y cordinate of the third point of the drawing
-   `options` **[Object][4]** You can specify the styling of the drawing (optional, default `{}`)

### Examples

```javascript
Sattee.draw(0,function(){
     //draws it with the default styles
     Sattee.triangle(10,10,20,20,30,30);
     //add custom styles in the form of an object
     Sattee.triangle(10,10,20,20,30,30,stylingObject);
});
```

## Sattee.ellipse

draws an ellipse on the canvas

### Parameters

-   `x` **[Number][2]** the x cordinate of the drawing
-   `y` **[Number][2]** the y cordinate of the drawing
-   `w` **[Number][2]** the width of the drawing
-   `h` **[Number][2]** the height of the drawing
-   `options` **[Object][4]** You can specify the styling of the drawing (optional, default `{}`)

### Examples

```javascript
Sattee.draw(0,function(){
     //draws it with the default styles
     Sattee.ellipse(10,10,20,20);
     //add custom styles in the form of an object
     Sattee.ellipse(10,10,20,20,stylingObject);
});
```

## Sattee.line

draws a line on the canvas

### Parameters

-   `x1` **[Number][2]** the x cordinate of the first point of the drawing
-   `y1` **[Number][2]** the y cordinate of the first point of the drawing
-   `x2` **[Number][2]** the x cordinate of the seccond point of the drawing
-   `y2` **[Number][2]** the y cordinate of the seccond point of the drawing
-   `options` **[Object][4]** You can specify the styling of the drawing (optional, default `{}`)

### Examples

```javascript
Sattee.draw(0,function(){
     //draws it with the default styles
     Sattee.line(10,10,20,20);
     //add custom styles in the form of an object
     Sattee.line(10,10,20,20,stylingObject);
});
```

## Sattee.text

The function draws a text on the current canvas

### Parameters

-   `text` **[String][1]** the text you want to display
-   `x` **[Number][2]** the x cordinate
-   `y` **[Number][2]** the y cordinate
-   `options` **[Object][4]** the styling options (optional, default `{}`)
    -   `options.size` **[Number][2]** This is a specific property for the text function that holds the fontSize

### Examples

```javascript
Sattee.draw(1,function(){
     Sattee.text("Hello World",10,10,{
         size:20,
         strokeSize:5,
         strokeColor:"red",
         color:"gray",
         //etc.. 
     });
});
```

## Sattee.textWidth

The function calculates the width of a text at a specific size

### Parameters

-   `text` **[String][1]** the text you wish to mesure
-   `size` **[Number][2]** the size of the text you wish to mesure

Returns **[Number][2]** the width of the given text at the given size

## Sattee.textHeight

The function calculates the height of a text at a specific size

### Parameters

-   `text` **[String][1]** the text you wish to mesure
-   `size` **[Number][2]** the size of the text you wish to mesure

Returns **[Number][2]** the height of the given text at the given size

## Sattee.image

This function draws an image on the current canvas layer

### Parameters

-   `imageName` **[String][1]** the name of the image specified in the Sattee.load function
-   `x` **[Number][2]** the x cordinate
-   `y` **[Number][2]** the y cordinate
-   `w` **[Number][2]** the width
-   `h` **[Number][2]** the height
-   `options` **[Object][4]** styling options for the drawing (optional, default `{}`)

### Examples

```javascript
//furst load an all images
Sattee.load({
     myImg:"sunset.jpg"
});
//and use it in the main scene
Sattee.init("myScene",function(){
     loop: function(){
         Sattee.draw(0,function(){
             Sattee.image("myImg",0,0,Sattee.width,Sattee.height,{
                 borderRadius: {all:20}
             });
         });
     }
});
```

## SCENE_MANAGER

## Sattee.init

This function creates a new scene in the Sattee object

### Parameters

-   `name` **[String][1]** the name of the scene
-   `sceneBody` **[Object][4]** the scene body

### Examples

```javascript
Sattee.init("mainScene",{
     setup: function(){
         //this function is called only once at the start
     },
     loop: function(){
         //this function is called each frame of animation
     }
});
```

## Sattee.switchScene

This function switches to a new scene in the Sattee object

### Parameters

-   `name` **[String][1]** the name of the scene
-   `reset` **[Boolean][3]** if true it will also run the setup function of the next scene (optional, default `false`)

## Sattee.exit

This function exits the whole game

## EVENT_MANAGER

## mouseClicked

Event function used in a scene for detecting a mouse click

### Examples

```javascript
Sattee.init("myScene",{
     setup: function(){
     
     },
     loop: function(){

     },
     mouseClicked: function(){
         //codes runs when the event fires
     }
});
```

## mouseReleased

Event function used in a scene for detecting a mouse release

### Examples

```javascript
Sattee.init("myScene",{
     setup: function(){
     
     },
     loop: function(){

     },
     mouseReleased: function(){
         //codes runs when the event fires
     }
});
```

## mouseDown

Event function used in a scene for detecting if mouse is clicked but not released

### Examples

```javascript
Sattee.init("myScene",{
     setup: function(){
     
     },
     loop: function(){

     },
     mouseDown: function(){
         //codes runs when the event fires
     }
});
```

## keyDown

Event function used in a scene for detecting all keys that are currently down

### Parameters

-   `keys` **[Array][6]** an array of keys that are fired on that event ex: ["A","S","D"]

### Examples

```javascript
Sattee.init("myScene",{
     setup: function(){
     
     },
     loop: function(){

     },
     keyDown: function(keys){
         //codes runs when the event fires
         if(keys.includes("A")){
             //checks if a specific key fires the event
         }
     }
});
```

## keyUp

Event function used in a scene for detecting all keys that are currently up

### Parameters

-   `keys` **[Array][6]** an array of keys that are fired on that event ex: ["A","S","D"]

### Examples

```javascript
Sattee.init("myScene",{
     setup: function(){
     
     },
     loop: function(){

     },
     keyUp: function(keys){
         //codes runs when the event fires
         if(keys.includes("A")){
             //checks if a specific key fires the event
         }
     }
});
```

## ERROR_HANDELING

## Sattee.validate

This function can check and validate the arguments of another function

### Parameters

-   `funcName` **[String][1]** The name of the function that you wish to validate (optional, default `"Checks if you are in a draw function"`)

### Examples

```javascript
//this will return an object that you can use to validate the function
let checkMyFunction = Sattee.validate(myFunction);
//you can now chain functions from the returned object
```

Returns **[Object][4]** An object that holds all of the validation functions (used for chaining)

## Sattee.validate.arguments

checks if all arguments are defined and are the correct count

### Parameters

-   `args` **[Array][6]** all of the arguments
-   `count` **[Number][2]** the count that the arguments should be
-   `e` **[String][1]** the error that will be displayed if something goes wrong (optional, default `"not enough or invald arguments"`)

### Examples

```javascript
function myFunction(arg1,arg2,arg3){
     Sattee.validate("myFunction").arguments([arg1,arg2,arg3],3);
}
```

## Sattee.validate.range

validates true if a given number is bettween the given minimum and maximum

### Parameters

-   `num` **[Number][2]** the number that you are checking
-   `min` **[Number][2]** the minimum
-   `max` **[Number][2]** the maximum
-   `e` **[String][1]** the error that will be displayed if something goes wrong (optional, default `"one or more of the arguments with type of number is with invalid range"`)

### Examples

```javascript
function myFunction(arg1,arg2,arg3){
     //this will also throw an error if arg1 is not a number
     //so before that you should check the type of the arg1
     Sattee.validate("myFunction").range(arg1,-10,30);
}
```

## Sattee.validate.type

validates true if a all of the given arguments are the correct given type

### Parameters

-   `arr` **[Array][6]** An array that holds all all data and types ex: [2,"number","myName","string",false,"boolean"]
-   `e` **[String][1]** the error that will be displayed if something goes wrong (optional, default `"wrong type of argument on one or more of the give arguments"`)

### Examples

```javascript
function myFunction(arg1,arg2,arg3){
     //check the type of each argument and then check if arg1 is a number
     Sattee.validate("myFunction")
         .type([arg1,"number",arg2,"string",arg3,"string"])
         .range(arg1,-10,30);
}
```

## MATH

## Sattee.distance

calculates the distance between 2 points

### Parameters

-   `x1` **[Number][2]** x of first point
-   `y1` **[Number][2]** y of first point
-   `x2` **[Number][2]** x of second point
-   `y2` **[Number][2]** y of second point

Returns **[Number][2]** The distance between the 2 points

## Sattee.midPoint

calculates the position of a point in the middle of 2 points

### Parameters

-   `x1` **[Number][2]** x of first point
-   `y1` **[Number][2]** y of first point
-   `x2` **[Number][2]** x of second point
-   `y2` **[Number][2]** y of second point

Returns **[Object][4]** A point that is in the middle of the 2 given points

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
