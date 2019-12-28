/**
 * @namespace RENDERING (High-Level / Responsive)
 */


Sattee.optionsPercentages = function (options) {
    let p = {};
    if (options) {
        p.strokeSize = {
            percentage: options.strokeSize / Sattee.configHeight,
            multiplyer: "height",
        }
        p.size = {
            percentage: options.size / Sattee.configHeight,
            multiplyer: "height",
        }
    }
    return p;
}

class SRectangle {
    constructor(layer, x, y, w, h, options = {}) {
        //set def options
        options.strokeSize = options && options.strokeSize ? options.strokeSize : 0;

        this.layer = layer;

        //save values
        this.options = options;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //calculate the percentages by the given original size
        this.xP = x / Sattee.configWidth;
        this.yP = y / Sattee.configHeight;
        this.wP = w / Sattee.configWidth;
        this.hP = h / Sattee.configHeight;

        this.optionsP = Sattee.optionsPercentages(options);

        //calculate at start
        this.calcResponsiveValues();
    }

    calcResponsiveValues() {
        //calculate the new values on (resize) todo
        this.x = Sattee.width * this.xP;
        this.y = Sattee.height * this.yP;
        this.w = Sattee.width * this.wP;
        this.h = Sattee.height * this.hP;

        //calculate for every responsive option
        for (let opt in this.options) {
            let optP = this.optionsP[opt];
            if (optP) {
                this.options[opt] = Sattee[optP.multiplyer] * optP.percentage;
            }
        }
    }

    set(propObj) {
        for (let p in propObj) {
            // if its valid value of the same type
            if (this[p] != undefined && typeof (this[p]) == (typeof propObj[p])) {
                //for every valid property and not options
                if (p != "options") {
                    if (this[p + "P"]) {
                        let devider;

                        // i dont like this but.. it will do for now
                        if (p.includes("x") || p.includes("w")) {
                            devider = Sattee.configWidth;
                        } else if (p.includes("y") || p.includes("h")) {
                            devider = Sattee.configHeight;
                        }

                        // recalculate the percentage
                        this[p + "P"] = this[p] / devider;
                    } else {
                        // change directly
                        this[p] = propObj[p];
                    }
                }
            }
        }
    }

    clear(offset = 0) {
        Sattee.clear(this.layer, {
            x: this.x - offset - this.options.strokeSize,
            y: this.y - offset - this.options.strokeSize,
            width: this.w + offset * 2 + this.options.strokeSize * 2,
            height: this.h + offset * 2 + this.options.strokeSize * 2
        });
    }

    draw() {
        //get the most recent values before a draw
        this.calcResponsiveValues();
        Sattee.rect(this.x, this.y, this.w, this.h, this.options);
    }
}

class SEllipse {
    constructor(layer, x, y, w, h, options = {}) {
        //set def options
        options.strokeSize = options && options.strokeSize ? options.strokeSize : 0;

        this.layer = layer;

        //save values
        this.options = options;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //calculate the percentages by the given original size
        this.xP = x / Sattee.configWidth;
        this.yP = y / Sattee.configHeight;
        this.wP = w / Sattee.configWidth;
        this.hP = h / Sattee.configHeight;

        this.optionsP = Sattee.optionsPercentages(options);

        //calculate at start
        this.calcResponsiveValues();
    }

    calcResponsiveValues() {
        //calculate the new values on (resize) todo
        this.x = Sattee.width * this.xP;
        this.y = Sattee.height * this.yP;
        this.w = Sattee.width * this.wP;
        this.h = Sattee.height * this.hP;

        //calculate for every responsive option
        for (let opt in this.options) {
            let optP = this.optionsP[opt];
            if (optP) {
                this.options[opt] = Sattee[optP.multiplyer] * optP.percentage;
            }
        }
    }

