// Initialize audio context on first user interaction
// This is required by browsers that block audio until user interacts with page

let audioInitialized = false;

export const initializeAudioOnUserInteraction = () => {
  if (audioInitialized) return;

  const initAudio = () => {
    try {
      // Create and play a silent audio to initialize context
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();

      // Resume if suspended
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Play silent sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNode.gain.value = 0; // Silent
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.01);

      audioInitialized = true;
      console.log("✅ Audio context initialized");

      // Remove listeners after initialization
      document.removeEventListener("click", initAudio);
      document.removeEventListener("touchstart", initAudio);
      document.removeEventListener("keydown", initAudio);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  };

  // Listen for any user interaction
  document.addEventListener("click", initAudio, { once: true });
  document.addEventListener("touchstart", initAudio, { once: true });
  document.addEventListener("keydown", initAudio, { once: true });
};
