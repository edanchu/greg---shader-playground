import React, { useState } from 'react';
import EditorText from '../components/EditorText'
import './Editor.css';


export default function Editor() {
    const [js, setJs] = useState('')
    const [GLSL, setGLSL] = useState('')
    const srcDoc = `
        <html>
            <html> </html>
            <script> ${js}  </script>
        </html>    
    
    
    `
  return (
    <>
        <div className="pane top-pane">
            <EditorText
              language = "javascript"
              displayName="Buffer1"
              value={js}
              onChange={setJs}
            />
        </div>
        <div className="pane screen">
            <iframe
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder={0}
                width="100%"
                height="100%"
                className='output'
            />
        </div>
    </>
  );
}