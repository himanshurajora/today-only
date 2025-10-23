# Face Detection Sensitivity Guide

## Current Settings

**Score Threshold:** 0.5 (Default - Balanced)

This is the **default sensitivity** that requires a clear, confident face detection.

## Understanding Sensitivity Levels

| Threshold | Sensitivity        | False Positives | False Negatives | Best For            |
| --------- | ------------------ | --------------- | --------------- | ------------------- |
| **0.2**   | Very High          | Many            | Very Few        | Testing only        |
| **0.3**   | High               | Some            | Few             | Poor lighting       |
| **0.4**   | Medium-High        | Occasional      | Some            | Variable conditions |
| **0.5**   | Balanced (Current) | Rare            | Balanced        | Good lighting ✓     |
| **0.6**   | Medium-Low         | Very Rare       | More            | Very good lighting  |
| **0.7**   | Low                | Almost None     | Many            | Perfect conditions  |

## Current Setup: 0.5 (Balanced)

### Pros ✅

- Fewer false alarms
- Accurate detection in good lighting
- Standard reliability
- Works for most users

### Cons ⚠️

- Requires decent lighting
- May miss face in poor lighting
- Needs clear face view

## When Detection Works Best

### ✅ Will Detect

- Good front or side lighting
- Face generally toward camera
- Normal distance (1-2 meters)
- Standard home/office lighting
- Confidence > 0.5

### ❌ May NOT Detect

- Very dark room
- Strong backlighting
- Extreme angle (> 60°)
- Too far away (> 3 meters)
- Confidence < 0.5

## Adjusting Sensitivity

If you want to change sensitivity, edit `src/hooks/useCamera.ts`:

### Make MORE Sensitive (more detections, more false positives)

```typescript
scoreThreshold: 0.4,  // Easier to detect
// or
scoreThreshold: 0.3,  // Very easy to detect
```

### Make LESS Sensitive (fewer false positives, stricter)

```typescript
scoreThreshold: 0.6,  // Harder to detect (requires better lighting)
```

## Console Logs to Watch

When face is detected, you'll see:

```
✅ Face detected with confidence: 0.67
```

**Confidence interpretation:**

- **0.5 - 0.6:** Barely detected (threshold edge)
- **0.6 - 0.7:** Good detection
- **0.7 - 0.8:** Very good detection
- **0.8 - 1.0:** Excellent detection

If confidence is consistently below 0.6, consider:

1. Adding more lighting
2. Moving closer to camera
3. Facing camera more directly
4. OR lowering threshold to 0.4

If you're getting false "not detected" alerts:

1. Check lighting first (most common issue)
2. Consider lowering threshold to 0.4
3. Move closer to camera

## Recommended Settings by Environment

### Home Office (Normal Lighting)

```typescript
scoreThreshold: 0.5; // Default - works well ✓
```

### Dark Room / Evening

```typescript
scoreThreshold: 0.4; // More sensitive
```

### Bright Office / Daylight

```typescript
scoreThreshold: 0.5; // Default works great
// or
scoreThreshold: 0.6; // Can go stricter if desired
```

### Inconsistent Lighting

```typescript
scoreThreshold: 0.4; // More forgiving
```

## History of Changes

- **v1.0:** Started at 0.5 (default)
- **v1.3.2:** Lowered to 0.3 (too sensitive, many false positives)
- **v1.4:** Back to 0.5 (balanced, fewer false alarms) ← Current

---

**Current setting (0.5) is balanced for most users with normal lighting. Adjust if needed based on your environment!**
