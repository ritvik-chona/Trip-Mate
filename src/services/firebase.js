import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBBbErWrK2fAgsEggrlJxtItqkERGIuidk",
  authDomain: "tripmate-8a362.firebaseapp.com",
  projectId: "tripmate-8a362",
  storageBucket: "tripmate-8a362.firebasestorage.app",
  messagingSenderId: "576744012379",
  appId: "1:576744012379:web:6d27135c11732beab3dd7e"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)