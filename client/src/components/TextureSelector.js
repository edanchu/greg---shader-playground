import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import TextureModal from './TextureModal';
import './TextureSelector.css';

const TextureSelector = ({ chanUniforms, updateChanUniforms }) => {
  const [show, setShow] = useState(false);
  const [chanIdx, setChanIdx] = useState(null);

  return (
    <div className='selector-container'>
      <Row className='h-100'>
        <Col>
          <div
            className='selector'
            onClick={() => {
              setChanIdx(0);
              setShow(true);
            }}
            style={
              chanUniforms[0] &&
              (chanUniforms[0].genType === 'sampler2D'
                ? {
                  backgroundImage: `url("/textures/${chanUniforms[0].path}")`,
                  backgroundSize: 'cover',
                }
                : {
                  backgroundImage: `url("/textures/${chanUniforms[0].path}/posz.jpg")`,
                  backgroundSize: 'cover',
                })
            }
          >
            0
          </div>
        </Col>
        <Col>
          <div
            className='selector'
            onClick={() => {
              setChanIdx(1);
              setShow(true);
            }}
            style={
              chanUniforms[1] &&
              (chanUniforms[1].genType === 'sampler2D'
                ? {
                  backgroundImage: `url("/textures/${chanUniforms[1].path}")`,
                  backgroundSize: 'cover',
                }
                : {
                  backgroundImage: `url("/textures/${chanUniforms[1].path}/posz.jpg")`,
                  backgroundSize: 'cover',
                })
            }
          >
            1
          </div>
        </Col>
        <Col>
          <div
            className='selector'
            onClick={() => {
              setChanIdx(2);
              setShow(true);
            }}
            style={
              chanUniforms[2] &&
              (chanUniforms[2].genType === 'sampler2D'
                ? {
                  backgroundImage: `url("/textures/${chanUniforms[2].path}")`,
                  backgroundSize: 'cover',
                }
                : {
                  backgroundImage: `url("/textures/${chanUniforms[2].path}/posz.jpg")`,
                  backgroundSize: 'cover',
                })
            }
          >
            2
          </div>
        </Col>
        <Col>
          <div
            className='selector'
            onClick={() => {
              setChanIdx(3);
              setShow(true);
            }}
            style={
              chanUniforms[3] &&
              (chanUniforms[3].genType === 'sampler2D'
                ? {
                  backgroundImage: `url("/textures/${chanUniforms[3].path}")`,
                  backgroundSize: 'cover',
                }
                : {
                  backgroundImage: `url("/textures/${chanUniforms[3].path}/posz.jpg")`,
                  backgroundSize: 'cover',
                })
            }
          >
            3
          </div>
        </Col>
      </Row>
      <TextureModal
        chanUniforms={chanUniforms}
        updateChanUniforms={updateChanUniforms}
        show={show}
        setShow={setShow}
        chanIdx={chanIdx}
      ></TextureModal>
    </div>
  );
};

export default TextureSelector;
