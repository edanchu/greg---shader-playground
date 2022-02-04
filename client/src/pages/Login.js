import React from 'react';
import '../App.css';
import { ButtonSignUp } from '../components/ButtonSignUp.js';
import { ButtonBrowse } from '../components/ButtonBrowse.js';
function Login() {
  return (
    <>
    <h1>Login</h1>
    <p></p>
    <div className='hero-btns'>
      <ButtonSignUp
        className='btns'
        buttonStyle='btn--outline'
        buttonSize='btn--large'
      >
        Create an Account
      </ButtonSignUp>
    </div>
    </>
  );

}

export default Login;

