import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

const GoogleCB = ({ setUser }) => {
  let { tok } = useParams();
  const cookies = new Cookies();
  cookies.set('access_token', tok, { path: '/' });

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('/api/user/authenticated')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => console.log(err));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <></>;
};

export default GoogleCB;
