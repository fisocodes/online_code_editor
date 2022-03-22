import AceEditor from 'react-ace';

function Editor(props){
    return <AceEditor className={props.classname} value={props.value} onChange={props.handleEditorChange} readOnly={props.readonly} showGutter={props.showgutter} showPrintMargin={props.margin}/>
}

export default Editor;