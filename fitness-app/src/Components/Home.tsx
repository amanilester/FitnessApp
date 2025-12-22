import { useState } from 'react'

import PremadeWorkouts from './Workouts/PremadeWorkouts.tsx'
import { Link } from 'react-router'
function Home() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6 w-4xl">
            <h1 className="text-center">Programs</h1>
            <PremadeWorkouts />
            <Link to="/new-program">
                <button className=" bg-sky-600 hover:bg-sky-700 transition delay-150 duration-300 ">Add Program</button>
            </Link>
        </div>
    )
}

export default Home