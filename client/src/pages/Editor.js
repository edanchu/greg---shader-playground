import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import EditorText from '../components/EditorText';
import TextureSelector from '../components/TextureSelector';
import './Editor.css';
import GraphicsComponent from '../components/graphics_component';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Texture } from 'three';
import SignLogInModal from '../components/SignLogInModal';

export default function Editor({ setUser }) {
  let { id } = useParams();
  let navigate = useNavigate();

  const [project, setProject] = useState(id ? null : defaultProject);
  const [lastSaved, setLastSaved] = useState(null);
  const [compiledCode, setCompiledCode] = useState(
    id ? null : defaultProject.code
  );
  const [bufferIdx, setBufferIdx] = useState(0);
  const [showSignLogInModal, setShowSignLogInModal] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get('/api/user/get-project/' + id).then((res) => {
        setProject(res.data);
        setLastSaved(res.data);
        setCompiledCode(res.data.code);
        setBufferIdx(0);
      });
    }
    if (!id) {
      setProject(defaultProject);
      setCompiledCode(defaultProject.code);
      setBufferIdx(0);
    }
  }, [id]);

  function updateBufferCode(editor, data, value) {
    setProject({
      ...project,
      code: project.code.map((c, i) => {
        if (i === bufferIdx) return value;
        return c;
      }),
    });
  }

  function updateChanUniforms(chan, file) {
    setProject({
      ...project,
      channelUniforms: project.channelUniforms.map((c, i) => {
        if (i === bufferIdx)
          return c.map((u, u_i) => {
            if (u_i === chan) return file;
            return u;
          });
        return c;
      }),
    });
  }

  function handleCompile() {
    setCompiledCode(project.code);
  }

  function handleSave() {
    axios
      .get('/api/user/authenticated')
      .then((res) => {
        if (project.owner === res.data.user._id) {
          console.log('saving project...', project);
          axios
            .put('/api/user/update-project/' + project._id, project)
            .then((res) => {
              console.log('successful save!');
              setLastSaved(project);
            })
            .catch((err) => console.log(err));
        } else {
          console.log('forking/adding project...');
          axios
            .post(
              '/api/user/add-project/',
              project.owner
                ? {
                    ...project,
                    title: 'Copy of: ' + project.title,
                    description:
                      'This is a copy of ' +
                      project.title +
                      ' by ' +
                      project.ownerName,
                    owner: res.data.user._id,
                    ownerName: res.data.user.username,
                    likes: 0,
                  }
                : {
                    ...project,
                    owner: res.data.user._id,
                    ownerName: res.data.user.username,
                    likes: 0,
                  }
            )
            .then((res) => {
              console.log('successfully added/forked project');
              return navigate('/Editor/' + res.data._id);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('sign up/in to save this project');
        setShowSignLogInModal(true);
      });
  }

  function onSignLogIn(user) {
    if (project.owner === user._id) {
      console.log('saving project...', project);
      axios
        .put('/api/user/update-project/' + project._id, project)
        .then((res) => {
          console.log('successful save!');
          setLastSaved(project);
        })
        .catch((err) => console.log(err));
    } else {
      console.log('forking/adding project...');
      axios
        .post(
          '/api/user/add-project/',
          project.owner
            ? {
                ...project,
                title: 'Copy of: ' + project.title,
                description:
                  'This is a copy of ' +
                  project.title +
                  ' by ' +
                  project.ownerName,
                owner: user._id,
                ownerName: user.username,
                likes: 0,
              }
            : {
                ...project,
                owner: user._id,
                ownerName: user.username,
                likes: 0,
              }
        )
        .then((res) => {
          console.log('successfully added/forked project');
          return navigate('/Editor/' + res.data._id);
        })
        .catch((err) => console.log(err));
    }
  }

  if (!project || !compiledCode) return <></>;

  return (
    <div className='editor-page'>
      <Row>
        <Col>
          <div style={{ height: 'calc(100vh - 100px)' }}>
            <EditorText
              project={project}
              bufferIdx={bufferIdx}
              setBufferIdx={setBufferIdx}
              updateBufferCode={updateBufferCode}
              language='glsl'
              handleCompile={handleCompile}
              handleSave={handleSave}
            />
            {bufferIdx !== 5 && (
              <TextureSelector
                chanUniforms={project.channelUniforms[bufferIdx]}
                updateChanUniforms={updateChanUniforms}
              />
            )}
          </div>
        </Col>
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
          <Link
            style={{ position: 'absolute', top: '640px', left: '20px' }}
            to={'/UserPage/' + project.owner}
          >
            {project.ownerName}
          </Link>
          <p style={{ position: 'absolute', top: '680px', left: '20px' }}>
            {project.description}
          </p>
        </Col>
      </Row>
      <SignLogInModal
        show={showSignLogInModal}
        setShow={setShowSignLogInModal}
        setUser={setUser}
        onSignLogIn={onSignLogIn}
      />
    </div>
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
    'void mainImage(out vec4 FragColor) {\n\tfloat color = (1.0 + sin(iTime)) / 2.0;\n\tFragColor = vec4(color, 1.0 - color, cos(color), 1.0);\n}',
    'void mainImage(out vec4 FragColor){\n\tFragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}',
    'void mainImage(out vec4 FragColor){\n\tFragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}',
    'void mainImage(out vec4 FragColor){\n\tFragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}',
    'void mainImage(out vec4 FragColor){\n\tFragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}',
    'vec2 sampleFunction( vec2 input1, float input2 ){\n\treturn input1 * input2;\n}',
  ],
  channelUniforms: [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ],
};
