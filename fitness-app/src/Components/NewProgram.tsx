import React, { useState } from 'react';
import Day from './Workouts/Day';
import { supabase } from '../lib/supabase';
import { FiCheck, FiEdit2, FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';

type Exercise = {
    name: string;
    sets: number;
    repRange: string; 
}

type Day = {
    name: string;
    exercises: Exercise[];
}

type Program = {
    name: string;
    expanded: boolean;
    days: Day[];
}

function NewProgram() {


    const [title, setTitle] = useState("New Program Title");
    const [flag, setFlag] = useState(false);
    const [days, setDays] = useState<Day[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleInput = () => {
        setFlag(!flag);
    }

    const addDay = () => {
        setDays(prev => [...prev, {name: "Day " + (days.length + 1), exercises: []}]);
    }

    const updateDay = (index: number, updatedDay: Day) => {
        const updatedDays = [...days];
        updatedDays[index] = updatedDay;
        setDays(updatedDays);
    }

    const deleteDay = (index: number) => {
        const updatedDays = [...days];
        updatedDays.splice(index, 1);
        setDays(updatedDays);
    }

    const saveProgram = async () => {
        setSaving(true);
        setSaved(false);

        const {data: { user } } = await supabase.auth.getUser();

        if(!user) {
            console.error("No user found");
            setSaving(false);
            return;
        }

        const { data: programData, error: programError } = 
            await supabase
                .from('programs')
                .insert([{ name: title, user_id: user.id }])
                .select()
                .single();

        if(programError) {
            console.error("Error saving program:", programError);
            setSaving(false);
            return;
        }

        const programId = programData.id;

        for(const day of days) {
            const { data: dayData } = 
                await supabase
                    .from('days')
                    .insert([
                        {
                            name: day.name,
                            program_id: programId
                        }
                    ])
                    .select()
                    .single();

            const dayId = dayData.id;
            const exercisesPayload = day.exercises.map((ex) => ({
                day_id: dayId,
                exercise: ex.name,
                sets: ex.sets,
                reps: ex.repRange
            }));

            await supabase.from("exercises").insert(exercisesPayload);
        }
        console.log("Program saved!");
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }


    const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        e.preventDefault();      // prevent form submit
        setFlag(false);    // save + exit edit mode
        }
    };

    return (
        <div>
            <form className="m-12 bg-neutral-900 rounded-2xl pb-6">
                <div className="flex items-center justify-center gap-4 pt-6 pb-2 px-6">
                    {flag ? (
                        <input 
                        type="text"
                        className="bg-neutral-800 border border-neutral-600 rounded-lg text-center text-white 
                        text-lg font-semibold px-4 py-1.5 focus:outline-none focus:border-sky-500 transition-colors"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        />
                    ) : (
                    <h3 className="text-center p-2 m-2">{title}</h3>
                    )}
                    <button
                    type="button"
                    onClick={toggleInput}
                    className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white
                    font-medium text-sm px-4 py-1.5 rounded-lg transition-colors active:scale-95"
                    >
                        {flag ? <><FiCheck size={14}/> Save</> : <><FiEdit2 size={14}/> Edit</>}
                    </button>
                </div>

                
                {days.map((day, index) => (
                    <div key={index} className="relative">
                    <button 
                    type="button"
                    onClick={() => deleteDay(index)}
                    className="absolute top-6 right-6 z-10 flex items-center gap-1 text-red-400 hover:text-red-500 
                    text-sm transition-colors"
                    >
                        <FiTrash2 size={15}/>
                        <span>Delete</span>
                    </button>
                    <Day
                        day={day}
                        onChange={(updatedDay: Day) => updateDay(index, updatedDay)}
                    />
                    </div>
                ))}

                {days.length === 0 && (
                    <p className="text-center text-neutral-600 text-sm py-10">
                        No days yet. Add one below!
                    </p>
                )}

                <div className="flex justify-center pt-4 px-6 gap-3">
                    <button
                    type="button"
                    onClick={addDay}
                    className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white
                    font-medium text-sm px-5 py-2.5 rounded-lg transition-colors active:scale-95"
                    >
                        <FiPlus size={15}/>
                        Add Day
                    </button>

                    <button
                    type="button"
                    disabled={saving}
                    onClick={saveProgram}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60
                    disabled:cursor-not-allowed text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors
                    active:scale-95"
                    >
                        <FiSave size={15}/>
                        {saving ? "Saving..." :  saved  ?  "Saved!" : "Save Program"}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default NewProgram;