import { useState } from 'react'
import './App.css'
import DashboardTemplate from './Components/DashboardTemplate'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div>
        <DashboardTemplate />
    </div>
    </div>
  )
}

export default App
