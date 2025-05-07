// firestoreHelpers.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function uploadGameResult({ userId, grid, score, startTime, endTime }) {
  try {
    await addDoc(collection(db, 'games'), {
      userId,
      grid,
      score,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error uploading game result:", error);
    throw error;
  }
}
