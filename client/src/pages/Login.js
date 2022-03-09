import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function Login({
  setUser,
  isNested,
  switchSignUp,
  onSignLogIn,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (validateForm())
      axios
        .post('/api/user/login', {
          email: email,
          password: password,
        })
        .then((res) => {
          console.log(res);
          setUser(res.data.user);
          //return navigate('/UserPage');
          onSignLogIn(res.data.user);
        })
        .catch((err) => {
          console.log(err);
          validateUser(err);
        });
  }

  function validateForm() {
    if (email.length <= 0 || password.length <= 0) {
      toast.error('Email and Password must be at least 1 character');
      return false;
    }
    return true;
  }

  function validateUser(err) {
    if (err) {
      toast.error('Wrong email address or password');
    }
  }

  function handleClickSignUp(e) {
    if (isNested) {
      e.preventDefault();
      switchSignUp();
    }
  }

  return (
    <div className='Login' style={isNested ? { height: '100%' } : {}}>
      <div className='login-box'>
        <h1 className='top-header'> Login </h1>
        <Form onSubmit={handleSubmit}>
          <p className='header'> Email </p>
          <Form.Group controlId='email' className='login-input-box'>
            <Form.Control
              className='login-input-box2'
              autoFocus
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <p className='header'> Password </p>
          <Form.Group controlId='password' className='login-input-box'>
            <Form.Control
              className='login-input-box2'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button className='login-button' type='submit'>
            Login
          </Button>
          <ToastContainer />
          <Link
            onClick={handleClickSignUp}
            to='/Sign-Up'
            className='login-link'
          >
            <Button className='SignUp-button' type='submit'>
              Don't have an account? Sign up!
            </Button>
          </Link>
          <Button
            variant='danger'
            className='google'
            type='submit'
            onClick={(e) => {
              e.preventDefault();
              window.open(
                'http://localhost:8888/api/user/auth/google',
                '_self'
              );
            }}
          >
            <i className='fab fa-google' /> &nbsp; Sign in with Google
          </Button>
        </Form>
      </div>
    </div>
  );
}
