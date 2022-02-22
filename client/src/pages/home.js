import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection.js';
import '../App.css';
import Cards from '../components/Cards.js';
import BrowseCards from '../components/BrowseCards.js';

function Home() {
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
      <HeroSection />
      <BrowseCards projects={projects} />
    </>
  );
}

export default Home;
