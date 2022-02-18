import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/yonce.css'
import 'codemirror/mode/clike/clike.js'
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
                        viewportMargin: Infinity,
                        lineNumbers: true,
                        matchBrackets: true,
                        mode: 'x-shader/x-fragment',
                        autoCloseBrackets: true,
                        showCursorWhenSelecting: true,
                        theme: 'yonce',
                        dragDrop: false,
                        indentUnit: 4,
                        tabSize: 4,
                        indentWithTabs: true,
                        lineWrapping: true,
                    }}
                />
            </div>
        </>
    );
};