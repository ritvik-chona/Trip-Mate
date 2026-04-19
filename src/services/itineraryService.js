import { db } from "./firebase"
import {
  collection, addDoc, getDocs, doc,
  updateDoc, deleteDoc, serverTimestamp
} from "firebase/firestore"

export async function addItineraryItem(tripId, data) {
  const ref = collection(db, "trips", tripId, "itinerary")
  return await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp()
  })
}

export async function getItineraryItems(tripId) {
  const ref = collection(db, "trips", tripId, "itinerary")
  const snapshot = await getDocs(ref)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function updateItineraryItem(tripId, itemId, data) {
  const ref = doc(db, "trips", tripId, "itinerary", itemId)
  await updateDoc(ref, data)
}

export async function deleteItineraryItem(tripId, itemId) {
  const ref = doc(db, "trips", tripId, "itinerary", itemId)
  await deleteDoc(ref)
}