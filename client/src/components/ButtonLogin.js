import React from 'react';
import '../pages/button.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

export const ButtonLogin = ({
  children,
  type,
  buttonStyle,
  buttonSize,
  user,
  setUser,
}) => {
  let navigate = useNavigate();

  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  const onClick = () => {
    if (user) {
      axios
        .post('/user/logout')
        .then((res) => {
          setUser(null);
          return navigate('/');
        })
        .catch((err) => console.log(err));
    } else {
      return navigate('/Login');
    }
  };

  return (
    <button
      className={`btn ${checkButtonStyle} ${checkButtonSize} btn-mobile`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
