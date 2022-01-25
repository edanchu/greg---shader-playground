import GraphicsComponent from './components/graphics_component'
import Example from './pages/page_test'
import './App.css';

function App() {
  const displayHeight = 480;
  const isPaused = false;
  const playOnMouseOver = false;
  return (
    <div>
      <GraphicsComponent height={displayHeight} pause={isPaused} playOnMouseOver={playOnMouseOver}/>
    </div>
  );
}

export default App;
