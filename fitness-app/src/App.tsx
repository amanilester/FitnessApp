import { Link } from 'react-router-dom'
import './App.css'
import { CiDumbbell } from 'react-icons/ci'

function App() {

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <div className="flex items-center justify-center rounded-xl bg-sky-600 w-16 h-16 mx-auto">
          <CiDumbbell size={18} />
        </div>
        <h1 className="text-2xl font-bold text-center mt-4">uLift</h1>
        <Link to="/home" className="text-center flex items-center justify-center gap-2 mt-2">
          <button>continue</button>
        </Link>
      </div>
      
    </div>
  )
}

export default App
