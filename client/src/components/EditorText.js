import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/yonce.css'
import 'codemirror/mode/clike/clike.js'
import { Controlled as ControlledEditor } from 'react-codemirror2'
import './EditorText.css'
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/wrap/hardwrap';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/keymap/sublime.js';

export default function EditorText(props) {
    const {
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
                        keymap: 'sublime',
                        indentUnit: 4,
                        tabSize: 4,
                        indentWithTabs: true,
                        lineWrapping: true,
                        autofocus: true
                    }}
                />
            </div>
        </>
    );
};