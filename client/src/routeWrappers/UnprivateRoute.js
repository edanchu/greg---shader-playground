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

  return !user ? <Outlet /> : <Navigate to={'/UserPage/' + user._id} />;
};

export default UnprivateRoute;
