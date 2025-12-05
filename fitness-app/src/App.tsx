import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [name, setName] = useState('continue')

  return (
    <>
      <div>
        <h1>Fitness App</h1>
      </div>
      <button onClick={() => setName('clicked')}>{name}</button>
      
    </>
  )
}

export default App
