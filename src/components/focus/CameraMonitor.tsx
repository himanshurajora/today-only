interface CameraMonitorProps {
    isChecking: boolean;
    nextCheckIn: number; // seconds until next check
}

export const CameraMonitor = ({ isChecking, nextCheckIn }: CameraMonitorProps) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            <div className="bg-black/80 backdrop-blur-lg p-4 rounded-2xl border border-white/20 shadow-2xl">
                <div className="text-center">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-white text-sm font-semibold mb-1">Face Detection</p>
                    {isChecking ? (
                        <p className="text-yellow-400 text-xs">Checking now...</p>
                    ) : (
                        <p className="text-white/60 text-xs">
                            Next check: {formatTime(nextCheckIn)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
