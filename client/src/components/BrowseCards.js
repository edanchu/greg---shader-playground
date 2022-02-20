import React from 'react';
import './BrowseCards.css';
import '../App.css';
import GraphicsComponent from './graphics_component';

function BrowseCards({ projects }) {
  console.log(projects);
  return (
  <div className='cards'>
    <div class='container-fluid'>
        <div class="row">
          <div class="col-md">
            {projects.map((project) => {
              return (
                <GraphicsComponent
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
          </div>
          <div class="col-md">
            {projects.map((project) => {
              return (
                <GraphicsComponent
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
          </div>
          <div class="col-md">
            {projects.map((project) => {
              return (
                <GraphicsComponent
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowseCards;
