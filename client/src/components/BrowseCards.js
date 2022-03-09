import React from 'react';
import CardItem from './CardItem.js';
import './Cards.css';

function BrowseCards({ projects }) {
  return (
    <div className='cards'>
      <div className='cards__wrapper'>
        <ul className='cards__items'>
          <div className='container-fluid'>
            <div className='row'>
              {projects.map((project) => (
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
