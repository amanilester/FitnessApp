import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FiPlay, FiList } from 'react-icons/fi';
import WorkoutHistory from './WorkoutHistory.tsx';

type Exercise = {
    id: string;
    exercise: string;
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

type Stats = {
    totalWorkouts: number;
    thisWeek: number;
    streak: number;
}

function Home() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [activeProgram, setActiveProgram] = useState<Program | null>(null);
    const [nextDay, setNextDay] = useState<Day | null>(null);
    const [stats, setStats] = useState<Stats>({ totalWorkouts: 0, thisWeek: 0, streak: 0 });
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const fetchAll = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get user email as display name fallback
            setUserName(user.email?.split('@')[0] ?? 'there');

            // Fetch profile for active program
            const { data: profile } = await supabase
                .from('profiles')
                .select('active_program_id, display_name')
                .eq('id', user.id)
                .single();

            if (profile?.display_name) {
                setUserName(profile.display_name);
            }

            // Fetch stats
            const { data: sessions } = await supabase
                .from('workout_sessions')
                .select('id, created_at')
                .eq('user_id', user.id)
                .not('completed_at', 'is', null);

            const total = sessions?.length ?? 0;

            const startOfWeek = new Date();
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

            const thisWeek = sessions?.filter(s =>
                new Date(s.created_at) >= startOfWeek
            ).length ?? 0;

            // Calculate streak (consecutive days with a workout)
            const streak = calcStreak(sessions ?? []);

            setStats({ totalWorkouts: total, thisWeek, streak });

            // Fetch active program
            if (profile?.active_program_id) {
                const { data: programData } = await supabase
                    .from('programs')
                    .select(`
                        id,
                        name,
                        days (
                            id,
                            name,
                            exercises (id, exercise)
                        )
                    `)
                    .eq('id', profile.active_program_id)
                    .single();

                if (programData) {
                    const prog = programData as Program;
                    setActiveProgram(prog);
                    const next = await getNextDay(prog, user.id);
                    setNextDay(next);
                }
            }

            setLoading(false);
    };

    useEffect(() => {
        
        fetchAll();
    }, [location.pathname, location.search]);

    const calcStreak = (sessions: { created_at: string }[]) => {
        if (!sessions.length) return 0;

        const dates = [...new Set(
            sessions.map(s => new Date(s.created_at).toDateString())
        )].map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

        let streak = 0;
        let current = new Date();
        current.setHours(0, 0, 0, 0);

        for (const date of dates) {
            const diff = Math.round((current.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (diff <= 1) {
                streak++;
                current = date;
            } else {
                break;
            }
        }

        return streak;
    };

    const getNextDay = async (prog: Program, userId: string): Promise<Day> => {
        const { data } = await supabase
            .from('workout_sessions')
            .select('day_id, created_at')
            .eq('program_id', prog.id)
            .eq('user_id', userId)
            .not('completed_at', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!data) return prog.days[0];

        const lastIndex = prog.days.findIndex(d => d.id === data.day_id);
        const nextIndex = (lastIndex + 1) % prog.days.length;
        return prog.days[nextIndex];
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (loading) return (
        <p className="text-neutral-500 text-sm text-center py-12">Loading...</p>
    );

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">

            {/* Greeting */}
            <div className="mb-8">
                <p className="text-neutral-500 text-sm mb-1">{getGreeting()},</p>
                <h1 className="text-3xl font-medium text-white capitalize">{userName} 👋</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-neutral-800 rounded-xl p-4">
                    <p className="text-xs text-neutral-400 mb-2">Total workouts</p>
                    <p className="text-2xl font-medium text-white">{stats.totalWorkouts}</p>
                    <p className="text-xs text-neutral-600 mt-1">all time</p>
                </div>
                <div className="bg-neutral-800 rounded-xl p-4">
                    <p className="text-xs text-neutral-400 mb-2">This week</p>
                    <p className="text-2xl font-medium text-white">{stats.thisWeek}</p>
                    <p className="text-xs text-neutral-600 mt-1">workouts</p>
                </div>
                <div className="bg-neutral-800 rounded-xl p-4">
                    <p className="text-xs text-neutral-400 mb-2">Current streak</p>
                    <p className="text-2xl font-medium text-white">{stats.streak}</p>
                    <p className="text-xs text-neutral-600 mt-1">days</p>
                </div>
            </div>

            {/* Active program */}
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Active program</p>

            {!activeProgram ? (
                <div className="bg-neutral-800 rounded-xl p-6 text-center">
                    <p className="text-neutral-400 text-sm mb-4">No active program set.</p>
                    <button
                        onClick={() => navigate('/programs')}
                        className="inline-flex items-center gap-2 hover:text-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        <FiList size={14} />
                        Choose a program
                    </button>
                </div>
            ) : (
                <div className="border border-neutral-700 rounded-xl overflow-hidden">

                    {/* Program header */}
                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-700 bg-neutral-800 ">
                        <div className="w-9 h-9 rounded-lg bg-sky-600/20 flex items-center justify-center text-sky-400 shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M6 4v16M18 4v16M6 12h12M3 8h3M18 8h3M3 16h3M18 16h3"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">{activeProgram.name}</p>
                            <p className="text-neutral-400 text-xs mt-0.5">
                                {activeProgram.days.length} {activeProgram.days.length === 1 ? 'day' : 'days'}
                            </p>
                        </div>
                    </div>

                    {/* Next day */}
                    {nextDay && (
                        <div className="px-4 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">Next up</p>
                                    <p className="text-white text-sm font-medium">{nextDay.name}</p>
                                    <p className="text-neutral-500 text-xs mt-0.5">
                                        {nextDay.exercises.slice(0, 3).map(e => e.exercise).join(' · ')}
                                        {nextDay.exercises.length > 3 && ` · +${nextDay.exercises.length - 3} more`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(`/workout/${activeProgram.id}`)}
                                    className="inline-flex items-center gap-2 border-neutral-700 hover:text-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors active:scale-95 ml-4 shrink-0"
                                >
                                    <FiPlay size={13} />
                                    Start
                                </button>
                            </div>

                            {/* Week progress bar */}
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-700">
                                <span className="text-xs text-neutral-500 whitespace-nowrap">Week progress</span>
                                <div className="flex-1 h-1 bg-neutral-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-sky-500 rounded-full"
                                        style={{ width: `${Math.min((stats.thisWeek / activeProgram.days.length) * 100, 100)}%` }}
                                    />
                                </div>
                                <span className="text-xs text-neutral-600 whitespace-nowrap">
                                    {stats.thisWeek} / {activeProgram.days.length} days
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <p className="mt-4 text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Workout history</p>
            <div className="border border-neutral-700 rounded-xl overflow-hidden">
                <WorkoutHistory />
            </div>
        </div>
    );
}

export default Home