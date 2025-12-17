import { useState } from 'react'

import PremadeWorkouts from './PremadeWorkouts/PremadeWorkouts.tsx'
function Home() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6 w-4xl">
            <h1 className="text-center">Programs</h1>
            <PremadeWorkouts />
            <button className=" bg-sky-600 hover:bg-sky-700 ">Add Program</button>
        </div>
    )
}

export default Home