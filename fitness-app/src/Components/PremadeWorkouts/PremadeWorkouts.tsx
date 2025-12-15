import { useState } from 'react'

function PremadeWorkouts() {
  const [programs, setPrograms] = useState([{
    name: 'PPL',
    expanded: false,
    days: {
      push: [
        { exercise: 'Bench Press', sets: 3, reps: '8-12'},
        { exercise: 'Shoulder Press', sets: 3, reps: '8-12'},
        { exercise: 'Tricep Dips', sets: 3, reps: '8-12'}
      ],
      pull: [
        { exercise: 'Pull Ups', sets: 3, reps: '8-12'},
        { exercise: 'Bicep Curls', sets: 3, reps: '8-12'},
        { exercise: 'Deadlifts', sets: 3, reps: '8-12'}
      ],
      legs: [
        { exercise: 'Squats', sets: 3, reps: '8-12'},
        { exercise: 'Leg Curl', sets: 3, reps: '8-12'},
        { exercise: 'Calf Raises', sets: 3, reps: '15-20'}
      ]
    }
  }]);

  const toggleExpand = (index: number) => {
    const update = [...programs]
    update[index].expanded = !update[index].expanded;
    setPrograms(update);
  };

  return (
    <div>
      {programs.map((program, index) => (
        <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
          <h2 onClick={() => toggleExpand(index)} style={{ cursor: 'pointer' }}>
            {program.name} {program.expanded ? '▲' : '▼'}
          </h2>
          {program.expanded && (
            <div>
              <h3>Push Day</h3>
              <ul>
                {program.days.push.map((exercise, idx) => (
                  <li key={idx}>{exercise.exercise}: {exercise.sets} sets of {exercise.reps}</li>
                ))}
              </ul>
              <h3>Pull Day</h3>
              <ul>
                {program.days.pull.map((exercise, idx) => (
                  <li key={idx}>{exercise.exercise}: {exercise.sets} sets of {exercise.reps}</li>
                ))}
              </ul>
              <h3>Leg Day</h3>
              <ul>
                {program.days.legs.map((exercise, idx) => (
                  <li key={idx}>{exercise.exercise}: {exercise.sets} sets of {exercise.reps}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PremadeWorkouts