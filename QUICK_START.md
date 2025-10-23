# 🚀 Quick Start Guide

## Run the App

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

## First Time Setup

1. **Sign Up**

   - Enter your email
   - Create a password (min 6 characters)
   - Click "Sign Up"

2. **Start Work Session**

   - Click the big "Start Work Session" button
   - You're now ready to add tasks!

3. **Add Your First Task**

   - Click "+ Add Task"
   - Enter task title (required)
   - Optionally add description and notes
   - Click "Create Task"

4. **Start Focusing**
   - Set focus duration (e.g., 60 minutes)
   - Click "Start Focus Session"
   - Allow camera access when prompted
   - The timer starts counting down
   - You'll hear a beep every 15 minutes
   - If you leave your seat, you'll get an alert!

## Key Shortcuts & Tips

- **Click on task title** → Expand to see notes
- **Check the box** → Mark task complete
- **Trash icon** → Delete task
- **Schedule Break** → Take a break without alerts
- **End Session** → Save everything and close your workday

## Keyboard Navigation

- **Tab** → Navigate between buttons
- **Enter** → Submit forms
- **Escape** → Close modals (when implemented)

## Troubleshooting

**Camera not showing?**

- Check browser permissions
- Refresh the page
- Make sure you're on http://localhost or https://

**No sound?**

- Unmute your browser
- Check system volume
- Click anywhere first (browsers require user interaction for audio)

**Face detection not working?**

- Ensure good lighting
- Face the camera directly
- Wait a few seconds for models to load

## Firebase Security

Your Firebase project is already configured. To add security rules:

```javascript
// Firestore Rules (add in Firebase Console)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null &&
                           request.auth.uid == resource.data.userId;

      match /tasks/{taskId} {
        allow read, write: if request.auth != null;
      }

      match /breaks/{breakId} {
        allow read, write: if request.auth != null;
      }

      match /activityLogs/{logId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Files Overview

```
Key files you might want to modify:

src/firebase.ts           → Firebase config
src/App.tsx              → Main app structure
src/components/          → UI components
src/services/            → Firebase operations
src/utils/audio.ts       → Customize beep sounds
src/utils/validation.ts  → Form validation rules
```

## Customization Ideas

### Change Beep Frequency

Edit `src/utils/audio.ts`:

```typescript
export const playBeep = (frequency: number = 1000, ...) // Change 800 to 1000
```

### Change Focus Interval

Edit `src/components/focus/FocusTimer.tsx`:

```typescript
beepIntervalRef.current = setInterval(() => {
  playAlertBeep();
}, 10 * 60 * 1000); // Change 15 to 10 for 10-minute intervals
```

### Change Theme Colors

Edit Tailwind classes in components:

- `from-pink-500 to-purple-600` → Change colors
- `bg-indigo-950` → Change background

## Next Steps

1. ✅ App is running
2. ✅ Create your first session
3. ✅ Add some tasks
4. ✅ Try focus mode
5. ✅ Schedule a break
6. ✅ End your session
7. 🎉 You're productive!

## Need Help?

- Check `SETUP.md` for detailed setup instructions
- Check `PROJECT_SUMMARY.md` for technical details
- Check browser console for error messages
- Ensure Firebase rules are set correctly

---

**Happy Focusing! 🎯**
