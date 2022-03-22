import antlr4 from 'antlr4';

import CLexer from '../../c_grammar_js/CLexer';
import CVisitor from '../../c_grammar_js/CVisitor';
import CParser from '../../c_grammar_js/CParser';

const {ErrorListener} = require('antlr4/src/antlr4/error/ErrorListener');

let error = null;
let translatedCode = null;
let variables = new Map();
let tabs = 0;

export default function handler(req, res){
    error = null;
    translatedCode = null;
    variables.clear();

    class CustomError extends ErrorListener{
        syntaxError(recognizer, offendingSymbol, line, charPositionInLIne, msg, e){
            error = {error: `ERROR [${line}, ${charPositionInLIne}]: ${msg}`};
        }
    }

    class CCustomVisitor extends CVisitor
    {
        printTabs(){
            let tabsString = "";
    
            for(let t = 0; t < tabs; t++){
                tabsString += "\t";
            }
    
            return tabsString;
        }

        visitProgram(ctx){
            translatedCode = "";
            return this.visit(ctx.main(0));
        }

        visitMain(ctx)
        {
            tabs++;
            translatedCode += "main{\n";

            ctx.statement().forEach(statement => {

                if(statement.getChild(0) !== null)
                {
                    translatedCode += this.printTabs() + this.visit(statement.getChild(0));
                }
                else{
                    parser.notifyErrorListeners(`No viable alternative at input '${statement.start.text}'.`, statement.start, null);
                }
            });
            tabs--;

            return translatedCode += "}\n";
        }

        visitDeclaration(ctx)
        {
            if(!variables.has(ctx.ID().getText()))
            {
                variables.set(ctx.ID().getText(), null);
                return "var " + ctx.ID().getText() + "\n";
            }
            else
            {
                parser.notifyErrorListeners(`Variable '${ctx.ID().getText()}' declared already.`, ctx.ID().token, null);
            }
        }

        visitAssignment(ctx)
        {
            if(variables.has(ctx.ID().getText()))
            {
                this.visit(ctx.expression());
                return ctx.ID().getText() + " = " + ctx.expression().getText() + "\n";
            }
            else
            {
                parser.notifyErrorListeners(`Variable '${ctx.ID().getText()}' not declared.`, ctx.ID().token, null);
            }
        }

        visitIdExp(ctx)
        {
            if(!variables.has(ctx.ID().getText()))
            {
                parser.notifyErrorListeners(`Variable '${ctx.ID().getText()}' not declared.`, ctx.ID().token, null);
            }
          }

        visitPrint(ctx)
        {
            this.visit(ctx.expression());
            return "print " + ctx.expression().getText() + "\n";
        }

        visitIfelse(ctx) {
            let ifElseString = "";
            ifElseString = this.visit(ctx.getChild(0)).toString();
    
            if(ctx.children.length > 1)
                for (let c = 1; c < ctx.children.length; c++) {
                    ifElseString += this.printTabs() + this.visit(ctx.getChild(c));
                }
            
            return ifElseString;
        }

        visitIfNoBraces(ctx) {
            tabs++;
            let ifStatement = "";
            ifStatement = "if " + this.visit(ctx.condition()) + "\n" + (ctx.statement() != null ? this.printTabs() + this.visit(ctx.statement().getChild(0)) : "");
            tabs--;  
            return ifStatement; 
        }

        visitIfBraces(ctx) {
            let ifStatement = "";
            ifStatement = "if " + this.visit(ctx.condition()) + "\n" + this.printTabs() + "{\n";
            tabs++;
    
            ctx.statement().forEach(statement => {
                if(statement != null){
                    ifStatement += this.printTabs() + this.visit(statement.getChild(0));
                }
            });
    
            tabs--;
            return ifStatement + this.printTabs() + "}\n";
        }

        visitElseNoBraces(ctx) {
            tabs++;
            let elseStatement = "";
            elseStatement = "else\n" + (ctx.statement() != null ? this.printTabs() + this.visit(ctx.statement().getChild(0)) : "");
            tabs--;  
            return elseStatement;
        }

        visitElseBraces(ctx) {

            let elseStatement = "";
            elseStatement = "else\n" + this.printTabs() + "{\n";
            tabs++;
    
            ctx.statement().forEach(statement => {
                if(statement != null){
                    elseStatement += this.printTabs() + this.visit(statement.getChild(0));
                }
            });
    
            tabs--;
            return elseStatement + this.printTabs() + "}\n";
        }

        visitElseifNoBraces(ctx) {
            tabs++;
            let elseifStatement = "";
            elseifStatement = "else if " + this.visit(ctx.condition()) + "\n" + (ctx.statement() != null ? this.printTabs() + this.visit(ctx.statement().getChild(0)) : "");
            tabs--;  
            return elseifStatement;
        }

        visitElseifBraces(ctx) {
            let elseifStatement = "";
            elseifStatement = "else if " + this.visit(ctx.condition()) + "\n" + this.printTabs() + "{\n";
            tabs++;
    
            ctx.statement().forEach(statement => {
                if(statement != null){
                    elseifStatement += this.printTabs() + this.visit(statement.getChild(0));
                }
            });
    
            tabs--;
            return elseifStatement + this.printTabs() + "}\n";
        }

        visitExpCond(ctx) {
            this.visit(ctx.expression(0));
            this.visit(ctx.expression(1));
            return ctx.expression(0).getText() + " " + ctx.lo().getText() + " " + ctx.expression(1).getText();
        }

        visitParenCond(ctx)
        {
            return "(" + this.visit(ctx.condition()) + ")";
        }

        visitCondCond(ctx)
        {
            return this.visit(ctx.condition(0)) + " " + ctx.lo().getText() + " " + this.visit(ctx.condition(1));
        }

        visitTrueCond(ctx)
        {
            return ctx.TRUE().getText();
        }

        visitFalseCond(ctx)
        {
            return ctx.FALSE().getText();
        }
    }

    const chars = new antlr4.InputStream(JSON.parse(req.body).code);
    const lexer = new CLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new CParser(tokens);
    parser.removeErrorListeners();
    parser.addErrorListener(new CustomError());
    parser.buildParseTrees = true;

    const tree = parser.program();
    const visitor = new CCustomVisitor();
    visitor.visit(tree);

    if(error)
        res.status(200).json(error);
    else{
        res.status(200).json({ code : translatedCode });
    }
}