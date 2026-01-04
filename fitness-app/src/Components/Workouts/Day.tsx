import { useState } from "react";

function Day() {
    const [exerciseFlag, setExerciseFlag] = useState(false);
    const [iter, setIter] = useState(0);
    
    const [exerciseName, setExerciseName] = useState("");
    const [sets, setSets] = useState("");
    const [lowerRange, setLowerRange] = useState("");
    const [upperRange, setUpperRange] = useState("");
    const toggleExerciseInput = () => {
            setExerciseFlag(!exerciseFlag);
        }
    
    return (
        <div>
            <input type="text" placeholder={"Day " + iter} className="m-4 bg-neutral-700 rounded-2xl text-center"/>
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
                                <button type="button" onClick={toggleExerciseInput} className="bg-black hover:bg-green-700">Done</button>
                            </div>
                        </div>
                        
                    }
                </div>
    );
}

export default Day;