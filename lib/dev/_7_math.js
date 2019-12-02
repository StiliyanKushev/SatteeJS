/**
 * @namespace MATH
 */

/**
 * calculates the distance between 2 points
 * @name Sattee.distance
 * @param {Number} x1 x of first point
 * @param {Number} y1 y of first point
 * @param {Number} x2 x of second point
 * @param {Number} y2 y of second point 
 * @returns {Number} The distance between the 2 points
 */
Sattee.distance = function (x1, y1, x2, y2) {
    Sattee.validate("distance")
        .arguments([x1, y1, x2, y2], 4);
    
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}


/**
 * calculates the position of a point in the middle of 2 points
 * @name Sattee.midPoint
 * @param {Number} x1 x of first point
 * @param {Number} y1 y of first point
 * @param {Number} x2 x of second point
 * @param {Number} y2 y of second point 
 * @returns {Object} A point that is in the middle of the 2 given points
 */
Sattee.midPoint = function (x1, y1, x2, y2) {
    let x = 0;
    let y = 0;

    let distance = this.distance(x1, y1, x2, y2);

    if (x1 > x2)
        x = x1 + distance / 2;
    else if (x2 > x1) x = x2 - distance / 2;
    else x = x1;
    if (y1 > y2)
        y = y1 + distance / 2;
    else if (y2 > y1) y = y2 - distance / 2;
    else y = y1;
    return { x, y }
}

//generates a random unique ID
Sattee.generateNewId = function(){
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 10)).toUpperCase();     
}

Sattee.random = function(start,range){
    return Math.floor(start + Math.random() * (range - start));
}