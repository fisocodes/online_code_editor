import antlr4 from 'antlr4';
import CLexer from '../c_grammar_js/CLexer';
import CParser from '../c_grammar_js/CParser';
import CCustomVisitor from '../c_grammar_js/CCustomVisitor';

class CTranslator{

    static translate(code, errorListener){

        const chars = new antlr4.InputStream(code);
        const lexer = new CLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new CParser(tokens);
        parser.removeErrorListeners();
        parser.addErrorListener(errorListener);
        parser.buildParseTrees = true;

        const tree = parser.program();

        const visitor = new CCustomVisitor();

        return visitor.visit(tree);
    }
}

export default CTranslator;