# Face Detection Tips

## Current Settings

The face detection is now set to **HIGH SENSITIVITY**:

- **Score Threshold:** 0.3 (default is 0.5)
- **Camera Warm-up:** 2.5 seconds
- **Input Size:** 416px (good balance of speed and accuracy)

## How to Get the Best Detection Results

### ✅ DO These Things

1. **Good Lighting is KEY** 💡

   - Face should be well-lit
   - Light source in front of you (not behind)
   - Avoid harsh shadows on face
   - Natural daylight works best

2. **Face the Camera** 👤

   - You don't need to stare at it
   - Just face generally toward the screen
   - Slight angles are okay (up to ~45°)

3. **Optimal Distance** 📏

   - **Best:** 50-150 cm (1.5-5 feet)
   - Too close: might not detect full face
   - Too far: face too small to detect

4. **Clear Face** 😊

   - No sunglasses
   - No face mask
   - Hats are usually okay
   - Glasses are fine

5. **Wait for Camera** ⏱️
   - First 2.5 seconds: camera warming up
   - Don't move during this time
   - Camera adjusting exposure and focus

### ❌ DON'T Do These Things

1. **Backlit** 🚫

   - Window behind you = dark face
   - Lamp behind you = silhouette
   - Move or add front lighting

2. **Side Profile** 🚫

   - Turning 90° away won't detect
   - Keep face somewhat toward camera

3. **Dark Room** 🚫

   - Very low light reduces detection
   - Turn on lights or move to brighter area

4. **Moving Too Much** 🚫
   - Quick head movements during check
   - Wait until "Checking now..." disappears

## Understanding Console Logs

### When Face IS Detected

```
Video ready, performing detection...
Face detection result: true (confidence: 0.87)
✅ Face detected with confidence: 0.87
📸 Face check callback - detected: true
✅ Face detected - all good!
```

**Confidence Scores:**

- **0.8 - 1.0:** Excellent detection (perfect lighting/angle)
- **0.6 - 0.8:** Good detection (normal conditions)
- **0.3 - 0.6:** Okay detection (lower lighting/angle)
- **Below 0.3:** Not detected (improve conditions)

### When Face NOT Detected

```
Video ready, performing detection...
Face detection result: false
❌ No face detected - try better lighting or move closer
📸 Face check callback - detected: false
⚠️ Face NOT detected - triggering alert and beep
```

**Common Reasons:**

1. Poor lighting (most common!)
2. Too far from camera
3. Face turned away
4. Camera not warmed up yet
5. Obstruction (hand, cup, etc.)

## Testing Your Setup

### Quick Test

1. Start focus session
2. Wait for 1-minute face check
3. Watch console for confidence score
4. **If score < 0.6:** Improve lighting/position

### Optimal Confidence Test

1. Position yourself for best detection
2. Good lighting + face camera + 1m distance
3. Start focus, wait for check
4. **Goal:** Confidence > 0.7 consistently

### Movement Test

1. During face check, move slightly
2. Check if still detected
3. Find your "safe zone" for movement

## Adjusting Sensitivity (Advanced)

If you want to make detection **EVEN MORE sensitive**, edit `src/hooks/useCamera.ts`:

```typescript
const options = new faceapi.TinyFaceDetectorOptions({
  inputSize: 416, // Keep at 416 for good balance
  scoreThreshold: 0.2, // Lower = more sensitive (currently 0.3)
});
```

**Warning:** Setting too low (< 0.2) may cause false positives!

If you want **LESS sensitive** (fewer false alerts):

```typescript
scoreThreshold: 0.5,   // Higher = less sensitive (default)
```

## Troubleshooting Poor Detection

### Issue: Always says "No face detected"

**Try:**

1. Turn on more lights
2. Move closer to camera
3. Check camera angle (should see your face in preview)
4. Make sure you're looking at screen during check
5. Check console for confidence scores

### Issue: Sometimes works, sometimes doesn't

**Try:**

1. Consistent lighting (close curtains if sunlight varies)
2. Fixed position (don't lean back/forward)
3. Check time of day (lighting changes throughout day)

### Issue: Works but confidence always low (0.3-0.4)

**Try:**

1. **Add front lighting** (lamp in front of you)
2. Move 20cm closer to camera
3. Adjust monitor angle
4. Clean camera lens
5. Check if camera has good focus

### Issue: Detection takes too long

**This is normal:**

- 2.5 seconds for camera warm-up
- 0.5-1 second for face detection
- Total: ~3-3.5 seconds
- Video preview shows during this time

## Camera Hardware Tips

### Webcam Quality Matters

- **720p or better:** Good detection
- **480p:** Okay, but may need better lighting
- **Lower:** May struggle in poor lighting

### Built-in Laptop Cameras

- Usually work fine
- Often at bottom of screen (look down slightly)
- May need external light source

### External Webcams

- Usually better quality
- Position at eye level for best detection
- Many have auto-focus (may take 2-3 seconds)

## Best Setup Examples

### 🏆 Optimal Setup

```
🪟 Window (daylight, side/front)
👤 You (1 meter from screen)
💻 Laptop with camera
💡 Desk lamp (front/side)
```

**Expected confidence:** 0.8-0.95

### ✅ Good Setup

```
💡 Ceiling light (bright)
👤 You (1-2 meters from screen)
💻 Computer with webcam
```

**Expected confidence:** 0.6-0.8

### ⚠️ Okay Setup

```
🌙 Room light (moderate)
👤 You (1 meter from screen)
💻 Computer with webcam
```

**Expected confidence:** 0.4-0.6

### ❌ Poor Setup

```
🪟 Window (behind you, backlit)
👤 You (far or turned away)
💻 Low-quality camera
🌑 Dark room
```

**Expected confidence:** Not detected

---

**Current sensitivity should work well in normal conditions. If still having issues, add front lighting! 💡**
