import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/home';
import Browse from './pages/browse';
import Cards from './components/Cards.js';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './pages/Sign-up';
import UserPage from './pages/UserPage';



function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/' element={<Cards />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Sign-up' element={<SignUp />} />
          <Route path='/UserPage' element={<UserPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;