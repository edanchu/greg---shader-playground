import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EditorText from '../components/EditorText';
import './Editor.css';
import GraphicsComponent from '../components/graphics_component';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

export default function Editor() {
  let { id } = useParams();

  const [project, setProject] = useState(id ? null : defaultProject);
  const [compiledCode, setCompiledCode] = useState(
    id ? null : defaultProject.code
  );
  const [bufferIdx, setBufferIdx] = useState(0);

  useEffect(() => {
    if (id) {
      axios.get('/user/get-project/' + id).then((res) => {
        setProject(res.data);
        setCompiledCode(res.data.code);
      });
    }
  }, []);

  function updateBufferCode(editor, data, value) {
    setProject({
      ...project,
      code: project.code.map((c, i) => {
        if (i === bufferIdx) return value;
        return c;
      }),
    });
  }

  function handleCompile() {
    setCompiledCode(project.code);
  }

  if (!project || !compiledCode) return <></>;

  return (
    <Container>
      {/* <div className='pane top-pane'> */}
      <Row>
        {/* </div> */}
        {/* <div className='pane screen'> */}
        <Col>
          <GraphicsComponent
            height={480}
            pause={false}
            playOnMouseOver={false}
            showButtons={true}
            commonFragShaderCustomCode={compiledCode[5]}
            finalFragShaderCustomCode={compiledCode[0]}
            buffer1FragShaderCustomCode={compiledCode[1]}
            buffer2FragShaderCustomCode={compiledCode[2]}
            buffer3FragShaderCustomCode={compiledCode[3]}
            buffer4FragShaderCustomCode={compiledCode[4]}
            channels={project.channelUniforms}
          />
          <h1 style={{ position: 'absolute', top: '600px', left: '20px' }}>
            {project.title}
          </h1>
          <h3 style={{ position: 'absolute', top: '640px', left: '20px' }}>
            {project.ownerName}
          </h3>
          <p style={{ position: 'absolute', top: '680px', left: '20px' }}>
            {project.description}
          </p>
        </Col>
      </Row>
      {/* </div> */}
      <Col>
        <div style={{ height: 'calc(100vh - 100px)' }}>
          <EditorText
            project={project}
            bufferIdx={bufferIdx}
            setBufferIdx={setBufferIdx}
            updateBufferCode={updateBufferCode}
            language='glsl'
            handleCompile={handleCompile}
          />
        </div>
      </Col>
    </Container>
  );
}

const defaultProject = {
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
