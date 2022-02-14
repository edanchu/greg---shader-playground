import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Sign-Up.css';
import '../App.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [click, setClick] = useState(false);

  function validateForm() {
    return (
      email.length > 0 && password.length > 0 && password === confirmPassword
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
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
            // REDIRECT to account page
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  }

  function errorMessage() {
    if (click === true && !validateForm()) {
      return 'Email and Password must be at least 1 character, Passwords must match';
    }
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
        <Form.Group controlId='username' className='input-box'>
          <Form.Control
            className='input-box2'
            autoFocus
            type='text'
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
        <Button
          className='login-button'
          type='submit'
          disabled={!validateForm()}
          onClick={() => setClick(true)}
        >
          Create Account
        </Button>
        <Link to='/Login' className='login-link'>
          <Button className='SignUp-button' type='submit'>
            Have an account? Sign in!
          </Button>
        </Link>
        <p className='error'> {errorMessage()} </p>
      </Form>
    </div>
  );
}
