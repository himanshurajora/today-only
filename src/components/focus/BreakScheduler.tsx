import { useState } from 'react';

interface BreakSchedulerProps {
    onSchedule: (duration: number) => void;
    onClose: () => void;
}

export const BreakScheduler = ({ onSchedule, onClose }: BreakSchedulerProps) => {
    const [duration, setDuration] = useState(20);

    const handleSchedule = () => {
        if (duration > 0) {
            onSchedule(duration);
        }
    };

    const presetDurations = [5, 10, 15, 20, 30];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-green-900 to-blue-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-white/20">
                <div className="text-center">
                    <div className="text-6xl mb-4">☕</div>
                    <h2 className="text-3xl font-bold text-white mb-6">Schedule Break</h2>

                    <div className="mb-6">
                        <label className="block text-white text-lg font-semibold mb-4">
                            Break Duration (minutes)
                        </label>

                        <div className="grid grid-cols-5 gap-3 mb-4">
                            {presetDurations.map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => setDuration(preset)}
                                    className={`py-3 px-4 rounded-xl font-bold transition transform hover:scale-105 ${duration === preset
                                            ? 'bg-white text-green-900'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>

                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-32 px-4 py-3 rounded-xl bg-white/20 text-white text-center text-2xl font-bold border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400"
                            min="1"
                            max="120"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSchedule}
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-full hover:from-green-600 hover:to-blue-700 transition transform hover:scale-105 text-lg"
                        >
                            Start Break
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white/20 text-white font-bold py-3 px-6 rounded-full hover:bg-white/30 transition text-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

