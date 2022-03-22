const {ErrorListener} = require('antlr4/src/antlr4/error/ErrorListener');

let res;

class CustomError extends ErrorListener{

    constructor(res){
        super();
        this.res = res;
    }

    syntaxError(recognizer, offendingSymbol, line, charPositionInLIne, msg, e){
        res.json({error : msg});
    }
}

export default CustomError;