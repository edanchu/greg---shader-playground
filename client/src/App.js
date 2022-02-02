import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import Browse from './pages/browse';
import Login from './pages/Login';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'



function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path= '/' element = {<Home/>}/>
        <Route path= '/Browse' element = {<Browse/>}/>
        <Route path= '/Login' elemnent = {<Login/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;