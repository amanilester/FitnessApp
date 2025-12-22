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
        <div key={index} 
          className="p-6 rounded-2xl shadow-lg transition cursor-pointer bg-neutral-900"
          onClick={() => toggleExpand(index)}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{program.name}</h2>
            <span>{program.expanded ? "▲" : "▼"}</span>
          </div>

          <div className="mt-3 space-y-1">
            <p><strong>Push:</strong> {program.days.push.length} exercises</p>
            <p><strong>Pull:</strong> {program.days.pull.length} exercises</p>
            <p><strong>Legs:</strong> {program.days.legs.length} exercises</p>
          </div>
          
          {program.expanded && (
            <div className="mt-6 p-4 rounded-xl space-y-4 bg-neutral-800">
              {Object.entries(program.days).map(([day, exercises], i) => (
                <div key={i} className={i < Object.entries(program.days).length - 1 ? "p-4 rounded-xl shadow-md" : "p-4 shadow-md"}>
                  <h3 className="text-xl font-semibold mb-3 capitalize">{day}</h3>
                  {exercises.map((exercise, j) => (
                    <div key={j} className="mb-3 p-3 rounded-lg border">
                      <h3 className="text-xl font-semibold">{exercise.exercise}</h3>
                      <p>Sets: {exercise.sets}</p>
                      <p>Reps: {exercise.reps}</p>
                    </div>
                  ))}
                </div>
              ))}
              <button className="w-full mt-4 py-3 bg-sky-600 rounded-xl hover:bg-sky-700">Start Program</button>
            </div>
          )}

          
        </div>
      ))}
    </div>
  )
}

export default PremadeWorkouts