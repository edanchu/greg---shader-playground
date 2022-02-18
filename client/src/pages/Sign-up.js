import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Sign-Up.css';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  let navigate = useNavigate();

  function validateForm() {
    if (email.length <= 0 || password.length <= 0) {
      toast.error("Email and Password must be at least 1 character");
    }

    else if (confirmPassword.length <= 0) {
      toast.error("Please confirm password");
    }
    
    else if (password !== confirmPassword) {
      toast.error("Passwords must match");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    validateForm();
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
            return navigate('/UserPage');
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
        <h className='header'> Email </h>
        <Form.Group controlId='email' className='input-box'>
          <Form.Control
            className='input-box2'
            autoFocus
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <h className="header"> Username </h>
        <Form.Group controlId="email" className="input-box">
          <Form.Control
            className="input-box2"
            autoFocus
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <h className="header"> Password </h>
        <Form.Group controlId="password" className="input-box">
          <Form.Control
            className='input-box2'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <h className='header'> Confirm Password </h>
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
            <ToastContainer/>
          <Link to='/Login' className='login-link'>
            <Button className='SignUp-button' type="submit">
              Have an account? Sign in! 
            </Button>
          </Link>
      </Form>
    </div>
  );
}
