import React from 'react';
import GraphicsComponent from './graphics_component';
import Search from './Search';
import CardItem from './CardItem.js';
import './Cards.css';

function BrowseCards({ projects }) {
  return (
    <div className='cards'>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {projects.map((project) => {
              return (
                <CardItem
                  text='Made by Jack357'
                  label='Minecraft'
                  path='/UserPage'
                  pause={false}
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
            {projects.map((project) => {
              return (
                <CardItem
                  text='Made by Jack357'
                  label='Minecraft'
                  path='/UserPage'
                  pause={false}
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
          <ul className='cards__items'>
            {projects.map((project) => {
              return (
                <CardItem
                  text='Made by Jack357'
                  label='Minecraft'
                  path='/UserPage'
                  pause={false}
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
            {projects.map((project) => {
              return (
                <CardItem
                  text='Made by Jack357'
                  label='Minecraft'
                  path='/UserPage'
                  pause={false}
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

export default BrowseCards;
