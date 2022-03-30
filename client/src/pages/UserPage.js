import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import BrowseCards from '../components/BrowseCards';
import './UserPage.css';

export default function UserPage({ currUser, setUser: setGlobalUser }) {
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
        setSelected(res.data.avatar);
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
  }, [user, currUser]);

  const handleChangeAvatar = () => {
    axios
      .put('/api/user/update-avatar', { avatar: selected })
      .then((res) => {
        axios
          .get('/api/user/authenticated')
          .then((res) => {
            setModalIsOpen(false);
            setUser({ ...res.data.user });
            if (isCurrUser) setGlobalUser({ ...res.data.user });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const getAvatarPaths = (dir) => {
    return dir.keys().map((item) => item.slice(2));
  };

  const dir = require.context('../../public/avatars');
  let imagePaths = getAvatarPaths(dir);

  if (!user) return <></>;

  return (
    <>
      <div className='Profile'>
        <img
          width={'300px'}
          src={'/avatars/' + user.avatar}
          alt='avatar-img'
          className='profileImage'
        />
        {isCurrUser && (
          <>
            <Button
              variant='outline-dark'
              onClick={(e) => {
                setSelected(user.avatar);
                setModalIsOpen(true);
              }}
            >
              Edit picture
            </Button>
            <Modal
              show={modalIsOpen}
              onHide={() => setModalIsOpen(false)}
              dialogClassName='selector-modal'
            >
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
                  {imagePaths.map((a, index) => (
                    <Col
                      style={{
                        flexBasis: 'auto',
                      }}
                      key={index}
                      md={4}
                      lg={3}
                      xs={6}
                    >
                      <img
                        src={window.location.origin + '/avatars/' + a}
                        alt='texture-img'
                        style={
                          selected === a
                            ? {
                                width: '100%',
                                maxWidth: '200px',
                                margin: '2%',
                                borderRadius: '5%',
                                cursor: 'pointer',
                                border: '7px solid red',
                              }
                            : {
                                width: '100%',
                                maxWidth: '200px',
                                margin: '2%',
                                borderRadius: '5%',
                                cursor: 'pointer',
                              }
                        }
                        onClick={() => setSelected(a)}
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
                  style={{ margin: 'auto' }}
                  onClick={handleChangeAvatar}
                >
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
        <div className='description'>
          <h4 style={{ marginBottom: '0' }} className='username'>
            {user.username}
          </h4>
        </div>
      </div>
      <div className='card-body'>
        <h1 className='title'>Projects</h1>
      </div>
      {projects.length > 0 && <BrowseCards projects={projects} />}
    </>
  );
}
