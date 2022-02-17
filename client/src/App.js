import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Browse from './pages/browse';
import Cards from './components/Cards.js';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/Sign-up';
import UserPage from './pages/UserPage';
import Editor from "./pages/Editor";

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
          <Route path='/Editor' element={<Editor />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
