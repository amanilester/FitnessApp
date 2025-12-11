import { useState } from 'react'
import PremadeWorkouts from './PremadeWorkouts/PremadeWorkouts.tsx'
function Home() {
    return (
        <div>
            <h1>Premade Workouts</h1>
            <PremadeWorkouts />
        </div>
    )
}

export default Home