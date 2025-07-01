import logo from './logo.svg';
import './App.css';
import { useState } from 'react'; 

function Counter() {
  const [count, setCount] = useState(0);
  
  function handleClick(){
    setCount(count+1);

  }

  return (
    <div>
    <p>You clicked {count} times!</p>
    <button onClick={handleClick}> Click Me</button>
    </div>
  );
  }

function App() {
  return (
    <div className="App">
      {/*<Welcome name = "John Louis"/>
      <Welcome name = "Yohan"/>
      <Welcome name = "Raph"/>*/}
      <Counter />
    </div>
  );
}

export default App;
