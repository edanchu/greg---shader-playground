import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

const GoogleCB = ({ setUser }) => {
  let { tok } = useParams();
  const cookies = new Cookies();
  cookies.addChangeListener((cookie) => {
    if (cookie.name === 'access_token') {
      axios
        .get('/greg/api/user/authenticated')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => console.log(err));
    }
  });

  useEffect(() => {
    axios
      .post('/greg/api/user/logout')
      .then((res) => {
        setUser(null);
        cookies.set('access_token', tok, { path: '/' });
      })
      .catch((err) => {
        setUser(null);
        cookies.set('access_token', tok, { path: '/' });
      });
  }, []);

  return <></>;
};
export default GoogleCB;
