import React, { useState } from 'react';
import Day from './Workouts/Day';
function NewProgram() {

        const [title, setTitle] = useState("New Program Title");
        const [flag, setFlag] = useState(false);
        const [dayFlag, setDayFlag] = useState(false);
        const [days, setDays] = useState([<Day dayName={"Day 1"} />]);

        const toggleInput = () => {
            setFlag(!flag);
        }

        const addDay = () => {
            setDays([...days, <Day dayName={"Day " + (days.length + 1)} />]);
        }

        const saveProgram = () => {
            // TO DO: Save program to database
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
                <div className="flex justify-center pt-4 gap-4">
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

                
                {days.map((day, index) => (
                    <div key={index} className="bg-neutral-800 rounded-2xl m-4 p-4">
                        {day}
                
                    </div>
                ))}
                <div className="flex justify-center p-4 gap-2">
                    <button type="button" onClick={addDay} className="bg-sky-600 hover:bg-sky-700">Add Day</button>
                    <button type="button" onClick={saveProgram} className="bg-purple-600 hover:bg-purple-700">Save Program</button>
                </div>
                
            </form>
        </div>
    )
}

export default NewProgram;