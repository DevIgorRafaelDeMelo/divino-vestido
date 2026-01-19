// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração gerada pelo Firebase Console
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "NUMERO",
  appId: "APP_ID",
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Exporta o Firestore
export const db = getFirestore(app);
