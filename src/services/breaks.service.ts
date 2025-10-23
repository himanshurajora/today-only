import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export const startBreak = async (
  sessionId: string,
  duration: number
): Promise<string> => {
  const breakRef = doc(collection(db, `sessions/${sessionId}/breaks`));
  const breakId = breakRef.id;

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + duration * 60000);

  await setDoc(breakRef, {
    startTime: Timestamp.fromDate(startTime),
    duration,
    endTime: Timestamp.fromDate(endTime),
  });

  return breakId;
};
