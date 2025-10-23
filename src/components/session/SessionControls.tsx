import { useSession } from '../../context/SessionContext';
import { formatDateTime } from '../../utils/dateUtils';

export const SessionControls = () => {
    const { currentSession, startNewSession, endCurrentSession, loading } = useSession();

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-white/60 text-lg">Loading session...</p>
            </div>
        );
    }

    if (!currentSession) {
        return (
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-lg p-10 rounded-3xl border border-white/20 text-center">
                <div className="text-7xl mb-6">🚀</div>
                <h2 className="text-4xl font-bold text-white mb-4">Ready to Start?</h2>
                <p className="text-white/80 text-xl mb-8">
                    Begin a new work session and focus on today's tasks
                </p>
                <button
                    onClick={startNewSession}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-5 px-12 rounded-full hover:from-pink-600 hover:to-purple-700 transition transform hover:scale-110 text-2xl shadow-2xl"
                >
                    Start Work Session
                </button>
            </div>
        );
    }

    const sessionDuration = Math.floor((new Date().getTime() - currentSession.startTime.getTime()) / 1000 / 60);

    return (
        <div className="bg-gradient-to-br from-green-900/40 to-blue-900/40 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <h3 className="text-2xl font-bold text-white">Session Active</h3>
                    </div>
                    <p className="text-white/70 mt-2">
                        Started: {formatDateTime(currentSession.startTime)} · {sessionDuration} minutes
                    </p>
                </div>
                <button
                    onClick={endCurrentSession}
                    className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-3 px-8 rounded-full hover:from-red-600 hover:to-orange-700 transition transform hover:scale-105 text-lg shadow-lg"
                >
                    End Session
                </button>
            </div>
        </div>
    );
};

