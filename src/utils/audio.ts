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
  // Stop any existing beep first
  stopLowFrequencyBeep();

  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = 200; // Low frequency
  oscillator.type = "sawtooth"; // More annoying sound

  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);

  // Store references so we can stop it
  currentOscillator = oscillator;
  currentGainNode = gainNode;

  // Clear references after duration
  setTimeout(() => {
    currentOscillator = null;
    currentGainNode = null;
  }, duration * 1000);
};

export const stopLowFrequencyBeep = (): void => {
  if (currentOscillator && currentGainNode) {
    try {
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
        }
      }, 100);
    } catch (error) {
      console.error("Error stopping beep:", error);
    }
  }
};

export const playAlertBeep = (): void => {
  playBeep(800, 0.1);
  setTimeout(() => playBeep(1000, 0.1), 150);
  setTimeout(() => playBeep(1200, 0.2), 300);
};
