import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Sign-Up.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function SignUp({
  setUser,
  isNested,
  switchLogin,
  onSignLogIn,
}) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function validateForm() {
    if (email.length <= 0 || password.length <= 0) {
      toast.error('Email and Password must be at least 1 character');
      return false;
    } else if (username.length <= 0) {
      toast.error('Username must be at least 1 character');
      return false;
    } else if (confirmPassword.length <= 0) {
      toast.error('Please confirm password');
      return false;
    } else if (password !== confirmPassword) {
      toast.error('Passwords must match');
      return false;
    }
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (validateForm())
      axios
        .post('/api/user/register', {
          email: email,
          username: username,
          password: password,
        })
        .then((res) => {
          axios
            .post('/api/user/login', {
              email: email,
              password: password,
            })
            .then((res) => {
              setUser(res.data.user);
              onSignLogIn(res.data.user);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
  }

  function handleClickLogin(e) {
    if (isNested) {
      e.preventDefault();
      switchLogin();
    }
  }

  return (
    <div className='SignUp' style={isNested ? { height: '100%' } : {}}>
      <div className='signup-box'>
        <h1 className='top-header'> Sign Up </h1>
        <Form onSubmit={handleSubmit}>
          <p className='header'> Email </p>
          <Form.Group controlId='email' className='signup-input-box'>
            <Form.Control
              className='signup-input-box2'
              autoFocus
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <p className='header'> Username </p>
          <Form.Group controlId='email' className='signup-input-box'>
            <Form.Control
              className='signup-input-box2'
              autoFocus
              type='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <p className='header'> Password </p>
          <Form.Group controlId='password' className='signup-input-box'>
            <Form.Control
              className='signup-input-box2'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <p className='header'> Confirm Password </p>
          <Form.Group controlId='password' className='signup-input-box'>
            <Form.Control
              className='signup-input-box2'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button className='login-button' type='submit'>
            Create Account
          </Button>
          <ToastContainer />
          <Link onClick={handleClickLogin} to='/Login' className='login-link'>
            <Button className='SignUp-button' type='submit'>
              Have an account? Sign in!
            </Button>
          </Link>
        </Form>
      </div>
    </div>
  );
}
