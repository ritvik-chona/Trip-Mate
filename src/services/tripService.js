import { db } from "./firebase"
import {
  collection, addDoc, getDocs, doc,
  updateDoc, deleteDoc, query, where, serverTimestamp
} from "firebase/firestore"

const tripsRef = collection(db, "trips")

export async function createTrip(userId, data) {
  return await addDoc(tripsRef, {
    ...data,
    userId,
    createdAt: serverTimestamp()
  })
}

export async function getUserTrips(userId) {
  const q = query(tripsRef, where("userId", "==", userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function deleteTrip(tripId) {
  await deleteDoc(doc(db, "trips", tripId))
}

export async function updateTrip(tripId, data) {
  await updateDoc(doc(db, "trips", tripId), data)
}