import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
import '../assets/glsl'
import { Controlled as ControlledEditor } from 'react-codemirror2'
import './EditorText.css'

export default function EditorText(props) {
    const {
        language,
        displayName,
        value,
        onChange,
    } = props
    function handleChange(editor, data, value) {
        onChange(value)
    }
    return (
        <>
            <div className='editor-container'>
                <button onClick={(e) => props.handleCompile(value)}>{'\u25B6'}</button>
                <div className='editor-title'>
                    {displayName}
                </div>
                <ControlledEditor
                    onBeforeChange={handleChange}
                    value={value}
                    className="code-mirror-wrapper"
                    options={{
                        lineWrapping: true,
                        lint: true,
                        mode: language,
                        theme: 'material',
                        lineNumbers: true
                    }}
                />
            </div>
        </>
    );
};