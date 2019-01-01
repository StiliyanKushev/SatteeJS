/**
 * @namespace RENDERING
 */

(function () {
    Sattee.getCanvas = function (layer) {
        let canvas = document.getElementById(`${this.name}${layer != undefined ? layer:this.currentLayer}`);
        let ctx = canvas.getContext("2d");
        return [ctx, canvas];
    }
    function _roundedPoly(ctx, points, radiusAll) {
        var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut, radius;
        // convert 2 points into vector form, polar form, and normalised 
        var asVec = function (p, pp, v) {
            v.x = pp.x - p.x;
            v.y = pp.y - p.y;
            v.len = Math.sqrt(v.x * v.x + v.y * v.y);
            v.nx = v.x / v.len;
            v.ny = v.y / v.len;
            v.ang = Math.atan2(v.ny, v.nx);
        }
        radius = radiusAll;
        v1 = {};
        v2 = {};
        len = points.length;
        p1 = points[len - 1];
        // for each point
        for (i = 0; i < len; i++) {
            p2 = points[(i) % len];
            p3 = points[(i + 1) % len];
            //-----------------------------------------
            // Part 1
            asVec(p2, p1, v1);
            asVec(p2, p3, v2);
            sinA = v1.nx * v2.ny - v1.ny * v2.nx;
            sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;
            angle = Math.asin(sinA);
            //-----------------------------------------
            radDirection = 1;
            drawDirection = false;
            if (sinA90 < 0) {
                if (angle < 0) {
                    angle = Math.PI + angle;
                } else {
                    angle = Math.PI - angle;
                    radDirection = -1;
                    drawDirection = true;
                }
            } else {
                if (angle > 0) {
                    radDirection = -1;
                    drawDirection = true;
                }
            }
            if (p2.radius !== undefined) {
                radius = p2.radius;
            } else {
                radius = radiusAll;
            }
            //-----------------------------------------
            // Part 2
            halfAngle = angle / 2;
            //-----------------------------------------

            //-----------------------------------------
            // Part 3
            lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
            //-----------------------------------------

            //-----------------------------------------
            // Special part A
            if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
                lenOut = Math.min(v1.len / 2, v2.len / 2);
                cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
            } else {
                cRadius = radius;
            }
            //-----------------------------------------
            // Part 4
            x = p2.x + v2.nx * lenOut;
            y = p2.y + v2.ny * lenOut;
            //-----------------------------------------
            // Part 5
            x += -v2.ny * cRadius * radDirection;
            y += v2.nx * cRadius * radDirection;
            //-----------------------------------------
            // Part 6
            ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection);
            //-----------------------------------------
            p1 = p2;
            p2 = p3;
        }
        ctx.closePath();
    }
    function _manageOptions(caller, options, obj) {
        if (options == undefined) options = {};
        for (let key in obj) {
            let [t, f, f1] = obj[key];
            if (options[key] != undefined) {
                Sattee.validate(caller)
                    .type([options[key], t]);
                f(options[key]);
            }
            else {
                if (f1 != undefined) f1();
            }
        }
    }
    function _manageDefaultDrawingOptions(name, options, ctx) {
        _manageOptions(name, options, {
            "color": ["string", () => { ctx.fillStyle = options.color }],
            "strokeSize": ["number", () => { ctx.lineWidth = options.strokeSize }],
            "strokeColor": ["string", () => { ctx.strokeStyle = options.strokeColor }],
        });
    }
    function _validateDrawingFunction(name, args) {
        //validate all of the arguments
        Sattee.validate(name)
            .arguments(args, args.length)
            .type("number", args);

        //check if you are inside the Sattee.draw() function
        Sattee.validate();
    }
    function _colorize(ctx, stroke) {
        //add the styles to the drawing
        if (stroke)
            ctx.stroke();
        ctx.fill();
    }

    //sets some default canvas styles
    //called in the sattee object configure function
    Sattee._setCtxToLayer = function (canvas) {
        let ctx = canvas.getContext("2d");
        //here are all of the default styles
        ctx.fillStyle = "rgb(51,51,51)";
        ctx.font = `30px Sans-serif`;
        // ctx.lineCap = "round";
    }

    /**
     * The draw function must be called each time you try to draw on the canvas (any of the canvases)
     * @name Sattee.draw
     * @param {Number} layer the layer you will be drawing
     * @param {Function} func a function that contains all of the drawing functions
     * @example
     * Sattee.draw(0,function(){
     *      //here you can use all of the drawing functions
     * });
     */
    Sattee.draw = function (layer, func) {
        //validate all of the arguments
        Sattee.validate("draw")
            .arguments([layer, func], 2)
            .type([layer, "number", func, "function"])
            .range(layer, 0, this.layers - 1);

        //set the layer
        this.currentLayer = layer;
        //call the function with all of the drawing stuff in it
        func.apply(this.scenes[this.currentScene]);
        //and then remove the layer to prevent someone from trying to draw outside of the .draw function
        this.currentLayer = undefined;
    }

    /**
     * This function draws the background of the canvas using rgba values
     * @name Sattee.bacground
     * @param {Number} r the red color 0 - 255
     * @param {Number} g the green color 0 - 255
     * @param {Number} b the blue color 0 - 255
     * @param {Number} [a=1] the alpha (opacity) color 0 - 1 
     * @example
     * //draws the background on the first layer
     * Sattee.draw(0,function(){
     *      Sattee.background(220,40,40,0.8);
     * });
     */
    Sattee.background = function (style) {
        //validate all of the arguments
        Sattee.validate("background")
            .arguments([style], 1)
            .type([style, "string"]);

        //check if you are inside the Sattee.draw() function
        Sattee.validate();

        //get the 2DContext of the current canvas layer
        let [ctx, canvas] = this.getCanvas();

        ctx.save();

        //draw the bacground as a big rectangle on the current cordinates
        ctx.fillStyle = style;

        ctx.fillRect(-(this.canvasArray[this.currentLayer].x), -(this.canvasArray[this.currentLayer].y), canvas.width, canvas.height);

        ctx.restore();
    }
    /**
     * This function clears all pixels on the canvas
     * @name Sattee.clear
     * @param {Number} layer the layer you want to clear
     * @param {Object} [options={}] you can give as options an x,y,w,h of where you want to clear the canvas. This may increse the FPS 
     * @example
     * //this will clear the whole canvas
     * Sattee.clear(0);
     * Sattee.clear(0,{x:20,y:20,width:40,height:60});
     */
    Sattee.clear = function (layer, options) {
        //validate all of the arguments
        Sattee.validate("clear")
            .arguments([layer], 1)
            .type([layer, "number"])
            .range(layer, 0, this.layers - 1);

        //get the 2DContext of the current canvas layer
        let [ctx, canvas] = this.getCanvas(layer);

        if (options) {
            Sattee.validate("clear", `There was an error with the options in the Sattee.clear() function`)
                .arguments([options.x, options.y, options.width, options.height], 4)
                .type([options.x, "number", options.y, "number", options.width, "number", options.height, "number"]);
            x = options.x;
            y = options.y;
            if (!options.offset)
                ctx.clearRect(x, y, options.width, options.height);
            else
                ctx.clearRect(x - options.offset, y - options.offset, options.width + options.offset * 2, options.height + options.offset * 2);
        }
        else {
            if (this.canvasArray[layer].translated)
                ctx.clearRect(-(this.canvasArray[layer].x), -(this.canvasArray[layer].y), canvas.width, canvas.height);
            else
                ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * Here are all possible styling options
     * @name options
     * This one only works for rectngle and ellipse
     * @param {Boolean} center if true, it will centralize the drawing
     * @example
     * Sattee.draw(0,function(){
     *      Sattee.rect(10,10,20,20,{
     *          center:true,
     *      });
     * });
     * @param {String} color [ "rgb(41,41,41)", "rgba(21,21,21,0.4)", "#fff", "red" ]
     * @param {String} strokeColor [ "rgb(41,41,41)", "rgba(21,21,21,0.4)", "#fff", "red" ]
     * @param {Number} strokeSize size of the stroke
     * @param {Object} borderRadius an object that holds the borderRadius settings
     * Examples for the border Radius
     * @example
     * //there are different settings for the different drawings
     * //for the rectangle
     * Sattee.draw(0,function(){
     *      Sattee.rect(10,10,40,40,{
     *          color: "rgba(20,20,20,0.4)",
     *          borderRadius:{topLeft:20,topRight:10,lowerLeft:20,lowerRight:10}
     *      });
     * });
     * @example
     * //for the triangle
     * //because the triangle has only 3 side, they are called A,B,C 
     * Sattee.draw(0,function(){
     *      Sattee.triangle(10,10,40,40,90,90,{
     *          strokeSize:2,
     *          strokeColor: "red",
     *          borderRadius:{A:20,B:10,C:20}
     *      });
     * });
     * @example
     * The border radius also has a propery "all" that sets borderRadius to all corners
     * Sattee.draw(0,function(){
     *      Sattee.rect(10,10,20,20,{
     *          borerRadius:{all:30,topleft:10}
     *      }); 
     * });
     * @param {Number} rotate Degrees of rotation of the drawing
     * By default the drawing is rotated by its 0,0 origin, but you can change that with rotateX,rotateY
     * @param {Number} rotateX custom X that the drawing will be rotated by
     * @param {Number} rotateY custom Y that the drawing will be rotated by
     * Here is an example for how to use the rotate, rotateX, rotateY
     * @example
     * Sattee.draw(0,function(){
     *      Sattee.rect(10,10,50,50,{
     *          rotate: 20, //rotate by 20 degrees
     *          rotateX:35,
     *          rotateY:35  //rotate by the center of the drawing 
     *      });
     * });
     */

    /**
     * draws a rectangle on the canvas
     * @name Sattee.rect
     * @param {Number} x the x cordinate of the drawing
     * @param {Number} x the y cordinate of the drawing
     * @param {Number} w the width of the drawing
     * @param {Number} h the height of the drawing
     * @param {Object} [options={}] You can specify the styling of the drawing 
     * @example
     * Sattee.draw(0,function(){
     *      //draws it with the default styles
     *      Sattee.rect(10,10,20,20);
     *      //add custom styles in the form of an object
     *      Sattee.rect(10,10,20,20,stylingObject);
     * });
     */
    Sattee.rect = function (x, y, w, h, options) {
        //validate all of the arguments
        _validateDrawingFunction("rect", [x, y, w, h]);

        //get the 2DContext of the current canvas layer
        let [ctx] = this.getCanvas();

        //save the current canvas drawing settings
        ctx.save();

        //manage the default options
        _manageDefaultDrawingOptions("rect", options, ctx);

        //manage additional options that change in other drawing function
        let fx = x, fy = y; // final x , final y (where the drawing will be rotated)
        _manageOptions("rect", options, {
            "center": ["boolean", () => { x -= w / 2; y -= h / 2 }],
            "rotateX": ["number", (rx) => { fx = rx }],
            "rotateY": ["number", (ry) => { fy = ry }],
            "rotate": ["number", (deg) => {
                Sattee.translate(Sattee.currentLayer, fx, fy, function () {
                    ctx.rotate(deg * Math.PI / 180)
                });
            }],
            "borderRadius": ["object", (radius) => {
                //draw a path (rectangle like) with the given raduises
                let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };

                if (radius.all != undefined) {
                    for (let key in cornerRadius) {
                        cornerRadius[key] = radius.all;
                    }
                }
                else if (radius.upperLeft == undefined && radius.upperRight == undefined &&
                    radius.lowerLeft == undefined && radius.lowerRight == undefined) {
                    throw new Error("There was an error in the borderRadius option in the Sattee.rect(); function");
                }

                for (let side in radius) {
                    cornerRadius[side] = radius[side];
                }

                let m = Math.min(w, h);
                for (let side in cornerRadius) {
                    if (cornerRadius[side] > m) {
                        cornerRadius[side] = m / 2;
                    }
                }

                ctx.beginPath();
                ctx.moveTo(x + cornerRadius.upperLeft, y);
                ctx.lineTo(x + w - cornerRadius.upperRight, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + cornerRadius.upperRight);
                ctx.lineTo(x + w, y + h - cornerRadius.lowerRight);
                ctx.quadraticCurveTo(x + w, y + h, x + w - cornerRadius.lowerRight, y + h);
                ctx.lineTo(x + cornerRadius.lowerLeft, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - cornerRadius.lowerLeft);
                ctx.lineTo(x, y + cornerRadius.upperLeft);
                ctx.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
                ctx.closePath();
            }, () => {
                //draw the rectagle without radius
                ctx.beginPath();
                ctx.rect(x, y, w, h);
            }]
        });

        //add the styles to the drawing
        _colorize(ctx, options && options.strokeSize != undefined);

        //remove all of the settings when done
        ctx.restore();
    }

    /**
     * draws an ellipse on the canvas
     * @name Sattee.ellipse
     * @param {Number} x the x cordinate of the drawing
     * @param {Number} y the y cordinate of the drawing
     * @param {Number} w the width of the drawing
     * @param {Number} h the height of the drawing
     * @param {Object} [options={}] You can specify the styling of the drawing 
     * @example
     * Sattee.draw(0,function(){
     *      //draws it with the default styles
     *      Sattee.ellipse(10,10,20,20);
     *      //add custom styles in the form of an object
     *      Sattee.ellipse(10,10,20,20,stylingObject);
     * });
     */
    Sattee.ellipse = function (x, y, w, h, options) {
        //validate all of the arguments
        _validateDrawingFunction("ellipse", [x, y, w, h]);

        //get the 2DContext of the current canvas layer
        let [ctx] = this.getCanvas();

        //save the current canvas drawing settings
        ctx.save();

        //manage the default options
        _manageDefaultDrawingOptions("ellipse", options, ctx);

        //mange some custom options
        _manageOptions("ellipse", options, {
            "center": ["boolean", () => { x -= w / 2; y -= h / 2 }]
        });

        // Draw the ellipse
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 90, 90); // w / 2 and h / 2 are cuz ctx.ellipse expects radius

        //add the styles to the drawing
        _colorize(ctx, options && options.strokeSize != undefined);

        //remove all of the settings when done
        ctx.restore();
    }

    /**
     * draws a rectangle on the canvas
     * @name Sattee.rect
     * @param {Number} x1 the x cordinate of the first point of the drawing
     * @param {Number} y1 the y cordinate of the first point of the drawing
     * @param {Number} x2 the x cordinate of the seccond point of the drawing
     * @param {Number} y2 the y cordinate of the seccond point of the drawing
     * @param {Number} x3 the x cordinate of the third point of the drawing
     * @param {Number} y3 the y cordinate of the third point of the drawing
     * @param {Object} [options={}] You can specify the styling of the drawing
     * @example
     * Sattee.draw(0,function(){
     *      //draws it with the default styles
     *      Sattee.triangle(10,10,20,20,30,30);
     *      //add custom styles in the form of an object
     *      Sattee.triangle(10,10,20,20,30,30,stylingObject);
     * });
     */
    Sattee.triangle = function (x1, y1, x2, y2, x3, y3, options) {
        //validate all of the arguments
        _validateDrawingFunction("triangle", [x1, y1, x2, y2, x3, y3]);

        //get the 2DContext of the current canvas layer
        let [ctx] = Sattee.getCanvas();

        //save the current canvas drawing settings
        ctx.save();

        //manage the default options
        _manageDefaultDrawingOptions("triangle", options, ctx);

        //manage additional options that change in other drawing function
        let fx = x1, fy = y1;   // final x , final y (where the drawing will be rotated)
        _manageOptions("triangle", options, {
            "rotateX": ["number", (rx) => { fx = rx }],
            "rotateY": ["number", (ry) => { fy = ry }],
            "rotate": ["number", (deg) => {
                Sattee.translate(Sattee.currentLayer, fx, fy, function () {
                    ctx.rotate(deg * Math.PI / 180)
                });
            }],
            "borderRadius": ["object", (radius) => {
                //draw a path (triangle like) with the given radiuses
                let cornerRadius = { A: 0, B: 0, C: 0, all: 0 };

                if (radius.all != undefined) {
                    for (let key in cornerRadius) {
                        cornerRadius[key] = radius.all;
                    }
                }
                else if (radius.A == undefined && radius.B == undefined && radius.C == undefined) {
                    throw new Error("There was an error in the borderRadius option in the Sattee.translate(); function");
                }

                for (var side in radius) {
                    cornerRadius[side] = radius[side];
                }

                _roundedPoly(ctx, [
                    {
                        x: x1,
                        y: y1,
                        radius: cornerRadius.A
                    },
                    {
                        x: x2,
                        y: y2,
                        radius: cornerRadius.B
                    },
                    {
                        x: x3,
                        y: y3,
                        radius: cornerRadius.C
                    }], cornerRadius.all);
            }, () => {
                //draw the triangle without border radius
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.lineTo(x1, y1);
            }]
        });

        //add the styles to the drawing
        _colorize(ctx, options && options.strokeSize != undefined);

        //remove all of the settings when done
        ctx.restore();
    }

    /**
     * draws a line on the canvas
     * @name Sattee.line
     * @param {Number} x1 the x cordinate of the first point of the drawing
     * @param {Number} y1 the y cordinate of the first point of the drawing
     * @param {Number} x2 the x cordinate of the seccond point of the drawing
     * @param {Number} y2 the y cordinate of the seccond point of the drawing
     * @param {Object} [options={}] You can specify the styling of the drawing
     * @example
     * Sattee.draw(0,function(){
     *      //draws it with the default styles
     *      Sattee.line(10,10,20,20);
     *      //add custom styles in the form of an object
     *      Sattee.line(10,10,20,20,stylingObject);
     * });
     */
    Sattee.line = function (x1, y1, x2, y2, options) {
        //validate all of the arguments
        _validateDrawingFunction("line", [x1, y1, x2, y2]);

        //get the 2DContext of the current canvas layer
        let [ctx] = this.getCanvas();

        //save the current canvas drawing settings
        ctx.save();

        //manage the default options
        _manageDefaultDrawingOptions("line", options, ctx);

        //manage additional options that change in other drawing function
        let fx = x1, fy = y1;   // final x , final y (where the drawing will be rotated)
        _manageOptions("line", options, {
            "rotateX": ["number", (rx) => { fx = rx }],
            "rotateY": ["number", (ry) => { fy = ry }],
            "rotate": ["number", (deg) => {
                Sattee.translate(Sattee.currentLayer, fx, fy, function () {
                    ctx.rotate(deg * Math.PI / 180)
                });
            }],
        });

        //draw the line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        //add the styles to the drawing
        _colorize(ctx, options && options.strokeSize != undefined);

        //remove all of the settings when done
        ctx.restore();
    }

    /**
     * The function draws a text on the current canvas
     * @name Sattee.text
     * @param {String} text the text you want to display
     * @param {Number} x the x cordinate
     * @param {Number} y the y cordinate
     * @param {Object} [options={}] the styling options
     * @param {Number} options.size This is a specific property for the text function that holds the fontSize
     * @example
     * Sattee.draw(1,function(){
     *      Sattee.text("Hello World",10,10,{
     *          size:20,
     *          strokeSize:5,
     *          strokeColor:"red",
     *          color:"gray",
     *          //etc.. 
     *      });
     * });
     */
    Sattee.text = function (text, x, y, options) {
        //validate all of the arguments
        Sattee.validate("text")
            .arguments([text, x, y], 3)
            .type([text, "string", x, "number", y, "number"]);

        //check if it is in the draw function
        Sattee.validate();

        //get the 2DContext of the current canvas layer
        let [ctx] = this.getCanvas();

        //save the current canvas drawing settings
        ctx.save();

        //manage additional options that change in other drawing function
        let fx = x, fy = y;   // final x , final y (where the drawing will be rotated)
        _manageOptions("text", options, {
            "rotateX": ["number", (rx) => { fx = rx }],
            "rotateY": ["number", (ry) => { fy = ry }],
            "rotate": ["number", (deg) => {
                Sattee.translate(Sattee.currentLayer, fx, fy, function () {
                    ctx.rotate(deg * Math.PI / 180)
                });
            }],
        });

        //manage text drawing options
        _manageOptions("text", options, {
            "size": ["number", () => { ctx.font = `${options.size}pt Sans-serif` }],
            "strokeSize": ["number", () => { ctx.lineWidth = options.strokeSize }],
            "strokeColor": ["string", () => {
                if (options.strokeSize != undefined) {
                    ctx.strokeStyle = options.strokeColor;
                    ctx.lineJoin = "miter";
                    ctx.miterLimit = 2;
                    ctx.strokeText(text, x, y);
                }
            }],
            "color": ["string", () => { ctx.fillStyle = options.color }]
        });

        //draw the text
        ctx.fillText(text, x, y);

        //remove all of the settings when done
        ctx.restore();
    }

    /**
     * The function calculates the width of a text at a specific size
     * @name Sattee.textWidth
     * @param {String} text the text you wish to mesure
     * @param {Number} size the size of the text you wish to mesure
     * @returns {Number} the width of the given text at the given size
     */
    Sattee.textWidth = function (text, size) {
        //validate arguments
        Sattee.validate("textWidth")
            .arguments([text, size], 2)
            .type([text, "string", size, "number"]);

        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.font = `${size}pt Sans-serif`;

        return ctx.measureText(text).width;
    }

    /**
     * The function calculates the height of a text at a specific size
     * @name Sattee.textHeight
     * @param {String} text the text you wish to mesure
     * @param {Number} size the size of the text you wish to mesure
     * @returns {Number} the height of the given text at the given size
     */
    Sattee.textHeight = function (text, size) {
        //validate arguments
        Sattee.validate("textHeight")
            .arguments([text, size], 2)
            .type([text, "string", size, "number"]);

        let div = document.createElement("div");
        div.innerHTML = text;
        div.style.position = 'absolute';
        div.style.top = '-9999px';
        div.style.left = '-9999px';
        div.style.fontFamily = "Sans-serif";
        div.style.fontWeight = 'normal';
        div.style.fontSize = size + 'pt'; // or 'px'
        document.body.appendChild(div);
        let height = div.offsetHeight;
        document.body.removeChild(div);
        return height;
    }

    /**
     * temporary sets the canvas (0,0) origin to whatever the x and y is given as an argument
     * @name Sattee.triangle
     * @param {Number} layer the canvas layer you will temporary translate
     * @param {Number} x the x you will translate by
     * @param {Number} y the y you will translate by
     * @param {Function} func all drawings in this function will ve translated
     */
    Sattee.translate = function (layer, x, y, func) {
        //validate all of the arguments
        Sattee.validate("translate")
            .arguments([layer, x, y, func], 4)
            .type([layer, "number", x, "number", y, "number", func, "function"])
            .range(layer, 0, this.layers - 1);

        //get the 2DContext of the current canvas layer
        let [ctx] = this.getCanvas(layer);

        //translate by x and y
        ctx.translate(x, y);
        //save the translate cordinates (used to corerctly clear or draw a background on the canvas)
        this.canvasArray[layer].translated = true;
        this.canvasArray[layer].x = x;
        this.canvasArray[layer].y = y;
        //call the function with all of the drawing stuff in it
        func.apply(this.scenes[this.currentScene]);
        //return the x and y back to it's normall state
        ctx.translate(-x, -y);
        //turn it back to 0,0 (or -x,-y)
        this.canvasArray[layer].translated = false;
        this.canvasArray[layer].x = -x;
        this.canvasArray[layer].y = -y;
    }

        /**
     * temporary scales the given canvas layer
     * @name Sattee.scale
     * @param {Number} layer the canvas layer you will temporary scale
     * @param {Number} scaleX the x you will scale by
     * @param {Number} scaleY the y you will scale by
     * @param {Function} func all drawings in this function will ve scaled
     */
    Sattee.scale = function (layer, scaleX, scaleY, func) {
        //validate all of the arguments
        Sattee.validate("translate")
            .arguments([layer, scaleX, scaleY, func], 4)
            .type([layer, "number", scaleX, "number", scaleY, "number", func, "function"])
            .range(layer, 0, this.layers - 1);
        
        //get the canvas context
        let [ctx] = this.getCanvas(layer);

        //temporary scale the canvas
        ctx.scale(scaleX,scaleY);

        //call the function with all of the drawing stuff
        func();

        //scale the canvas back
        ctx.scale(1 / scaleX,1 / scaleY);
    }
})();