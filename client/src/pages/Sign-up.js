import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Link } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import "./Sign-Up.css";
import "../App.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [click, setClick] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0 && password===confirmPassword;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function errorMessage() {
    if (click === true && !validateForm())
      {
        return "Email and Password must be at least 1 character, Passwords must match";
      }
  }

  return (
    <div className="SignUp">
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
        <h className="header"> Confirm Password </h>
        <Form.Group controlId="password" className="input-box">
          <Form.Control
            className="input-box2"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
          <Link to='/Account' className='login-link'>
            <Button className='login-button' type="submit" disabled={!validateForm()} onClick={() => setClick(true)}>
              Create Account
            </Button>
          </Link> 
          <Link to='/Login' className='login-link'>
            <Button className='SignUp-button' type="submit">
              Have an account? Sign in! 
            </Button>
          </Link> 
          <p className='error'> {errorMessage()} </p>
      </Form>
    </div>
  );
}

