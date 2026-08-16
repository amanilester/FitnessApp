import { FiCheck } from 'react-icons/fi';

type SetLog = {
    weight: string;
    repsCompleted: string;
    done: boolean;
}

type SetRowProps = {
    setNumber: number;
    set: SetLog;
    targetReps: string;
    onUpdate: (field: 'weight' | 'repsCompleted', value: string) => void;
    onToggle: () => void;
}

function SetRow({ setNumber, set, targetReps, onUpdate, onToggle }: SetRowProps) {
    return (
        <div className="grid grid-cols-4 gap-3 items-center mb-2">
            <span className={`text-sm font-medium ${set.done ? 'text-emerald-400' : 'text-neutral-400'}`}>
                {setNumber}
            </span>
            <input
                type="number"
                placeholder="lbs"
                value={set.weight}
                onChange={e => onUpdate('weight', e.target.value)}
                disabled={set.done}
                className="bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm px-3 py-1.5 text-center focus:outline-none focus:border-sky-500 transition-colors disabled:opacity-40"
            />
            <input
                type="number"
                placeholder={targetReps}
                value={set.repsCompleted}
                onChange={e => onUpdate('repsCompleted', e.target.value)}
                disabled={set.done}
                className="bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm px-3 py-1.5 text-center focus:outline-none focus:border-sky-500 transition-colors disabled:opacity-40"
            />
            <button
                onClick={onToggle}
                className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors mx-auto
                    ${set.done
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-neutral-600 text-neutral-600 hover:border-emerald-500 hover:text-emerald-500'
                    }`}
            >
                <FiCheck size={14} />
            </button>
        </div>
    );
}

export default SetRow;
export type { SetLog };