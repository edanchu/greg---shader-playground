import GraphicsTest from './pages/graphics_test'
import Example from './pages/page_test'
import './App.css';
import Home from './pages/home';
import Browse from './pages/browse';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path= '/' element = {<Home/>}/>
        <Route path= '/Browse' element = {<Browse/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
