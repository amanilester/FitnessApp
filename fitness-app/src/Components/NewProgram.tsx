import React, { useEffect, useRef, useState } from 'react';

function NewProgram() {

        interface Program {
            name: string;
            expanded: boolean;
            exercises: object[];
        }

        const [title, setTitle] = useState("New Program Title");
        const [flag, setFlag] = useState(false);
        const [exerciseFlag, setExerciseFlag] = useState(false);
        const [dayFlag, setDayFlag] = useState(false);
        const [iter, setIter] = useState(0);
        const [days, setDays] = useState([{
           
        }]);

        const toggleInput = () => {
            setFlag(!flag);
        }

        const toggleDayInput = () => {
            setDayFlag(!dayFlag);
            setIter(iter + 1);
        }

        const toggleExerciseInput = () => {
            setExerciseFlag(!exerciseFlag);
        }

        const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
            e.preventDefault();      // prevent form submit
            setFlag(false);    // save + exit edit mode
            }
        };

    return (
        <div>
            <form className="m-12 bg-neutral-900 rounded-2xl">
                <div className="flex justify-center gap-4">
                    {flag ? <input type="text"
                    className="m-2 bg-neutral-800 rounded-2xl text-center"
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown} />
                    :
                    <h3 className="text-center p-2 m-2">{title}</h3>}
                    <button type="button" onClick={toggleInput}
                    className="ml-4 bg-sky-600 hover:bg-sky-700 m-2">
                        {flag ? "Save" : "Edit"}
                    </button>
                </div>

                {!dayFlag ?
                <div className="flex justify-center">
                    <button type="button" onClick={toggleDayInput} className="bg-sky-600 hover:bg-sky-700 px-20">Add Day</button>
                </div>

                :
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
                            
                            <input type="text" className="border-none bg-neutral-700 rounded-2xl text-center"/>
                            <input type="text" className="bg-neutral-700 rounded-2xl text-center"/>
                            <div className="grid grid-cols-3">
                                <input type="text" className="bg-neutral-700 rounded-2xl text-center"/>
                                <p>-</p>
                                <input type="text" className="bg-neutral-700 rounded-2xl text-center"/>
                            </div>
                            <div className="flex justify-center col-span-3">
                                <button type="button" onClick={toggleExerciseInput} className="bg-black hover:bg-green-700">Done</button>
                            </div>
                        </div>
                        
                    }
                </div>
                }
            </form>
        </div>
    )
}

export default NewProgram;