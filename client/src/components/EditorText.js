import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/yonce.css';
import 'codemirror/mode/clike/clike.js';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { Nav } from 'react-bootstrap';
import 'react-dropdown/style.css';
import { Button } from 'react-bootstrap';
import './EditorText.css';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/matchesonscrollbar'
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

const buffers = [
  'Main',
  'Buffer 1',
  'Buffer 2',
  'Buffer 3',
  'Buffer 4',
  'Common',
];

export default function EditorText({
  project,
  bufferIdx,
  setBufferIdx,
  updateBufferCode,
  value,
  handleCompile,
  handleSave,
  ...props
}) {
  return (
    <>
      <div className='editor-container'>
        <button onClick={(e) => handleCompile()}>{'\u25B6'}</button>
        <div className='editor-title'>
          <Nav variant="pills" defaultActiveKey="Main" onSelect={(selectedKey) => { setBufferIdx(buffers.findIndex((b) => b === selectedKey)); }}>
            <Nav.Item> <Nav.Link eventKey="Common"> Common </Nav.Link> </Nav.Item>
            <Nav.Item> <Nav.Link eventKey="Main"> Main </Nav.Link> </Nav.Item>
            <Nav.Item> <Nav.Link eventKey="Buffer 1"> Buffer 1 </Nav.Link> </Nav.Item>
            <Nav.Item> <Nav.Link eventKey="Buffer 2"> Buffer 2 </Nav.Link> </Nav.Item>
            <Nav.Item> <Nav.Link eventKey="Buffer 3"> Buffer 3 </Nav.Link> </Nav.Item>
            <Nav.Item> <Nav.Link eventKey="Buffer 4"> Buffer 4 </Nav.Link> </Nav.Item>
          </Nav>
          <Button variant='secondary' onClick={handleSave}>
            SAVE
          </Button>
        </div>
        <ControlledEditor
          onBeforeChange={updateBufferCode}
          value={project.code[bufferIdx]}
          className='code-mirror-wrapper'
          options={{
            viewportMargin: Infinity,
            lineNumbers: true,
            matchBrackets: true,
            mode: 'x-shader/x-fragment',
            gutters: 'CodeMirror-foldgutter',
            autoCloseBrackets: true,
            showCursorWhenSelecting: true,
            theme: 'yonce',
            keymap: 'sublime',
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: true,
            lineWrapping: true,
            autofocus: true,
          }}
        />
      </div>
    </>
  );
}
