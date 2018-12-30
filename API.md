<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [SATTEE_OBJECT][1]
-   [Sattee][2]
    -   [Properties][3]
-   [Sattee.load][4]
    -   [Parameters][5]
-   [Sattee.configure][6]
    -   [Parameters][7]
-   [Sattee.loaded][8]
-   [LOADING][9]
-   [Sattee.loadImage][10]
    -   [Parameters][11]
-   [Sattee.loadSound][12]
    -   [Parameters][13]
-   [RENDERING][14]
-   [Sattee.draw][15]
    -   [Parameters][16]
    -   [Examples][17]
-   [Sattee.bacground][18]
    -   [Parameters][19]
    -   [Examples][20]
-   [Sattee.clear][21]
    -   [Parameters][22]
    -   [Examples][23]
-   [options][24]
    -   [Parameters][25]
    -   [Examples][26]
-   [Sattee.rect][27]
    -   [Parameters][28]
    -   [Examples][29]
-   [Sattee.rect][30]
    -   [Parameters][31]
    -   [Examples][32]
-   [Sattee.ellipse][33]
    -   [Parameters][34]
    -   [Examples][35]
-   [Sattee.line][36]
    -   [Parameters][37]
    -   [Examples][38]
-   [Sattee.text][39]
    -   [Parameters][40]
    -   [Examples][41]
-   [Sattee.textWidth][42]
    -   [Parameters][43]
-   [Sattee.triangle][44]
    -   [Parameters][45]
-   [SCENE_MANAGER][46]
-   [Sattee.init][47]
    -   [Parameters][48]
    -   [Examples][49]
-   [Sattee.switchScene][50]
    -   [Parameters][51]
-   [Sattee.exit][52]
-   [EVENT_MANAGER][53]
-   [mouseClicked][54]
    -   [Examples][55]
-   [mouseReleased][56]
    -   [Examples][57]
-   [mouseDown][58]
    -   [Examples][59]
-   [keyDown][60]
    -   [Parameters][61]
    -   [Examples][62]
-   [keyUp][63]
    -   [Parameters][64]
    -   [Examples][65]
-   [ERROR_HANDELING][66]
-   [Sattee.validate][67]
    -   [Parameters][68]
    -   [Examples][69]
-   [Sattee.validate.arguments][70]
    -   [Parameters][71]
    -   [Examples][72]
-   [Sattee.validate.range][73]
    -   [Parameters][74]
    -   [Examples][75]
-   [Sattee.validate.type][76]
    -   [Parameters][77]
    -   [Examples][78]
-   [MATH][79]
-   [Sattee.distance][80]
    -   [Parameters][81]
-   [Sattee.midPoint][82]
    -   [Parameters][83]

## SATTEE_OBJECT

## Sattee

this is the sattee object that holds some key features

### Properties

-   `name` **[String][84]** The id of the game div and the begining of the id of each canvas layer followed by the the layer index
-   `container` **[String][84]** The id or class of a div that you want the game div to be in
-   `layers` **[Number][85]** The number of canvases layer on top of each other in the game div
-   `width` **[Number][85]** The width of the game container and all canvases in it
-   `height` **[Number][85]** The height of the game container and all canvases in it
-   `main` **[String][84]** The name of the first game scene that will be played on game start
-   `loopFunction` **[String][84]** The type of function that will be used for controlling the frame aniamtion -> options: timeout,interval,animation (animation is the best)
-   `mouseIsDragged` **[Boolean][86]** True, if the mouse is dragged on one of the canvases
-   `frameRate` **[Number][85]** The frame rate of the animation of the game (can be set using Sattee.frameRate = anyNumber)
-   `delta` **[Number][85]** Time that passed from the last frame to the current one

## Sattee.load

This function loads given assets as key-value pair of an object (ex: myImage:path/to/image.png)

### Parameters

-   `assets` **[Object][87]** 

## Sattee.configure

### Parameters

-   `settings` **[Object][87]** All of the settings that you can give to Sattee when configuring a game
    -   `settings.name` **[String][84]** The id of the game div and the begining of the id of each canvas layer followed by the the layer index
    -   `settings.container` **[String][84]** The id or class of a div that you want the game div to be in (optional, default `body`)
    -   `settings.layers` **[Number][85]** The number of canvases layer on top of each other in the game div
    -   `settings.width` **[Number][85]** The width of the game container and all canvases in it
    -   `settings.height` **[Number][85]** The height of the game container and all canvases in it
    -   `settings.main` **[String][84]** The name of the first game scene that will be played on game start
    -   `settings.loopFunction` **[String][84]** The type of function that will be used for controlling the frame aniamtion -> options: timeout,interval,animation (animation is the best)

## Sattee.loaded

holds the percentage of the loaded canvas game.

## LOADING

## Sattee.loadImage

This function loads an image file and save it in the Sattee.assets array

### Parameters

-   `path` **[String][84]** the path to the image file
-   `callback` **[Function][88]** a callback when the image is loaded

