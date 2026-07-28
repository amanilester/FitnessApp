import { useState, useEffect} from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiPlay, FiPlus, FiTrash2 } from "react-icons/fi";
import { CiDumbbell } from "react-icons/ci";

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
    created_at: string;
    day_count?: number;
    days: Day[];
}


function Programs() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<string | null>(null);
    const navigate = useNavigate();


    const fetchPrograms = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from('programs')
            .select('id, name, created_at, days ( id, name, exercises (id, exercise, sets, reps) )')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return;
        }
        

        setPrograms(data as Program[]);
        setLoading(false);
    }

    useEffect(() => {
        fetchPrograms();
    }, []);

    const toggleOpen = (id: string) => {
        setOpenId(prev => prev === id ? null : id);
    }

    const deleteProgram = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const { error } = await supabase.from('programs').delete().eq('id', id);
        if (error) {
            console.error(error);
            return;
        }
        console.log(`Program "${programs.find(p => p.id === id)?.name}" deleted successfully.`);
        setPrograms(prev => prev.filter(p => p.id !== id));
        if(openId === id) setOpenId(null);

    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const totalExercises = (program: Program) =>
        program.days.reduce((total, d) => total + d.exercises.length, 0);

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-medium text-white">Your Programs</span>
                <button
                    onClick={() => navigate('/new-program')}
                    className="inline-flex items-center gap-2 border border-gray-700
                    hover:bg-sky-700 text-white font-medium text-sm px-4 py-2
                    rounded-lg transition-colors active:scale-95 cursor-pointer"
                >
                    <FiPlus size={15} />
                    Add Program
                </button>
            </div>

            {loading && (
                <p className="text-neutral-500 text-sm text-center py-12">Loading...</p>
            )}

            {/* Empty State */}
            {!loading && programs.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-neutral-400 text-sm mb-4">You don't have any programs yet.</p>
                    <button
                        onClick={() => navigate('/new-program')}
                        className="inline-flex items-center gap-2 bg-sky-600 
                        hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg
                        transition-colors"
                    >
                        <FiPlus size={15} />
                        Create Your First Program
                    </button>
                </div>
            )}
            {/* Program List */}
            {!loading && programs.map((program) => {
                const isOpen = openId === program.id;
                return (
                    <div
                        key={program.id}
                        className={`mb-2 rounded-xl border transition-colors overflow-hidden
                        ${isOpen ? 'border-neutral-800' : 'border-neutral-800'}`}
                    >
                    <div 
                        onClick={() => toggleOpen(program.id)}
                        className="flex items-center justify-between px-4 py-3.5 bg-neutral-800 hover:bg-neutral-750 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-sky-600/20 flex items-center
                            justify-center text-sky-400 shrink-0">
                                <CiDumbbell size={18} />
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">{program.name}</p>
                                <p className="text-neutral-400 text-xs mt-0.5">
                                    {program.days.length} {program.days.length === 1 ? 'day' : 'days'} · {totalExercises(program)} {totalExercises(program) === 1 ? 'exercise' : 'exercises'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-neutral-500 bg-neutral-900 border border-neutral-700 rounded-md px-2 py-1">
                                {formatDate(program.created_at)}
                            </span>
                            <button
                                onClick={(e) => deleteProgram(program.id, e)}
                                className="text-neutral-600 hover:text-red-400 hover:bg-red-400/10 p-1.5
                                rounded-md transition-colors"
                                aria-label={`Delete ${program.name}`}
                            >
                                <FiTrash2 size={15} />
                            </button>

                            <FiChevronDown
                                size={16}
                                className={`text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </div>
                    
                    </div>

                 {/* Dropdown */}
                        {isOpen && (
                            <div className="bg-neutral-900 px-4 py-4">
                                {program.days.length === 0 ? (
                                    <p className="text-neutral-600 text-sm text-center py-4">No days in this program.</p>
                                ) : (
                                    program.days.map((day, dayIndex) => (
                                        <div key={day.id} className={dayIndex > 0 ? 'mt-4' : ''}>
                                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                                                {day.name}
                                            </p>
                                            {day.exercises.length === 0 ? (
                                                <p className="text-neutral-700 text-xs py-1">No exercises.</p>
                                            ) : (
                                                day.exercises.map((ex, exIndex) => (
                                                    <div
                                                        key={ex.id}
                                                        className={`flex gap-2 items-center justify-between py-2 ${exIndex > 0 ? 'border-t border-neutral-800' : ''}`}
                                                    >
                                                        <span className="text-sm text-white">{ex.exercise}</span>
                                                        <div className="flex gap-2">
                                                            <span className="text-xs text-neutral-400 bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-center">{ex.sets} sets</span>
                                                            <span className="text-xs text-neutral-400 bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-center">{ex.reps} reps</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    ))
                                )}
 
                                {/* Start workout button */}
                                <div className="flex justify-end mt-4 pt-3 border-t border-neutral-800">
                                    <button
                                        onClick={() => navigate(`/workout/${program.id}`)}
                                        className="inline-flex items-center gap-2 hover:text-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors active:scale-95"
                                    >
                                        <FiPlay size={13} />
                                        Select program
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Programs;