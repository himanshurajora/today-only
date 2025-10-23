# Setup & Usage Guide

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Face Detection Models:**
   The face detection models are already downloaded in `public/models/`. If needed, you can re-download them:

```bash
cd public/models
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
```

3. **Firebase Configuration:**
   The Firebase config is already set up in `src/firebase.ts`. The project is connected to the Firebase project `today-only-17f6e`.

### Running the Application

**Development mode:**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
npm run preview
```

## 📖 How to Use

### 1. Authentication

- Open the application
- Sign up with email and password (min 6 characters)
- Or sign in if you already have an account

### 2. Start a Work Session

- Click "Start Work Session" button
- This creates a new session and enables task management

### 3. Manage Tasks

- Click "+ Add Task" to create a new task
- Fill in:
  - **Title** (required)
  - **Description** (optional)
  - **Notes** (optional)
- Click on a task to expand and view notes
- Check the checkbox to mark a task as complete
- Delete tasks with the trash icon

### 4. Focus Mode

- Set your focus duration (in minutes)
- Click "Start Focus Session"
- Features:
  - **Timer countdown** with progress bar
  - **Beep every 15 minutes** to keep you attentive
  - **Camera monitoring** (requires camera permission)
  - **Face detection** - if you're away for 5+ seconds:
    - Low-frequency beep plays for 30 seconds
    - Alert dialog appears

### 5. Schedule Breaks

- Click "Schedule Break" button
- Choose duration (5, 10, 15, 20, 30 minutes or custom)
- During break:
  - No beeps or alerts
  - Timer shows remaining break time
  - Can end break early if needed
- Focus mode automatically resumes after break

### 6. End Work Session

- Click "End Session" button in the session controls
- All tasks, breaks, and activity logs are saved to Firebase

## 🔧 Features Implemented

✅ Email/password authentication with validation  
✅ Session management (multiple sessions per day)  
✅ Task CRUD operations (Create, Read, Update, Delete)  
✅ Focus timer with audio alerts  
✅ Camera-based face detection  
✅ Break scheduling and management  
✅ Activity logging (all actions logged to Firebase)  
✅ Responsive, expressive UI with Tailwind CSS  
✅ Real-time Firebase synchronization

## 🎯 Firebase Collections Structure

```
sessions/
  {sessionId}/
    - userId: string
    - startTime: Timestamp
    - endTime: Timestamp | null
    - isActive: boolean

    tasks/
      {taskId}/
        - title: string
        - description: string
        - notes: string
        - completed: boolean
        - createdAt: Timestamp
        - updatedAt: Timestamp

    breaks/
      {breakId}/
        - startTime: Timestamp
        - duration: number
        - endTime: Timestamp

    activityLogs/
      {logId}/
        - timestamp: Timestamp
        - action: string
        - details: string
```

## 🛠️ Tech Stack

- **Frontend:** React 19 with TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API
- **Backend:** Firebase (Authentication, Firestore)
- **Face Detection:** face-api.js
- **Audio:** Web Audio API
- **Build Tool:** Vite
- **Utilities:** Lodash, date-fns

## ⚠️ Important Notes

1. **Camera Permission:** The app requires camera access for focus mode. Make sure to allow camera permissions when prompted.

2. **Browser Compatibility:** Face detection works best in Chrome/Edge. Safari may have limitations.

3. **Performance:** The face-api.js models add ~5MB to the bundle size. This is expected for face detection functionality.

4. **Audio Context:** Some browsers require user interaction before playing audio. The first beep might be delayed.

## 🐛 Troubleshooting

**Camera not working:**

- Check browser permissions
- Ensure you're using HTTPS (or localhost)
- Try refreshing the page

**Face detection not working:**

- Ensure models are in `public/models/`
- Check console for loading errors
- Make sure lighting is adequate

**Firebase errors:**

- Check internet connection
- Verify Firebase rules allow read/write for authenticated users
- Check console for specific error messages

## 📝 Future Enhancements (Not Yet Implemented)

- Dashboard with productivity analytics
- View previous sessions history
- Charts and visualizations
- Export session data
- Custom notification sounds
- Dark/light theme toggle
- Mobile app version

---

Made by Vedik Dev: [Himanshu Jangid @himanshurajora](https://github.com/himanshurajora)
