import { useState } from 'react'

import PremadeWorkouts from './Workouts/PremadeWorkouts.tsx'
import { Link } from 'react-router'
import { FiPlus } from 'react-icons/fi'
function Home() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6 w-4xl">
            <h1 className="text-center">Programs</h1>
            <PremadeWorkouts />
            <Link to="/new-program">
                <button className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors active:scale-95">
                    <FiPlus size={16}/>
                    Add Program
                </button>
            </Link>
        </div>
    )
}

export default Home