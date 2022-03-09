import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/yonce.css';
import 'codemirror/mode/clike/clike.js';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { Nav } from 'react-bootstrap';
import 'react-dropdown/style.css';
import { Button } from 'react-bootstrap';
import './EditorText.css';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/wrap/hardwrap';
import 'codemirror/keymap/sublime';

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
  user,
  ...props
}) {
  return (
    <>
      <div className='editor-container'>
        <button onClick={(e) => handleCompile()}>{'\u25B6'}</button>
        <div className='editor-title'>
          <Nav
            variant='pills'
            defaultActiveKey='Main'
            onSelect={(selectedKey) => {
              setBufferIdx(buffers.findIndex((b) => b === selectedKey));
            }}
          >
            <Nav.Item>
              {' '}
              <Nav.Link eventKey='Common'> Common </Nav.Link>{' '}
            </Nav.Item>
            <Nav.Item>
              {' '}
              <Nav.Link eventKey='Main'> Main </Nav.Link>{' '}
            </Nav.Item>
            <Nav.Item>
              {' '}
              <Nav.Link eventKey='Buffer 1'> Buffer 1 </Nav.Link>{' '}
            </Nav.Item>
            <Nav.Item>
              {' '}
              <Nav.Link eventKey='Buffer 2'> Buffer 2 </Nav.Link>{' '}
            </Nav.Item>
            <Nav.Item>
              {' '}
              <Nav.Link eventKey='Buffer 3'> Buffer 3 </Nav.Link>{' '}
            </Nav.Item>
            <Nav.Item>
              {' '}
              <Nav.Link eventKey='Buffer 4'> Buffer 4 </Nav.Link>{' '}
            </Nav.Item>
          </Nav>
          <Button variant='secondary' onClick={handleSave} style={{ marginRight: '10px' }}>
            {!project.owner || user?._id === project.owner ? 'SAVE' : 'FORK'}
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
            autoCloseBrackets: true,
            showCursorWhenSelecting: true,
            theme: 'yonce',
            keymap: 'sublime',
            extraKeys: { 'Ctrl-/': 'toggleComment', 'Alt-S': handleCompile },
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: true,
            lineWrapping: true,
            autofocus: false,
          }}
        />
      </div>
    </>
  );
}
