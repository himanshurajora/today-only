export interface User {
  uid: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  notes: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Break {
  id: string;
  startTime: Date;
  duration: number; // in minutes
  endTime: Date;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  action:
    | "session_start"
    | "session_end"
    | "task_created"
    | "task_completed"
    | "task_deleted"
    | "task_updated"
    | "break_start"
    | "break_end"
    | "focus_start"
    | "focus_end"
    | "face_not_detected";
  details: string;
}

export interface Session {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  isActive: boolean;
}

export interface FocusSession {
  duration: number; // in minutes
  startTime: Date;
  isActive: boolean;
  beepInterval: number; // in minutes
}

export interface AuthFormData {
  email: string;
  password: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  notes: string;
}
