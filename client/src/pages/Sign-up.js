import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Sign-Up.css';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function SignUp({ setUser }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  let navigate = useNavigate();

  function validateForm() {
    if (email.length <= 0 || password.length <= 0) {
      toast.error('Email and Password must be at least 1 character');
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
        .post('/user/register', {
          email: email,
          username: username,
          password: password,
        })
        .then((res) => {
          console.log(res);
          console.log(`Success: ${username} created`);
          axios
            .post('/user/login', {
              email: email,
              password: password,
            })
            .then((res) => {
              console.log('& Logged in');
              setUser(res.data.user);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
  }

  return (
    <div className='SignUp'>
      <Form onSubmit={handleSubmit}>
        <p className='header'> Email </p>
        <Form.Group controlId='email' className='input-box'>
          <Form.Control
            className='input-box2'
            autoFocus
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <p className='header'> Username </p>
        <Form.Group controlId='email' className='input-box'>
          <Form.Control
            className='input-box2'
            autoFocus
            type='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <p className='header'> Password </p>
        <Form.Group controlId='password' className='input-box'>
          <Form.Control
            className='input-box2'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <p className='header'> Confirm Password </p>
        <Form.Group controlId='password' className='input-box'>
          <Form.Control
            className='input-box2'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button className='login-button' type='submit'>
          Create Account
        </Button>
        <ToastContainer />
        <Link to='/Login' className='login-link'>
          <Button className='SignUp-button' type='submit'>
            Have an account? Sign in!
          </Button>
        </Link>
      </Form>
    </div>
  );
}
