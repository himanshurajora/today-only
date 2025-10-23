import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAURrKegve2t2wR5cu0bNZY7E8NnYVC2eU",
  authDomain: "today-only-17f6e.firebaseapp.com",
  projectId: "today-only-17f6e",
  storageBucket: "today-only-17f6e.firebasestorage.app",
  messagingSenderId: "897578041353",
  appId: "1:897578041353:web:1fb266bff7a368d18b38d8",
  measurementId: "G-JK7MLDZCGM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