## Sattee.loadSound

This function loads a sound file and save it in the Sattee.assets array

### Parameters

-   `path` **[String][84]** the path to the sound file
-   `callback` **[Function][88]** a callback when the sound is loaded

## RENDERING

## Sattee.draw

The draw function must be called each time you try to draw on the canvas (any of the canvases)

### Parameters

-   `layer` **[Number][85]** the layer you will be drawing
-   `func` **[Function][88]** a function that contains all of the drawing functions

### Examples

```javascript
Sattee.draw(0,function(){
     //here you can use all of the drawing functions
});
```

## Sattee.bacground

This function draws the background of the canvas using rgba values

### Parameters

-   `r` **[Number][85]** the red color 0 - 255
-   `g` **[Number][85]** the green color 0 - 255
-   `b` **[Number][85]** the blue color 0 - 255
-   `a` **[Number][85]** the alpha (opacity) color 0 - 1 (optional, default `1`)

### Examples

```javascript
//draws the background on the first layer
Sattee.draw(0,function(){
     Sattee.background(220,40,40,0.8);
});
```

## Sattee.clear

This function clears all pixels on the canvas

### Parameters

-   `layer` **[Number][85]** the layer you want to clear
-   `options` **[Object][87]** you can give as options an x,y,w,h of where you want to clear the canvas. This may increse the FPS (optional, default `{}`)

### Examples

```javascript
//this will clear the whole canvas
Sattee.clear(0);
Sattee.clear(0,{x:20,y:20,width:40,height:60});
```

## options

Here are all possible styling options

### Parameters

-   `color` **[String][84]** [ "rgb(41,41,41)", "rgba(21,21,21,0.4)", "#fff", "red" ]
-   `strokeColor` **[String][84]** [ "rgb(41,41,41)", "rgba(21,21,21,0.4)", "#fff", "red" ]
-   `strokeSize` **[Number][85]** size of the stroke
-   `borderRadius` **[Object][87]** an object that holds the borderRadius settings
    Examples for the border Radius
-   `rotate` **[Number][85]** Degrees of rotation of the drawing
    By default the drawing is rotated by its 0,0 origin, but you can change that with rotateX,rotateY
-   `rotateX` **[Number][85]** custom X that the drawing will be rotated by
-   `rotateY` **[Number][85]** custom Y that the drawing will be rotated by
    Here is an example for how to use the rotate, rotateX, rotateY

### Examples

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

## Sattee.rect

draws a rectangle on the canvas

### Parameters

-   `x` **[Number][85]** the x cordinate of the drawing
-   `x` **[Number][85]** the y cordinate of the drawing
-   `w` **[Number][85]** the width of the drawing
-   `h` **[Number][85]** the height of the drawing
-   `options` **[Object][87]** You can specify the styling of the drawing (optional, default `{}`)

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

-   `x1` **[Number][85]** the x cordinate of the first point of the drawing
-   `y1` **[Number][85]** the y cordinate of the first point of the drawing
-   `x2` **[Number][85]** the x cordinate of the seccond point of the drawing
-   `y2` **[Number][85]** the y cordinate of the seccond point of the drawing
-   `x3` **[Number][85]** the x cordinate of the third point of the drawing
-   `y3` **[Number][85]** the y cordinate of the third point of the drawing
-   `options` **[Object][87]** You can specify the styling of the drawing (optional, default `{}`)

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

-   `x` **[Number][85]** the x cordinate of the drawing
-   `y` **[Number][85]** the y cordinate of the drawing
-   `w` **[Number][85]** the width of the drawing
-   `h` **[Number][85]** the height of the drawing
-   `options` **[Object][87]** You can specify the styling of the drawing (optional, default `{}`)

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

-   `x1` **[Number][85]** the x cordinate of the first point of the drawing
-   `y1` **[Number][85]** the y cordinate of the first point of the drawing
-   `x2` **[Number][85]** the x cordinate of the seccond point of the drawing
-   `y2` **[Number][85]** the y cordinate of the seccond point of the drawing
-   `options` **[Object][87]** You can specify the styling of the drawing (optional, default `{}`)

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

-   `text` **[String][84]** the text you want to display
-   `x` **[Number][85]** the x cordinate
-   `y` **[Number][85]** the y cordinate
-   `options` **[Object][87]** the styling options (optional, default `{}`)
    -   `options.size` **[Number][85]** This is a specific property for the text function that holds the fontSize

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

-   `text` **[String][84]** the text you wish to mesure
-   `size` **[Number][85]** the size of the text you wish to mesure

Returns **[Number][85]** the width of the given text at the given size

## Sattee.triangle

temporary sets the canvas (0,0) origin to whatever the x and y is given as an argument

### Parameters

-   `layer` **[Number][85]** the canvas layer you will temporary translate
-   `x` **[Number][85]** the x you will translate by
-   `y` **[Number][85]** the y you will translate by
-   `func` **[Function][88]** all drawings in this function will ve translated

