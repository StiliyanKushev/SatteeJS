/**
 * @namespace RENDERING (High-Level / Responsive)
 */

class SResponsiveDrawable {
    constructor(inputObj) {
        this.options = inputObj.options;
        this.layer = inputObj.layer;
        this.x = inputObj.x;
        this.y = inputObj.y;
        this.w = inputObj.w;
        this.h = inputObj.h;
        this.x1 = inputObj.x1;
        this.y1 = inputObj.y1;
        this.x2 = inputObj.x2;
        this.y2 = inputObj.y2;
        this.x3 = inputObj.x3;
        this.y3 = inputObj.y3;
        this.text = inputObj.text;
        this.textSize = inputObj.options && inputObj.options.size ?
            inputObj.options.size :
            undefined;
        this.font = inputObj.options && inputObj.options.font ?
            inputObj.options.font :
            undefined;
        this.strokeSize =
            inputObj.options && inputObj.options.strokeSize ?
            inputObj.options.strokeSize :
            undefined;
        this.borderRadius =
            inputObj.options && inputObj.options.borderRadius ?
            inputObj.options.borderRadius :
            undefined;

        //calculate the percent values relative to the game ratio
        this.xPercent = inputObj.x / Sattee.width;
        this.yPercent = inputObj.y / Sattee.height;
        this.x1Percent = inputObj.x1 / Sattee.width;
        this.y1Percent = inputObj.y1 / Sattee.height;
        this.x2Percent = inputObj.x2 / Sattee.width;
        this.y2Percent = inputObj.y2 / Sattee.height;
        this.x3Percent = inputObj.x3 / Sattee.width;
        this.y3Percent = inputObj.y3 / Sattee.height;
        this.wPercent = inputObj.w / Sattee.width;
        this.hPercent = inputObj.h / Sattee.height;
        this.borderRadiusPercents = {};
        this.strokeSizePercent;
        this.textSize;

        if (this.borderRadius) {
            // this.borderRadiusPercents = this.borderRadius / Sattee.height;
            for (let key in this.borderRadius) {
                let value = this.borderRadius[key];
                this.borderRadiusPercents[key] = value / Sattee.height;
            }
        }

        if (this.strokeSize) {
            this.strokeSizePercent = this.strokeSize / Sattee.height;
        }

        if (this.textSize) {
            this.textSizePercent = this.textSize / Sattee.height;
        }

        this.calcResponsiveValues();
    }
    calcResponsiveValues() {
        this.x = Sattee.width * this.xPercent;
        this.y = Sattee.height * this.yPercent;
        this.x1 = Sattee.width * this.x1Percent;
        this.y1 = Sattee.height * this.y1Percent;
        this.x2 = Sattee.width * this.x2Percent;
        this.y2 = Sattee.height * this.y2Percent;
        this.x3 = Sattee.width * this.x3Percent;
        this.y3 = Sattee.height * this.y3Percent;
        this.w = Sattee.width * this.wPercent;
        this.h = Sattee.height * this.hPercent;

        if (this.borderRadius) {
            //this.borderRadius = Sattee.height * this.borderRadiusPercent;
            for (let key in this.borderRadius) {
                this.borderRadius[key] = Sattee.height * this.borderRadiusPercents[key];
            }
            this.options.borderRadius = this.borderRadius;
        }

        if (this.strokeSize) {
            this.strokeSize = Sattee.height * this.strokeSizePercent;
            this.options.strokeSize = this.strokeSize;
        }

        if (this.textSize) {
            //make it responsive
            this.textSize = Sattee.height * this.textSizePercent;
            this.options.size = this.textSize;
        }
    }
}

class SEllipse extends SResponsiveDrawable {
    constructor(layer, x, y, w, h, options) {
        super({
            layer,
            x,
            y,
            w,
            h,
            options
        });
    }

    draw() {
        //get the most recent values before a draw
        this.calcResponsiveValues();
        let that = this;
        Sattee.draw(this.layer, function () {
            Sattee.ellipse(that.x, that.y, that.w, that.h, that.options);
        });
    }
}

class SRectangle extends SResponsiveDrawable {
    constructor(layer, x, y, w, h, options) {
        super({
            layer,
            x,
            y,
            w,
            h,
            options
        });
    }

    draw() {
        //get the most recent values before a draw
        this.calcResponsiveValues();
        let that = this;
        Sattee.draw(this.layer, function () {
            Sattee.rect(that.x, that.y, that.w, that.h, that.options);
        });
    }
}

class STriangle extends SResponsiveDrawable {
    constructor(layer, x1, y1, x2, y2, x3, y3, options) {
        super({
            layer,
            x1,
            y1,
            x2,
            y2,
            x3,
            y3,
            options
        });
    }

    draw() {
        //get the most recent values before a draw
        this.calcResponsiveValues();
        let that = this;
        Sattee.draw(this.layer, function () {
            Sattee.triangle(that.x1, that.y1, that.x2, that.y2, that.x3, that.y3, that.options);
        });
    }
}

class SText extends SResponsiveDrawable {
    constructor(layer, text, x, y, options) {
        super({
            layer,
            text,
            x,
            y,
            options
        });
        this.center = false;
        if (options && options.center) this.center = options.center;
    }

    draw() {
        //get the most recent values before a draw
        this.calcResponsiveValues();
        if (this.center) {
            this.x -= this.width / 2;
            this.y += this.height / 20 + this.height / 4;
        }
        let that = this;
        Sattee.draw(this.layer, function () {
            Sattee.text(that.text, that.x, that.y, that.options);
        });
    }

    get width() {
        return Sattee.textWidth(this.text, this.textSize);
    }

    get height() {
        return Sattee.textHeight(this.text, this.textSize);
    }
}