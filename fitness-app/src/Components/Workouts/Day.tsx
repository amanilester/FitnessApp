import { useState } from "react";

function Day(props: {dayName: string}) {
    const [exerciseFlag, setExerciseFlag] = useState(false);
    
    const [exerciseName, setExerciseName] = useState("");
    const [sets, setSets] = useState("");
    const [lowerRange, setLowerRange] = useState("");
    const [upperRange, setUpperRange] = useState("");
    const [exercises, setExercises] = useState<{ name: string; sets: number; repRange: string }[]>([]);

    const toggleExerciseInput = () => {
            setExerciseFlag(!exerciseFlag);
        }

    const submitExercise = () => {
        if(exerciseName == "" && sets == "" && lowerRange == "" && upperRange == "") {
            toggleExerciseInput();
            return;
        }
        if(exerciseName == "" || sets == "" || lowerRange == "" || upperRange == "") {
            return;
        }
        const newExercise = {
            name: exerciseName,
            sets: Number(sets),
            repRange: lowerRange + "-" + upperRange
        };
        const updatedExercises = [...exercises, newExercise];
        setExercises(updatedExercises);
        setExerciseName("");
        setSets("");
        setLowerRange("");
        setUpperRange("");
        toggleExerciseInput();
    }
    
    return (
        <div>
            <div>
                <input type="text" placeholder={props.dayName} className="m-4 bg-neutral-700 rounded-2xl text-center"/>
                <button type="button" className="bg-red-700 rounded-2xl">X</button>
            </div>

            {exercises.map((exercise, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 m-4 text-center">
                    <h3 className="text-xl font-semibold">{exercise.name}</h3>
                    <p>Sets: {exercise.sets}</p>
                    <p>Rep Range: {exercise.repRange}</p>
                </div>
            ))

            }

            {!exerciseFlag ?
                <div className="flex justify-center">
                    <button type="button" onClick={toggleExerciseInput} className="bg-sky-600 hover:bg-sky-700 m-2">Add Exercise</button>
                </div>
                    :
                        <div className="grid grid-cols-3 gap-4 m-4 text-center">
                            <p>Exercise Name</p>
                            <p>Sets</p>
                            <p>Rep Range</p>
                            
                            <input type="text" 
                            className="border-none bg-neutral-700 rounded-2xl text-center"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}/>

                            <input type="text"
                            className="bg-neutral-700 rounded-2xl text-center"
                            value={sets}
                            onChange={(e) => setSets(e.target.value)}/>
                            <div className="grid grid-cols-3">
                                <input type="text"
                                className="bg-neutral-700 rounded-2xl text-center"
                                value={lowerRange}
                                onChange={(e) => setLowerRange(e.target.value)}/>
                                <p>-</p>
                                <input type="text"
                                className="bg-neutral-700 rounded-2xl text-center"
                                value={upperRange}
                                onChange={(e) => setUpperRange(e.target.value)}/>
                            </div>
                            <div className="flex justify-center col-span-3">
                                <button type="button" onClick={submitExercise} className="bg-neutral-900 hover:bg-neutral-950">Done</button>
                            </div>
                        </div>
                        
                    }
                </div>
    );
}

export default Day;