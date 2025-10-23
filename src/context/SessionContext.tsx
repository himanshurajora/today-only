import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, Task, ActivityLog } from '../types';
import { createSession, endSession, getActiveSession } from '../services/sessions.service';
import { getTasks, createTask as createTaskService, updateTask as updateTaskService, deleteTask as deleteTaskService, toggleTaskComplete as toggleTaskCompleteService } from '../services/tasks.service';
import { logActivity } from '../services/logger.service';
import { deleteFocusSession } from '../services/focus.service';
import { useAuth } from './AuthContext';
import type { TaskFormData } from '../types';

interface SessionContextType {
    currentSession: Session | null;
    tasks: Task[];
    loading: boolean;
    startNewSession: () => Promise<void>;
    endCurrentSession: () => Promise<void>;
    createTask: (taskData: TaskFormData) => Promise<void>;
    updateTask: (taskId: string, taskData: Partial<TaskFormData>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    toggleTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
    logSessionActivity: (action: ActivityLog['action'], details: string) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within SessionProvider');
    }
    return context;
};

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
    const { user } = useAuth();
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadActiveSession();
        } else {
            setCurrentSession(null);
            setTasks([]);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (currentSession) {
            loadTasks();
        }
    }, [currentSession]);

    const loadActiveSession = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const session = await getActiveSession(user.uid);
            setCurrentSession(session);
        } catch (error) {
            console.error('Error loading active session:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTasks = async () => {
        if (!currentSession) return;

        try {
            const loadedTasks = await getTasks(currentSession.id);
            setTasks(loadedTasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const startNewSession = async () => {
        if (!user) return;

        try {
            const sessionId = await createSession(user.uid);
            const session: Session = {
                id: sessionId,
                userId: user.uid,
                startTime: new Date(),
                endTime: null,
                isActive: true,
            };
            setCurrentSession(session);
            await logActivity(sessionId, 'session_start', 'Started new work session');
        } catch (error) {
            console.error('Error starting session:', error);
            throw error;
        }
    };

  const endCurrentSession = async () => {
    if (!currentSession) return;
    
    try {
      await logActivity(currentSession.id, 'session_end', 'Ended work session');
      
      // Clean up any active focus session
      try {
        await deleteFocusSession(currentSession.id);
      } catch (error) {
        // Focus session might not exist, that's okay
        console.log('No focus session to clean up');
      }
      
      await endSession(currentSession.id);
      setCurrentSession(null);
      setTasks([]);
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  };

    const createTask = async (taskData: TaskFormData) => {
        if (!currentSession) return;

        try {
            await createTaskService(currentSession.id, taskData);
            await logActivity(currentSession.id, 'task_created', `Created task: ${taskData.title}`);
            await loadTasks();
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    };

    const updateTask = async (taskId: string, taskData: Partial<TaskFormData>) => {
        if (!currentSession) return;

        try {
            await updateTaskService(currentSession.id, taskId, taskData);
            await logActivity(currentSession.id, 'task_updated', `Updated task: ${taskId}`);
            await loadTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    };

    const deleteTask = async (taskId: string) => {
        if (!currentSession) return;

        try {
            await deleteTaskService(currentSession.id, taskId);
            await logActivity(currentSession.id, 'task_deleted', `Deleted task: ${taskId}`);
            await loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    };

    const toggleTaskComplete = async (taskId: string, completed: boolean) => {
        if (!currentSession) return;

        try {
            await toggleTaskCompleteService(currentSession.id, taskId, completed);
            const action = completed ? 'task_completed' : 'task_updated';
            await logActivity(currentSession.id, action, `Task ${completed ? 'completed' : 'uncompleted'}: ${taskId}`);
            await loadTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
            throw error;
        }
    };

    const logSessionActivity = async (action: ActivityLog['action'], details: string) => {
        if (!currentSession) return;

        try {
            await logActivity(currentSession.id, action, details);
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    };

    const value = {
        currentSession,
        tasks,
        loading,
        startNewSession,
        endCurrentSession,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        logSessionActivity,
    };

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