    set(propObj) {
        for (let p in propObj) {
            // if its valid value of the same type
            if (this[p] != undefined && typeof (this[p]) == (typeof propObj[p])) {
                //for every valid property and not options
                if (p != "options") {
                    if (this[p + "P"]) {
                        let devider;

                        // i dont like this but.. it will do for now
                        if (p.includes("x") || p.includes("w")) {
                            devider = Sattee.configWidth;
                        } else if (p.includes("y") || p.includes("h")) {
                            devider = Sattee.configHeight;
                        }

                        // recalculate the percentage
                        this[p + "P"] = this[p] / devider;
                    } else {
                        // change directly
                        this[p] = propObj[p];
                    }
                }
            }
        }
    }

    clear(offset = 0) {
        Sattee.clear(this.layer, {
            x: this.x - offset - this.options.strokeSize,
            y: this.y - offset - this.options.strokeSize,
            width: this.w + offset * 2 + this.options.strokeSize * 2,
            height: this.h + offset * 2 + this.options.strokeSize * 2
        });
    }

    draw() {
        //get the most recent values before a draw
        this.calcResponsiveValues();
        Sattee.ellipse(this.x, this.y, this.w, this.h, this.options);
    }
}

class STriangle {
    constructor(layer, x1, y1, x2, y2, x3, y3, options = {}) {
        //set def options
        options.strokeSize = options && options.strokeSize ? options.strokeSize : 0;

        //save values
        this.layer = layer;
        this.options = options;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        //calculate the percentages by the given original size
        this.x1P = x1 / Sattee.configWidth;
        this.y1P = y1 / Sattee.configHeight;
        this.x2P = x2 / Sattee.configWidth;
        this.y2P = y2 / Sattee.configHeight;
        this.x3P = x3 / Sattee.configWidth;
        this.y3P = y3 / Sattee.configHeight;

        this.optionsP = Sattee.optionsPercentages(options);

        //calculate at start
        this.calcResponsiveValues();
    }

    calcResponsiveValues() {
        //calculate the new values on (resize) todo
        this.x1 = Sattee.width * this.x1P;
        this.y1 = Sattee.height * this.y1P;
        this.x2 = Sattee.width * this.x2P;
        this.y2 = Sattee.height * this.y2P;
        this.x3 = Sattee.width * this.x3P;
        this.y3 = Sattee.height * this.y3P;

        //calculate for every responsive option
        for (let opt in this.options) {
            let optP = this.optionsP[opt];
            if (optP) {
                this.options[opt] = Sattee[optP.multiplyer] * optP.percentage;
            }
        }
    }

    set(propObj) {
        for (let p in propObj) {
            // if its valid value of the same type
            if (this[p] != undefined && typeof (this[p]) == (typeof propObj[p])) {
                //for every valid property and not options
                if (p != "options") {
                    if (this[p + "P"]) {
                        let devider;

                        // i dont like this but.. it will do for now
                        if (p.includes("x") || p.includes("w")) {
                            devider = Sattee.configWidth;
                        } else if (p.includes("y") || p.includes("h")) {
                            devider = Sattee.configHeight;
                        }

                        // recalculate the percentage
                        this[p + "P"] = this[p] / devider;
                    } else {
                        // change directly
                        this[p] = propObj[p];
                    }
                }
            }
        }
    }

    clear(offset = 0) {
        let leftMost = Math.min(this.x1, this.x2, this.x3);
        let rightMost = Math.max(this.x1, this.x2, this.x3);
        let topMost = Math.min(this.y1, this.y2, this.y3);
        let bottomMost = Math.max(this.y1, this.y2, this.y3);;

        Sattee.clear(this.layer, {
            x: leftMost - offset - this.options.strokeSize,
            y: topMost - offset - this.options.strokeSize,
            width: rightMost + offset * 2 + this.options.strokeSize * 2,
            height: bottomMost + offset * 2 + this.options.strokeSize * 2
        });
    }

    draw() {
        //get the most recent values before a draw
        this.calcResponsiveValues();
        Sattee.triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.options);
    }
}

class SText {
    constructor(layer, text, x, y, options = {
        size: 20
    }) {
        //set def options
        options.strokeSize = options && options.strokeSize ? options.strokeSize : 0;

        //save values
        this.layer = layer;
        this.options = options;
        this.x = x;
        this.y = y;
        this.text = text;
        //calculate the percentages by the given original size
        this.xP = x / Sattee.configWidth;
        this.yP = y / Sattee.configHeight;

        this.optionsP = Sattee.optionsPercentages(options);

        //calculate at start
        this.calcResponsiveValues();
    }

