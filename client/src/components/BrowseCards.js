import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CardItem from './CardItem.js';
import './Cards.css';

function BrowseCards({ projects }) {
  const [pageNum, setPageNum] = useState(0);

  return (
    <div className='cards'>
      <div className='cards__wrapper'>
        <ul className='cards__items'>
          <div className='container-fluid'>
            <div className='row'>
              {projects.slice(pageNum * 6, pageNum * 6 + 6).map((project) => (
                <CardItem
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
                  key={project._id}
                />
              ))}
            </div>
            <Container>
              <Row>
                <Col xs={4} />
                <Col
                  xs={2}
                  style={{ display: 'flex', justifyContent: 'space-evenly' }}
                >
                  {pageNum > 0 ? (
                    <Button
                      variant='outline-primary'
                      onClick={() => setPageNum(pageNum - 1)}
                    >
                      <i className='fa fa-arrow-left' /> Prev
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant='outline-primary'
                      style={{ opacity: '0.3', cursor: 'default' }}
                    >
                      <i className='fa fa-arrow-left' /> Prev
                    </Button>
                  )}
                </Col>
                <Col
                  xs={2}
                  style={{ display: 'flex', justifyContent: 'space-evenly' }}
                >
                  {pageNum + 1 < projects.length / 6 ? (
                    <Button
                      variant='outline-primary'
                      onClick={() => setPageNum(pageNum + 1)}
                    >
                      Next <i className='fa fa-arrow-right' />
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant='outline-primary'
                      onClick={() => setPageNum(pageNum + 1)}
                      style={{ opacity: '0.3', cursor: 'default' }}
                    >
                      Next <i className='fa fa-arrow-right' />
                    </Button>
                  )}
                </Col>
                <Col xs={4} />
              </Row>
            </Container>
          </div>
        </ul>
      </div>
    </div>
    // <div className='cards'>
    //   <div className='cards__wrapper'>
    //     <div className='container-fluid'>
    //       <div className='row'>
    //         <Row>
    //           {projects.map((project) => (
    //             <Col xs={6} xl={4}>
    //               <CardItem
    //                 project={project}
    //                 pause={true}
    //                 playOnMouseOver={true}
    //                 showButtons={false}
    //                 commonFragShaderCustomCode={project.code[5]}
    //                 finalFragShaderCustomCode={project.code[0]}
    //                 buffer1FragShaderCustomCode={project.code[1]}
    //                 buffer2FragShaderCustomCode={project.code[2]}
    //                 buffer3FragShaderCustomCode={project.code[3]}
    //                 buffer4FragShaderCustomCode={project.code[4]}
    //                 channels={project.channelUniforms}
    //                 key={project._id}
    //               />
    //             </Col>
    //           ))}
    //         </Row>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default BrowseCards;
