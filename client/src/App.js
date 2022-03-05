import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Browse from './pages/browse';
import Login from './pages/Login';
import GoogleCB from './pages/GoogleCB';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/Sign-up';
import UserPage from './pages/UserPage';
import Editor from './pages/Editor';
import PrivateRoute from './routeWrappers/PrivateRoute';
import UnprivateRoute from './routeWrappers/UnprivateRoute';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get('/api/user/authenticated')
      .then((res) => setUser(res.data.user))
      .catch((err) => setUser(null));
  }, []);

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
            <Route path='' element={<Login setUser={setUser} />} />
          </Route>
          <Route
            path='/GoogleCB/:tok'
            element={<UnprivateRoute user={user} setUser={setUser} />}
          >
            <Route path='' element={<GoogleCB setUser={setUser} />} />
          </Route>
          <Route
            path='/Sign-up'
            element={<UnprivateRoute user={user} setUser={setUser} />}
          >
            <Route path='' element={<SignUp setUser={setUser} />} />
          </Route>
          {/* <Route
            path='/UserPage/:id'
            element={<PrivateRoute user={user} setUser={setUser} />}
          > */}
          {/* <Route path='' element={<UserPage currUser={user} />} /> */}
          <Route path='/UserPage/:id' element={<UserPage currUser={user} />} />
          {/* </Route> */}
          <Route
            path='/Editor/:id'
            element={<Editor user={user} setUser={setUser} />}
          />
          <Route
            path='/Editor/'
            element={<Editor user={user} setUser={setUser} />}
          />
          <Route path='/Browse' element={<Browse />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
