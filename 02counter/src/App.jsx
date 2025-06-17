import { useState } from 'react'
import './App.css'

function App() {
  let [counter, setCounter] = useState(0)

  const addValue = () => {
    let newCounter = counter;
    for (let i = 0; i < 1; i++) {
      if (newCounter < 20) {
        newCounter++;
      }
    }
    setCounter(newCounter)
  };

  const removeValue = () => {
    let newCounter = counter;
    for (let i = 0; i < 1; i++) {
      if (newCounter > 0) {
        newCounter--;
      }
    }
    setCounter(newCounter)
  }

  return (
    <>
      <h1>Counter value:{counter} </h1>

      <button
        onClick={addValue}>Add value {counter}</button>
      <br />
      <br />
      <button
        onClick={removeValue}>Remove value {counter}</button>
    </>
  )
}

export default App
