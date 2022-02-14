import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './UserPage.css';
import '../components/Cards';
import CardItem from '../components/CardItem';

export default function UserPage() {
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
              <CardItem
                src='images/Minecraft.jpg'
                label='Minecraft'
                path='/services'
              />
              <CardItem
                src='images/sunset.jpeg'
                label='Minecraft2'
                path='/services'
              />
              <CardItem
                src='images/MinecraftShader.jpg'
                label='Minecraft3'
                path='/Browse'
              />
              <CardItem
                src='images/download.jfif'
                label='Minecraft4'
                path='/products'
              />
              <CardItem
                src='images/shader.jpg'
                label='Minecraft5'
                path='/sign-up'
              />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
