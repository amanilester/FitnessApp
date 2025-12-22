import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <div className="m-64 grid text-center">
      <div>
        <h1>Fitness App</h1>
      </div>
      <Link to="/home">
      <button className="text-center">continue</button>
      </Link>
      
    </div>
  )
}

export default App
