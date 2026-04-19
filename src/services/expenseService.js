import { db } from "./firebase"
import {
  collection, addDoc, getDocs, doc,
  deleteDoc, serverTimestamp
} from "firebase/firestore"

export async function addExpense(tripId, data) {
  const ref = collection(db, "trips", tripId, "expenses")
  return await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp()
  })
}

export async function getExpenses(tripId) {
  const ref = collection(db, "trips", tripId, "expenses")
  const snapshot = await getDocs(ref)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function deleteExpense(tripId, expenseId) {
  const ref = doc(db, "trips", tripId, "expenses", expenseId)
  await deleteDoc(ref)
}