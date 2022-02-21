import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const UnprivateRoute = ({ user, setUser }) => {
  useEffect(() => {
    axios
      .get('/user/authenticated')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => setUser(null));
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return !user ? <Outlet /> : <Navigate to='/UserPage' />;
};

export default UnprivateRoute;
