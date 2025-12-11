import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
import './App.css'

function App() {
  const [name, setName] = useState('continue')

  return (
    <>
      <div>
        <h1>Fitness App</h1>
      </div>
      <Link to="/home">
      <button>continue</button>
      </Link>
      
    </>
  )
}

export default App
