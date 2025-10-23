import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { ActivityLog } from "../types";

export const logActivity = async (
  sessionId: string,
  action: ActivityLog["action"],
  details: string
): Promise<void> => {
  const logRef = doc(collection(db, `sessions/${sessionId}/activityLogs`));

  await setDoc(logRef, {
    timestamp: Timestamp.now(),
    action,
    details,
  });
};
