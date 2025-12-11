import { useState } from 'react'

function PremadeWorkouts() {
  const [template, setTemplate] = useState({
    push: [{ exercise: 'Bench Press', sets: 3, reps: 8-12},
      { exercise: 'Shoulder Press', sets: 3, reps: 8-12},
      { exercise: 'Tricep Dips', sets: 3, reps: 8-12}],
    pull: [{ exercise: 'Pull Ups', sets: 3, rps: 8-12},
      { exercise: 'Bicep Curls', sets: 3, reps: 8-12},
      { exercise: 'Deadlifts', sets: 3, reps: 8-12}],
    legs: [{ exercise: 'Squats', sets: 3, reps: 8-12},
      { exercise: 'Leg Curl', sets: 3, reps: 8-12},
      { exercise: 'Calf Raises', sets: 3, reps: 15-20}]
  });
  return (
    <div>
      <div>
        <h2>Push Day</h2>
        <ul>
          {template.push.map((item, index) => (
            <li key={index}>{item.exercise}: {item.sets} sets of {item.reps} reps</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Pull Day</h2>
        <ul>
          {template.pull.map((item, index) => (
            <li key={index}>{item.exercise}: {item.sets} sets of {item.reps} reps</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Leg Day</h2>
        <ul>
          {template.legs.map((item, index) => (
            <li key={index}>{item.exercise}: {item.sets} sets of {item.reps} reps</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PremadeWorkouts