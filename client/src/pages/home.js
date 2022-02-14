import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection.js';
import '../App.css';
import Cards from '../components/Cards.js';
import axios from 'axios';

function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get('/user/get-projects')
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <HeroSection />
      <Cards />
    </>
  );
}

export default Home;
