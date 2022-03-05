import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './browse.css';
import Search from '../components/Search';

function Browse() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get('/api/user/get-projects')
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Search />
    </>
  );
}

export default Browse;