    calcResponsiveValues() {
        //calculate the new values on (resize) todo
        this.x = Sattee.width * this.xP;
        this.y = Sattee.height * this.yP

        //calculate for every responsive option
        for (let opt in this.options) {
            let optP = this.optionsP[opt];
            if (optP) {
                this.options[opt] = Sattee[optP.multiplyer] * optP.percentage;
            }
        }
    }
    set(propObj) {
        for (let p in propObj) {
            // if its valid value of the same type
            if (this[p] != undefined && typeof (this[p]) == (typeof propObj[p])) {
                //for every valid property and not options
                if (p != "options") {
                    if (this[p + "P"]) {
                        let devider;

                        // i dont like this but.. it will do for now
                        if (p.includes("x") || p.includes("w")) {
                            devider = Sattee.configWidth;
                        } else if (p.includes("y") || p.includes("h")) {
                            devider = Sattee.configHeight;
                        }

                        // recalculate the percentage
                        this[p + "P"] = this[p] / devider;
                    } else {
                        // change directly
                        this[p] = propObj[p];
                    }
                }
            }
        }
    }

    clear(offset = 0) {
        let x = this.x - offset - this.options.strokeSize;
        let y = this.y - offset - this.options.strokeSize;
        let width = Sattee.textWidth(this.text, this.options.size) +
            offset * 2 + this.options.strokeSize * 2;
        let height = Sattee.textHeight(this.text, this.options.size) +
            offset * 2 + this.options.strokeSize * 2;

        Sattee.clear(this.layer, {
            x,
            y,
            width,
            height,
        });
    }
    draw() {
        //get the most recent values before a draw
        this.calcResponsiveValues();
        Sattee.text(this.text, this.x, this.y, this.options);
    }
}

class SImage {
    constructor(layer, imageName, x, y, w, h, options = {}) {
        //set def options
        options.strokeSize = options && options.strokeSize ? options.strokeSize : 0;
        //save values
        this.layer = layer;
        this.options = options;
        this.imageName = imageName;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //calculate the percentages by the given original size
        this.xP = x / Sattee.configWidth;
        this.yP = y / Sattee.configHeight;
        this.wP = w / Sattee.configWidth;
        this.hP = h / Sattee.configHeight;

        this.optionsP = Sattee.optionsPercentages(options);

        //calculate at start
        this.calcResponsiveValues();
    }

    calcResponsiveValues() {
        //calculate the new values on (resize) todo
        this.x = Sattee.width * this.xP;
        this.y = Sattee.height * this.yP;
        this.w = Sattee.width * this.wP;
        this.h = Sattee.height * this.hP;

        //calculate for every responsive option
        for (let opt in this.options) {
            let optP = this.optionsP[opt];
            if (optP) {
                this.options[opt] = Sattee[optP.multiplyer] * optP.percentage;
            }
        }
    }

    set(propObj) {
        for (let p in propObj) {
            //for every valid property and not options
            if (this[p] && p != "options") {
                // if its valid value of the same type
                if (typeof this[p] == typeof propObj[p]) {
                    let devider;

                    // i dont like this but.. it will do for now
                    if (p.includes("x") || p.includes("w")) {
                        devider = Sattee.configWidth;
                    } else if (p.includes("y") || p.includes("h")) {
                        devider = Sattee.configHeight;
                    }

                    // recalculate the percentage
                    this[p + "P"] = this[p] / devider;
                }
            }
        }
    }

    clear(offset = 0) {
        Sattee.clear(this.layer, {
            x: this.x - offset - this.options.strokeSize,
            y: this.y - offset - this.options.strokeSize,
            width: this.w + offset * 2 + this.options.strokeSize * 2,
            height: this.h + offset * 2 + this.options.strokeSize * 2
        });
    }

    draw() {
        //get the most recent values before a draw
        this.calcResponsiveValues();
        Sattee.image(this.imageName, this.x, this.y, this.w, this.h, this.options);
    }
}