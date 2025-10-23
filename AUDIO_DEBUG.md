# Audio Debugging Guide

## How to Debug Audio Issues

The alarm system now has comprehensive logging. Open your browser's Developer Console (F12) to see audio logs.

### Expected Console Output When Face NOT Detected

```
📸 Face check callback - detected: false
⚠️ Face NOT detected - triggering alert and beep
🔊 Attempting to play low frequency beep for 30 seconds
🔊 Low frequency beep started
```

### Expected Console Output When Face IS Detected

```
📸 Face check callback - detected: true
✅ Face detected - all good!
```

### Expected Console Output When You Click "I'm Back!"

```
🔇 Stopping low frequency beep
🔇 Low frequency beep stopped
```

### Audio Initialization (Happens Once)

On first user interaction (click, tap, or key press):

```
✅ Audio context initialized
```

## Common Audio Issues & Solutions

### Issue: No sound plays at all

**Problem:** Audio context not initialized or suspended

**Solution:**

1. Make sure you've clicked somewhere on the page first
2. Check console for "✅ Audio context initialized"
3. If you see "Audio context suspended, resuming..." that's normal
4. Refresh page and click somewhere before starting focus

### Issue: Sound plays but very quiet

**Problem:** System volume or browser volume low

**Solution:**

1. Check system volume (should be > 50%)
2. Check browser isn't muted (look for speaker icon in tab)
3. Check if other apps can play sound
4. Try increasing volume during beep

### Issue: Sound only plays once then stops

**Problem:** Browser blocking repeated audio

**Solution:**

1. Refresh page
2. Click on page before starting focus
3. Check console for errors
4. Try different browser (Chrome recommended)

### Issue: "I'm Back!" doesn't stop sound

**Problem:** Oscillator reference lost

**Solution:**

1. Check console for "🔇 Stopping low frequency beep"
2. If you see "ℹ️ No active beep to stop", beep already ended
3. Refresh page if issue persists

## Testing Audio

### Test 15-Minute Alert Beep

1. Start focus session
2. Wait 15 minutes
3. Should hear: **beep-beep-BEEP** (triple beep)
4. Check console for: "🔔 Playing alert beep (triple beep)"

### Test Face Detection Alert

1. Start focus session
2. Wait 1 minute for face check
3. **Move away from camera**
4. Should hear: **BRRRRRRRR** (low frequency sawtooth wave)
5. Check console for:
   ```
   ⚠️ Face NOT detected - triggering alert and beep
   🔊 Attempting to play low frequency beep for 30 seconds
   🔊 Low frequency beep started
   ```

### Test Stop Beep

1. While alarm is playing
2. Click "I'm Back!" button
3. Sound should fade out immediately
4. Check console for:
   ```
   🔇 Stopping low frequency beep
   🔇 Low frequency beep stopped
   ```

## Browser-Specific Notes

### Chrome / Edge (Chromium)

✅ Best support
✅ Audio works reliably
✅ Web Audio API fully supported

### Firefox

✅ Good support
⚠️ May need user interaction first
✅ Audio resumes automatically

### Safari (macOS/iOS)

⚠️ Stricter audio policies
⚠️ Requires user interaction before ANY audio
⚠️ May need to click "Start Focus" to initialize
✅ Works after initialization

### Mobile Browsers

⚠️ Very strict audio policies
⚠️ Requires tap before audio works
⚠️ May not support background audio
⚠️ Test on desktop first

## Manual Testing Commands

Open browser console and try:

```javascript
// Test if audio context exists and is running
const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();
console.log("Audio context state:", ctx.state);
// Should output: "running" (good) or "suspended" (needs interaction)

// Manually play low frequency beep (assuming audio utils are imported)
// This won't work in console, but you can test in the app by moving away from camera

// Check if microphone/camera permissions granted
navigator.permissions.query({ name: "microphone" }).then((result) => {
  console.log("Microphone permission:", result.state);
});

navigator.permissions.query({ name: "camera" }).then((result) => {
  console.log("Camera permission:", result.state);
});
```

## Troubleshooting Steps

1. **Verify Audio Works in General**

   - Play a YouTube video
   - Check system volume
   - Ensure browser isn't muted

2. **Check Browser Permissions**

   - Click lock icon in address bar
   - Ensure camera and microphone allowed
   - Refresh page after granting permissions

3. **Verify Console Logs**

   - Open console (F12)
   - Start focus session
   - Wait for face check
   - Move away from camera
   - Check for audio logs

4. **Test Different Scenarios**

   - With headphones
   - Without headphones
   - Different browsers
   - Incognito mode

5. **Clear Browser Cache**
   - Sometimes helps with audio issues
   - Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

## Expected Audio Behavior

### During Focus Session

| Time              | Event         | Audio                           | Console Log                    |
| ----------------- | ------------- | ------------------------------- | ------------------------------ |
| 15:00             | Regular alert | Triple beep (short)             | 🔔 Playing alert beep          |
| Every 1 min       | Face check    | None (unless face not detected) | 📸 Face check callback         |
| Face not detected | Alert         | Low frequency sawtooth (30s)    | 🔊 Low frequency beep started  |
| Click "I'm Back!" | Stop alert    | Fade out (0.1s)                 | 🔇 Stopping low frequency beep |

### Audio Characteristics

**15-Minute Alert (Triple Beep):**

- Frequency: 800Hz → 1000Hz → 1200Hz
- Duration: 0.1s + 0.1s + 0.2s
- Type: Sine wave (clean tone)
- Volume: 30%

**Face Detection Alert (Low Frequency):**

- Frequency: 200Hz
- Duration: 30 seconds (or until dismissed)
- Type: Sawtooth wave (annoying/alerting)
- Volume: 50%
- **Purpose:** Get your attention!

---

**If audio still doesn't work after following this guide, please:**

1. Note your browser name and version
2. Copy console logs
3. Check if "✅ Audio context initialized" appears
4. Try on a different device/browser
