import React from 'react';
import '../App.css';
import './HeroSection.css';
import { ButtonBrowse } from './ButtonBrowse';
import '../pages/button.css';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  let navigate = useNavigate();

  const onClick = () => {
    return navigate('/Editor');
  };

  return (
    <div className='hero-container'>
      <video src='/videos/test.mp4' autoPlay loop muted />
      <h1 className='title'>SHADERS AWAIT!!!</h1>
      <div className='hero-btns'>
        <button
          className='btns btn--outline btn--large btn btn-mobile'
          onClick={onClick}
        >
          GET STARTED
        </button>
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
