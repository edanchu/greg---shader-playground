import React, { useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';

const TextureModal = ({
  chanUniforms,
  updateChanUniforms,
  show,
  setShow,
  chanIdx,
}) => {
  const [showTextures, setShowTextures] = useState(true);
  const [selected, setSelected] = useState(chanUniforms[chanIdx]);

  const getTexturePaths = (dir) => {
    return dir.keys().map((item) => item.slice(2));
  };

  const getCubemapPaths = () => {
    return [
      'ForbiddenCity 2048x2048',
      'GamlaStan 2048x2048',
      'Kastellholmen 2048x2048',
      'Langholmen 2048x2048',
      'Langholmen3 2048x2048',
      'SaintLazarusChurch2 2048x2048',
      'Skinnarviksberget 2048x2048',
      'UnionSquare 2048x2048',
    ];
  };

  const dir = require.context('../../public/textures', false);
  let imagePaths = getTexturePaths(dir);
  let cubemapPaths = getCubemapPaths();

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Select input for Channel {chanIdx}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          maxHeight: 'calc(100vh - 300px)',
          overflowY: 'auto',
        }}
      >
        <Button
          variant={showTextures ? 'dark' : 'secondary'}
          onClick={() => setShowTextures(true)}
        >
          Textures
        </Button>
        <Button
          variant={!showTextures ? 'dark' : 'secondary'}
          onClick={() => setShowTextures(false)}
        >
          Cubemaps
        </Button>
        <Button
          variant='outline-danger'
          style={{ position: 'absolute', right: '0' }}
          onClick={() => setSelected(null)}
        >
          Clear
        </Button>
        <Row>
          {showTextures
            ? imagePaths.map((i, index) => (
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
                        type: 'sampler2D',
                        path: i,
                      })
                    }
                  />
                </Col>
              ))
            : cubemapPaths.map((c, index) => (
                <Col
                  style={{
                    width: '50%',
                    flexBasis: 'auto',
                  }}
                  key={index}
                >
                  <img
                    src={
                      window.location.origin + '/textures/' + c + '/posz.jpg'
                    }
                    alt='texture-img'
                    style={
                      selected?.path === c
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
                        type: 'samplerCube',
                        path: c,
                      })
                    }
                  />
                </Col>
              ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button
          variant='primary'
          onClick={() => {
            updateChanUniforms(chanIdx, selected);
            setShow(false);
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TextureModal;
