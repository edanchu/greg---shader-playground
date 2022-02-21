import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './UserPage.css';
import '../components/Cards';
import CardItem from '../components/CardItem';

export default function UserPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get('/user/get-projects')
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className='Profile'>
        <img
          src='https://bootdey.com/img/Content/avatar/avatar7.png'
          alt='Admin'
          className='profileImage'
        />
        <div className='description'>
          <h4 className='username'>Shady boy</h4>
          <p>Professional Shader</p>
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
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
