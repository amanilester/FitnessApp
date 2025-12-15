import { useState } from 'react'
import PremadeWorkouts from './PremadeWorkouts/PremadeWorkouts.tsx'
function Home() {
    return (
        <div>
            <h1>Programs</h1>
            <PremadeWorkouts />
        </div>
    )
}

export default Home