import { useState } from 'react'
import Dashboard from './Components/Dashboard'
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div>
        <Dashboard />
      </div>
    </div>
  )
}

export default App
