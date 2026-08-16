import SetRow from './SetRow';
import type { SetLog } from './SetRow';

type Exercise = {
    id: string;
    exercise: string;
    sets: number;
    reps: string;
}

type ExerciseCardProps = {
    exercise: Exercise;
    sets: SetLog[];
    onUpdate: (setIndex: number, field: 'weight' | 'repsCompleted', value: string) => void;
    onToggle: (setIndex: number) => void;
}

function ExerciseCard({ exercise, sets, onUpdate, onToggle }: ExerciseCardProps) {
    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl mb-4 overflow-hidden">

            {/* Exercise header */}
            <div className="px-4 py-3 border-b border-neutral-700">
                <p className="text-white font-medium">{exercise.exercise}</p>
                <p className="text-neutral-500 text-xs mt-0.5">{exercise.sets} sets · {exercise.reps} reps</p>
            </div>

            {/* Set rows */}
            <div className="px-4 py-3">
                <div className="grid grid-cols-4 gap-3 mb-2 px-1">
                    <span className="text-xs text-neutral-600 uppercase tracking-wider">Set</span>
                    <span className="text-xs text-neutral-600 uppercase tracking-wider">Weight</span>
                    <span className="text-xs text-neutral-600 uppercase tracking-wider">Reps</span>
                    <span className="text-xs text-neutral-600 uppercase tracking-wider text-center">Done</span>
                </div>

                {sets.map((set, i) => (
                    <SetRow
                        key={i}
                        setNumber={i + 1}
                        set={set}
                        targetReps={exercise.reps}
                        onUpdate={(field, value) => onUpdate(i, field, value)}
                        onToggle={() => onToggle(i)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ExerciseCard;
export type { Exercise };