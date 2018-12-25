//##########################################################//
//####### HERE IS ALL OF THE ERROR HANDELING STUFF #########//
//##########################################################//

Sattee.validate = function (funcName) {
    check = {};
    check.msg = `There was an error in the Sattee.${funcName}(); function.\n`;
    
    if (this.currentLayer == undefined)
    throw new Error("You are not allowed to draw on the canvas outside the Sattee.draw function");

    check.arguments = function (args, count,e) {
        let err = e || "not enough or invald arguments";
        let inv = false;

        //check if all of the arguments are valid
        for(let i = 0; i < args.length;i++){
            if(args[i] === undefined){
                inv = true;
                break;
            }
        }

        if(args.length != count || inv)
        throw new Error(this.msg + err);

        return this;
    }

    check.range = function (num, min, max,e) {
        let err = e || "one or more of the arguments with type of number is with invalid range";
        
        if(num < min || num > max)
        throw new Error(this.msg + err);
        
        return this;
    }

    check.type = function (arr,e) {
        let err = e || "wrong type of argument on one or more of the give arguments";
        
        let inv = false;

        //check if all of the arguments are the given type
        for(let i = 0; i < arr.length;i+=2){
            if(typeof arr[i] != arr[i + 1]){
                inv = true;
                break;
            }
        }

        if(inv)
        throw new Error(this.msg + err);
        
        return this;
    }
    return check;
}