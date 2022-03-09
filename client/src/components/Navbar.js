import React, { useState, useEffect } from 'react';
import { ButtonLogin } from './ButtonLogin';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const [button, setButton] = useState(true);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
      console.log('TOO SMALL!!!');
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo'>
            GREG &nbsp;
            <i className='fas fa-robot' />
          </Link>
          <ul className='nav-menu'>
            <li className='nav-item'>
              <Link to='/' className='nav-links'>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to={user ? '/UserPage/' + user._id : '/Login'}
                className='nav-links'
              >
                My Page
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/Editor' className='nav-links'>
                New Shader
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/Tutorial' className='nav-links'>
                Tutorial
              </Link>
            </li>
          </ul>
          {button && (
            <ButtonLogin
              buttonStyle='btn--outline'
              user={user}
              setUser={setUser}
            >
              {user ? 'LOGOUT' : 'LOGIN'}
            </ButtonLogin>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
