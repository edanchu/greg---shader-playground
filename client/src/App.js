import GraphicsTest from './pages/graphics_test'
import Example from './pages/page_test'
import './App.css';

function App() {
  let displayHeight = 480;
  return (
    <div>
      <GraphicsTest height={displayHeight}  />
      <Example />
    </div>
  );
}

export default App;
