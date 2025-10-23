import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface FocusSessionData {
  startTime: Date;
  duration: number; // in minutes
  isActive: boolean;
}

export const saveFocusSession = async (
  sessionId: string,
  focusData: FocusSessionData
): Promise<void> => {
  const focusRef = doc(db, `sessions/${sessionId}/focusSession`, "current");

  await setDoc(focusRef, {
    startTime: focusData.startTime.toISOString(),
    duration: focusData.duration,
    isActive: focusData.isActive,
  });
};

export const getFocusSession = async (
  sessionId: string
): Promise<FocusSessionData | null> => {
  const focusRef = doc(db, `sessions/${sessionId}/focusSession`, "current");
  const focusDoc = await getDoc(focusRef);

  if (!focusDoc.exists()) {
    return null;
  }

  const data = focusDoc.data();
  return {
    startTime: new Date(data.startTime),
    duration: data.duration,
    isActive: data.isActive,
  };
};

export const deleteFocusSession = async (
  sessionId: string
): Promise<void> => {
  const focusRef = doc(db, `sessions/${sessionId}/focusSession`, "current");
  await deleteDoc(focusRef);
};

