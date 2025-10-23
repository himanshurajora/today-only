import { useState, useEffect, useRef } from 'react';
import { useSession } from '../../context/SessionContext';
import { playAlertBeep, playLowFrequencyBeep, stopLowFrequencyBeep } from '../../utils/audio';
import { useCamera } from '../../hooks/useCamera';
import { CameraMonitor } from './CameraMonitor';
import { AlertDialog } from './AlertDialog';
import { BreakScheduler } from './BreakScheduler';
import { startBreak } from '../../services/breaks.service';
import { saveFocusSession, getFocusSession, deleteFocusSession } from '../../services/focus.service';

export const FocusTimer = () => {
  const { currentSession, logSessionActivity } = useSession();
  const [focusDuration, setFocusDuration] = useState(60); // minutes
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [showAlert, setShowAlert] = useState(false);
  const [showBreakScheduler, setShowBreakScheduler] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldCheckFace, setShouldCheckFace] = useState(false);
  const [timeUntilNextCheck, setTimeUntilNextCheck] = useState(60); // 1 minute in seconds for testing

  const beepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { videoRef, isChecking } = useCamera(shouldCheckFace, (detected) => {
    console.log('📸 Face check callback - detected:', detected);
    setShouldCheckFace(false);

    if (!detected) {
      console.log('⚠️ Face NOT detected - triggering alert and beep');
      setShowAlert(true);
      playLowFrequencyBeep(30);
      if (currentSession) {
        logSessionActivity('face_not_detected', 'Face not detected during check');
      }
    } else {
      console.log('✅ Face detected - all good!');
    }

    // Reset timer for next check
    setTimeUntilNextCheck(60); // 1 minute for testing
  });

  // Load saved focus session on mount
  useEffect(() => {
    const loadFocusSession = async () => {
      if (!currentSession) {
        setIsLoading(false);
        return;
      }

      try {
        const savedFocus = await getFocusSession(currentSession.id);

        if (savedFocus && savedFocus.isActive) {
          const elapsed = Math.floor((Date.now() - savedFocus.startTime.getTime()) / 1000);
          const totalSeconds = savedFocus.duration * 60;
          const remaining = totalSeconds - elapsed;

          if (remaining > 0) {
            setFocusDuration(savedFocus.duration);
            setTimeRemaining(remaining);
            setIsActive(true);
          } else {
            // Focus session expired, clean up
            await deleteFocusSession(currentSession.id);
          }
        }
      } catch (error) {
        console.error('Error loading focus session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFocusSession();
  }, [currentSession]);

  useEffect(() => {
    if (isActive && !isOnBreak) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            stopFocus();
            return 0;
          }
          return prev - 1;
        });

        // Countdown for face check
        setTimeUntilNextCheck((prev) => {
          if (prev <= 0) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Beep every 15 minutes
      beepIntervalRef.current = setInterval(() => {
        playAlertBeep();
        if (currentSession) {
          logSessionActivity('focus_start', '15-minute alert beep');
        }
      }, 15 * 60 * 1000);

      // Face check every 1 minute (for testing)
      faceCheckIntervalRef.current = setInterval(() => {
        console.log('Face check interval triggered');
        setShouldCheckFace(true);
      }, 60 * 1000); // 1 minute

      // Initial face check after 1 minute
      const initialCheckTimeout = setTimeout(() => {
        console.log('Initial face check triggered');
        setShouldCheckFace(true);
      }, 60 * 1000); // 1 minute

      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (beepIntervalRef.current) clearInterval(beepIntervalRef.current);
        if (faceCheckIntervalRef.current) clearInterval(faceCheckIntervalRef.current);
        clearTimeout(initialCheckTimeout);
      };
    }
  }, [isActive, isOnBreak]);

  useEffect(() => {
    if (isOnBreak) {
      timerIntervalRef.current = setInterval(() => {
        setBreakTimeRemaining((prev) => {
          if (prev <= 0) {
            endBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    }
  }, [isOnBreak]);

  const startFocus = async () => {
    if (!currentSession) return;

    const startTime = new Date();
    setTimeRemaining(focusDuration * 60);
    setIsActive(true);

    try {
      await saveFocusSession(currentSession.id, {
        startTime,
        duration: focusDuration,
        isActive: true,
      });
      await logSessionActivity('focus_start', `Started ${focusDuration}-minute focus session`);
    } catch (error) {
      console.error('Error starting focus session:', error);
    }
  };

  const stopFocus = async () => {
    if (!currentSession) return;

    setIsActive(false);
    if (beepIntervalRef.current) clearInterval(beepIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    try {
      await deleteFocusSession(currentSession.id);
      await logSessionActivity('focus_end', 'Ended focus session');
    } catch (error) {
      console.error('Error stopping focus session:', error);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    stopLowFrequencyBeep();
  };

  const handleBreakStart = async (duration: number) => {
    if (!currentSession) return;

    // If focus was active, stop it before break
    if (isActive) {
      await stopFocus();
    }

    setIsOnBreak(true);
    setBreakTimeRemaining(duration * 60);
    setShowBreakScheduler(false);

    try {
      await startBreak(currentSession.id, duration);
      await logSessionActivity('break_start', `Started ${duration}-minute break`);
    } catch (error) {
      console.error('Error starting break:', error);
    }
  };

  const endBreak = async () => {
    setIsOnBreak(false);
    setBreakTimeRemaining(0);

    if (currentSession) {
      await logSessionActivity('break_end', 'Break ended');
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}`;
    }
    return `${mins}:00`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = focusDuration * 60;
    const elapsed = totalSeconds - timeRemaining;
    return (elapsed / totalSeconds) * 100;
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <p className="text-white/60">Loading focus mode...</p>
        </div>
      </div>
    );
  }

  if (isOnBreak) {
    const breakProgress = breakTimeRemaining / (breakTimeRemaining > 0 ? (breakTimeRemaining + 1) : 1);

    return (
      <div className="bg-gray-900/40 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
        <div className="text-center">
          <div className="text-6xl mb-4">☕</div>
          <h2 className="text-4xl font-bold text-white mb-6">Break Time!</h2>

          {/* Circular Progress for Break */}
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  stroke="url(#gradientBreak)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - breakProgress)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradientBreak" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6b7280" />
                    <stop offset="100%" stopColor="#374151" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-bold text-gray-300 font-mono">
                  {formatTime(breakTimeRemaining)}
                </div>
              </div>
            </div>
          </div>
          <p className="text-white/80 text-xl mb-6">Relax and recharge</p>
          <button
            onClick={endBreak}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold py-3 px-8 rounded-full hover:from-gray-600 hover:to-gray-800 transition transform hover:scale-105 text-lg border border-white/10"
          >
            End Break Early
          </button>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-4xl font-bold text-white mb-6">Focus Mode</h2>

          <div className="mb-8">
            <label className="block text-white text-lg font-semibold mb-3">
              Focus Duration (minutes)
            </label>
            <input
              type="number"
              value={focusDuration}
              onChange={(e) => setFocusDuration(Number(e.target.value))}
              className="w-32 px-4 py-3 rounded-xl bg-white/20 text-white text-center text-2xl font-bold border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
              min="1"
              max="240"
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={startFocus}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold py-4 px-8 rounded-full hover:from-gray-600 hover:to-gray-800 transition transform hover:scale-105 text-xl shadow-lg border border-white/10"
            >
              Start Focus Session
            </button>

            <button
              onClick={() => setShowBreakScheduler(true)}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold py-4 px-8 rounded-full hover:from-gray-500 hover:to-gray-700 transition transform hover:scale-105 text-xl shadow-lg border border-white/10"
            >
              Schedule Break
            </button>
          </div>

          <div className="mt-6 text-white/60 text-sm space-y-2">
            <p>• Beep alert every 15 minutes</p>
            <p>• Face check every 1 minute (high sensitivity)</p>
            <p>• Alert if you're away</p>
            <p className="text-white/40 text-xs mt-2">💡 Tip: Good lighting improves detection</p>
          </div>
        </div>

        {showBreakScheduler && (
          <BreakScheduler
            onSchedule={handleBreakStart}
            onClose={() => setShowBreakScheduler(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900/40 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
        <div className="text-center">
          <div className="text-6xl mb-4">⏱️</div>
          <h2 className="text-3xl font-bold text-white mb-6">Focus Active</h2>

          {/* Circular Progress */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-64">
              {/* Background circle */}
              <svg className="transform -rotate-90 w-64 h-64">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgressPercentage() / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6b7280" />
                    <stop offset="100%" stopColor="#374151" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Timer text in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-7xl font-bold text-white font-mono">
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={stopFocus}
            className="bg-gradient-to-r from-gray-800 to-black text-white font-bold py-3 px-8 rounded-full hover:from-gray-700 hover:to-gray-900 transition transform hover:scale-105 text-lg border border-white/10"
          >
            End Focus
          </button>
        </div>
      </div>

      {isActive && (
        <>
          <CameraMonitor isChecking={isChecking} nextCheckIn={timeUntilNextCheck} />

          {isChecking && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-black/80 backdrop-blur-lg p-4 rounded-2xl border border-white/20">
                <video
                  ref={videoRef}
                  className="w-64 h-48 rounded-lg object-cover"
                  autoPlay
                  muted
                />
              </div>
            </div>
          )}
        </>
      )}

      <AlertDialog
        isOpen={showAlert}
        onClose={handleAlertClose}
        title="Stay Focused!"
        message="We couldn't detect you. Please return to your workspace!"
      />
    </>
  );
};

