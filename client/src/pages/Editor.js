import React, { useState } from 'react';
import EditorText from '../components/EditorText'
import './Editor.css';
import GraphicsComponent from '../components/graphics_component'

export default function Editor() {
  const [glsl, setGlsl] = useState('')
  const [mainFragShader, setMainFragShader] = useState('')

  function handleCompile(value) {
    setMainFragShader(value);
  }

  return (
    <>
      <div className="pane top-pane">
        <EditorText
          language="glsl"
          displayName="Buffer1"
          value={glsl}
          onChange={setGlsl}
          handleCompile={handleCompile}
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