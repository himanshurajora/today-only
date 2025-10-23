# Changelog

## [Latest - v1.4] - Dark Theme + Balanced Face Detection

### Changed

- **Theme changed to dark black glassy** 🖤

  - Removed purple/pink gradients
  - Deep black and gray color scheme
  - Subtle borders and glass effects
  - Professional dark aesthetic

- **Face detection sensitivity reduced** 📸
  - Score threshold back to 0.5 (default)
  - Less false positives
  - Requires clearer face detection
  - Better for well-lit environments

### What This Means

- **Less sensitive detection** = Fewer false alarms when lighting isn't perfect
- **More accurate detection** = Only triggers when confident face is detected
- **Requires better setup** = Good lighting and clear face view important

---

## [v1.3.2] - Improved Face Detection Sensitivity

### Improved

- **Face detection much more sensitive** 📸
  - Lowered detection threshold from 0.5 to 0.3 (40% more sensitive)
  - Increased camera warm-up time from 1.5s to 2.5s
  - Better detection in various lighting conditions
  - Shows confidence score in console logs
  - Helpful tips displayed in UI

### What Changed

- **scoreThreshold: 0.3** (was 0.5)
  - Lower = more likely to detect faces
  - Better for varying lighting and angles
- **Camera warm-up: 2.5 seconds** (was 1.5s)
  - Gives camera more time to adjust exposure
  - Better focus and lighting adaptation

### Better Console Logging

- Now shows confidence score when face detected
- "✅ Face detected with confidence: 0.85"
- "❌ No face detected - try better lighting or move closer"

### Tips for Best Detection

1. **Good lighting** - face well-lit, not backlit
2. **Face the camera** - look generally toward screen
3. **Don't be too far** - within 1-2 meters is best
4. **No hats/sunglasses** - can interfere with detection
5. **Wait for camera** - first few seconds after check starts

---

## [v1.3.1] - Audio Alarm Fix

### Fixed

- **Alarm now plays reliably when face not detected** 🔊
  - Audio context automatically initialized on first user interaction
  - Audio resumes if suspended by browser
  - Comprehensive logging for debugging audio issues
  - Works in all browsers (Chrome, Firefox, Safari, Edge)

### Debug Features

- Added audio logging:
  - "🔊 Attempting to play low frequency beep for X seconds"
  - "🔊 Low frequency beep started"
  - "🔊 Low frequency beep ended naturally"
  - "🔇 Stopping low frequency beep"
  - "🔔 Playing alert beep (triple beep)"
  - "⚠️ Face NOT detected - triggering alert and beep"
  - "✅ Face detected - all good!"

### Technical Changes

#### New: `utils/initAudio.ts`

- Initializes audio context on first user interaction
- Required by browsers that block audio until user interaction
- Listens for click, touch, or keydown events

#### Updated: `utils/audio.ts`

- Added audio context state checking
- Automatically resumes suspended contexts
- Comprehensive error handling and logging

#### Updated: `App.tsx`

- Calls `initializeAudioOnUserInteraction()` on mount
- Ensures audio works throughout the app

---

## [v1.3] - Circular Timer UI & Face Check Debug

### Added

- **Beautiful circular progress timer** ⭕
  - Timer now shows as HH:MM format (no seconds) to prevent overflow
  - Large circular progress indicator shows time remaining visually
  - Smooth gradient animation (pink to purple)
  - Cleaner, more professional look
  - Works for both Focus and Break modes

### Fixed

- **Face check interval set to 1 minute** for easier testing ⏱️

  - Changed from 10 minutes to 1 minute
  - Easier to test face detection without waiting
  - Can be changed back to 10 minutes in production

- **Camera resource properly released** 📸
  - Added comprehensive logging for debugging
  - Ensures camera tracks are stopped after each check
  - Video source cleared after detection
  - Prevents camera from being locked
  - Other apps can use camera between checks

### Debug Features

- Added detailed console logging for face detection:
  - "Starting face check..."
  - "Requesting camera access..."
  - "Camera access granted"
  - "Video ready, performing detection..."
  - "Face detection result: true/false"
  - "Stopping camera tracks..."
  - "Track stopped: camera-name"
  - "Face check complete"

### Technical Changes

#### Updated: `FocusTimer.tsx`

