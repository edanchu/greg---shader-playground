import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Link } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import "./Login.css";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [click, setClick] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function errorMessage() {
    if (click === true && (email.length === 0 || password.length === 0))
      {
        return "Email and Password must be at least 1 character";
      }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <h className="header"> Email </h>
        <Form.Group controlId="email" className="input-box">
          <Form.Control
            className="input-box2"
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <h className="header"> Password </h>
        <Form.Group controlId="password" className="input-box">
          <Form.Control
            className="input-box2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
          <Link to='/Account' className='login-link'>
            <Button className='login-button' type="submit" disabled={!validateForm()} onClick={() => setClick(true)}>
              Login
            </Button>
          </Link> 
          <Link to='/Sign-Up' className='login-link'>
            <Button className='SignUp-button' type="submit">
              Don't have an account? Sign up! 
            </Button>
          </Link> 
          <p className='error'> {errorMessage()} </p>
      </Form>
    </div>
  );
}

