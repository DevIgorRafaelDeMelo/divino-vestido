import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEsPG9VVoo9LkVJt6Mh2hK9Pz1eLdBXbY",
  authDomain: "vetido-divino.firebaseapp.com",
  projectId: "vetido-divino",
  storageBucket: "vetido-divino.firebasestorage.app",
  messagingSenderId: "220553834199",
  appId: "1:220553834199:web:911694222b99e219194a92",
  measurementId: "G-6WHPR2LTHX",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
