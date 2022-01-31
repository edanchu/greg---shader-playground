import GraphicsComponent from './components/graphics_component'
import './App.css';
// import Home from './pages/home';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const displayHeight = 480;
  const isPaused = false;
  const playOnMouseOver = false;
  const showButtons = true;
  return (
    <div>
      <GraphicsComponent height={displayHeight} pause={isPaused} playOnMouseOver={playOnMouseOver} showButtons={showButtons} />
    </div>
  );
}

export default App;
