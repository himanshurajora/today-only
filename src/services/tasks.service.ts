import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Task, TaskFormData } from "../types";

export const createTask = async (
  sessionId: string,
  taskData: TaskFormData
): Promise<string> => {
  const taskRef = doc(collection(db, `sessions/${sessionId}/tasks`));
  const taskId = taskRef.id;

  await setDoc(taskRef, {
    ...taskData,
    completed: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return taskId;
};

export const updateTask = async (
  sessionId: string,
  taskId: string,
  taskData: Partial<TaskFormData>
): Promise<void> => {
  const taskRef = doc(db, `sessions/${sessionId}/tasks`, taskId);
  await updateDoc(taskRef, {
    ...taskData,
    updatedAt: Timestamp.now(),
  });
};

export const toggleTaskComplete = async (
  sessionId: string,
  taskId: string,
  completed: boolean
): Promise<void> => {
  const taskRef = doc(db, `sessions/${sessionId}/tasks`, taskId);
  await updateDoc(taskRef, {
    completed,
    updatedAt: Timestamp.now(),
  });
};

export const deleteTask = async (
  sessionId: string,
  taskId: string
): Promise<void> => {
  const taskRef = doc(db, `sessions/${sessionId}/tasks`, taskId);
  await deleteDoc(taskRef);
};

export const getTasks = async (sessionId: string): Promise<Task[]> => {
  const q = query(
    collection(db, `sessions/${sessionId}/tasks`),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      notes: data.notes,
      completed: data.completed,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  });
};
