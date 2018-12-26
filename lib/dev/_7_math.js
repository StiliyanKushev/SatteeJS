Sattee.distance = function (x1, y1, x2, y2) {
    Sattee.validate("distance")
        .arguments([x1, y1, x2, y2], 4);

    try {
        Sattee.validate("distance")
            .type("number", [x1, y1, x2, y2])
        let a = x1 - x2;
        let b = y1 - y2;
        return Math.sqrt(a * a + b * b);
    } catch (err) {
        // Then they should be vectors (i should check if they are)
        //TODO WORK WIT VECTORS
    }
}

Sattee.midPoint = function(x1,y1,x2,y2){
    let x = 0;
    let y = 0;

    let distance = this.distance(x1,y1,x2,y2);

    if(x1 > x2)
    x = x1 + distance / 2;
    else if(x2 > x1) x = x2 - distance / 2;
    else x = x1;
    if(y1 > y2)
    y = y1 + distance / 2;
    else if(y2 > y1) y = y2 - distance / 2;
    else y = y1;
    return {x,y}
}