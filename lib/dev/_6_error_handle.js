/**
 * @namespace ERROR_HANDELING
 */

/**
 * This function can check and validate the arguments of another function
 * @name Sattee.validate
 * @param {String} [funcName="Checks if you are in a draw function"] The name of the function that you wish to validate
 * @returns {Object} An object that holds all of the validation functions (used for chaining)
 * @example
 * //this will return an object that you can use to validate the function
 * let checkMyFunction = Sattee.validate(myFunction);
 * //you can now chain functions from the returned object
 */
Sattee.validate = function (funcName) {
    let check = {};
    check.msg = `There was an error in the Sattee.${funcName}(); function.\n`;

    if (!funcName && this.currentLayer == undefined)
        throw new Error("You are not allowed to draw on the canvas outside the Sattee.draw function");

    /**
     * checks if all arguments are defined and are the correct count
     * @name Sattee.validate.arguments
     * @param {Array} args all of the arguments
     * @param {Number} count the count that the arguments should be
     * @param {String} [e="not enough or invald arguments"] the error that will be displayed if something goes wrong  
     * @example
     * function myFunction(arg1,arg2,arg3){
     *      Sattee.validate("myFunction").arguments([arg1,arg2,arg3],3);
     * }
     */
    check.arguments = function (args, count, e) {
        let err = e || "not enough or invald arguments";
        let inv = false;

        //check if all of the arguments are valid
        for (let i = 0; i < args.length; i++) {
            if (args[i] === undefined) {
                inv = true;
                break;
            }
        }

        if (args.length != count || inv)
            throw new Error(this.msg + err);

        return this;
    }

    /**
     * validates true if a given number is bettween the given minimum and maximum
     * @name Sattee.validate.range
     * @param {Number} num the number that you are checking
     * @param {Number} min the minimum
     * @param {Number} max the maximum
     * @param {String} [e="one or more of the arguments with type of number is with invalid range"] the error that will be displayed if something goes wrong  
     * @example
     * function myFunction(arg1,arg2,arg3){
     *      //this will also throw an error if arg1 is not a number
     *      //so before that you should check the type of the arg1
     *      Sattee.validate("myFunction").range(arg1,-10,30);
     * }
     */
    check.range = function (num, min, max, e) {
        let err = e || "one or more of the arguments with type of number is with invalid range";

        if (num < min || num > max)
            throw new Error(this.msg + err);

        return this;
    }
    /**
     * validates true if a all of the given arguments are the correct given type
     * @name Sattee.validate.type
     * @param {Array} arr An array that holds all all data and types ex: [2,"number","myName","string",false,"boolean"]
     * @param {String} [e="wrong type of argument on one or more of the give arguments"] the error that will be displayed if something goes wrong  
     * @example
     * function myFunction(arg1,arg2,arg3){
     *      //check the type of each argument and then check if arg1 is a number
     *      Sattee.validate("myFunction")
     *          .type([arg1,"number",arg2,"string",arg3,"string"])
     *          .range(arg1,-10,30);
     * }
     */
    check.type = function (arr, e) {
        let err = e || "wrong type of argument on one or more of the give arguments";

        if (typeof arr == "string") {
            for (let arg of e) {
                if (typeof arg != arr) {
                    throw new Error(this.msg + err);
                }
            }
        }
        else {
            let inv = false;
            //check if all of the arguments are the given type
            for (let i = 0; i < arr.length; i += 2) {
                if (typeof arr[i] != arr[i + 1]) {
                    inv = true;
                    break;
                }
            }
            if (inv)
                throw new Error(this.msg + err);
        }
        return this;
    }
    return check;
}