import { useState } from "react";
import {FiPlus, FiCheck} from 'react-icons/fi';

type Exercise = {
    name: string;
    sets: number;
    repRange: string;
}

type DayProps = {
    day: {
        name: string;
        exercises: Exercise[];
    }
    onChange: (day: DayProps["day"]) => void;
}

function Day({day, onChange}: DayProps) {
    const [exerciseFlag, setExerciseFlag] = useState(false);    
    const [exerciseName, setExerciseName] = useState("");
    const [sets, setSets] = useState("");
    const [lowerRange, setLowerRange] = useState("");
    const [upperRange, setUpperRange] = useState("");

    const submitExercise = () => {
        if(exerciseName == "" && sets == "" && lowerRange == "" && upperRange == "") {
            setExerciseFlag(false);
            return;
        }

        if(exerciseName == "" || sets == "" || lowerRange == "" || upperRange == "")
            return;

        const newExercise: Exercise = {
            name: exerciseName,
            sets: Number(sets),
            repRange: lowerRange + "-" + upperRange
        }

        onChange({
            ...day,
            exercises: [...day.exercises, newExercise]
        });
        
        setExerciseName("");
        setSets("");
        setLowerRange("");
        setUpperRange("");
        setExerciseFlag(false);

    }


    const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        e.preventDefault();
        }
    };
    
    return (
        <div className="bg-neutral-800 rounded-xl p-4 m-4">

            {/* Day Name Input */}
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-neutral-500 uppercase tracking-wider">Day Name</span>
                <input 
                    type="text"
                    placeholder={day.name}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => onChange({...day, name: e.target.value})}
                    className="m-4 bg-neutral-700 border border-neutral-600 rounded-lg text-center text-white text-sm
                    font-medium px-3 py-1.5 focus:outline-none focus:border-sky-500 transition-colors"
                />
            </div>

            {/* Exercise List */}
            {day.exercises.length > 0 && (
                <div className="mb-3">
                    <div className="grid grid-cols-3 gap-4 px-1 mb-1">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Exercise</span>
                        <span className="text-xs text-neutral-500 uppercase tracking-wider text-center">Sets</span>
                        <span className="text-xs text-neutral-500 uppercase tracking-wider text-center">Reps</span>
                    </div>
                    {day.exercises.map((exercise, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 items-center py-2 border-t border-neutral-700">
                            <span className="text-sm text-white font-medium">{exercise.name}</span>
                            <span className="text-sm text-neutral-300 bg-neutral-700 rounded-md px-2 py-0.5 text-center">{exercise.sets} sets</span>
                            <span className="text-sm text-neutral-300 bg-neutral-700 rounded-md px-2 py-0.5 text-center">{exercise.repRange} reps</span>
                        </div>
                    ))}
                </div>
            )}

            {day.exercises.length == 0 && (
                <p className="text-sm text-neutral-600 text-center py-3">No exercises yet.</p>
            )}

            {/* Add Exercise Form */}
            {exerciseFlag && (
                <div className="bg-neutral-900 rounded-xl p-4 mt-2 mb-3">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Exercise</label>
                            <input
                                type="text"
                                placeholder="e.g. Squat"
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm
                                px-3 py-1.5 focus:outline-none focus:border-sky-500 transition-colors"
                                value={exerciseName}
                                onChange={(e) => setExerciseName(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Sets</label>
                            <input
                                type="text"
                                placeholder="3"
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm
                                px-3 py-1.5 focus:outline-none focus:border-sky-500 transition-colors"
                                value={sets}
                                onChange={(e) => setSets(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Rep Range</label>
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    placeholder="4"
                                    className="w-full bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm
                                    px-3 py-1.5 focus:outline-none focus:border-sky-500 transition-colors"
                                    value={lowerRange}
                                    onChange={(e) => setLowerRange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <span className="text-neutral-500 text-sm">-</span>
                                <input
                                    type="text"
                                    placeholder="6"
                                    className="w-full bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm
                                    px-3 py-1.5 focus:outline-none focus:border-sky-500 transition-colors"
                                    value={upperRange}
                                    onChange={(e) => setUpperRange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={submitExercise}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white
                            font-medium text-sm px-4 py-1.5 rounded-lg transition-colors active:scale-95"
                        >
                            <FiCheck size={14}/>
                            Done
                        </button>
                    </div>
                </div>
            )}

            {!exerciseFlag && (
                <button
                    type="button"
                    onClick={() => setExerciseFlag(true)}
                    className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700
                    text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors active:scale-95 mt-1"
                >
                    <FiPlus size={14}/>
                    Add Exercise
                </button>
            )}
         </div>
    );
}

export default Day;