import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FiCheck } from 'react-icons/fi';
import DayPicker from './DayPicker.tsx';
import ExerciseCard from './ExerciseCard.tsx';
import type { Day } from './DayPicker';
import type { Exercise } from './ExerciseCard';
import type { SetLog } from './SetRow';

type Program = {
    id: string;
    name: string;
    days: (Day & { exercises: Exercise[] })[];
}

type WorkoutLog = {
    [exerciseId: string]: SetLog[];
}

function Workout() {
    const { id: programId } = useParams();
    const navigate = useNavigate();

    const [program, setProgram] = useState<Program | null>(null);
    const [selectedDay, setSelectedDay] = useState<Day & { exercises: Exercise[] } | null>(null);
    const [showDayPicker, setShowDayPicker] = useState(false);
    const [workoutLog, setWorkoutLog] = useState<WorkoutLog>({});
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Timer
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Add this function instead:
    const startTimer = (fromSeconds: number) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setElapsed(fromSeconds);
        timerRef.current = setInterval(() => {
            setElapsed(prev => prev + 1);
        }, 1000);
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const formatElapsed = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

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

        if (error || !data) return;

        const prog = data as Program;
        setProgram(prog);

        // Check for existing session FIRST before setting day
        const { data: { user } } = await supabase.auth.getUser();
        const { data: existing } = await supabase
            .from('workout_sessions')
            .select('id, created_at, day_id')
            .eq('user_id', user!.id)
            .eq('program_id', programId)
            .is('completed_at', null)
            .order('created_at', { ascending: false })
            .limit(1);

        const existingSession = existing?.[0];

        if (existingSession) {
            // Resume existing session
            const secondsElapsed = Math.floor((Date.now() - new Date(existingSession.created_at).getTime()) / 1000);
            setSessionId(existingSession.id);
            startTimer(secondsElapsed);
            localStorage.setItem('liveWorkout', JSON.stringify({ sessionId: existingSession.id, programId }));

            // Set the day that was already selected
            const existingDay = prog.days.find(d => d.id === existingSession.day_id) ?? prog.days[0];
            setSelectedDay(existingDay);
            initLog(existingDay);
        } else {
            // No existing session — pick next day, session created later
            const nextDay = await getNextDay(prog);
            setSelectedDay(nextDay);
            initLog(nextDay);
        }

        setLoading(false);
    };

    fetchProgram();
}, [programId]);

    // Create session when day is selected + store in localStorage
    useEffect(() => {
        if (!selectedDay || sessionId) return;
        createSession();
    }, [selectedDay]);

    const getNextDay = async (prog: Program) => {
        const { data } = await supabase
            .from('workout_sessions')
            .select('day_id, created_at')
            .eq('program_id', prog.id)
            .not('completed_at', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!data) return prog.days[0];

        const lastDayIndex = prog.days.findIndex(d => d.id === data.day_id);
        const nextIndex = (lastDayIndex + 1) % prog.days.length;
        return prog.days[nextIndex];
    };

    const initLog = (day: Day & { exercises: Exercise[] }) => {
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
        if (!user || !selectedDay || sessionId) return; // bail if already have a session

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
        startTimer(0);
        localStorage.setItem('liveWorkout', JSON.stringify({ sessionId: data.id, programId }));
    };

    const handleDayChange = (day: Day) => {
        const fullDay = program?.days.find(d => d.id === day.id);
        if (!fullDay) return;
        setSelectedDay(fullDay);
        initLog(fullDay);
        setSessionId(null);
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
        if (!sessionId || !selectedDay) return;
        setSaving(true);

        const setsPayload: any[] = [];
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

        const { error: sessionError } = await supabase
            .from('workout_sessions')
            .update({ completed_at: new Date().toISOString() })
            .eq('id', sessionId);

        if (sessionError) {
            console.error(sessionError);
            setSaving(false);
            return;
        }

        // Clear live workout from localStorage
        localStorage.removeItem('liveWorkout');

        setSaving(false);
        navigate('/home');
    };

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
                <div className="flex items-center justify-between mb-1">
                    <p className="text-neutral-500 text-xs uppercase tracking-wider">{program.name}</p>
                    {/* Timer */}
                    <span className="text-sm font-mono text-sky-400 bg-sky-600/10 border border-sky-600/20 rounded-md px-2.5 py-1">
                        {formatElapsed(elapsed)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium text-white">{selectedDay.name}</h1>
                    <DayPicker
                        days={program.days}
                        selectedDay={selectedDay}
                        isOpen={showDayPicker}
                        onToggle={() => setShowDayPicker(prev => !prev)}
                        onSelect={handleDayChange}
                    />
                </div>
            </div>

            {/* Exercises */}
            {selectedDay.exercises.map(ex => (
                <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    sets={workoutLog[ex.id] ?? []}
                    onUpdate={(setIndex, field, value) => updateSet(ex.id, setIndex, field, value)}
                    onToggle={(setIndex) => toggleSetDone(ex.id, setIndex)}
                />
            ))}

            {/* Finish button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={finishWorkout}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors active:scale-95"
                >
                    <FiCheck size={15} />
                    {saving ? 'Saving...' : 'Finish workout'}
                </button>
            </div>
        </div>
    );
}

export default Workout;