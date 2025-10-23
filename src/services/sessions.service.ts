import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Session } from "../types";

export const createSession = async (userId: string): Promise<string> => {
  const sessionRef = doc(collection(db, "sessions"));
  const sessionId = sessionRef.id;

  await setDoc(sessionRef, {
    userId,
    startTime: Timestamp.now(),
    endTime: null,
    isActive: true,
  });

  return sessionId;
};

export const endSession = async (sessionId: string): Promise<void> => {
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, {
    endTime: Timestamp.now(),
    isActive: false,
  });
};

export const getActiveSession = async (
  userId: string
): Promise<Session | null> => {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", userId),
    where("isActive", "==", true),
    limit(1)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    userId: data.userId,
    startTime: data.startTime.toDate(),
    endTime: data.endTime ? data.endTime.toDate() : null,
    isActive: data.isActive,
  };
};

export const getRecentSessions = async (
  userId: string,
  limitCount: number = 10
): Promise<Session[]> => {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", userId),
    orderBy("startTime", "desc"),
    limit(limitCount)
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      startTime: data.startTime.toDate(),
      endTime: data.endTime ? data.endTime.toDate() : null,
      isActive: data.isActive,
    };
  });
};
