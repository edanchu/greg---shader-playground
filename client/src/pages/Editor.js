import React, { useState } from 'react';
import EditorText from '../components/EditorText'
import './Editor.css';
import GraphicsComponent from '../components/graphics_component'
import CodeMirror, { Doc } from 'codemirror';

export default function Editor() {
    const [js, setJs] = useState('')
    const [glsl, setGlsl] = useState('')
    const [mainFragShader] = useState('')

    return (
    <>
        <div className="pane top-pane">
            <EditorText
              language = "glsl"
              displayName="Buffer1"
              value={glsl}
              onChange={setGlsl}
            />
        </div>
        <div className="pane screen">
            <GraphicsComponent
             height={480}
             pause={false}
             playOnMouseOver={false}
             showButtons={true}
             finalFragShaderCustomCode={mainFragShader}
             />
        </div>
    </>
  );
}