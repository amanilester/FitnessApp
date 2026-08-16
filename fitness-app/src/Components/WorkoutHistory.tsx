import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FiChevronDown, FiClock } from 'react-icons/fi';
import { CiDumbbell } from 'react-icons/ci';

type SetLog = {
    id: string;
    set_number: number;
    weight: number;
    reps_completed: number;
    exercise: {
        exercise: string;
    };
}

type Session = {
    id: string;
    created_at: string;
    completed_at: string;
    program: { name: string };
    day: { name: string };
    session_sets: SetLog[];
    
}

function WorkoutHistory() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('workout_sessions')
                .select(`
                    id,
                    created_at,
                    completed_at,
                    program:programs ( name ),
                    day:days ( name ),
                    session_sets (
                        id,
                        set_number,
                        weight,
                        reps_completed,
                        exercise:exercises ( exercise )
                    )
                `)
                .eq('user_id', user.id)
                .not('completed_at', 'is', null)
                .order('created_at', { ascending: false });

            console.log('Raw data:', JSON.stringify(data, null, 2));
            if (error) {
                console.error(error);
                return;
            }

            setSessions(data as unknown as Session[]);
            setLoading(false);
        };

        fetchHistory();
    }, []);

    const toggleOpen = (id: string) => {
        setOpenId(prev => prev === id ? null : id);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();

        const dateLabel = isToday ? 'Today' : isYesterday ? 'Yesterday' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        return `${dateLabel} · ${time}`;
    };

    const getDuration = (start: string, end: string) => {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const minutes = Math.round(diff / 1000 / 60);
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const remaining = minutes % 60;
        return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
    };

    // Group sets by exercise name
    const groupSetsByExercise = (sets: SetLog[]) => {
        const grouped: { [name: string]: SetLog[] } = {};
        const order: string[] = [];

        sets.forEach(set => {
            const name = set.exercise?.exercise ?? 'Unknown';
            if (!grouped[name]) {
                grouped[name] = [];
                order.push(name);
            }
            grouped[name].push(set);
        });

        return order.map(name => ({ name, sets: grouped[name].sort((a, b) => a.set_number - b.set_number) }));
    };

    if (loading) return (
        <p className="text-neutral-500 text-sm text-center py-12">Loading...</p>
    );

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">

            {/* Header */}
            {/*<h1 className="text-2xl font-medium text-white mb-6">Workout history</h1>*/}

            {/* Empty state */}
            {sessions.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-neutral-400 text-sm">No workouts logged yet.</p>
                </div>
            )}

            {/* Session list */}
            {sessions.map(session => {
                const isOpen = openId === session.id;
                const duration = getDuration(session.created_at, session.completed_at);
                const grouped = groupSetsByExercise(session.session_sets);

                return (
                    <div
                        key={session.id}
                        className="mb-2 rounded-xl border border-neutral-800 overflow-hidden transition-colors"
                    >
                        {/* Row header */}
                        <div
                            onClick={() => toggleOpen(session.id)}
                            className="flex items-center justify-between px-4 py-3.5 bg-neutral-800 hover:bg-neutral-750 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-sky-600/20 flex items-center justify-center text-sky-400 shrink-0">
                                    <CiDumbbell size={18} />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">
                                        {session.program?.name} — {session.day?.name}
                                    </p>
                                    <p className="text-neutral-400 text-xs mt-0.5">
                                        {formatDate(session.created_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {!isOpen && (
                                    <span className="text-xs text-neutral-500 bg-neutral-900 border border-neutral-700 rounded-md px-2 py-1">
                                        {duration}
                                    </span>
                                )}
                                <FiChevronDown
                                    size={16}
                                    className={`text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        {/* Dropdown */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-neutral-900 px-4 py-4">

                                {/* Duration */}
                                <div className="flex items-center gap-2 mb-4">
                                    <FiClock size={13} className="text-neutral-500" />
                                    <span className="text-xs text-neutral-500 bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1">
                                        {duration}
                                    </span>
                                </div>

                                {/* Exercises */}
                                {grouped.length === 0 ? (
                                    <p className="text-neutral-600 text-sm">No sets logged.</p>
                                ) : (
                                    grouped.map((ex, exIndex) => (
                                        <div key={ex.name} className={exIndex > 0 ? 'mt-4' : ''}>
                                            <p className="text-sm font-medium text-white mb-2">{ex.name}</p>
                                            <div className="grid grid-cols-3 gap-2 mb-1 px-1">
                                                <span className="text-xs text-neutral-600 uppercase tracking-wider">Set</span>
                                                <span className="text-xs text-neutral-600 uppercase tracking-wider">Weight</span>
                                                <span className="text-xs text-neutral-600 uppercase tracking-wider">Reps</span>
                                            </div>
                                            {ex.sets.map((set, i) => (
                                                <div
                                                    key={set.id}
                                                    className={`grid grid-cols-3 gap-2 py-1.5 ${i > 0 ? 'border-t border-neutral-800' : ''}`}
                                                >
                                                    <span className="text-sm text-neutral-400">{set.set_number}</span>
                                                    <span className="text-sm text-neutral-300">{set.weight} lbs</span>
                                                    <span className="text-sm text-neutral-300">{set.reps_completed} reps</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default WorkoutHistory;