- Changed time format to HH:MM (removed seconds)
- Added `getProgressPercentage()` for circular progress
- Implemented SVG circular progress with gradient
- Timer centered inside circular progress
- Face check interval: 1 minute
- Break timer also uses circular progress

#### Updated: `useCamera.ts`

- Added comprehensive console logging
- Proper cleanup of video source
- Ensures mediaStream.getTracks() properly stops all tracks
- Better error handling with logging

---

## [v1.2] - Face Detection Optimization & Audio Fixes

### Fixed

- **Face detection now checks every 10 minutes instead of continuously** 📸
  - Camera only activates when it's time to check (saves battery!)
  - Reduces CPU usage significantly
  - If camera is busy, waits for next check instead of alerting
  - Shows countdown timer for next face check
  - Video preview appears only during check (center of screen for better visibility)
- **"I'm Back!" button now properly stops the beep sound** 🔇
  - Low-frequency alert beep stops immediately when you dismiss the alert
  - Smooth fade-out of the sound for better UX
  - No more annoying beep continuing after you've returned

### User Experience Improvements

**Better camera usage:**

- Camera activates for ~2 seconds every 10 minutes
- Visual indicator shows when check is happening
- Countdown shows time until next check
- No continuous camera drain on battery

**Smarter error handling:**

- If camera is busy/unavailable during check, assumes user is present
- No false alarms if camera fails temporarily
- Graceful fallback behavior

### Technical Changes

#### Updated: `utils/audio.ts`

- Added `stopLowFrequencyBeep()` function
- Tracks oscillator and gain node references globally
- Implements smooth fade-out before stopping

#### Updated: `hooks/useCamera.ts`

- Changed from continuous monitoring to on-demand checks
- Camera starts only when `shouldCheck` is true
- Performs single face detection then stops camera immediately
- Returns `isChecking` state for UI feedback

#### Updated: `CameraMonitor.tsx`

- Completely redesigned UI
- Shows countdown to next check (e.g., "Next check: 9:45")
- Displays "Checking now..." status during active check
- No continuous video stream

#### Updated: `FocusTimer.tsx`

- Triggers face check every 10 minutes via interval
- Tracks time until next check and displays countdown
- Shows video preview center-screen during check only
- Stops beep when alert is dismissed via `handleAlertClose`

---

## [v1.1] - Focus Session Persistence Fix

### Fixed

- **Focus timer now persists across page reloads** 🎉
  - When you start a focus session and reload the browser, the timer now correctly restores
  - Timer continues from the correct remaining time
  - Camera monitoring resumes automatically
  - Beep intervals continue as expected

### Technical Changes

#### New Service: `focus.service.ts`

- Added `saveFocusSession()` - Saves focus session to Firebase
- Added `getFocusSession()` - Retrieves active focus session
- Added `deleteFocusSession()` - Cleans up focus session

#### Updated: `FocusTimer.tsx`

- Added loading state to prevent flash of wrong UI
- On mount, checks for active focus session in Firebase
- Calculates remaining time based on start time
- Restores timer if session is still valid
- Saves focus session to Firebase when starting
- Cleans up Firebase when stopping

#### Updated: `SessionContext.tsx`

- Automatically cleans up focus session when work session ends

### Firebase Structure Added

```
sessions/
  {sessionId}/
    focusSession/
      current/
        - startTime: ISO string
        - duration: number (minutes)
        - isActive: boolean
```

### User Experience

Before this fix:

1. Start work session ✓
2. Start 60-minute focus timer ✓
3. Reload browser ✗
4. Timer resets, shows "Start Focus Session" ✗

After this fix:

1. Start work session ✓
2. Start 60-minute focus timer ✓
3. Reload browser ✓
4. Timer continues with correct remaining time ✓
5. Camera monitoring resumes ✓
6. All features work as expected ✓

### Notes

- Focus session is stored in Firebase under each session
- Timer calculates remaining time based on elapsed time since start
- If timer expired while browser was closed, it's automatically cleaned up
- Taking a break automatically stops the active focus session
- Ending a work session cleans up any active focus session

---

## [Initial Release]

### Features

- ✅ Email/password authentication
- ✅ Session management
- ✅ Task CRUD operations
- ✅ Focus mode with timer
- ✅ Camera monitoring with face detection
- ✅ Audio alerts (Web Audio API)
- ✅ Break scheduling
- ✅ Activity logging
- ✅ Beautiful expressive UI
