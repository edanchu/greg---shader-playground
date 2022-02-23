import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Login from '../pages/Login';
import SignUp from '../pages/Sign-up';

const SignLogInModal = ({ show, setShow, setUser, onSignLogIn }) => {
  const [loggingIn, setLoggingIn] = useState(true);
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{loggingIn ? 'Log In' : 'Sign Up'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loggingIn ? (
          <Login
            isNested={true}
            switchSignUp={() => setLoggingIn(false)}
            setUser={setUser}
            onSignLogIn={(user) => {
              onSignLogIn(user);
              setShow(false);
            }}
          />
        ) : (
          <SignUp
            isNested={true}
            switchLogin={() => setLoggingIn(true)}
            setUser={setUser}
            onSignLogIn={(user) => {
              onSignLogIn(user);
              setShow(false);
            }}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShow(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignLogInModal;
