import GraphicsComponent from './components/graphics_component'
import Example from './pages/page_test'
import './App.css';

function App() {
  const displayHeight = 480;
  return (
    <div>
      <GraphicsComponent height={displayHeight}  />
      <Example />
    </div>
  );
}

export default App;
