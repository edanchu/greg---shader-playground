import React from 'react';
import '../App.css';
import { ButtonLogin } from './ButtonLogin';
import './HeroSection.css';
import { ButtonBrowse } from './ButtonBrowse';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video src='/videos/test.mp4' autoPlay loop muted />
      <h1 className='title'>SHADERS AWAIT!!!</h1>
      <div className='hero-btns'>
        <ButtonLogin
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </ButtonLogin>
        <ButtonBrowse
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
        >
          BROWSE SHADERS <i className='far fa-play-circle' />
        </ButtonBrowse>
      </div>
    </div>
  );
}

export default HeroSection;
