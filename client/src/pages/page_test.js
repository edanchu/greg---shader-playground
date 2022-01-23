import React, {useState, useEffect} from 'react';

function Example() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);
    const [fruit, setFruit] = useState('');
  
    useEffect(() => {
      document.title = fruit;
    });

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me to raise count
        </button>
        <p>Fruit: {fruit}</p>
        <button onClick={() => setFruit('apple')}>
          Apple
        </button>
        <button onClick={() => setFruit('cherry')}>
          Cherry
        </button>
        <button onClick={() => setFruit('banana')}>
          Banana
        </button>
      </div>
    );
  }

  export default Example