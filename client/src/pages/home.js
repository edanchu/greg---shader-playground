import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Button} from './button.js';
import './home.css';

function Home() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMenu = () => setClick(false);

  const showButton = () => {
    if(window.innerWidth <= 960) {
      setButton(false);
    }
    else {
      setButton(true);
    }
  }

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='home'>
        <div className='home-container'>
          <Link to='/' className='home-logo'>
            TRVL <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'menu active' : 'menu'}>
            <li className='item'>
              <Link to='/' className='links' onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className='item'>
              <Link to='/Browse' className='links' onClick={closeMenu}>
                Browse
              </Link>
            </li>
            <li className='item'>
              <Link to='/Settings' className='links' onClick={closeMenu}>
                Settings
              </Link>
            </li>
            <li className='item'>
              <Link to='/Projects' className='links' onClick={closeMenu}>
                Projects
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline'>SIGN IN</Button>}
        </div>
      </nav>
      
    </>
  );
}

export default Home;
