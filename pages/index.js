import Editor from "@monaco-editor/react";
import MenuBar from "../components/menubar";
import { useState } from "react";

function App(){
    const [output, setOutput] = useState("");
    const [code, setCode] = useState("");
    const [translatedCode, setTranslatedCode] = useState("");

    const handleEditorChange = (value) => {
        setCode(value);
    }

    const handleTranslateChange = (nv) => {
        setTranslatedCode(nv);
    }

    const handleTranslate = async () => {
        if(code !== ""){
            const response = await fetch(
                '/api/translate',
                {
                    method: 'POST',
                    body: JSON.stringify({code : code})
                }
            );
    
            const jsonResponse = await response.json();
            if(jsonResponse.code)
            {
                setTranslatedCode(jsonResponse.code)
            }
            else
            {
                setOutput(jsonResponse.error);
                setTranslatedCode("");
            }
        }else{
            setOutput("No code to run...");
            setTranslatedCode("");
        }
    }

    const handleClear = () => {
        setOutput("");
    }

    return(
        <div className="main-div">
            <MenuBar handleTranslate={handleTranslate} handleClear={handleClear}/>
            <div className="editor-container">
                <Editor onChange={handleEditorChange} height="60vh" theme="vs-dark"/>
                <Editor value={translatedCode} onChange={handleTranslateChange} height="60vh"/>
            </div>
            <Editor value={output} height="25vh"/>
        </div>
    )
}

export default App;