## SCENE_MANAGER

## Sattee.init

This function creates a new scene in the Sattee object

### Parameters

-   `name` **[String][84]** the name of the scene
-   `sceneBody` **[Object][87]** the scene body

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

-   `name` **[String][84]** the name of the scene
-   `reset` **[Boolean][86]** if true it will also run the setup function of the next scene (optional, default `false`)

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

-   `keys` **[Array][89]** an array of keys that are fired on that event ex: ["A","S","D"]

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

-   `keys` **[Array][89]** an array of keys that are fired on that event ex: ["A","S","D"]

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

-   `funcName` **[String][84]** The name of the function that you wish to validate (optional, default `"Checks if you are in a draw function"`)

### Examples

```javascript
//this will return an object that you can use to validate the function
let checkMyFunction = Sattee.validate(myFunction);
//you can now chain functions from the returned object
```

Returns **[Object][87]** An object that holds all of the validation functions (used for chaining)

## Sattee.validate.arguments

checks if all arguments are defined and are the correct count

### Parameters

-   `args` **[Array][89]** all of the arguments
-   `count` **[Number][85]** the count that the arguments should be
-   `e` **[String][84]** the error that will be displayed if something goes wrong (optional, default `"not enough or invald arguments"`)

### Examples

```javascript
function myFunction(arg1,arg2,arg3){
     Sattee.validate("myFunction").arguments([arg1,arg2,arg3],3);
}
```

## Sattee.validate.range

validates true if a given number is bettween the given minimum and maximum

### Parameters

-   `num` **[Number][85]** the number that you are checking
-   `min` **[Number][85]** the minimum
-   `max` **[Number][85]** the maximum
-   `e` **[String][84]** the error that will be displayed if something goes wrong (optional, default `"one or more of the arguments with type of number is with invalid range"`)

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

-   `arr` **[Array][89]** An array that holds all all data and types ex: [2,"number","myName","string",false,"boolean"]
-   `e` **[String][84]** the error that will be displayed if something goes wrong (optional, default `"wrong type of argument on one or more of the give arguments"`)

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

-   `x1` **[Number][85]** x of first point
-   `y1` **[Number][85]** y of first point
-   `x2` **[Number][85]** x of second point
-   `y2` **[Number][85]** y of second point

Returns **[Number][85]** The distance between the 2 points

## Sattee.midPoint

calculates the position of a point in the middle of 2 points

### Parameters

-   `x1` **[Number][85]** x of first point
-   `y1` **[Number][85]** y of first point
-   `x2` **[Number][85]** x of second point
-   `y2` **[Number][85]** y of second point

Returns **[Object][87]** A point that is in the middle of the 2 given points

[1]: #sattee_object

[2]: #sattee

[3]: #properties

[4]: #satteeload

[5]: #parameters

[6]: #satteeconfigure

[7]: #parameters-1

[8]: #satteeloaded

[9]: #loading

[10]: #satteeloadimage

[11]: #parameters-2

[12]: #satteeloadsound

[13]: #parameters-3

[14]: #rendering

[15]: #satteedraw

[16]: #parameters-4

[17]: #examples

[18]: #satteebacground

[19]: #parameters-5

[20]: #examples-1

[21]: #satteeclear

[22]: #parameters-6

[23]: #examples-2

[24]: #options

[25]: #parameters-7

[26]: #examples-3

[27]: #satteerect

[28]: #parameters-8

[29]: #examples-4

[30]: #satteerect-1

[31]: #parameters-9

[32]: #examples-5

[33]: #satteeellipse

[34]: #parameters-10

[35]: #examples-6

[36]: #satteeline

[37]: #parameters-11

[38]: #examples-7

[39]: #satteetext

[40]: #parameters-12

[41]: #examples-8

[42]: #satteetextwidth

[43]: #parameters-13

[44]: #satteetriangle

[45]: #parameters-14

[46]: #scene_manager

[47]: #satteeinit

[48]: #parameters-15

[49]: #examples-9

[50]: #satteeswitchscene

[51]: #parameters-16

[52]: #satteeexit

[53]: #event_manager

[54]: #mouseclicked

[55]: #examples-10

[56]: #mousereleased

[57]: #examples-11

[58]: #mousedown

[59]: #examples-12

[60]: #keydown

[61]: #parameters-17

[62]: #examples-13

[63]: #keyup

[64]: #parameters-18

[65]: #examples-14

[66]: #error_handeling

[67]: #satteevalidate

[68]: #parameters-19

[69]: #examples-15

[70]: #satteevalidatearguments

[71]: #parameters-20

[72]: #examples-16

[73]: #satteevalidaterange

[74]: #parameters-21

[75]: #examples-17

[76]: #satteevalidatetype

[77]: #parameters-22

[78]: #examples-18

[79]: #math

[80]: #satteedistance

[81]: #parameters-23

[82]: #satteemidpoint

[83]: #parameters-24

[84]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[85]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[86]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[87]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[88]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[89]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array