let audioContext: AudioContext | null = null;
let currentOscillator: OscillatorNode | null = null;
let currentGainNode: GainNode | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playBeep = (
  frequency: number = 800,
  duration: number = 0.2
): void => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

export const playLowFrequencyBeep = (duration: number = 30): void => {
  try {
    console.log(
      "🔊 Attempting to play low frequency beep for",
      duration,
      "seconds"
    );

    // Stop any existing beep first
    stopLowFrequencyBeep();

    const ctx = getAudioContext();

    // Resume context if suspended (required by some browsers)
    if (ctx.state === "suspended") {
      console.log("Audio context suspended, resuming...");
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 200; // Low frequency
    oscillator.type = "sawtooth"; // More annoying sound

    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);

    console.log("🔊 Low frequency beep started");

    // Store references so we can stop it
    currentOscillator = oscillator;
    currentGainNode = gainNode;

    // Clear references after duration
    setTimeout(() => {
      currentOscillator = null;
      currentGainNode = null;
      console.log("🔊 Low frequency beep ended naturally");
    }, duration * 1000);
  } catch (error) {
    console.error("❌ Error playing low frequency beep:", error);
  }
};

export const stopLowFrequencyBeep = (): void => {
  if (currentOscillator && currentGainNode) {
    try {
      console.log("🔇 Stopping low frequency beep");
      const ctx = getAudioContext();
      // Fade out quickly
      currentGainNode.gain.setValueAtTime(
        currentGainNode.gain.value,
        ctx.currentTime
      );
      currentGainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + 0.1
      );

      // Stop the oscillator after fade
      setTimeout(() => {
        if (currentOscillator) {
          try {
            currentOscillator.stop();
          } catch (e) {
            // Already stopped
          }
          currentOscillator = null;
          currentGainNode = null;
          console.log("🔇 Low frequency beep stopped");
        }
      }, 100);
    } catch (error) {
      console.error("❌ Error stopping beep:", error);
    }
  } else {
    console.log("ℹ️ No active beep to stop");
  }
};

export const playAlertBeep = (): void => {
  try {
    console.log("🔔 Playing alert beep (triple beep)");
    const ctx = getAudioContext();

    // Resume context if suspended
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    playBeep(800, 0.1);
    setTimeout(() => playBeep(1000, 0.1), 150);
    setTimeout(() => playBeep(1200, 0.2), 300);
  } catch (error) {
    console.error("❌ Error playing alert beep:", error);
  }
};
