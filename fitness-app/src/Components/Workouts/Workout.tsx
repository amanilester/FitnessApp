import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
 
type Exercise = {
    id: string;
    exercise: string;
    sets: number;
    reps: string;
}
 
type Day = {
    id: string;
    name: string;
    exercises: Exercise[];
}
 
type Program = {
    id: string;
    name: string;
    days: Day[];
}
 
type SetLog = {
    weight: string;
    repsCompleted: string;
    done: boolean;
}
 
// exerciseId -> array of sets
type WorkoutLog = {
    [exerciseId: string]: SetLog[];
}
 
function Workout() {
    const { id: programId } = useParams();
    const navigate = useNavigate();
 
    const [program, setProgram] = useState<Program | null>(null);
    const [selectedDay, setSelectedDay] = useState<Day | null>(null);
    const [showDayPicker, setShowDayPicker] = useState(false);
    const [workoutLog, setWorkoutLog] = useState<WorkoutLog>({});
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
 
    // Fetch program + days + exercises
    useEffect(() => {
        const fetchProgram = async () => {
            const { data, error } = await supabase
                .from('programs')
                .select(`
                    id,
                    name,
                    days (
                        id,
                        name,
                        exercises (
                            id,
                            exercise,
                            sets,
                            reps
                        )
                    )
                `)
                .eq('id', programId)
                .single();
 
            if (error || !data) {
                console.error(error);
                return;
            }
 
            setProgram(data as Program);
 
            // Figure out the next day
            const nextDay = await getNextDay(data as Program);
            setSelectedDay(nextDay);
 
            // Initialize workout log for that day
            initLog(nextDay);
 
            setLoading(false);
        };
 
        fetchProgram();
    }, [programId]);
 
    // Create session in Supabase as soon as day is selected
    useEffect(() => {
        if (!selectedDay || sessionId) return;
        createSession();
    }, [selectedDay]);
 
    const getNextDay = async (prog: Program): Promise<Day> => {
        // Find the most recently completed day for this program
        const { data } = await supabase
            .from('workout_sessions')
            .select('day_id, created_at')
            .eq('program_id', prog.id)
            .not('completed_at', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
 
        if (!data) return prog.days[0]; // No history, start from day 1
 
        const lastDayIndex = prog.days.findIndex(d => d.id === data.day_id);
        const nextIndex = (lastDayIndex + 1) % prog.days.length;
        return prog.days[nextIndex];
    };
 
    const initLog = (day: Day) => {
        const log: WorkoutLog = {};
        day.exercises.forEach(ex => {
            log[ex.id] = Array.from({ length: ex.sets }, () => ({
                weight: '',
                repsCompleted: '',
                done: false
            }));
        });
        setWorkoutLog(log);
    };
 
    const createSession = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !selectedDay) return;
 
        const { data, error } = await supabase
            .from('workout_sessions')
            .insert([{
                user_id: user.id,
                program_id: programId,
                day_id: selectedDay.id
            }])
            .select()
            .single();
 
        if (error) {
            console.error(error);
            return;
        }
 
        setSessionId(data.id);
    };
 
    const handleDayChange = (day: Day) => {
        setSelectedDay(day);
        initLog(day);
        setSessionId(null); // will trigger createSession via useEffect
        setShowDayPicker(false);
    };
 
    const updateSet = (exerciseId: string, setIndex: number, field: 'weight' | 'repsCompleted', value: string) => {
        setWorkoutLog(prev => {
            const updated = { ...prev };
            updated[exerciseId] = [...updated[exerciseId]];
            updated[exerciseId][setIndex] = { ...updated[exerciseId][setIndex], [field]: value };
            return updated;
        });
    };
 
    const toggleSetDone = (exerciseId: string, setIndex: number) => {
        setWorkoutLog(prev => {
            const updated = { ...prev };
            updated[exerciseId] = [...updated[exerciseId]];
            updated[exerciseId][setIndex] = {
                ...updated[exerciseId][setIndex],
                done: !updated[exerciseId][setIndex].done
            };
            return updated;
        });
    };
 
    const finishWorkout = async () => {
        if (!sessionId) return;
        setSaving(true);
 
        // Build session_sets payload
        const setsPayload: any[] = [];
        if (selectedDay) {
            selectedDay.exercises.forEach(ex => {
                const sets = workoutLog[ex.id] ?? [];
                sets.forEach((set, i) => {
                    if (set.done) {
                        setsPayload.push({
                            session_id: sessionId,
                            exercise_id: ex.id,
                            set_number: i + 1,
                            weight: parseFloat(set.weight) || 0,
                            reps_completed: parseInt(set.repsCompleted) || 0
                        });
                    }
                });
            });
        }
 
        // Insert all sets
        if (setsPayload.length > 0) {
            const { error: setsError } = await supabase
                .from('session_sets')
                .insert(setsPayload);
 
            if (setsError) {
                console.error(setsError);
                setSaving(false);
                return;
            }
        }
 
        // Mark session as completed
        const { error: sessionError } = await supabase
            .from('workout_sessions')
            .update({ completed_at: new Date().toISOString() })
            .eq('id', sessionId);
 
        if (sessionError) {
            console.error(sessionError);
            setSaving(false);
            return;
        }
 
        setSaving(false);
        navigate('/programs');
    };
 
    const allSetsDone = selectedDay
        ? selectedDay.exercises.every(ex =>
            (workoutLog[ex.id] ?? []).every(set => set.done)
          )
        : false;
 
    if (loading) return (
        <p className="text-neutral-500 text-sm text-center py-12">Loading workout...</p>
    );
 
    if (!program || !selectedDay) return (
        <p className="text-neutral-500 text-sm text-center py-12">Program not found.</p>
    );
 
    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
 
            {/* Header */}
            <div className="mb-6">
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">{program.name}</p>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium text-white">{selectedDay.name}</h1>
                    <button
                        onClick={() => setShowDayPicker(prev => !prev)}
                        className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-sm transition-colors"
                    >
                        Switch day
                        <FiChevronDown size={14} className={`transition-transform duration-200 ${showDayPicker ? 'rotate-180' : ''}`} />
                    </button>
                </div>
 
                {/* Day picker */}
                {showDayPicker && (
                    <div className="mt-2 bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
                        {program.days.map(day => (
                            <button
                                key={day.id}
                                onClick={() => handleDayChange(day)}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-neutral-700 last:border-0
                                    ${selectedDay.id === day.id
                                        ? 'text-sky-400 bg-sky-600/10'
                                        : 'text-white hover:bg-neutral-700'
                                    }`}
                            >
                                {day.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
 
            {/* Exercises */}
            {selectedDay.exercises.map(ex => (
                <div key={ex.id} className="bg-neutral-800 border border-neutral-700 rounded-xl mb-4 overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-700">
                        <p className="text-white font-medium">{ex.exercise}</p>
                        <p className="text-neutral-500 text-xs mt-0.5">{ex.sets} sets · {ex.reps} reps</p>
                    </div>
 
                    <div className="px-4 py-3">
                        {/* Column headers */}
                        <div className="flex justify-start gap-20 mb-2">
                            <span className="text-xs text-neutral-600 uppercase tracking-wider">Set</span>
                            <span className="text-xs text-neutral-600 uppercase tracking-wider">Weight</span>
                            <span className="text-xs text-neutral-600 uppercase tracking-wider">Reps</span>
                        </div>
 
                        {(workoutLog[ex.id] ?? []).map((set, i) => (
                            <div key={i} className="grid grid-cols-3 gap-3 items-center mb-2">
                                <div className="flex items-center gap-4 w-full">
                                    <span className={`text-sm font-medium px-2 py-1 ${set.done ? 'text-emerald-400' : 'text-neutral-400'}`}>
                                        {i + 1}
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="lbs"
                                        value={set.weight}
                                        onChange={e => updateSet(ex.id, i, 'weight', e.target.value)}
                                        disabled={set.done}
                                        className="w-full bg-neutral-700 border border-neutral-600 rounded-lg text-white text-xs px-2 py-1 text-center focus:outline-none focus:border-sky-500 transition-colors disabled:opacity-40"
                                    />
                                    <input
                                        type="number"
                                        placeholder={ex.reps}
                                        value={set.repsCompleted}
                                        onChange={e => updateSet(ex.id, i, 'repsCompleted', e.target.value)}
                                        disabled={set.done}
                                        className="w-full bg-neutral-700 border border-neutral-600 rounded-lg text-white text-xs px-2 py-1 text-center focus:outline-none focus:border-sky-500 transition-colors disabled:opacity-40"
                                    />
                                </div>
                                <button
                                    onClick={() => toggleSetDone(ex.id, i)}
                                    className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors mx-auto
                                        ${set.done
                                            ? 'bg-emerald-600 border-emerald-600 text-white'
                                            : 'border-neutral-600 text-neutral-600 hover:border-emerald-500 hover:text-emerald-500'
                                        }`}
                                >
                                    <FiCheck size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
 
            {/* Finish button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={finishWorkout}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors active:scale-95"
                >
                    <FiCheck size={15} />
                    {saving ? 'Saving...' : allSetsDone ? 'Finish workout' : 'Finish workout'}
                </button>
            </div>
 
        </div>
    );
}
 
export default Workout;