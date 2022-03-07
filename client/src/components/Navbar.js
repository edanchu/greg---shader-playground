import React, { useState, useEffect } from 'react';
import { ButtonLogin } from './ButtonLogin';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
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
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            GREG &nbsp;
            <i className='fas fa-robot' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to={user ? '/UserPage/' + user._id : '/Login'}
                className='nav-links'
                onClick={closeMobileMenu}
              >
                My Page
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/Editor'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                New Shader
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/Tutorial'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Tutorial
              </Link>
            </li>
            <li>
              <Link
                to='/Login'
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Sign Up
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
