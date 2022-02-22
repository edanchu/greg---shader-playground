import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Browse from './pages/browse';
import Cards from './components/Cards.js';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/Sign-up';
import UserPage from './pages/UserPage';
import Editor from './pages/Editor';
import PrivateRoute from './routeWrappers/PrivateRoute';
import UnprivateRoute from './routeWrappers/UnprivateRoute';

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Router>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/Login'
            element={<UnprivateRoute user={user} setUser={setUser} />}
          >
            <Route path='/Login' element={<Login setUser={setUser} />} />
          </Route>
          <Route
            path='/Sign-up'
            element={<UnprivateRoute user={user} setUser={setUser} />}
          >
            <Route path='/Sign-up' element={<SignUp setUser={setUser} />} />
          </Route>
          <Route
            path='/UserPage'
            element={<PrivateRoute user={user} setUser={setUser} />}
          >
            <Route
              path='/UserPage'
              element={<UserPage currUser={user} user={user} />}
            />
          </Route>
          <Route path='/Editor' element={<Editor />} />
          <Route path='/Browse' element={<Browse />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
