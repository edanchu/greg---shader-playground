import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserPage.css';

import CardItem from '../components/CardItem';
import { Row, Col, Modal, Button } from 'react-bootstrap';

export default function UserPage({ currUser }) {
  let { id } = useParams();

  const [user, setUser] = useState(null);
  const [isCurrUser, setIsCurrUser] = useState(false);
  const [projects, setProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selected, setSelected] = useState();

  useEffect(() => {
    if (!user)
      axios.get('/api/user/find-by-id/' + id).then((res) => {
        setUser(res.data);
      });
  }, []);

  useEffect(() => {
    if (user) {
      setIsCurrUser(currUser?._id === user._id);
      if (currUser?._id === user._id)
        axios
          .get('/api/user/get-self-projects')
          .then((res) => {
            setProjects(res.data);
          })
          .catch((err) => console.log(err));
      else
        axios
          .get('/api/user/get-user-projects/' + user?._id)
          .then((res) => {
            setProjects(res.data);
          })
          .catch((err) => console.log(err));
    }
  }, [user]);

  const getTexturePaths = (dir) => {
    return dir.keys().map((item) => item.slice(2));
  };

  const dir = require.context('../../public/textures', false);
  let imagePaths = getTexturePaths(dir);

  if (!user) return <></>;

  return (
    <>
      <div className='Profile'>
        <img
          src='https://bootdey.com/img/Content/avatar/avatar7.png'
          alt='Admin'
          className='profileImage'
        />
        <button onClick={(e) => setModalIsOpen(true)}>Edit picture</button>
        <Modal show={modalIsOpen}>
          <Modal.Header closeButton>
            <Modal.Title> Select new Profile Image</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              maxHeight: 'calc(100vh - 300px)',
              overflowY: 'auto',
            }}
          >
            <Row>
              {imagePaths.map((i, index) => (
                <Col
                  style={{
                    width: '50%',
                    flexBasis: 'auto',
                  }}
                  key={index}
                >
                  <img
                    src={window.location.origin + '/textures/' + i}
                    alt='texture-img'
                    style={
                      selected?.path === i
                        ? {
                            width: '100%',
                            margin: '2%',
                            borderRadius: '5%',
                            cursor: 'pointer',
                            border: '7px solid red',
                          }
                        : {
                            width: '100%',
                            margin: '2%',
                            borderRadius: '5%',
                            cursor: 'pointer',
                          }
                    }
                    onClick={() =>
                      setSelected({
                        path: i,
                      })
                    }
                  />
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='outline-danger'
              style={{ position: 'absolute', right: '0' }}
              onClick={() => setSelected(null)}
            >
              Clear
            </Button>
            <Button
              variant='outline-danger'
              style={{ position: 'absolute', left: '0' }}
              onClick={(e) => setModalIsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant='primary'
              style={{ position: 'absolute', left: '40%', right: '40%' }}
              onClick={() => {
                setModalIsOpen(false);
              }}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        <div className='description'>
          <h4 className='username'>{user.username}</h4>
        </div>
      </div>
      <div className='card-body'>
        <h1 className='title'>Projects</h1>
      </div>
      <div className='cards'>
        <div className='cards__container'>
          <div className='cards__wrapper'>
            <ul className='cards__items'>
              {projects.map((project) => (
                <CardItem
                  key={project._id}
                  project={project}
                  pause={true}
                  playOnMouseOver={true}
                  showButtons={false}
                  commonFragShaderCustomCode={project.code[5]}
                  finalFragShaderCustomCode={project.code[0]}
                  buffer1FragShaderCustomCode={project.code[1]}
                  buffer2FragShaderCustomCode={project.code[2]}
                  buffer3FragShaderCustomCode={project.code[3]}
                  buffer4FragShaderCustomCode={project.code[4]}
                  channels={project.channelUniforms}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
