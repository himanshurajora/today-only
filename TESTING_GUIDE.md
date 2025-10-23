# Testing Guide for Today Only

## How to Test the Latest Features

### 1. Face Detection (10-Minute Intervals)

**What to test:**

- Face detection only happens every 10 minutes, not continuously
- Camera stops after each check

**Steps:**

1. Start a work session
2. Start a focus session (you can set it to 30+ minutes)
3. **Wait 10 minutes** (or temporarily change the interval in code to 1 minute for testing)
4. You should see:
   - Camera indicator in bottom-right shows countdown: "Next check: 9:59, 9:58..."
   - At 10:00 mark, indicator shows "Checking now..."
   - Video preview appears in center of screen for ~2 seconds
   - Camera turns off automatically after check
5. Countdown resets to 10:00 and repeats

**To test fast (for development):**

```typescript
// In FocusTimer.tsx, change these lines temporarily:
- setTimeUntilNextCheck(600); // 10 minutes
+ setTimeUntilNextCheck(60); // 1 minute for testing

// And:
- }, 10 * 60 * 1000); // 10 minutes
+ }, 60 * 1000); // 1 minute for testing
```

### 2. Stop Beep When Alert Dismissed

**What to test:**

- Low-frequency beep stops when you click "I'm Back!"

**Steps:**

1. Start focus session
2. Wait for a face detection check (10 minutes)
3. **Move away from camera** during the check
4. Alert dialog appears with loud low-frequency beep
5. Click **"I'm Back!"** button
6. ✅ **Beep should stop immediately**
7. ✅ **Alert should close**
8. Continue working normally

### 3. Focus Session Persistence (from v1.1)

**What to test:**

- Focus timer survives page reload

**Steps:**

1. Start work session
2. Start 30-minute focus session
3. Wait 5 minutes
4. **Reload the page (F5 or Cmd+R)**
5. ✅ Timer should show ~25 minutes remaining (not 30)
6. ✅ Beep intervals continue from where you left off
7. ✅ Face detection countdown continues

### 4. Camera Busy Handling

**What to test:**

- App doesn't fail if camera is in use by another app

**Steps:**

1. Open another app that uses camera (Zoom, Teams, etc.)
2. Start a call or activate camera there
3. Start focus session in Today Only
4. Wait for face check (10 minutes)
5. ✅ No error should appear
6. ✅ App assumes you're present
7. ✅ Next check happens normally

### 5. Integration Test (Full Workflow)

**Complete test of all features:**

1. **Sign up / Login**

   - Create account or sign in
   - Should see "Ready to Start?" screen

2. **Start Session**

   - Click "Start Work Session"
   - Should see session controls with "End Session" button
   - Should see empty task list

3. **Add Tasks**

   - Click "+ Add Task"
   - Add title: "Test the app"
   - Add description and notes
   - Create task
   - ✅ Task appears in list

4. **Start Focus Mode**

   - Set duration to 15 minutes (for faster testing)
   - Click "Start Focus Session"
   - ✅ Timer starts counting down
   - ✅ Camera monitor appears bottom-right showing "Next check: 10:00"

5. **Test 15-Minute Beep**

   - Change focus duration test to include 15-minute mark
   - Or wait 15 minutes in a real session
   - ✅ Should hear triple beep at 15:00 mark

6. **Test Face Detection**

   - Wait for countdown to reach 0:00
   - ✅ "Checking now..." appears
   - ✅ Video preview shows in center
   - ✅ Camera turns off after ~2 seconds
   - If face detected: continues normally
   - If no face: alert appears with beep

7. **Test Alert Dismissal**

   - When alert appears, click "I'm Back!"
   - ✅ Beep stops immediately
   - ✅ Alert closes
   - ✅ Timer continues

8. **Test Break**

   - Click "Schedule Break"
   - Choose 5 minutes
   - ✅ Focus timer stops (if active)
   - ✅ Break timer starts
   - ✅ No beeps during break
   - Wait for break to end or click "End Break Early"
   - ✅ Can start new focus session

9. **Test Persistence**

   - During active focus session
   - Reload browser
   - ✅ Timer continues from correct time
   - ✅ Face check countdown continues
   - ✅ Everything works as before reload

10. **Complete Task**

    - Click checkbox on task
    - ✅ Task moves to "Completed" section
    - ✅ Stats update

11. **End Session**
    - Click "End Session"
    - ✅ Confirms ending
    - ✅ Returns to "Ready to Start?" screen
    - ✅ Can start new session for same day

## Expected Timings

- **Focus Timer:** Counts down from set duration
- **15-Minute Beep:** Every 15 minutes exactly
- **Face Check:** Every 10 minutes (600 seconds)
- **Face Check Duration:** ~2 seconds (1 second camera warm-up + detection)
- **Beep Stop:** Immediate (< 0.1 second fade-out)
- **Break Timer:** Counts down from set duration

## Common Issues & Solutions

### Camera not working?

- Check browser permissions
- Close other apps using camera
- Refresh page
- Try Chrome/Edge (best compatibility)

### Face detection not triggering?

- Wait full 10 minutes
- Check countdown timer in bottom-right
- Ensure good lighting
- Face the camera directly

### Beep not stopping?

- Click "I'm Back!" button (not just close dialog)
- If still playing, refresh page
- Check browser audio settings

### Timer not persisting?

- Check internet connection (Firebase)
- Look for console errors
- Ensure session is active before reload

## Browser Console Commands (for testing)

Open browser console and try these:

```javascript
// Check if focus session is saved
// (You can inspect Firebase data in browser dev tools)

// Manually trigger face check (useful for testing)
// Note: This requires accessing React component state
// which is not directly accessible from console

// For faster testing, modify intervals in code directly
```

## Test Checklist

- [ ] Sign up / Login works
- [ ] Start session works
- [ ] Create task works
- [ ] Edit/complete/delete task works
- [ ] Focus timer counts down
- [ ] 15-minute beep works
- [ ] Face check happens at 10 minutes
- [ ] Face check countdown shows
- [ ] Camera activates only during check
- [ ] Camera stops after check
- [ ] Face detected → continues normally
- [ ] No face → alert appears
- [ ] Beep plays when face not detected
- [ ] "I'm Back!" stops beep
- [ ] "I'm Back!" closes alert
- [ ] Break scheduling works
- [ ] Break timer works
- [ ] End break works
- [ ] Focus timer persists on reload
- [ ] Face check countdown persists on reload
- [ ] End session works
- [ ] Multiple sessions same day works

---

**All tests passed? You're ready to focus! 🎯**
