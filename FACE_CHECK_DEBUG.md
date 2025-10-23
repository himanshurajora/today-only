# Face Check Debugging Guide

## How to Debug Face Detection

The face detection system now has comprehensive logging. Open your browser's Developer Console (F12) to see the logs.

### Expected Console Output (Every 1 Minute)

```
Face check interval triggered
Starting face check...
Requesting camera access...
Camera access granted
Video playing
Video ready, performing detection...
Face detection result: true
Stopping camera tracks...
Track stopped: camera: 0, facing back
Face check complete
```

### What Each Log Means

1. **"Face check interval triggered"**

   - The 1-minute timer has elapsed
   - System is about to start face check

2. **"Starting face check..."**

   - Face check process begins
   - `isChecking` state set to true

3. **"Requesting camera access..."**

   - Calling `getUserMedia()` to access camera
   - Browser may ask for permission first time

4. **"Camera access granted"**

   - Successfully got camera stream
   - Camera is now active

5. **"Video playing"**

   - Video element started playing
   - Camera feed is live

6. **"Video ready, performing detection..."**

   - Waited 1.5 seconds for camera warm-up
   - About to run face detection

7. **"Face detection result: true/false"**

   - `true` = Face detected ✓
   - `false` = No face detected (triggers alert)

8. **"Stopping camera tracks..."**

   - Releasing camera resources
   - **CRITICAL** for allowing other apps to use camera

9. **"Track stopped: [camera-name]"**

   - Specific camera track has been stopped
   - Camera light should turn off

10. **"Face check complete"**
    - Entire process finished
    - Camera is released
    - Ready for next check in 1 minute

### Troubleshooting

#### Issue: No "Face check interval triggered" logs

**Problem:** Interval not running
**Solution:**

- Check if focus timer is active
- Look for JavaScript errors in console
- Refresh page and start new focus session

#### Issue: Stuck at "Requesting camera access..."

**Problem:** Camera permission denied or in use
**Solution:**

- Check browser permissions (click lock icon in address bar)
- Close other apps using camera (Zoom, Teams, etc.)
- Grant permission when prompted

#### Issue: "Face detection result: false" when face is present

**Problem:** Poor lighting or face too far
**Solution:**

- Ensure good lighting
- Face camera directly
- Move closer to camera
- Wait for camera to adjust (1.5 seconds)

#### Issue: Camera light stays on after check

**Problem:** Tracks not being stopped properly
**Solution:**

- Check for "Track stopped" logs
- Look for errors after "Stopping camera tracks..."
- Refresh page to force cleanup

#### Issue: "Face check already in progress, skipping"

**Problem:** Previous check still running
**Solution:**

- This is normal if checks happen too close
- System assumes user present to avoid false alarm
- Next check will run normally

### Testing Steps

1. **Start Focus Session**

   ```
   - Set duration (any amount)
   - Click "Start Focus Session"
   - Open browser console (F12)
   ```

2. **Wait for First Check** (1 minute)

   ```
   - Watch countdown in bottom-right: "Next check: 0:59, 0:58..."
   - At 0:00, check should trigger
   - Watch console logs
   - Video preview appears center-screen
   ```

3. **Verify Camera Stops**

   ```
   - Look for "Track stopped" log
   - Camera light should turn off
   - Video preview disappears
   - Countdown resets to 1:00
   ```

4. **Test Face Not Detected**
   ```
   - Wait for next check (1 minute)
   - Move away from camera during check
   - Should see "Face detection result: false"
   - Alert dialog appears
   - Beep plays
   - Click "I'm Back!" to dismiss
   ```

### Changing Check Interval (For Production)

Currently set to **1 minute** for testing. To change to **10 minutes** for production:

**In `FocusTimer.tsx`:**

```typescript
// Line ~22: Change initial state
const [timeUntilNextCheck, setTimeUntilNextCheck] = useState(600); // 10 minutes

// Line ~40: Change reset value
setTimeUntilNextCheck(600); // 10 minutes

// Line ~107-110: Change interval
faceCheckIntervalRef.current = setInterval(() => {
  console.log("Face check interval triggered");
  setShouldCheckFace(true);
}, 10 * 60 * 1000); // 10 minutes

// Line ~113-116: Change initial timeout
const initialCheckTimeout = setTimeout(() => {
  console.log("Initial face check triggered");
  setShouldCheckFace(true);
}, 10 * 60 * 1000); // 10 minutes
```

### Camera Resource Management

The system is designed to:
✓ Request camera only when needed (every 1 minute)
✓ Use camera for ~2 seconds
✓ Stop ALL camera tracks after check
✓ Clear video source
✓ Release resources completely

This allows:
✓ Other apps to use camera between checks
✓ Battery savings
✓ Lower CPU usage
✓ No continuous permission requirement

### Console Commands for Testing

```javascript
// In browser console during focus session:

// Manually check shouldCheckFace state (requires React DevTools)
// Look for FocusTimer component in React DevTools

// To see if camera is in use:
navigator.mediaDevices.enumerateDevices().then((devices) => {
  console.log("Available devices:", devices);
});
```

---

**If face detection isn't working, send the console logs for debugging!**
