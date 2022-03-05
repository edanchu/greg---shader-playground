import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import EditorText from '../components/EditorText';
import TextureSelector from '../components/TextureSelector';
import './Editor.css';
import GraphicsComponent from '../components/graphics_component';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Texture } from 'three';
import { ToastContainer, toast } from 'react-toastify';
import SignLogInModal from '../components/SignLogInModal';

export default function Editor({ user, setUser }) {
  let { id } = useParams();
  let navigate = useNavigate();

  const [project, setProject] = useState(id ? null : defaultProject);
  const [lastSaved, setLastSaved] = useState(id ? null : defaultProject);
  const [compiledCode, setCompiledCode] = useState(
    id ? null : defaultProject.code
  );
  const [bufferIdx, setBufferIdx] = useState(0);
  const [showSignLogInModal, setShowSignLogInModal] = useState(false);
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const [liked, setLiked] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [titleInfo, setTitleInfo] = useState(null);
  const [descriptionInfo, setDescriptionInfo] = useState(null);
  const [publicInfo, setPublicInfo] = useState(false);

  window.onbeforeunload = (e) => {
    if (project != lastSaved) {
      e.preventDefault();
      if (e) e.returnValue = '';
      return '';
    }
  };

  function handleResize() {
    setPageWidth(window.innerWidth);
  }

  useEffect(() => {
    if (id) {
      axios.get('/api/user/get-project/' + id).then((res) => {
        setProject(res.data);
        setLastSaved(res.data);
        setCompiledCode(res.data.code);
        setBufferIdx(0);
        setLiked(res.data.likes.indexOf(user?._id) !== -1);
      });
    }
    if (!id) {
      setProject(defaultProject);
      setCompiledCode(defaultProject.code);
      setBufferIdx(0);
    }
  }, [id, user]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  function updateBufferCode(editor, data, value) {
    setProject({
      ...project,
      code: project.code.map((c, i) => {
        if (i === bufferIdx) return value;
        return c;
      }),
    });
  }

  const handleUpdateInformation = () => {
    setProject({
      ...project,
      title: titleInfo,
      description: descriptionInfo,
      public: publicInfo,
    });
  };

  const handleLike = () => {
    if (user) {
      let newLikes = project.likes;
      let likeStatus;
      if (project.likes.indexOf(user._id) === -1) {
        newLikes.push(user._id);
        likeStatus = true;
      } else {
        newLikes = newLikes.filter((id) => id !== user._id);
        likeStatus = false;
      }
      if (id) {
        axios
          .put('/api/user/update-project/' + id, {
            ...project,
            likes: newLikes,
          })
          .then((res) => {
            setProject({ ...project, likes: newLikes });
            setLiked(likeStatus);
          })
          .catch((err) => console.log(err));
      } else {
        setProject({ ...project, likes: newLikes });
        setLiked(likeStatus);
      }
    } else {
      toast.error('Must be signed in to like');
    }
  };

  const handleDelete = (event) => {
    if (user) {
      axios
        .delete('/api/user/delete-project/' + id)
        .then((res) => {
          toast('Project deleted successfully');
        })
        .catch((err) => console.log(err));
    } else {
      toast.error('Must be signed in to delete project');
    }
  };

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
                    likes: !id ? project.likes : [],
                  }
                : {
                    ...project,
                    owner: res.data.user._id,
                    ownerName: res.data.user.username,
                    likes: !id ? project.likes : [],
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
                likes: [],
              }
            : {
                ...project,
                owner: user._id,
                ownerName: user.username,
                likes: [],
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
            height={pageWidth * 0.3}
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
          <div>
            <button
              style={{
                position: 'float',
                top: '625px',
                left: '15px',
                color: liked ? 'aqua' : 'lightgrey',
              }}
              onClick={() => handleLike()}
            >
              <i className='fas fa-thumbs-up'></i>
            </button>
            <button
              style={{
                position: 'float',
                top: '625px',
                left: '105px',
                color: 'red',
              }}
              onClick={(e) => handleDelete()}
            >
              <i className='fa fa-trash' aria-hidden='true'></i>
            </button>
            <h6
              style={{
                position: 'float',
                top: '628px',
                left: '55px',
                color: 'white',
              }}
            >
              {project.likes.length}
            </h6>
          </div>
          <button
            className='fa fa-edit'
            style={{ position: 'float', top: '705px', left: '275px' }}
            onClick={() => {
              setModalIsOpen(true);
              setTitleInfo(project.title);
              setDescriptionInfo(project.description);
              setPublicInfo(project.public);
            }}
          ></button>
          <button
            className='fa fa-public'
            style={{ position: 'float', top: '705px', left: '295px' }}
            onClick={() => {
              setPublicInfo(!project.public);
              project.public = !project.public;
            }}
          >
            {project.public ? 'Set Private' : 'Set Public'}
          </button>
          <Modal show={modalIsOpen}>
            <Modal.Header className='modal-header'>
              Update Project Information
            </Modal.Header>
            <Modal.Body>
              <label className='modal-body-header' htmlFor='name'>
                Title:
              </label>
              <br />
              <input
                className='input'
                type='text'
                id='name'
                name='name'
                value={titleInfo}
                onChange={(e) => setTitleInfo(e.target.value)}
              />
              <br />
              <label className='modal-body-header' htmlFor='decription'>
                Decription:
              </label>
              <br />
              <textarea
                className='input'
                type='text'
                id='decription'
                name='decription'
                value={descriptionInfo}
                onChange={(e) => setDescriptionInfo(e.target.value)}
              />
              <br />
              <label className='modal-body-header' htmlFor='public'>
                Public:
              </label>
              <br />
              <input
                type='checkbox'
                id='public'
                name='public'
                checked={publicInfo}
                onChange={(e) => setPublicInfo(e.target.checked)}
              />
              <br />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant='outline-danger'
                style={{ position: 'float', left: '0' }}
                onClick={(e) => setModalIsOpen(false)}
              >
                Close
              </Button>
              <Button
                variant='outline-danger'
                style={{ position: 'float', right: '0' }}
                onClick={(e) => {
                  setModalIsOpen(false);
                  handleUpdateInformation();
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
          <h1 style={{ position: 'float', top: '700px', left: '20px' }}>
            {project.title}
          </h1>
          <Link
            style={{ position: 'float', top: '740px', left: '20px' }}
            to={'/UserPage/' + project.owner}
          >
            {project.ownerName}
          </Link>
          <br></br>
          <p style={{ position: 'float', top: '780px', left: '20px' }}>
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
      <ToastContainer />
    </div>
  );
}

const defaultProject = {
  owner: null,
  ownerName: null,
  title: 'New Project',
  description: 'Welcome to your new project!',
  likes: [],
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
