import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection.js';
import '../App.css';
import BrowseCards from '../components/BrowseCards.js';
import Search from '../components/Search.js';

function Home() {

  return (
    <>
      <HeroSection />
      <Search />
    </>
  );
}

export default Home;
