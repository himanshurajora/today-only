# 🕒 Today Only

**Today Only** is a minimal yet expressive **task management and focus app** designed to help you concentrate on what truly matters — **today**.  
No future tasks, no clutter — just you, your goals, and your focus for the day.

---

## 🚀 Features

### ✅ Task Management

- Add, edit, complete, and remove tasks.
- Each task includes:
  - **Title**
  - **Description**
  - **Notes**
- All data is stored securely in **Firebase**.

### 🎯 Focus Mode

- Start a work session by selecting how long you want to focus.
- Plays a **loud beep every 15 minutes** to keep you attentive.
- Automatically activates the **camera** to detect if you’re in the frame.
  - If no face is detected → a **low-frequency beep** plays for 30 seconds.
  - A **prominent on-screen dialog** reminds you to stay focused.

### ☕ Break Management

- Schedule breaks (e.g., 20 minutes) where no alerts or beeps occur.
- After the break ends, focus mode automatically resumes.

### 📅 Work Sessions

- Each work session stores its own data:
  - Tasks
  - Breaks
  - Activity logs
- You can end your workday manually; all progress is saved in the session.

### 📊 Activity Logging & Dashboard

- Every action (task creation, session start/end, breaks, etc.) is logged.
- Logs can later be visualized in a **dashboard** for productivity insights.

### 🔐 Authentication

- Uses **Firebase Authentication** to restrict access to specific users only.

---

## 🎨 UI/UX Design

- **Material 3 expressive design** principles
- **Large, bold buttons** for high accessibility
- **Clean, minimal layout** optimized for focus
- Fully responsive interface

---

## 🧱 Tech Stack

- **Frontend:** Angular / React (Material 3 Design)
- **Backend & Auth:** Firebase
- **Database:** Firestore
- **Storage:** Firebase Storage
- **Camera API:** WebRTC / MediaD

Made by Vedik Dev: [Himanshu Jangid @himanshurajora](https://github.com/himanshurajora)
