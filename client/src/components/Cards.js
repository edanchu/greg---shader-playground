import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import GraphicsComponent from './graphics_component';

function Cards({ projects }) {
  return (
    <div className='cards'>
      <h1>Check out these shaders!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {projects.map((project) => {
              return (
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
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
