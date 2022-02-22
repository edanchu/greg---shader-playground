import React, { useState } from 'react';
import EditorText from '../components/EditorText';
import './Editor.css';
import GraphicsComponent from '../components/graphics_component';

export default function Editor({ project: p }) {
  const [project, setProject] = useState(p ?? emptyProject);
  const [glsl, setGlsl] = useState('');
  const [mainFragShader, setMainFragShader] = useState('');

  function handleCompile(value) {
    setMainFragShader(value);
  }

  return (
    <>
      <div className='pane top-pane'>
        <EditorText
          language='glsl'
          displayName='Buffer1'
          value={glsl}
          onChange={setGlsl}
          handleCompile={handleCompile}
        />
      </div>
      <div className='pane screen'>
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

const emptyProject = {
  owner: null,
  ownerName: null,
  title: 'New Project',
  description: 'Welcome to your new project!',
  likes: 0,
  public: false,
  code: [
    'void mainImage(out vec4 FragColor) {\n        float color = (1.0 + sin(iTime)) / 2.0;\n        FragColor = vec4(color, 1.0 - color, cos(color), 1.0);\n      }',
    'void mainImage(out vec4 FragColor){\n        FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n      }',
    'void mainImage(out vec4 FragColor){\n        FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n      }',
    'void mainImage(out vec4 FragColor){\n        FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n      }',
    'void mainImage(out vec4 FragColor){\n        FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n      }',
    'vec2 sampleFunction( vec2 input1, float input2 ){\n        return input1 * input2;\n      }',
  ],
  channelUniforms: [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ],
};
