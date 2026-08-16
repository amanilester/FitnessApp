import { FiChevronDown } from 'react-icons/fi';

type Day = {
    id: string;
    name: string;
}

type DayPickerProps = {
    days: Day[];
    selectedDay: Day;
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (day: Day) => void;
}

function DayPicker({ days, selectedDay, isOpen, onToggle, onSelect }: DayPickerProps) {
    return (
        <div>
            <button
                onClick={onToggle}
                className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-sm transition-colors"
            >
                Switch day
                <FiChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="mt-2 bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
                    {days.map(day => (
                        <button
                            key={day.id}
                            onClick={() => onSelect(day)}
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
    );
}

export default DayPicker;
export type { Day };